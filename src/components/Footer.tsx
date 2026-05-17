import { Network, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const linkStyle: React.CSSProperties = {
    color: 'var(--text-muted)',
    transition: 'color 0.3s ease',
  };

  return (
    <footer
      className="relative py-12"
      style={{
        background: 'var(--page-bg)',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--brand-bg)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                <Network className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>南宁中燃 客户服务部</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              南宁中燃客户服务部管理图谱 v3.2<br />
              基于四份真实管理制度文件构建<br />
              目标：新人来了也能看懂、会用、能查
            </p>
          </div>
          <div>
            <h4
              className="text-[10px] font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              数据来源文件
            </h4>
            <ul className="space-y-2">
              {[
                '《管理组织架构及岗位职责》V2.0',
                '《客户服务部管理制度》V2.0',
                '《客户服务部安检管理制度》V2.0',
                '《客户服务部隐患管理制度》V2.0',
              ].map((doc, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span
                    className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                    style={{ background: 'var(--brand-primary)', opacity: 0.5 }}
                  />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              className="text-[10px] font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              反馈入口
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:nnkfb@chinagasholdings.com"
                className="flex items-center gap-2 text-xs transition-colors"
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Mail className="w-3.5 h-3.5" /> nnkfb@chinagasholdings.com
              </a>
              <p className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                <ExternalLink className="w-3.5 h-3.5" /> 意见反馈
              </p>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-mono font-bold px-2 py-1 rounded"
              style={{
                color: 'var(--brand-primary)',
                background: 'var(--brand-bg)',
                border: '1px solid var(--border-accent)',
              }}
            >
              v3.2_20260513
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
              南宁中燃城市燃气发展有限公司
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
              客户服务部 · 内部管理参考系统 · 数据来源于2025年12月版制度文件
            </p>
            <p
              className="text-[11px] select-none"
              style={{ color: 'var(--text-muted)', opacity: 0.55 }}
            >
              南宁中燃客户服务部-张琨鹏 版权所有
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
