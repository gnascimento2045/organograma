import dagre from 'dagre'
import { Position, type Node, type Edge } from '@xyflow/react'

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

const NODE_WIDTH = 172
const NODE_HEIGHT = 60
const GROUP_WIDTH = 280
const GROUP_HEIGHT = 150

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 })

  const topLevelNodes = nodes.filter((n) => !n.parentId)
  const childNodes = nodes.filter((n) => n.parentId)

  topLevelNodes.forEach((node) => {
    const isGroup = node.type === 'group'
    const width = isGroup ? GROUP_WIDTH : NODE_WIDTH
    const height = isGroup ? GROUP_HEIGHT : NODE_HEIGHT
    dagreGraph.setNode(node.id, { width, height })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes: Node[] = nodes.map((node) => {
    if (node.parentId) {
      const parent = dagreGraph.node(node.parentId)
      if (!parent) {
        return {
          ...node,
          targetPosition: isHorizontal ? Position.Left : Position.Top,
          sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        }
      }

      const parentWidth = GROUP_WIDTH
      const parentHeight = GROUP_HEIGHT
      const childIndex = childNodes.filter((c) => c.parentId === node.parentId).indexOf(node)
      const cols = 2
      const row = Math.floor(childIndex / cols)
      const col = childIndex % cols
      const childWidth = 140
      const childHeight = 60
      const padding = 15
      const x = parent.x - parentWidth / 2 + padding + col * (childWidth + padding)
      const y = parent.y - parentHeight / 2 + 30 + row * (childHeight + padding)

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x, y },
      }
    }

    const pos = dagreGraph.node(node.id)
    const isGroup = node.type === 'group'
    const width = isGroup ? GROUP_WIDTH : NODE_WIDTH
    const height = isGroup ? GROUP_HEIGHT : NODE_HEIGHT

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: pos.x - width / 2,
        y: pos.y - height / 2,
      },
    }
  })

  return { nodes: newNodes, edges }
}
