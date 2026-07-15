import { writeFileSync, readFileSync, existsSync } from 'fs'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
const JSON_PATH = 'public/organograma.json'
const NOTION_VERSION = '2025-09-03'

async function getDataSourceId() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Notion API error ${res.status}: ${text}`)
  }

  const data = await res.json()

  if (data.data_sources && data.data_sources.length > 0) {
    return data.data_sources[0].id
  }

  return NOTION_DATABASE_ID
}

async function fetchAllItems(dataSourceId) {
  const items = []
  let hasMore = true
  let startCursor = undefined

  while (hasMore) {
    const body = { page_size: 100 }
    if (startCursor) body.start_cursor = startCursor

    const res = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Notion API error ${res.status}: ${text}`)
    }

    const data = await res.json()
    items.push(...data.results)
    hasMore = data.has_more
    startCursor = data.next_cursor
  }

  return items
}

function getMultiSelect(property) {
  if (!property?.multi_select) return []
  return property.multi_select.map((item) => item.name)
}

function getRichText(property) {
  if (!property?.rich_text) return ''
  return property.rich_text.map((t) => t.plain_text).join('')
}

function getTitle(property) {
  if (!property?.title) return ''
  return property.title.map((t) => t.plain_text).join('')
}

function processNotionData(items) {
  const peopleMap = {}

  for (const item of items) {
    const props = item.properties

    const nome = getTitle(props.Nome)
    if (!nome) continue

    const cargos = getMultiSelect(props.Cargo)
    const projetos = getMultiSelect(props.Projeto)
    const gestor = getRichText(props.Gestor)

    if (!peopleMap[nome]) {
      peopleMap[nome] = { nome, cargos: [], projetos: [], gestor }
    }

    for (const c of cargos) {
      if (!peopleMap[nome].cargos.includes(c)) {
        peopleMap[nome].cargos.push(c)
      }
    }

    for (const p of projetos) {
      if (!peopleMap[nome].projetos.includes(p)) {
        peopleMap[nome].projetos.push(p)
      }
    }

    if (gestor && !peopleMap[nome].gestor) {
      peopleMap[nome].gestor = gestor
    }
  }

  const people = Object.values(peopleMap)
  const nodes = []
  const edges = []

  // 1. Identify Diretoria members (CEO + CPO + CTO)
  const diretoriaNomes = ['Thiago Zampiere', 'Josiele', 'Diego']
  const diretoriaMembers = people.filter(p => diretoriaNomes.includes(p.nome))

  nodes.push({
    id: 'group-diretoria',
    type: 'group',
    data: { label: 'Diretoria' },
    position: { x: 0, y: 0 },
    style: { width: 300, height: 180 },
  })

  for (const p of diretoriaMembers) {
    const cargoLabel = p.cargos.join(', ') || 'Sem cargo'
    nodes.push({
      id: p.nome,
      type: 'employee',
      data: {
        label: p.nome + '\n' + cargoLabel,
        cargo: cargoLabel,
        projetos: p.projetos,
      },
      parentId: 'group-diretoria',
      position: { x: 0, y: 0 },
    })
  }

  // Edges within Diretoria: Thiago → Josiele, Thiago → Diego
  for (const p of diretoriaMembers) {
    if (p.nome !== 'Thiago Zampiere' && p.gestor === 'Thiago Zampiere') {
      edges.push({
        id: `thiago-${p.nome}`,
        source: 'Thiago Zampiere',
        target: p.nome,
      })
    }
  }

  // 2. Group remaining people by their first Projeto
  const teamMap = {}
  for (const p of people) {
    if (diretoriaNomes.includes(p.nome)) continue

    const teamName = p.projetos[0] || 'Sem Time'
    if (!teamMap[teamName]) {
      teamMap[teamName] = []
    }
    teamMap[teamName].push(p)
  }

  for (const [teamName, members] of Object.entries(teamMap)) {
    const groupId = `group-${teamName.toLowerCase().replace(/\s+/g, '-')}`

    const memberCount = members.length
    const groupHeight = Math.max(100, 40 + Math.ceil(memberCount / 2) * 70)

    nodes.push({
      id: groupId,
      type: 'group',
      data: { label: teamName },
      position: { x: 0, y: 250 },
      style: { width: 280, height: groupHeight },
    })

    for (const p of members) {
      const cargoLabel = p.cargos.join(', ') || 'Sem cargo'
      nodes.push({
        id: p.nome,
        type: 'employee',
        data: {
          label: p.nome + '\n' + cargoLabel,
          cargo: cargoLabel,
          projetos: p.projetos,
        },
        parentId: groupId,
        position: { x: 0, y: 0 },
      })
    }

    // Edge: Diretoria → Team
    edges.push({
      id: `edge-${groupId}`,
      source: 'group-diretoria',
      target: groupId,
    })
  }

  return { nodes, edges }
}

try {
  console.log('Fetching Notion data...')
  const dataSourceId = await getDataSourceId()
  console.log(`Using data source: ${dataSourceId}`)
  const items = await fetchAllItems(dataSourceId)
  console.log(`Fetched ${items.length} items`)

  const organograma = processNotionData(items)
  console.log(`Generated ${organograma.nodes.length} nodes, ${organograma.edges.length} edges`)

  const newContent = JSON.stringify(organograma, null, 2)

  if (existsSync(JSON_PATH)) {
    const currentContent = readFileSync(JSON_PATH, 'utf-8')
    if (currentContent.trim() === newContent.trim()) {
      console.log('No changes detected')
      process.exit(0)
    }
  }

  writeFileSync(JSON_PATH, newContent)
  console.log('organograma.json updated')
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
