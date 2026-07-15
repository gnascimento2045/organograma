import { useEffect, useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import EmployeeNode from './components/EmployeeNode'
import { getLayoutedElements } from './lib/layout'
import type { Organograma } from './types'
import './App.css'

const nodeTypes = { employee: EmployeeNode }

function toFlowNodes(data: Organograma): Node[] {
  return data.nodes.map((n) => ({
    id: n.id,
    type: 'employee',
    position: { x: 0, y: 0 },
    data: n.data,
  }))
}

function toFlowEdges(data: Organograma): Edge[] {
  return data.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: true,
  }))
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('organograma.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Organograma = await res.json()

      const flowNodes = toFlowNodes(data)
      const flowEdges = toFlowEdges(data)
      const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(
        flowNodes,
        flowEdges,
        'TB',
      )

      setNodes(layouted)
      setEdges(layoutedEdges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar organograma')
    } finally {
      setLoading(false)
    }
  }, [setNodes, setEdges])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="center">
        <p>Carregando organograma...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="center">
        <p>Erro: {error}</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Organograma</h1>
      </header>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        colorMode="light"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
