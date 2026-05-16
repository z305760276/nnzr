import { useState, useMemo } from 'react'
import { X, Users, Brain, ChevronLeft, ChevronRight, Maximize2, Minimize2, Shield, FileText, BookOpen } from 'lucide-react'
import {
  orgHierarchy,
  getChildren,
  getReportLine,
  type OrgNode,
} from '../data/orgHierarchy'

const LEVEL_COLORS: Record<number, { bg: string; border: string; text: string; badge: string; line: string }> = {
  1: { bg: '#EBF5FF', border: '#60A5FA', text: '#1E40AF', badge: '#3B82F6', line: '#93C5FD' },
  2: { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', badge: '#10B981', line: '#A7F3D0' },
  3: { bg: '#EEF2FF', border: '#A5B4FC', text: '#3730A3', badge: '#6366F1', line: '#C7D2FE' },
  4: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', badge: '#F59E0B', line: '#FDE68A' },
  5: { bg: '#FDF2F8', border: '#F9A8D4', text: '#9D174D', badge: '#EC4899', line: '#FBCFE8' },
}

const LEVEL_NAMES: Record<number, string> = {
  1: '部门负责人',
  2: '部门副经理',
  3: '主管/站长',
  4: '班长/专员',
  5: '一线岗',
}

const LEVEL_HEADCOUNT: Record<number, number> = {
  1: 1,
  2: 4,
  3: 10,
  4: 98,
  5: 220,
}

function buildTreeStructure(nodeId: string): any {
  const node = orgHierarchy.find((n) => n.id === nodeId)
  if (!node) return null
  const children = getChildren(nodeId)
  return {
    node,
    children: children.map((c) => buildTreeStructure(c.id)).filter(Boolean),
  }
}

function OrgChartNode({ data, level, onNodeClick }: { data: any; level: number; onNodeClick: (node: OrgNode) => void }) {
  const node = data.node as OrgNode
  const colors = LEVEL_COLORS[level]
  const parentColors = LEVEL_COLORS[level - 1] || colors
  const titleParts = node.title.match(/^(.+?)（(.+)）$/)
  const main = titleParts ? titleParts[1] : node.title
  const sub = titleParts ? titleParts[2] : ''
  const childCount = data.children.length

  return (
    <li>
      <div
        className="node-card"
        onClick={(e) => { e.stopPropagation(); onNodeClick(node) }}
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: colors.text,
          minWidth: childCount > 2 ? 'auto' : '100px',
          padding: childCount > 0 ? '6px 16px' : '4px 12px',
        }}
      >
        <span className="level-badge" style={{ backgroundColor: colors.badge, color: '#fff' }}>
          L{level}
        </span>
        <span className="main-text">{main}</span>
        {sub && <span className="sub-text">{sub}</span>}
      </div>
      {childCount > 0 && (
        <ul style={{ ['--line-color' as string]: parentColors.line }}>
          {data.children.map((child: any) => (
            <OrgChartNode key={child.node.id} data={child} level={level + 1} onNodeClick={onNodeClick} />
          ))}
        </ul>
      )}
    </li>
  )
}

