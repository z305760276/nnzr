import { useState, useCallback, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { X, Users, Brain, ChevronLeft, Maximize2, Minimize2, Shield, FileText } from 'lucide-react'
import {
  orgHierarchy,
  orgRelations,
  getChildren,
  getReportLine,
  type OrgNode,
} from '../data/orgHierarchy'

interface LevelMeta {
  color: string
  name: string
  symbolSize: number
}

const LEVEL_META: Record<number, LevelMeta> = {
  1: { color: '#C8102E', name: '部门负责人', symbolSize: 72 },
  2: { color: '#B91C1C', name: '主管/站长', symbolSize: 56 },
  3: { color: '#7C3AED', name: '班长/专员', symbolSize: 44 },
  4: { color: '#1D4ED8', name: '执行岗', symbolSize: 36 },
}

const RING_RADII = [0, 140, 260, 380]

function computeRadialPositions() {
  const positions: Record<string, [number, number]> = {}
  for (let level = 1; level <= 4; level++) {
    const nodes = orgHierarchy.filter((n) => n.level === level)
    const count = nodes.length
    const radius = RING_RADII[level - 1]
    if (count === 1) {
      positions[nodes[0].id] = [0, 0]
    } else {
      nodes.forEach((n, i) => {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2
        positions[n.id] = [radius * Math.cos(angle), radius * Math.sin(angle)]
      })
    }
  }
  return positions
}

const RADIAL_POSITIONS = computeRadialPositions()

function buildGraphData(focusNode?: OrgNode) {
  const focusId = focusNode?.id

  let visibleIds: Set<string>
  if (focusId) {
    visibleIds = new Set([focusId])
    const children = getChildren(focusId)
    children.forEach((c) => visibleIds.add(c.id))
    children.flatMap((c) => getChildren(c.id)).forEach((c) => visibleIds.add(c.id))
  } else {
    visibleIds = new Set(orgHierarchy.map((n) => n.id))
  }

  const visibleNodes = orgHierarchy.filter((n) => visibleIds.has(n.id))

  const nodePositions = computeRadialPositionsFromFocus(focusId)
  const focusX = focusId ? (nodePositions[focusId]?.[0] ?? 0) : 0
  const focusY = focusId ? (nodePositions[focusId]?.[1] ?? 0) : 0

  const nodes = visibleNodes.map((n) => {
    const meta = LEVEL_META[n.level]
    const isFocus = n.id === focusId
    const rawPos = nodePositions[n.id] ?? [0, 0]

    if (n.level === 1 && !focusId) {
      return {
        id: n.id,
        name: n.title,
        fullName: n.title,
        level: n.level,
        category: 0,
        aiEnabled: n.aiEnabled,
        x: 0,
        y: 0,
        itemStyle: {
          color: meta.color,
          shadowBlur: 20,
          shadowColor: 'rgba(200,16,46,0.45)',
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 2,
        },
        symbolSize: meta.symbolSize,
        label: {
          show: true,
          position: 'bottom',
          fontSize: 13,
          fontWeight: 'bold',
          color: '#ffffff',
          textShadowBlur: 4,
          textShadowColor: 'rgba(0,0,0,0.5)',
          distance: 8,
          formatter: (p: any) => p.data.fullName || p.data.name,
        },
      }
    }

    return {
      id: n.id,
      name: n.title.length > 10 ? n.title.slice(0, 10) + '...' : n.title,
      fullName: n.title,
      level: n.level,
      category: n.level - 1,
      aiEnabled: n.aiEnabled,
      x: rawPos[0] - focusX,
      y: rawPos[1] - focusY,
      itemStyle: {
        color: isFocus ? meta.color : meta.color,
        shadowBlur: isFocus ? 16 : 4,
        shadowColor: isFocus ? `rgba(200,16,46,0.35)` : 'rgba(0,0,0,0.12)',
        borderColor: isFocus ? '#ffffff' : 'rgba(255,255,255,0.15)',
        borderWidth: isFocus ? 3 : 1,
        opacity: isFocus ? 1 : 0.85,
      },
      symbolSize: isFocus ? meta.symbolSize * 1.2 : meta.symbolSize * (1 - 0.08 * (n.level - 1)),
      label: {
        show: true,
        position: 'bottom',
        fontSize: isFocus ? 12 : n.level <= 2 ? 11 : 10,
        fontWeight: isFocus ? 'bold' : 'normal',
        color: '#ffffff',
        textShadowBlur: 3,
        textShadowColor: 'rgba(0,0,0,0.4)',
        distance: 6,
        formatter: (p: any) => {
          const name = p.data.fullName || p.data.name
          return name.length > 14 ? name.slice(0, 14) + '...' : name
        },
      },
    }
  })

  const nodeIds = new Set(nodes.map((n) => n.id))

  const links = orgRelations
    .filter((r) => nodeIds.has(r.from) && nodeIds.has(r.to))
    .map((r) => ({
      source: r.from,
      target: r.to,
      lineStyle: {
        color: r.type === 'collaborates' ? '#A855F7' : '#475569',
        width: r.type === 'reports' ? 2 : 1.2,
        curveness: r.type === 'collaborates' ? 0.3 : 0.1,
        type: r.type === 'collaborates' ? 'dashed' : 'solid' as const,
        opacity: 0.5,
      },
      label: {
        show: r.type === 'collaborates',
        formatter: '协作',
        fontSize: 9,
        color: '#A855F7',
      },
    }))

  return { nodes, links }
}

function computeRadialPositionsFromFocus(focusId?: string) {
  if (!focusId) return RADIAL_POSITIONS
  const positions: Record<string, [number, number]> = {}
  const focusNode = orgHierarchy.find((n) => n.id === focusId)
  if (!focusNode) return RADIAL_POSITIONS

  const focusLevel = focusNode.level

  positions[focusId] = [0, 0]

  for (let level = focusLevel; level <= Math.min(focusLevel + 2, 4); level++) {
    const nodes = orgHierarchy.filter((n) => n.level === level && n.id !== focusId)
    const radius = RING_RADII[level - focusLevel]
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2
      positions[n.id] = [radius * Math.cos(angle), radius * Math.sin(angle)]
    })
  }

  return positions
}

