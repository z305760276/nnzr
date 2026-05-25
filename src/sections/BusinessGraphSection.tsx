import { useState, useMemo, useRef, useLayoutEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Briefcase, GitBranch, UserCheck, BarChart3, Database, X, Maximize2, Minimize2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { businessNodes, businessRelations, type BusinessNode } from '../data/businessGraph'
import { orgHierarchy } from '../data/orgHierarchy'

const LAYER_CONFIG = {
  1: { label: '战略目标', icon: Target, gradient: 'linear-gradient(135deg, #FFD700, #FF6B6B)', shape: 'diamond' as const },
  2: { label: '业务板块', icon: Briefcase, gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', shape: 'roundedRect' as const },
  3: { label: '业务执行', icon: GitBranch, gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)', shape: 'circle' as const },
  4: { label: '岗位支撑', icon: UserCheck, gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', shape: 'hexagon' as const },
  5: { label: '数据指标', icon: BarChart3, gradient: 'linear-gradient(135deg, #F97316, #EA580C)', shape: 'roundedRect' as const },
  6: { label: '数据来源', icon: Database, gradient: 'linear-gradient(135deg, #6B7280, #4B5563)', shape: 'roundedRect' as const },
}

const RELATION_COLORS: Record<string, string> = {
  decomposes: '#6366F1',
  supports: '#14B8A6',
  measures: '#F97316',
  sources_from: '#6B7280',
  impacts: '#F59E0B',
  assesses: '#EF4444',
}

const RELATION_LABELS: Record<string, string> = {
  decomposes: '分解',
  supports: '支撑',
  measures: '衡量',
  sources_from: '来源于',
  impacts: '影响',
  assesses: '考核',
}

interface Connection {
  fromId: string
  toId: string
  x1: number
  y1: number
  x2: number
  y2: number
  type: string
  label?: string
}

function BusinessNodeCard({
  node,
  layer,
  onSelect,
  isSelected,
  setNodeRef,
  hoveredNodeId,
  hoveredRelatedIds,
  onHover,
  onHoverEnd,
}: {
  node: BusinessNode
  layer: (typeof LAYER_CONFIG)[keyof typeof LAYER_CONFIG]
  onSelect: (node: BusinessNode) => void
  isSelected: boolean
  setNodeRef: (id: string) => (el: HTMLDivElement | null) => void
  hoveredNodeId: string | null
  hoveredRelatedIds: Set<string>
  onHover: (id: string) => void
  onHoverEnd: () => void
}) {
  const Icon = layer.icon
  const isDiamond = layer.shape === 'diamond'
  const isCircle = layer.shape === 'circle'
  const isHexagon = layer.shape === 'hexagon'

  const isDimmed = hoveredNodeId !== null && hoveredNodeId !== node.id && !hoveredRelatedIds.has(node.id)

  return (
    <motion.div
      ref={setNodeRef(node.id)}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        scale: 1,
        y: 0,
      }}
      transition={{ duration: 0.4, delay: node.layer * 0.08 + (businessNodes.indexOf(node) % 10) * 0.03 }}
      onClick={() => onSelect(node)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={onHoverEnd}
      className="relative cursor-pointer shrink-0 glass-shimmer"
      style={{
        width: isDiamond ? 84 : isCircle ? 72 : 96,
        height: isDiamond ? 84 : isCircle ? 72 : 72,
        clipPath: isHexagon ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : undefined,
        borderRadius: isDiamond ? '8px' : isCircle ? '50%' : '12px',
        background: layer.gradient,
        transform: isDiamond ? 'rotate(45deg)' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: isSelected ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: isSelected
          ? '0 0 20px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        transition: 'border-color 0.2s, box-shadow 0.2s, opacity 0.25s ease',
      }}
      whileHover={{ scale: 1.08, zIndex: 10 }}
    >
      <div style={{ transform: isDiamond ? 'rotate(-45deg)' : undefined, textAlign: 'center' }} className="px-1.5">
        <Icon className="mx-auto" style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.95)' }} />
        <p
          className="font-semibold leading-tight mt-0.5"
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: 9,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {node.label}
        </p>
      </div>
    </motion.div>
  )
}

function BusinessGraphSection() {
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState<BusinessNode | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [connections, setConnections] = useState<Connection[]>([])
  const graphRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const nodesByLayer = useMemo(() => {
    const map = new Map<number, BusinessNode[]>()
    for (let i = 1; i <= 6; i++) map.set(i, [])
    businessNodes.forEach((n) => {
      const list = map.get(n.layer)
      if (list) list.push(n)
    })
    return map
  }, [])

  const filteredNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase()
    const ids = new Set<string>()
    businessNodes.forEach((n) => {
      if (n.label.toLowerCase().includes(q) || (n.description && n.description.toLowerCase().includes(q))) {
        ids.add(n.id)
      }
    })
    return ids
  }, [searchQuery])

  const hoveredRelatedIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>()
    const related = new Set<string>()
    businessRelations.forEach((r) => {
      if (r.from === hoveredNodeId) {
        related.add(r.to)
      }
      if (r.to === hoveredNodeId) {
        related.add(r.from)
      }
    })
    related.add(hoveredNodeId)
    return related
  }, [hoveredNodeId])

  const stats = useMemo(() => {
    const totalNodes = businessNodes.length
    const totalRelations = businessRelations.length
    const redYellowItems = businessNodes.filter(
      (n) => n.redYellowLine && (n.redYellowLine.hasRedLine || n.redYellowLine.hasYellowLine)
    ).length
    const coveredPositions = businessNodes.filter((n) => n.layer === 4 && n.refId).length
    return { totalNodes, totalRelations, redYellowItems, coveredPositions }
  }, [])

  const selectedDetails = useMemo(() => {
    if (!selectedNode) return null
    const orgNode = selectedNode.refId ? orgHierarchy.find((o) => o.id === selectedNode.refId) : null
    const relations = businessRelations.filter(
      (r) => r.from === selectedNode.id || r.to === selectedNode.id
    )
    const relatedNodes = relations.map((r) => {
      const relatedId = r.from === selectedNode.id ? r.to : r.from
      return businessNodes.find((n) => n.id === relatedId)
    }).filter(Boolean) as BusinessNode[]

    const upstreamRelations = businessRelations.filter((r) => r.to === selectedNode.id)
    const downstreamRelations = businessRelations.filter((r) => r.from === selectedNode.id)
    const upstreamNodes = upstreamRelations.map((r) => ({
      relation: r,
      node: businessNodes.find((n) => n.id === r.from)!,
    })).filter((item) => item.node)
    const downstreamNodes = downstreamRelations.map((r) => ({
      relation: r,
      node: businessNodes.find((n) => n.id === r.to)!,
    })).filter((item) => item.node)

    return { orgNode, relations, relatedNodes, upstreamNodes, downstreamNodes }
  }, [selectedNode])

  const setNodeRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }, [])

  const recalculateConnections = useCallback(() => {
    if (!graphRef.current) return
    const graphRect = graphRef.current.getBoundingClientRect()
    const lines: Connection[] = []

    businessRelations.forEach((rel) => {
      const fromEl = nodeRefs.current.get(rel.from)
      const toEl = nodeRefs.current.get(rel.to)
      if (!fromEl || !toEl) return

      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()

      lines.push({
        fromId: rel.from,
        toId: rel.to,
        x1: fromRect.left - graphRect.left + fromRect.width / 2,
        y1: fromRect.bottom - graphRect.top,
        x2: toRect.left - graphRect.left + toRect.width / 2,
        y2: toRect.top - graphRect.top,
        type: rel.type,
        label: rel.label,
      })
    })
    setConnections(lines)
  }, [])

  useLayoutEffect(() => {
    recalculateConnections()
    const observer = new ResizeObserver(() => recalculateConnections())
    if (graphRef.current) observer.observe(graphRef.current)
    return () => observer.disconnect()
  }, [recalculateConnections])

  const processedLabels = useMemo(() => {
    type RawEntry = { x: number; y: number; text: string; color: string; fromId: string; toId: string }
    const raw: RawEntry[] = []
    connections.forEach((conn) => {
      if (!conn.label) return
      raw.push({
        x: (conn.x1 + conn.x2) / 2,
        y: (conn.y1 + conn.y2) / 2,
        text: conn.label,
        color: RELATION_COLORS[conn.type] || '#6366F1',
        fromId: conn.fromId,
        toId: conn.toId,
      })
    })

    if (raw.length === 0) return { labels: [] }

    const MERGE_RADIUS = 80
    const SPREAD_OFFSET = 36

    const textGroups = new Map<string, RawEntry[]>()
    raw.forEach((e) => {
      const g = textGroups.get(e.text)
      if (g) g.push(e)
      else textGroups.set(e.text, [e])
    })

    const result: { x: number; y: number; text: string; color: string; mergedCount: number; connectionPairs: { fromId: string; toId: string }[] }[] = []

    textGroups.forEach((group) => {
      const clustered: RawEntry[][] = []
      const used = new Set<number>()

      for (let i = 0; i < group.length; i++) {
        if (used.has(i)) continue
        const cluster: RawEntry[] = [group[i]]
        used.add(i)
        for (let j = i + 1; j < group.length; j++) {
          if (used.has(j)) continue
          const dx = Math.abs(group[j].x - group[i].x)
          const dy = Math.abs(group[j].y - group[i].y)
          if (dx < MERGE_RADIUS && dy < MERGE_RADIUS) {
            cluster.push(group[j])
            used.add(j)
          }
        }
        clustered.push(cluster)
      }

      clustered.forEach((cluster) => {
        result.push({
          x: cluster.reduce((s, e) => s + e.x, 0) / cluster.length,
          y: cluster.reduce((s, e) => s + e.y, 0) / cluster.length,
          text: cluster[0].text,
          color: cluster[0].color,
          mergedCount: cluster.length,
          connectionPairs: cluster.map((e) => ({ fromId: e.fromId, toId: e.toId })),
        })
      })
    })

    result.sort((a, b) => a.y - b.y || a.x - b.x)

    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        if (result[i].text === result[j].text) continue
        const dy = Math.abs(result[j].y - result[i].y)
        if (dy < 16) {
          const dx = result[j].x - result[i].x
          if (Math.abs(dx) < SPREAD_OFFSET) {
            result[j].x = result[i].x + SPREAD_OFFSET * (1 + Math.floor(Math.abs(dx) / SPREAD_OFFSET))
          }
        }
      }
    }

    return { labels: result }
  }, [connections])

  const selectedNodeResults = selectedDetails?.relatedNodes ?? []

  return (
    <>
      <style>{`
        .business-graph-wrapper {
          position: relative;
          overflow: auto;
        }
        .business-graph-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .business-graph-layer {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 16px 24px;
          min-height: 120px;
        }
        .business-graph-layer-label {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          transform-origin: center;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.3;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .business-graph-layer {
            padding: 12px 8px;
            gap: 10px;
          }
        }
      `}</style>

      <div className={fullscreen ? 'fixed inset-0 z-[90] bg-background p-4 flex flex-col' : 'space-y-4'}>
        <div className={`rounded-xl overflow-hidden ${fullscreen ? 'flex-1 flex flex-col' : ''}`}
          style={{
            background: 'var(--kpi-glass-bg-strong, var(--glass-bg-strong))',
            backdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid var(--kpi-glass-border, var(--glass-border))',
            boxShadow: 'var(--kpi-glass-shadow, var(--glass-shadow))',
          }}
        >
          <div className="flex items-center justify-between px-5 py-3 shrink-0 gap-3"
            style={{ borderBottom: '1px solid var(--kpi-divider, var(--border-light))' }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}>
                <Target className="size-4" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold truncate" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                  业务能力全景图谱
                </span>
                <p className="text-[10px] leading-none mt-0.5 truncate" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                  六大层级 · 战略到数据全链路可视化
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative" style={{ width: 160 }}>
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
                <input
                  type="text"
                  placeholder="搜索节点名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[11px] rounded-lg pl-7 pr-6 py-1.5 outline-none"
                  style={{
                    background: 'var(--card-inner-bg, rgba(0,0,0,0.03))',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-light, rgba(255,255,255,0.06))',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  <ChevronLeft className="size-3.5" />返回全景
                </button>
              )}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                title={fullscreen ? '退出全屏' : '全屏'}
              >
                {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
            </div>
          </div>

          <div className="business-graph-wrapper" ref={graphRef} style={{ height: fullscreen ? '100%' : '580px' }}>
            <svg className="business-graph-svg">
              <defs>
                {Object.entries(RELATION_COLORS).map(([type, color]) => (
                  <marker
                    key={type}
                    id={`arrow-${type}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M0,0 L10,5 L0,10 Z" fill={color} opacity={0.6} />
                  </marker>
                ))}
              </defs>
              {connections.map((conn, i) => {
                const midY = (conn.y1 + conn.y2) / 2
                const pathD = `M${conn.x1},${conn.y1} L${conn.x1},${midY} L${conn.x2},${midY} L${conn.x2},${conn.y2}`
                const color = RELATION_COLORS[conn.type] || '#6366F1'
                const activeNodeId = hoveredNodeId || selectedNode?.id
                const isActive = activeNodeId != null
                const isConnected = isActive && (
                  (conn as any).fromId === activeNodeId || (conn as any).toId === activeNodeId
                )
                const svgOpacity = isActive ? (isConnected ? 0.7 : 0.06) : 0
                return (
                  <path
                    key={i}
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={isConnected ? 2 : 1.2}
                    strokeOpacity={svgOpacity}
                    markerEnd={isActive ? `url(#arrow-${conn.type})` : undefined}
                  />
                )
              })}
              {processedLabels.labels.map((label, i) => {
                const activeNodeId = hoveredNodeId || selectedNode?.id
                const isActive = activeNodeId != null
                const isConnected = isActive && label.connectionPairs.some(
                  (p) => p.fromId === activeNodeId || p.toId === activeNodeId
                )
                const textOpacity = isActive ? (isConnected ? 0.8 : 0.06) : 0
                const displayText = label.mergedCount > 1
                  ? `${label.text} ×${label.mergedCount}`
                  : label.text
                return (
                  <text
                    key={`label-${i}`}
                    x={label.x}
                    y={label.y - 4}
                    textAnchor="middle"
                    fontSize="8"
                    fill={label.color}
                    fillOpacity={textOpacity}
                    style={{ pointerEvents: 'none' }}
                  >
                    {displayText.length > 10 ? displayText.slice(0, 10) + '..' : displayText}
                  </text>
                )
              })}
            </svg>

            <div className="flex flex-col">
              {[1, 2, 3, 4, 5, 6].map((layerNum) => {
                const nodes = nodesByLayer.get(layerNum) || []
                if (nodes.length === 0) return null
                const layer = LAYER_CONFIG[layerNum as keyof typeof LAYER_CONFIG]
                return (
                  <div
                    key={layerNum}
                    className="business-graph-layer relative"
                    style={{
                      background: layerNum % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: layerNum < 6 ? '1px solid var(--border-subtle, rgba(255,255,255,0.04))' : undefined,
                    }}
                  >
                    <span className="business-graph-layer-label" style={{ color: layer.gradient }}>
                      L{layerNum} {layer.label}
                    </span>
                    <div className="flex items-center gap-3 flex-wrap justify-center" style={{ paddingLeft: 60 }}>
                      {nodes
                        .filter((node) => !filteredNodeIds || filteredNodeIds.has(node.id))
                        .map((node) => (
                        <BusinessNodeCard
                          key={node.id}
                          node={node}
                          layer={layer}
                          onSelect={setSelectedNode}
                          isSelected={selectedNode?.id === node.id}
                          setNodeRef={setNodeRef}
                          hoveredNodeId={hoveredNodeId}
                          hoveredRelatedIds={hoveredRelatedIds}
                          onHover={setHoveredNodeId}
                          onHoverEnd={() => setHoveredNodeId(null)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '总节点数', value: stats.totalNodes, gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)' },
            { label: '总关联数', value: stats.totalRelations, gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)' },
            { label: '红黄线考核项', value: stats.redYellowItems, gradient: 'linear-gradient(135deg, #F97316, #EF4444)' },
            { label: '覆盖岗位数', value: stats.coveredPositions, gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="rounded-xl px-4 py-3 glass-shimmer relative overflow-hidden"
              style={{
                background: 'var(--kpi-card-bg, var(--glass-bg))',
                border: '1px solid var(--kpi-card-border, var(--glass-border))',
                boxShadow: 'var(--kpi-glass-shadow, var(--glass-shadow))',
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l" style={{ background: stat.gradient }} />
              <p className="text-[11px] font-medium" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-0.5" style={{ background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--kpi-glass-bg-strong, var(--glass-bg-strong))',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid var(--kpi-glass-border, var(--glass-border))',
                boxShadow: 'var(--kpi-glass-shadow, var(--glass-shadow))',
              }}
            >
              <div className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: '1px solid var(--kpi-divider, var(--border-light))' }}>
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg flex items-center justify-center"
                    style={{ background: LAYER_CONFIG[selectedNode.layer].gradient }}>
                    {(() => {
                      const Icon = LAYER_CONFIG[selectedNode.layer].icon
                      return <Icon className="size-4 text-white" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                      {selectedNode.label}
                    </h3>
                    <p className="text-[10px]" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                      L{selectedNode.layer} · {LAYER_CONFIG[selectedNode.layer].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {selectedNode.description && (
                  <div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--kpi-text-secondary, var(--text-secondary))' }}>
                      {selectedNode.description}
                    </p>
                  </div>
                )}

                {selectedNode.details && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedNode.details.owner && (
                      <div className="rounded-lg px-3 py-2"
                        style={{ background: 'var(--card-inner-bg, rgba(0,0,0,0.03))' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>负责人</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                          {selectedNode.details.owner}
                        </p>
                      </div>
                    )}
                    {selectedNode.details.frequency && (
                      <div className="rounded-lg px-3 py-2"
                        style={{ background: 'var(--card-inner-bg, rgba(0,0,0,0.03))' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>频次</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                          {selectedNode.details.frequency}
                        </p>
                      </div>
                    )}
                    {selectedNode.details.formula && (
                      <div className="rounded-lg px-3 py-2 col-span-2"
                        style={{ background: 'var(--card-inner-bg, rgba(0,0,0,0.03))' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>计算方式</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                          {selectedNode.details.formula}
                        </p>
                      </div>
                    )}
                    {selectedNode.details.source && (
                      <div className="rounded-lg px-3 py-2"
                        style={{ background: 'var(--card-inner-bg, rgba(0,0,0,0.03))' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>数据来源</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                          {selectedNode.details.source}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.experienceTips && selectedNode.experienceTips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                      style={{ color: 'var(--brand-primary)' }}>
                      <span className="size-1.5 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                      经验提示
                    </p>
                    <ul className="space-y-1.5">
                      {selectedNode.experienceTips.map((tip, i) => (
                        <li key={i} className="text-xs leading-relaxed pl-3 relative"
                          style={{ color: 'var(--kpi-text-secondary, var(--text-secondary))' }}>
                          <span className="absolute left-0 top-1.5 size-1 rounded-full"
                            style={{ background: 'var(--brand-primary)', opacity: 0.4 }} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNodeResults.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                      关联节点（{selectedNodeResults.length}）
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNodeResults.map((rn) => {
                        const lc = LAYER_CONFIG[rn.layer]
                        return (
                          <button
                            key={rn.id}
                            onClick={() => setSelectedNode(rn)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                            style={{
                              background: `${lc.gradient}15`,
                              color: rn.layer <= 2 ? '#CBD5E1' : 'rgba(255,255,255,0.85)',
                              border: `1px solid ${lc.gradient}30`,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = `${lc.gradient}25` }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = `${lc.gradient}15` }}
                          >
                            <lc.icon className="size-3" />
                            {rn.label.length > 10 ? rn.label.slice(0, 10) + '..' : rn.label}
                            <ChevronRight className="size-2.5" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedDetails?.orgNode && (
                  <div>
                    <p className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                      style={{ color: 'var(--brand-primary)' }}>
                      <UserCheck className="size-3" />
                      关联岗位信息
                    </p>
                    <div className="rounded-lg px-3 py-2 text-xs"
                      style={{ background: 'var(--card-inner-bg, rgba(0,0,0,0.03))' }}>
                      <p style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                        {selectedDetails.orgNode.title}
                        <span className="ml-2" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                          L{selectedDetails.orgNode.level}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {selectedDetails.orgNode.responsibilities && (
                          <span style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                            职责：{selectedDetails.orgNode.responsibilities.length}项
                          </span>
                        )}
                        {selectedDetails.orgNode.safetyDuties && (
                          <span style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                            安全职责：{selectedDetails.orgNode.safetyDuties.length}项
                          </span>
                        )}
                        {selectedDetails.orgNode.staffCount && (
                          <span style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                            团队：{selectedDetails.orgNode.staffCount}人
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode.redYellowLine && (selectedNode.redYellowLine.hasRedLine || selectedNode.redYellowLine.hasYellowLine) && (
                  <div className="flex items-center gap-2 text-[10px]">
                    {selectedNode.redYellowLine.hasRedLine && (
                      <span className="px-2 py-0.5 rounded font-semibold"
                        style={{ background: 'rgba(220,38,38,0.12)', color: '#EF4444', border: '1px solid rgba(220,38,38,0.2)' }}>
                        红线考核项
                      </span>
                    )}
                    {selectedNode.redYellowLine.hasYellowLine && (
                      <span className="px-2 py-0.5 rounded font-semibold"
                        style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                        黄线考核项
                      </span>
                    )}
                  </div>
                )}

                {selectedDetails && (selectedDetails.upstreamNodes.length > 0 || selectedDetails.downstreamNodes.length > 0) && (
                  <div>
                    <p className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                      style={{ color: 'var(--brand-primary)' }}>
                      <GitBranch className="size-3" />
                      责任穿刺 · 链路展开
                    </p>
                    <div className="rounded-lg p-3 text-xs space-y-2"
                      style={{ background: 'var(--card-inner-bg, rgba(0,0,0,0.03))' }}>
                      {selectedDetails.upstreamNodes.length > 0 && (
                        <div>
                          <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                            上游链路（来自）
                          </p>
                          <div className="flex flex-wrap items-center gap-1">
                            {selectedDetails.upstreamNodes.map((item, idx) => (
                              <span key={item.node.id} className="flex items-center gap-1">
                                {idx > 0 && <ChevronRight className="size-2.5" style={{ color: 'var(--text-muted)' }} />}
                                <button
                                  onClick={() => setSelectedNode(item.node)}
                                  className="px-2 py-0.5 rounded font-medium transition-colors"
                                  style={{
                                    background: `${LAYER_CONFIG[item.node.layer].gradient}20`,
                                    color: 'var(--kpi-text-primary, var(--text-primary))',
                                    border: `1px solid ${LAYER_CONFIG[item.node.layer].gradient}25`,
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = `${LAYER_CONFIG[item.node.layer].gradient}35` }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = `${LAYER_CONFIG[item.node.layer].gradient}20` }}
                                >
                                  {item.node.label}
                                </button>
                                <span className="text-[9px]" style={{ color: RELATION_COLORS[item.relation.type] || 'var(--text-muted)' }}>
                                  {RELATION_LABELS[item.relation.type] || item.relation.type}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-1">
                        <span className="size-2 rounded-full" style={{ background: LAYER_CONFIG[selectedNode.layer].gradient }} />
                        <span className="font-semibold text-xs" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                          {selectedNode.label}
                        </span>
                        <span className="text-[9px]" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                          （当前节点）
                        </span>
                      </div>
                      {selectedDetails.downstreamNodes.length > 0 && (
                        <div>
                          <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                            下游链路（去向）
                          </p>
                          <div className="flex flex-wrap items-center gap-1">
                            {selectedDetails.downstreamNodes.map((item, idx) => (
                              <span key={item.node.id} className="flex items-center gap-1">
                                {idx > 0 && <ChevronRight className="size-2.5" style={{ color: 'var(--text-muted)' }} />}
                                <span className="text-[9px]" style={{ color: RELATION_COLORS[item.relation.type] || 'var(--text-muted)' }}>
                                  {RELATION_LABELS[item.relation.type] || item.relation.type}
                                </span>
                                <button
                                  onClick={() => setSelectedNode(item.node)}
                                  className="px-2 py-0.5 rounded font-medium transition-colors"
                                  style={{
                                    background: `${LAYER_CONFIG[item.node.layer].gradient}20`,
                                    color: 'var(--kpi-text-primary, var(--text-primary))',
                                    border: `1px solid ${LAYER_CONFIG[item.node.layer].gradient}25`,
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = `${LAYER_CONFIG[item.node.layer].gradient}35` }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = `${LAYER_CONFIG[item.node.layer].gradient}20` }}
                                >
                                  {item.node.label}
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedNode.type === 'position' && selectedDetails?.orgNode && (
                    <button
                      onClick={() => navigate('/detail/org')}
                      className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{
                        background: 'rgba(99,102,241,0.12)',
                        color: '#818CF8',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
                    >
                      <UserCheck className="size-3.5" />
                      查看组织架构
                    </button>
                  )}
                  {selectedNode.details?.relatedDocs && selectedNode.details.relatedDocs.length > 0 && (
                    <button
                      onClick={() => {
                        const doc = selectedNode.details!.relatedDocs![0]
                        window.open(`/files/${encodeURIComponent(doc)}`, '_blank')
                      }}
                      className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{
                        background: 'rgba(16,185,129,0.12)',
                        color: '#34D399',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)' }}
                    >
                      <Target className="size-3.5" />
                      查看制度文件
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-2 text-[10px] flex-wrap px-1">
          <div className="flex items-center gap-3 flex-wrap">
            {([1, 2, 3, 4, 5, 6] as const).map((layerNum) => {
              const layer = LAYER_CONFIG[layerNum]
              const count = nodesByLayer.get(layerNum)?.length || 0
              return (
                <span key={layerNum} className="flex items-center gap-1">
                  <span className="size-2 rounded-full shrink-0" style={{ background: layer.gradient }} />
                  <span style={{ color: 'var(--text-muted)' }}>L{layerNum} {layer.label}</span>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{count}</span>
                </span>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            {Object.entries(RELATION_LABELS).map(([type, label]) => (
              <span key={type} className="flex items-center gap-1">
                <span className="size-2 rounded-sm shrink-0" style={{ background: RELATION_COLORS[type] }} />
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default BusinessGraphSection
