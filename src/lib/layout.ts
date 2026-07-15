import dagre from 'dagre'
import { Position, type Node, type Edge } from '@xyflow/react'

const GROUP_WIDTH = 280
const GROUP_HEIGHT = 150
const NODE_WIDTH = 172
const NODE_HEIGHT = 60
const CHILD_WIDTH = 130
const CHILD_HEIGHT = 52

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) {
  const isHorizontal = direction === 'LR'

  const topLevel = nodes.filter((n) => !n.parentId)
  const children = nodes.filter((n) => !!n.parentId)
  const childrenByParent = new Map<string, Node[]>()
  for (const c of children) {
    const list = childrenByParent.get(c.parentId!) || []
    list.push(c)
    childrenByParent.set(c.parentId!, list)
  }

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 100 })
  g.setDefaultEdgeLabel(() => ({}))

  topLevel.forEach((node) => {
    const isGroup = node.type === 'group'
    g.setNode(node.id, {
      width: isGroup ? GROUP_WIDTH : NODE_WIDTH,
      height: isGroup ? GROUP_HEIGHT : NODE_HEIGHT,
    })
  })

  edges.forEach((edge) => {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target)
    }
  })

  dagre.layout(g)

  const newNodes: Node[] = []

  for (const node of topLevel) {
    const pos = g.node(node.id)
    if (!pos) continue
    const isGroup = node.type === 'group'
    const w = isGroup ? GROUP_WIDTH : NODE_WIDTH
    const h = isGroup ? GROUP_HEIGHT : NODE_HEIGHT

    newNodes.push({
      ...node,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
    })

    const kids = childrenByParent.get(node.id) || []
    const padding = 12
    const cols = 2
    const startY = isGroup ? 30 : 0

    for (let i = 0; i < kids.length; i++) {
      const child = kids[i]
      const row = Math.floor(i / cols)
      const col = i % cols
      // positions are RELATIVE to parent in React Flow
      const x = padding + col * (CHILD_WIDTH + padding)
      const y = startY + row * (CHILD_HEIGHT + padding)

      newNodes.push({
        ...child,
        position: { x, y },
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      })
    }
  }

  return { nodes: newNodes, edges }
}
