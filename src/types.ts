export interface OrganogramaNode {
  id: string
  type?: string
  data: {
    label: string
    cargo?: string
    projetos?: string[]
  }
  position?: { x: number; y: number }
  parentId?: string
  style?: { width: number; height: number }
}

export interface OrganogramaEdge {
  id: string
  source: string
  target: string
}

export interface Organograma {
  nodes: OrganogramaNode[]
  edges: OrganogramaEdge[]
}
