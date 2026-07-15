import { Handle, Position, type NodeProps } from '@xyflow/react'

const CARGO_COLORS: Record<string, string> = {
  CEO: '#1e40af',
  CTO: '#a16207',
  CPO: '#6b21a8',
  Dev: '#374151',
  UX: '#0e7490',
  Suporte: '#92400e',
}

function getColor(cargo: string): string {
  const first = cargo.split(',')[0].trim()
  return CARGO_COLORS[first] || '#374151'
}

export default function EmployeeNode({ data }: NodeProps) {
  const { label, projetos } = data as { label: string; projetos: string[] }
  const [name, ...cargoParts] = label.split('\n')
  const cargo = cargoParts.join(' ')
  const color = getColor(cargo)

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: `2px solid ${color}`,
        background: '#fff',
        textAlign: 'center',
        minWidth: 120,
        maxWidth: 180,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{name}</div>
      <div style={{ fontSize: 10, color, marginTop: 2 }}>{cargo}</div>
      {projetos && projetos.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', marginTop: 4 }}>
          {projetos.slice(0, 2).map((p) => (
            <span
              key={p}
              style={{
                fontSize: 8,
                padding: '1px 4px',
                borderRadius: 2,
                background: '#f3f4f6',
                color: '#6b7280',
              }}
            >
              {p}
            </span>
          ))}
          {projetos.length > 2 && (
            <span
              style={{
                fontSize: 8,
                padding: '1px 4px',
                borderRadius: 2,
                background: '#f3f4f6',
                color: '#6b7280',
              }}
            >
              +{projetos.length - 2}
            </span>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
