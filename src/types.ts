export interface OrganogramaNode {
  id: string
  data: {
    label: string
    area: string
  }
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
