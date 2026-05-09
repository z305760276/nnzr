import { useState, useEffect } from 'react';
import { Network, Sparkles, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[var(--page-bg)]">
      <div className="absolute inset-0 pointer-events-none opacity-15"
        style={{ backgroundImage: 'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <div className="absolute pointer-events-none"
        style={{ top: '10%', left: '20%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, var(--glow-red) 0%, transparent 60%)', filter: 'blur(60px)',
          transform: `translate(${(mousePos.x - window.innerWidth/2) * 0.01}px, ${(mousePos.y - window.innerHeight/2) * 0.01}px)` }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-20 w-full">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-[2px] bg-[#C8102E]" />
            <span className="text-[#C8102E] text-xs tracking-[0.2em] uppercase font-medium">AI-Powered Management System</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4 leading-tight" style={{ textShadow: '0 0 30px var(--glow-red-strong)' }}>
            管理图谱
            <span className="block text-2xl md:text-3xl font-light text-[var(--accent)] mt-2 tracking-wide">Management Graph v3.0</span>
          </h1>

          <p className="text-[var(--text-secondary)] text-base md:text-lg mb-8 max-w-xl leading-relaxed">
            南宁中燃客户服务部智能化管理体系全景透视。基于四份真实管理制度文件构建，目标让新人来了也能看懂、会用、能查。
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Network, label: '四级架构', desc: '15个岗位完整职责' },
              { icon: Sparkles, label: '制度条款', desc: '200+可检索条目' },
              { icon: ChevronDown, label: '隐患标准', desc: '三级分级详细白话' },
              { icon: ChevronDown, label: '财年指标', desc: '4项核心指标明细' },
            ].map((item, i) => (
              <div key={i} className="bg-[var(--brand-bg)] rounded-xl p-3 backdrop-blur-sm">
                <item.icon className="w-5 h-5 text-[#C8102E] mb-1.5" />
                <div className="text-[var(--text-primary)] text-xs font-semibold">{item.label}</div>
                <div className="text-[var(--text-secondary)] text-[10px] mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