function OrgGraphSection() {
  const [focusNode, setFocusNode] = useState<OrgNode | undefined>(undefined)
  const [selectedNode, setSelectedNode] = useState<OrgNode | undefined>(undefined)
  const [fullscreen, setFullscreen] = useState(false)

  const breadcrumb = useMemo(() => {
    if (!focusNode) return []
    return getReportLine(focusNode.id)
  }, [focusNode])

  const graphData = useMemo(() => buildGraphData(focusNode), [focusNode])

  const totalNodes = orgHierarchy.length
  const aiNodes = orgHierarchy.filter((n) => n.aiEnabled).length

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const d = params.data
            const meta = LEVEL_META[d.level]
            const levelName = meta?.name || ''
            return `<div style="font-size:14px;font-weight:700;color:#1E293B;margin-bottom:6px">${d.fullName || d.name}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${meta?.color || '#64748B'}"></span>
                      <span style="font-size:12px;color:#64748B">${levelName}</span>
                    </div>
                    ${d.aiEnabled ? '<div style="font-size:11px;color:#C8102E;margin-top:4px;display:flex;align-items:center;gap:4px">🧠 AI赋能岗位</div>' : ''}
                    <div style="font-size:11px;color:#94A3B8;margin-top:4px">点击查看详情</div>`
          }
          return ''
        },
        backgroundColor: '#ffffff',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        padding: [12, 16],
        textStyle: { color: '#1E293B', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 20px rgba(0,0,0,0.1)',
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          roam: true,
          draggable: true,
          data: graphData.nodes,
          links: graphData.links,
          categories: [
            { name: '部门负责人', itemStyle: { color: LEVEL_META[1].color } },
            { name: '主管/站长', itemStyle: { color: LEVEL_META[2].color } },
            { name: '班长/专员', itemStyle: { color: LEVEL_META[3].color } },
            { name: '执行岗', itemStyle: { color: LEVEL_META[4].color } },
          ],
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 7],
          lineStyle: { opacity: 0.5 },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 3, opacity: 0.9 },
            itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.2)' },
          },
          blur: { opacity: 0.12 },
          animationDuration: 600,
          animationEasingUpdate: 'cubicOut',
          animationDelay: (idx: number) => idx * 30,
        },
      ],
    }),
    [graphData]
  )

  const onChartClick = useCallback(
    (params: any) => {
      if (params.dataType === 'node') {
        const node = orgHierarchy.find((n) => n.id === params.data.id)
        if (node) {
          setSelectedNode(node === selectedNode ? undefined : node)
          if (node.level < 4) {
            setFocusNode(node)
          }
        }
      }
    },
    [selectedNode]
  )

  const resetView = () => {
    setFocusNode(undefined)
    setSelectedNode(undefined)
  }

  const goToBreadcrumb = (node: OrgNode) => {
    setFocusNode(node)
    setSelectedNode(undefined)
  }

  const renderDetailPanel = () => {
    if (!selectedNode) return null
    const n = selectedNode
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: LEVEL_META[n.level]?.color || '#64748B' }}
            >
              {n.title.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className="size-1.5 rounded-full shrink-0"
                  style={{ background: LEVEL_META[n.level]?.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {LEVEL_META[n.level]?.name || `Level ${n.level}`}
                </span>
                {n.aiEnabled && (
                  <span className="flex items-center gap-1 text-[10px] text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    <Brain className="size-3" />
                    AI赋能
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(undefined)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[280px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <div className="bg-card p-4 space-y-3">
              <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <FileText className="size-3.5" />
                核心职责
              </h4>
              <ul className="space-y-2">
                {n.responsibilities.slice(0, 6).map((r, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-lg px-3 py-2"
                  >
                    {r}
                  </li>
                ))}
                {n.responsibilities.length > 6 && (
                  <li className="text-[10px] text-muted-foreground/60 text-center">
                    +{n.responsibilities.length - 6} 条其余职责
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-card p-4 space-y-3">
              <h4 className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#DC2626' }}>
                <Shield className="size-3.5" />
                安全职责
              </h4>
              <ul className="space-y-2">
                {n.safetyDuties.slice(0, 4).map((d, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground leading-relaxed bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2"
                  >
                    {d}
                  </li>
                ))}
                {n.safetyDuties.length > 4 && (
                  <li className="text-[10px] text-muted-foreground/60 text-center">
                    +{n.safetyDuties.length - 4} 条其余职责
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground bg-muted/20">
          {n.reportsTo && (
            <span>
              汇报对象：<span className="text-foreground font-medium">{n.reportsTo}</span>
            </span>
          )}
          {n.manages && n.manages.length > 0 && (
            <span>
              直接管理：<span className="text-foreground font-medium">{n.manages.join('、')}</span>
            </span>
          )}
          {n.staffCount && (
            <span>
              团队规模：<span className="text-foreground font-medium">{n.staffCount}人</span>
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={fullscreen ? 'fixed inset-0 z-[90] bg-background p-4 flex flex-col' : ''}>
        <div
          className={`rounded-xl border border-border bg-card overflow-hidden ${
            fullscreen ? 'flex-1 flex flex-col' : ''
          }`}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-gradient-to-r from-primary/[0.03] to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="size-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {focusNode ? focusNode.title : '组织架构全景图谱'}
                </span>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  {focusNode ? `${LEVEL_META[focusNode.level]?.name || ''} · 点击子节点继续穿透` : '经理居中 · 辐射式网状布局'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {breadcrumb.length > 0 && (
                <button
                  onClick={resetView}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-accent"
                >
                  <ChevronLeft className="size-3.5" />
                  返回全景
                </button>
              )}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title={fullscreen ? '退出全屏' : '全屏'}
              >
                {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
            </div>
          </div>

          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 px-5 py-2 bg-muted/20 border-b border-border overflow-x-auto">
              <span className="text-[10px] text-muted-foreground/60 shrink-0">导航路径：</span>
              {breadcrumb.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => goToBreadcrumb(n)}
                  className={`text-xs shrink-0 px-2.5 py-0.5 rounded-full transition-all ${
                    n.id === focusNode?.id
                      ? 'text-white font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  style={n.id === focusNode?.id ? { background: LEVEL_META[n.level]?.color } : undefined}
                >
                  {n.title.length > 8 ? n.title.slice(0, 8) + '..' : n.title}
                  {i < breadcrumb.length - 1 && (
                    <ChevronLeft className="size-2.5 inline ml-1 -rotate-180 opacity-50" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="relative" style={{ height: fullscreen ? '100%' : '560px' }}>
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              onEvents={{ click: onChartClick }}
            />
          </div>
        </div>

        {renderDetailPanel()}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-3 flex-wrap">
          {([1, 2, 3, 4] as const).map((level) => {
            const count = orgHierarchy.filter((n) => n.level === level).length
            return (
              <span key={level} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full shrink-0" style={{ background: LEVEL_META[level].color }} />
                <span className="text-foreground/70">{LEVEL_META[level].name}</span>
                <span className="font-medium text-foreground">{count}</span>
              </span>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <span>{totalNodes} 个节点 · {orgRelations.length} 条关联</span>
          <span className="flex items-center gap-1">
            <Brain className="size-3" />
            AI赋能 {aiNodes} 个岗位
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrgGraphSection
