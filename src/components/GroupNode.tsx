import { type NodeProps } from '@xyflow/react'

const TEAM_COLORS: Record<string, string> = {
  'Diretoria': '#1e40af',
  'UX Team': '#0e7490',
  'UX TEAM': '#0e7490',
  'Resultagro': '#059669',
  'RESULTAGRO': '#059669',
  'Fanthon': '#d97706',
  'FANTHON': '#d97706',
  'Zeonpaper': '#7c3aed',
  'ZEONPAPER': '#7c3aed',
  'Sapiens': '#dc2626',
  'SAPIENS': '#dc2626',
  'Reduto': '#0891b2',
  'REDUTO': '#0891b2',
  'BYPONTO': '#be185d',
  'SPI-TOOLS': '#4f46e5',
  'Joinplace': '#65a30d',
  'JOINPLACE': '#65a30d',
  'Moonz': '#c2410c',
  'MOONZ': '#c2410c',
  'Trading Food': '#9333ea',
  'TRADING FOOD': '#9333ea',
  'Hiibbe': '#0d9488',
  'HIIBBE': '#0d9488',
  'Akingpoker': '#b91c1c',
  'AKINGPOKER': '#b91c1c',
  'Salariosweb': '#1d4ed8',
  'SALARIOSWEB': '#1d4ed8',
  'Pidon': '#7c2d12',
  'PIDON': '#7c2d12',
  'Meu Pet': '#166534',
  'MEU PET': '#166534',
  'F1Delize': '#a16207',
  'F1DELIZE': '#a16207',
  'Countfly': '#6d28d9',
  'COUNTFLY': '#6d28d9',
  'Depaulapay': '#be123c',
  'DEPAULAPAY': '#be123c',
}

function getTeamColor(label: string): string {
  return TEAM_COLORS[label] || '#6b7280'
}

export default function GroupNode({ data }: NodeProps) {
  const { label } = data as { label: string }
  const color = getTeamColor(label)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: `2px solid ${color}`,
        borderRadius: 12,
        background: `${color}10`,
        padding: 8,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: 10,
          background: color,
          color: '#fff',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  )
}
