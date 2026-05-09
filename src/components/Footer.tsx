import { Network, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-10 bg-[var(--page-bg)] border-t border-[var(--border-light)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Network className="w-5 h-5 text-[var(--brand-primary)]" />
              <span className="text-[var(--text-primary)] text-sm font-bold">南宁中燃 客户服务部</span>
            </div>
            <p className="text-[var(--text-secondary)]/50 text-xs leading-relaxed">
              南宁中燃客户服务部管理图谱 v3.0<br />
              基于四份真实管理制度文件构建<br />
              目标：新人来了也能看懂、会用、能查<br />
            </p>
          </div>
          <div>
            <h4 className="text-[var(--text-secondary)]/40 text-[10px] font-semibold uppercase tracking-wider mb-3">数据来源文件</h4>
            <ul className="space-y-1.5">
              {[
                '《管理组织架构及岗位职责》V2.0',
                '《客户服务部管理制度》V2.0',
                '《客户服务部安检管理制度》V2.0',
                '《客户服务部隐患管理制度》V2.0'
              ].map((doc, i) => (
                <li key={i} className="text-[var(--text-secondary)]/40 text-xs flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--brand-primary)]/40 mt-1.5 shrink-0" />{doc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--text-secondary)]/40 text-[10px] font-semibold uppercase tracking-wider mb-3">反馈入口</h4>
            <div className="space-y-2">
              <a href="mailto:nnkfb@chinagasholdings.com" className="flex items-center gap-2 text-xs text-[var(--text-secondary)]/50 hover:text-[var(--accent)] transition-colors">
                <Mail className="w-3.5 h-3.5" /> nnkfb@chinagasholdings.com
              </a>
              <p className="flex items-center gap-2 text-xs text-[var(--text-secondary)]/40">
                <ExternalLink className="w-3.5 h-3.5" /> 意见反馈
              </p>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[#C8102E] text-xs font-mono font-bold px-2 py-1 rounded bg-[var(--brand-bg)] border border-[var(--border-subtle)]">v3.0_20260502</span>
            <span className="text-[var(--text-secondary)]/30 text-xs">南宁中燃城市燃气发展有限公司</span>
          </div>
          <p className="text-[var(--text-secondary)]/20 text-[10px]">
            客户服务部 · 内部管理参考系统 · 数据来源于2025年12月版制度文件
          </p>
        </div>
      </div>
    </footer>
  );
}
