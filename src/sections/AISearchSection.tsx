import { Bot, Sparkles, ExternalLink } from 'lucide-react';

const COZE_EMBED_URL = 'https://57b23c58-9b3c-47b9-b1e0-ba129ce785fa.dev.coze.site/';

export default function AISearchSection() {

  const openAIAssistant = () => {
    const event = new CustomEvent('open-ai-assistant');
    window.dispatchEvent(event);
  };

  return (
    <section className="relative py-16 bg-[var(--page-bg)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse, rgba(200,16,46,0.5) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#C8102E]/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  AI 智能检索助手
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  基于 24 份制度文件，用自然语言检索组织架构、安检隐患、规范标准等信息
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openAIAssistant}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-[var(--card-nvidia-cta-border)] bg-[var(--card-nvidia-cta-bg)] text-[var(--card-nvidia-cta-text)] hover:brightness-110 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            全屏模式
          </button>
        </div>

        <div className="rounded-[20px] overflow-hidden border border-[var(--card-nvidia-border)] bg-[var(--card-nvidia-bg)] shadow-[var(--card-nvidia-shadow)]">
          <iframe
            src={COZE_EMBED_URL}
            title="AI 检索助手"
            className="w-full border-0"
            style={{ height: '620px' }}
            allow="clipboard-read; clipboard-write"
          />
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-xs text-[var(--text-muted)]">
            AI 回答基于已上传的制度文件，仅供参考，请以正式文件为准
          </p>
          <button
            onClick={openAIAssistant}
            className="text-xs text-[#C8102E] font-medium hover:underline cursor-pointer"
          >
            新窗口打开 →
          </button>
        </div>
      </div>
    </section>
  );
}
