import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { orgHierarchy, getChildren, type OrgNode } from '../data/orgHierarchy';
import { Users, ShieldAlert, FileText, ChevronRight, ChevronDown, Brain, X, BookOpen } from 'lucide-react';

const levelColors: Record<number, { dot: string }> = {
  1: { dot: '#C8102E' }, 2: { dot: '#E31837' }, 3: { dot: '#FF6B8A' }, 4: { dot: '#94A3B8' },
};
const levelNames: Record<number, string> = { 1: '部门负责人', 2: '主管/站长', 3: '班长/专员', 4: '执行岗' };

function TreeNode({ node, depth, onSelect }: { node: OrgNode; depth: number; onSelect: (n: OrgNode) => void }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const children = getChildren(node.id);
  const hasChildren = children.length > 0;

  return (
    <div className="select-none">
      <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg group transition-all hover:bg-[rgba(200,16,46,0.04)]" style={{ paddingLeft: `${depth * 20 + 8}px` }}>
        <button className="w-4 h-4 flex items-center justify-center flex-shrink-0 rounded hover:bg-[var(--brand-bg)] transition-colors" onClick={(e) => { e.stopPropagation(); if (hasChildren) setExpanded(!expanded); }}>
          {hasChildren ? (expanded ? <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />) : <span className="w-3.5 h-3.5" />}
        </button>
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: levelColors[node.level].dot }} />
        <button className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate flex-1 text-left" onClick={() => onSelect(node)}>{node.title}</button>
        {node.aiEnabled && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--brand-bg)] text-[var(--accent)] border border-[rgba(200,16,46,0.15)] shrink-0">AI</span>}
        <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 hidden sm:inline bg-[rgba(148,163,184,0.08)] text-[var(--text-secondary)] border border-[rgba(148,163,184,0.15)]">{levelNames[node.level]}</span>
      </div>
      {hasChildren && expanded && (
        <div className="relative">
          <div className="absolute top-0 bottom-2 left-0 w-px bg-[var(--brand-bg)]" style={{ left: `${depth * 20 + 16}px` }} />
          {children.map(child => <TreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />)}
        </div>
      )}
    </div>
  );
}

function DetailModal({ node, onClose }: { node: OrgNode; onClose: () => void }) {
  const regulationMap: Record<string, string> = {
    manager: '《管理组织架构及岗位职责》V2.0 第一章第3条', mgr_station: '《管理组织架构及岗位职责》V2.0 第二章第2-3条',
    station_chief: '《管理组织架构及岗位职责》V2.0 第三章第4条', ops_supervisor: '《管理组织架构及岗位职责》V2.0 第三章第6条',
    safety_supervisor: '《管理组织架构及岗位职责》V2.0 第三章第5条', admin_supervisor: '《管理组织架构及岗位职责》V2.0 第三章第7条',
    grid_leader_repair: '《管理组织架构及岗位职责》V2.0 第四章第1条', grid_leader_inspect: '《管理组织架构及岗位职责》V2.0 第四章第2条',
    grid_leader_commercial: '《管理组织架构及岗位职责》V2.0 第四章第3条', inspector_chief: '《管理组织架构及岗位职责》V2.0 第四章第6条',
    ops_monitor_chief: '《管理组织架构及岗位职责》V2.0 第四章第7条', net_hall_chief: '《管理组织架构及岗位职责》V2.0 第四章第8条',
    safety_tech: '《管理组织架构及岗位职责》V2.0 第五章第1条', ai_specialist: '《管理组织架构及岗位职责》V2.0 第五章第3条',
    grid_worker_repair: '《管理组织架构及岗位职责》V2.0 第五章第2条', inspector_external: '《管理组织架构及岗位职责》V2.0 第五章第4条',
    warehouse_admin: '《管理组织架构及岗位职责》V2.0 第五章第5条',
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[var(--card-solid)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-light)] bg-[rgba(200,16,46,0.05)]">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--brand-bg)] border border-[var(--border-subtle)]">
            <Users className="w-5 h-5 text-[#C8102E]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[var(--text-primary)] font-bold text-base">{node.title}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--accent)]">{levelNames[node.level]}</span>
              {node.category && <span className="text-xs text-[var(--text-secondary)]">{node.category}</span>}
              {node.aiEnabled && <span className="flex items-center gap-1 text-[10px] text-[#C8102E] px-2 py-0.5 rounded-full bg-[var(--brand-bg)] border border-[var(--border-subtle)]"><Brain className="w-3 h-3" /> AI赋能</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <h4 className="text-[var(--accent)] text-sm font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> 核心职责（共{node.responsibilities.length}条）</h4>
            <div className="space-y-2">
              {node.responsibilities.map((r, i) => (
                <div key={i} className="dark-card flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--card-inner-bg-strong)] rounded-lg p-3">
                  <span className="w-5 h-5 rounded bg-[var(--brand-bg)] flex items-center justify-center text-[10px] text-[#C8102E] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[#E31837] text-sm font-semibold mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> 安全职责（共{node.safetyDuties.length}条）</h4>
            <div className="bg-[rgba(200,16,46,0.03)] border border-[var(--border-light)] rounded-lg p-4 space-y-2">
              {node.safetyDuties.map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E31837] mt-1.5 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[#F59E0B] text-sm font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> 对接制度条款号</h4>
            <div className="bg-[rgba(245,158,11,0.03)] border border-[rgba(245,158,11,0.1)] rounded-lg p-4">
              <p className="text-sm text-[var(--text-secondary)]">{regulationMap[node.id] || '【待补充】对应制度条款号'}</p>
            </div>
          </div>
          {node.reportsTo && <p className="text-sm text-[var(--text-secondary)]">直接汇报对象：<span className="text-[var(--text-primary)]">{node.reportsTo}</span></p>}
          {node.manages && <p className="text-sm text-[var(--text-secondary)]">直接管理：<span className="text-[var(--text-primary)]">{node.manages.join('、')}</span></p>}
        </div>
      </div>
    </div>
  );
}

export default function OrgHierarchySection() {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const rootNodes = orgHierarchy.filter(n => n.level === 1);
  const totalNodes = orgHierarchy.length;
  const aiNodes = orgHierarchy.filter(n => n.aiEnabled).length;

  return (
    <div className="space-y-6">
        
        <AccordionGroup className="space-y-3">
          <AccordionItem id="org-tree" title="岗位层级树" summary={`${totalNodes}个岗位 · 点击岗位名称查看职责详情`} icon={<Users className="w-5 h-5" />}>
            <div className="dark-card bg-[var(--card-inner-bg)] border border-[rgba(200,16,46,0.06)] rounded-lg p-3 max-h-[400px] overflow-y-auto">
              {rootNodes.map(node => <TreeNode key={node.id} node={node} depth={0} onSelect={setSelectedNode} />)}
            </div>
          </AccordionItem>

          <AccordionItem id="org-stats" title="岗位统计" summary={`AI赋能${aiNodes}个岗位 · ${totalNodes - aiNodes}个标准执行岗位`} icon={<Users className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider">岗位分布</h4>
                {[1,2,3,4].map(l => {
                  const count = orgHierarchy.filter(n => n.level === l).length;
                  return (
                    <div key={l} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: levelColors[l].dot }} />
                      <span className="text-[var(--text-secondary)] text-sm flex-1">{levelNames[l]}</span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">{count}</span>
                      <div className="w-16 h-1.5 rounded-full bg-[var(--card-bg)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / totalNodes) * 100}%`, background: levelColors[l].dot }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">AI赋能覆盖</h4>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(13,25,48,0.6)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#C8102E" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(aiNodes / totalNodes) * 239} 239`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-[var(--text-primary)]">{Math.round((aiNodes / totalNodes) * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{aiNodes} 个AI赋能岗位</p>
                    <p className="text-[var(--text-secondary)] text-xs">{totalNodes - aiNodes} 个标准执行岗位</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem id="org-source" title="来源文件" summary="《管理组织架构及岗位职责》V2.0 · ZR-XNQY-NNJG-NNZR-KF" icon={<FileText className="w-5 h-5" />}>
            <div className="text-sm text-[var(--text-secondary)] space-y-2">
              <p>文件名称：《客户服务部管理组织架构及岗位职责》V2.0</p>
              <p>编码：ZR-XNQY-NNJG-NNZR-KF</p>
              <p>发布日期：2025-12-05</p>
              <p>发布单位：客户服务部</p>
              <p>适用范围：南宁中燃城市燃气发展有限公司客户服务部全体岗位</p>
            </div>
          </AccordionItem>
        </AccordionGroup>

        {selectedNode && <DetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />}
      </div>
  );
}