function OrgGraphSection() {
  const [focusNode, setFocusNode] = useState<OrgNode | undefined>(undefined)
  const [selectedNode, setSelectedNode] = useState<OrgNode | undefined>(undefined)
  const [fullscreen, setFullscreen] = useState(false)

  const breadcrumb = useMemo(() => (focusNode ? getReportLine(focusNode.id) : []), [focusNode])

  const treeData = useMemo(() => {
    const rootId = focusNode?.id || orgHierarchy.find((n) => n.level === 1)?.id
    return rootId ? buildTreeStructure(rootId) : null
  }, [focusNode])

  const totalNodes = orgHierarchy.length
  const aiNodes = orgHierarchy.filter((n) => n.aiEnabled).length

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
    const children = getChildren(n.id)
    const parent = n.parentId ? orgHierarchy.find(o => o.id === n.parentId) : undefined
    const colors = LEVEL_COLORS[n.level] || LEVEL_COLORS[5]

    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: colors.border }}
            >
              {n.title.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white" style={{ background: colors.badge }}>
                  {LEVEL_NAMES[n.level] || `L${n.level}`}
                </span>
                {n.aiEnabled && (
                  <span className="flex items-center gap-1 text-[10px] text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    <Brain className="size-3" />
                    AI赋能
                  </span>
                )}
                {n.chapter && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                    <BookOpen className="size-3" />
                    {n.chapter}
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

        {(parent || children.length > 0) && (
          <div className="flex items-center gap-1.5 px-5 py-2 bg-muted/20 border-b border-border overflow-x-auto">
            <span className="text-[10px] text-muted-foreground/60 shrink-0">穿透导航：</span>
            {parent && (
              <button
                onClick={() => setSelectedNode(parent)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent shrink-0"
              >
                <ChevronLeft className="size-3" />
                {parent.title.length > 10 ? parent.title.slice(0, 10) + '..' : parent.title}
              </button>
            )}
            <span className="text-[10px] text-muted-foreground/40">|</span>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedNode(child)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent shrink-0"
              >
                {child.title.length > 10 ? child.title.slice(0, 10) + '..' : child.title}
                <ChevronRight className="size-3" />
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-5 space-y-3">
            <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <FileText className="size-3.5" />岗位职责
              <span className="font-normal text-muted-foreground/60">（共{n.responsibilities.length}条）</span>
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {n.responsibilities.map((r, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-lg px-3 py-2 pl-2">
                  <span className="ml-2">{r}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-5 space-y-3 border-l border-border">
            <h4 className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#DC2626' }}>
              <Shield className="size-3.5" />安全职责
              <span className="font-normal text-muted-foreground/60">（共{n.safetyDuties.length}条）</span>
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {n.safetyDuties.map((d, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2 pl-2">
                  <span className="ml-2">{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground bg-muted/20">
          {n.reportsTo && <span>汇报对象：<span className="text-foreground font-medium">{n.reportsTo}</span></span>}
          {n.manages && n.manages.length > 0 && <span>直接管理：<span className="text-foreground font-medium">{n.manages.join('、')}</span></span>}
          {n.staffCount && <span>团队规模：<span className="text-foreground font-medium">{n.staffCount}人</span></span>}
          {n.chapter && <span>制度来源：<span className="text-foreground font-medium">{n.chapter}</span></span>}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .org-tree-wrapper {
          width: 100%;
          overflow: auto;
          padding: 24px 0;
        }
        .org-tree {
          display: inline-flex;
          min-width: 100%;
          justify-content: center;
          padding: 0 40px;
        }
        .org-tree ul {
          padding-top: 28px;
          position: relative;
          display: flex;
          justify-content: center;
          padding-left: 0;
          margin: 0;
          list-style: none;
        }
        .org-tree li {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 28px 10px 0 10px;
          list-style: none;
        }
        .org-tree li::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 2px solid var(--line-color, #A7F3D0);
          width: 0;
          height: 28px;
          z-index: 0;
        }
        .org-tree ul::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10px;
          right: 10px;
          border-top: 2px solid var(--line-color, #A7F3D0);
          z-index: 0;
        }
        .org-tree > ul::before {
          display: none;
        }
        .org-tree > ul > li::before {
          display: none;
        }
        .org-tree li:only-child {
          padding-top: 0;
        }
        .org-tree li:only-child::before {
          display: none;
        }
        .org-tree li:first-child::before {
          left: 50%;
        }
        .org-tree li:last-child::before {
          left: 50%;
        }
        .node-card {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1.5px solid;
          text-align: center;
          min-height: 44px;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .node-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .level-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 600;
          padding: 1px 5px;
          border-radius: 3px;
          margin-bottom: 2px;
          line-height: 1.4;
        }
        .main-text {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.3;
          white-space: nowrap;
        }
        .sub-text {
          font-size: 10px;
          font-weight: 400;
          opacity: 0.7;
          white-space: nowrap;
          margin-top: 1px;
        }
      `}</style>

      <div className="space-y-4">
        <div className={fullscreen ? 'fixed inset-0 z-[90] bg-background p-4 flex flex-col' : ''}>
          <div className={`rounded-xl border border-border bg-card overflow-hidden ${fullscreen ? 'flex-1 flex flex-col' : ''}`}>
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
                    {focusNode ? `${LEVEL_NAMES[focusNode.level] || ''} · 点击节点查看职责穿透` : '层级展开 · 点击节点查看岗位职责与安全职责'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {breadcrumb.length > 0 && (
                  <button onClick={resetView} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-accent">
                    <ChevronLeft className="size-3.5" />返回全景
                  </button>
                )}
                <button onClick={() => setFullscreen(!fullscreen)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title={fullscreen ? '退出全屏' : '全屏'}>
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
                    className={`text-xs shrink-0 px-2.5 py-0.5 rounded-full transition-all ${n.id === focusNode?.id ? 'text-white font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                    style={n.id === focusNode?.id ? { background: LEVEL_COLORS[n.level]?.badge } : undefined}
                  >
                    {n.title.length > 8 ? n.title.slice(0, 8) + '..' : n.title}
                    {i < breadcrumb.length - 1 && <ChevronLeft className="size-2.5 inline ml-1 -rotate-180 opacity-50" />}
                  </button>
                ))}
              </div>
            )}

            <div className="org-tree-wrapper" style={{ height: fullscreen ? '100%' : '560px', overflow: 'auto' }}>
              {treeData && (
                <div className="org-tree">
                  <ul>
                    <OrgChartNode data={treeData} level={1} onNodeClick={(node) => { setSelectedNode(node); setFocusNode(node) }} />
                  </ul>
                </div>
              )}
            </div>
          </div>
          {renderDetailPanel()}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-1">
          <div className="flex items-center gap-3 flex-wrap">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <span key={level} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full shrink-0" style={{ background: LEVEL_COLORS[level].badge }} />
                <span className="text-foreground/70">{LEVEL_NAMES[level]}</span>
                <span className="font-medium text-foreground">{LEVEL_HEADCOUNT[level]}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span>{totalNodes} 个节点</span>
            <span className="flex items-center gap-1">
              <Brain className="size-3" />AI赋能 {aiNodes} 个岗位
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrgGraphSection
