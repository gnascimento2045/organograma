import { Handle, Position, type NodeProps } from '@xyflow/react'

const AREA_COLORS: Record<string, string> = {
  Diretoria: '#1e40af',
  Tecnologia: '#166534',
  Marketing: '#9a3412',
  Vendas: '#7c2d12',
  Financeiro: '#6b21a8',
  RH: '#be185d',
  Operacoes: '#0f766e',
}

function getColor(area: string): string {
  return AREA_COLORS[area] || '#374151'
}

export default function EmployeeNode({ data }: NodeProps) {
  const { label, area } = data as { label: string; area: string }
  const [name, ...cargoParts] = label.split('\n')
  const cargo = cargoParts.join(' ')
  const color = getColor(area)

  return (
    <div
      style={{
        padding: '10px 16px',
        borderRadius: 8,
        border: `2px solid ${color}`,
        background: '#fff',
        textAlign: 'center',
        minWidth: 140,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{name}</div>
      <div style={{ fontSize: 12, color, marginTop: 2 }}>{cargo}</div>
      <div
        style={{
          fontSize: 10,
          color: '#6b7280',
          marginTop: 4,
          padding: '2px 6px',
          borderRadius: 4,
          background: '#f3f4f6',
          display: 'inline-block',
        }}
      >
        {area}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
