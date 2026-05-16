import { useState, useCallback, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { X, Users, Brain, ChevronLeft, ArrowUpRight, Maximize2, Minimize2 } from 'lucide-react'
import {
  orgHierarchy,
  orgRelations,
  getChildren,
  getReportLine,
  type OrgNode,
} from '../data/orgHierarchy'

const LEVEL_COLORS: Record<number, string> = {
  1: '#C8102E',
  2: '#E8453F',
  3: '#FF6B8A',
  4: '#94A3B8',
}
const LEVEL_NAMES: Record<number, string> = {
  1: '部门负责人',
  2: '主管/站长',
  3: '班长/专员',
  4: '执行岗',
}

function buildGraphData(focusNode?: OrgNode) {
  const focusId = focusNode?.id

  let visibleIds: Set<string>
  if (focusId) {
    visibleIds = new Set([focusId])
    const children = getChildren(focusId)
    children.forEach((c) => visibleIds.add(c.id))
    const grandChildren = children.flatMap((c) => getChildren(c.id))
    grandChildren.forEach((c) => visibleIds.add(c.id))
  } else {
    visibleIds = new Set(orgHierarchy.map((n) => n.id))
  }

  const nodes = orgHierarchy
    .filter((n) => visibleIds.has(n.id))
    .map((n) => {
      const level = n.level
      const isFocus = n.id === focusId
      return {
        id: n.id,
        name: n.title.length > 10 ? n.title.slice(0, 10) + '...' : n.title,
        fullName: n.title,
        value: n.staffCount || 1,
        level,
        category: level - 1,
        aiEnabled: n.aiEnabled,
        itemStyle: {
          color: isFocus ? '#C8102E' : LEVEL_COLORS[level],
          borderColor: isFocus ? '#fff' : 'transparent',
          borderWidth: isFocus ? 3 : 0,
          shadowBlur: isFocus ? 10 : 0,
          shadowColor: 'rgba(200,16,46,0.4)',
        },
        symbolSize: isFocus ? 60 : level === 1 ? 50 : level === 2 ? 42 : level === 3 ? 36 : 30,
        label: {
          show: true,
          position: 'bottom',
          fontSize: isFocus ? 12 : 10,
          fontWeight: isFocus ? 'bold' : 'normal',
          color: '#fff',
          formatter: (params: any) => {
            const name = params.data.fullName || params.name
            return name.length > 12 ? name.slice(0, 12) + '...' : name
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
        color: r.type === 'collaborates' ? '#E8453F' : '#64748B',
        width: r.type === 'reports' ? 1.5 : 1,
        curveness: r.type === 'collaborates' ? 0.2 : 0,
        type: r.type === 'collaborates' ? 'dashed' : 'solid' as const,
      },
      label: {
        show: r.type === 'collaborates',
        formatter: '协作',
        fontSize: 8,
        color: '#E8453F',
      },
    }))

  return { nodes, links }
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
      tooltip: {
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const d = params.data
            const levelName = LEVEL_NAMES[d.level] || ''
            return `<div style="font-size:13px;font-weight:bold;margin-bottom:4px">${d.fullName || d.name}</div>
                    <div style="font-size:11px;color:#94A3B8">${levelName}</div>
                    ${d.aiEnabled ? '<div style="font-size:11px;color:#C8102E;margin-top:2px">🤖 AI赋能岗位</div>' : ''}`
          }
          return ''
        },
        backgroundColor: 'rgba(15,23,42,0.9)',
        borderColor: 'rgba(200,16,46,0.3)',
        textStyle: { color: '#fff', fontSize: 12 },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: focusNode ? 300 : 200,
            edgeLength: focusNode ? [80, 150] : [60, 120],
            gravity: 0.1,
            friction: 0.1,
          },
          roam: true,
          draggable: true,
          data: graphData.nodes,
          links: graphData.links,
          categories: [
            { name: '部门负责人', itemStyle: { color: LEVEL_COLORS[1] } },
            { name: '主管/站长', itemStyle: { color: LEVEL_COLORS[2] } },
            { name: '班长/专员', itemStyle: { color: LEVEL_COLORS[3] } },
            { name: '执行岗', itemStyle: { color: LEVEL_COLORS[4] } },
          ],
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 6],
          lineStyle: {
            opacity: 0.6,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3,
              opacity: 0.8,
            },
          },
          blur: {
            opacity: 0.15,
          },
          animationDuration: 500,
          animationEasingUpdate: 'cubicOut',
        },
      ],
    }),
    [graphData, focusNode]
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
    setSelectedNode(node)
  }

  return (
    <div className="space-y-4">
      <div className={`${fullscreen ? 'fixed inset-0 z-[90] bg-background p-4' : ''}`}>
        <div
          className={`rounded-xl border border-border bg-card overflow-hidden ${
            fullscreen ? 'h-full flex flex-col' : ''
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {focusNode ? focusNode.title : '组织架构全景图谱'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {breadcrumb.length > 0 && (
                <button
                  onClick={resetView}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="size-3" />
                  返回全景
                </button>
              )}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title={fullscreen ? '退出全屏' : '全屏'}
              >
                {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
            </div>
          </div>

          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 px-4 py-2 bg-muted/30 border-b border-border overflow-x-auto">
              <span className="text-[10px] text-muted-foreground shrink-0">当前位置：</span>
              {breadcrumb.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => goToBreadcrumb(n)}
                  className={`text-xs shrink-0 px-2 py-0.5 rounded-full transition-colors ${
                    n.id === focusNode?.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {n.title.length > 8 ? n.title.slice(0, 8) + '..' : n.title}
                  {i < breadcrumb.length - 1 && (
                    <ChevronLeft className="size-2.5 inline ml-1 -rotate-180 opacity-50" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="relative" style={{ height: fullscreen ? 'calc(100% - 100px)' : '500px' }}>
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              onEvents={{
                click: onChartClick,
              }}
            />
          </div>
        </div>

        {selectedNode && (
          <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div
                  className="size-2.5 rounded-full shrink-0"
                  style={{ background: LEVEL_COLORS[selectedNode.level] }}
                />
                <span className="text-sm font-semibold text-foreground">
                  {selectedNode.title}
                </span>
                {selectedNode.aiEnabled && (
                  <span className="flex items-center gap-1 text-[10px] text-primary px-2 py-0.5 rounded-full bg-primary/10 shrink-0">
                    <Brain className="size-3" />
                    AI赋能
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(undefined)}
                className="p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-4 border-r border-border space-y-2">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpRight className="size-3" />
                  核心职责
                </h4>
                <ul className="space-y-1.5">
                  {selectedNode.responsibilities.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                      <span className="size-1 rounded-full bg-primary shrink-0 mt-1.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldIcon className="size-3" />
                  安全职责
                </h4>
                <ul className="space-y-1.5">
                  {selectedNode.safetyDuties.map((d, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                      <span className="size-1 rounded-full bg-destructive shrink-0 mt-1.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
              {selectedNode.reportsTo && (
                <span>
                  汇报对象：<span className="text-foreground font-medium">{selectedNode.reportsTo}</span>
                </span>
              )}
              {selectedNode.manages && selectedNode.manages.length > 0 && (
                <span>
                  管理：<span className="text-foreground font-medium">{selectedNode.manages.join('、')}</span>
                </span>
              )}
              {selectedNode.staffCount && (
                <span>
                  团队：<span className="text-foreground font-medium">{selectedNode.staffCount}人</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: LEVEL_COLORS[1] }} />
            {LEVEL_NAMES[1]} ({orgHierarchy.filter((n) => n.level === 1).length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: LEVEL_COLORS[2] }} />
            {LEVEL_NAMES[2]} ({orgHierarchy.filter((n) => n.level === 2).length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: LEVEL_COLORS[3] }} />
            {LEVEL_NAMES[3]} ({orgHierarchy.filter((n) => n.level === 3).length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: LEVEL_COLORS[4] }} />
            {LEVEL_NAMES[4]} ({orgHierarchy.filter((n) => n.level === 4).length})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{totalNodes} 个节点 · {orgRelations.length} 条关联</span>
          <span>🤖 AI赋能 {aiNodes} 个岗位</span>
        </div>
      </div>
    </div>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export default OrgGraphSection
