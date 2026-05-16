import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Loader2,
  Plus,
  History,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { search } from '@/data/searchIndex';

// ============================================================
// Types
// ============================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

// ============================================================
// 获取当前主题
// ============================================================

function getTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
}

// ============================================================
// 中国燃气Q版守护精灵 — 使用用户提供的参考图
// ============================================================

function QCharacter({ size = 80 }: { size?: number; theme?: 'light' | 'dark' }) {
  return (
    <img
      src="./mascot.png"
      alt="中国燃气AI助手"
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
      }}
      draggable={false}
    />
  );
}

// ============================================================
// 主题感知的渐变背景
// ============================================================

function ThemeBg({ theme }: { theme: 'light' | 'dark' }) {
  if (theme === 'light') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {/* 主渐变：亮调 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F8F4FF] to-[#F0E8FF]" />
        {/* 品牌红暖光 */}
        <div
          className="absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, transparent 70%)' }}
        />
        {/* 淡紫光 */}
        <div
          className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }}
        />
        {/* 微妙网格 */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        {/* 顶部光晕 */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[rgba(200,16,46,0.15)] to-transparent" />
        {/* 右侧阴影 */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[rgba(200,16,46,0.08)] to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {/* 主渐变：暗调 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D2B] via-[#1A0A2E] to-[#0A1628]" />
      {/* 红色辉光 */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(123,45,142,0.15) 0%, transparent 70%)' }}
      />
      {/* 网格纹理 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* 顶部光晕 */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[rgba(200,16,46,0.4)] to-transparent" />
    </div>
  );
}

// ============================================================
// 预设快捷问题
// ============================================================

const QUICK_QUESTIONS = [
  '组织架构有哪些部门？',
  '安检隐患分类标准是什么？',
  'CRM工单流转流程是怎样的？',
  '今年财年指标完成情况？',
];

// ============================================================
// AI API 配置
// ============================================================

const AI_API_URL = import.meta.env.PROD
  ? 'https://nnzr-worker.z305760276.workers.dev/api/chat' // ← 部署 Cloudflare Worker 后替换
  : '/api/chat'; // 开发环境用 Express 代理

// ============================================================
// 调用后端 AI API（支持上下文 + 知识注入）
// ============================================================

async function fetchAIResponse(
  message: string,
  history?: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  try {
    const localResults = search(message);
    const knowledgeContext = localResults
      .slice(0, 5)
      .map(r => `[${r.category}] ${r.title}\n${r.content}`)
      .join('\n\n');

    const systemPrompt = `你是一个专业的燃气行业智能助手，名叫"燃气管家"。你为南宁中燃客户服务部提供支持。

回答要求：
1. 优先参考下方提供的"相关知识库内容"来回答
2. 如果知识库中没有相关内容，请基于自身知识回答
3. 回答要简洁专业，控制在 300 字以内
4. 使用 Markdown 格式组织回答，善用列表、表格、加粗等格式
5. 当涉及具体数据或标准时，务必引用来源

## 相关知识库内容

${knowledgeContext || '（当前问题无精确匹配的本地知识，请基于自身知识回答）'}

请优先参考以上知识库内容。`;

    const res = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, systemPrompt }),
    });
    const data = await res.json();
    return data.reply || '抱歉，我没有理解您的问题，请换个方式描述。';
  } catch {
    return `抱歉，我暂时无法连接 AI 引擎。关于"${message}"，请稍后再试或查阅左侧导航栏的相关模块文档。`;
  }
}

// ============================================================
// 主题感知的文案颜色
// ============================================================

const tc = {
  // text colors for light mode
  light: {
    title: '#1E0A3C',
    subtitle: '#6366F1',
    desc: '#5B5B7B',
    hint: '#8B8BA8',
    faint: '#B0B0C8',
    bubbleAi: '#2E2E4A',
    bubbleAiBg: 'rgba(99,102,241,0.06)',
    bubbleAiBorder: 'rgba(99,102,241,0.12)',
    time: '#A0A0B8',
    inputPlaceholder: '#A0A0B8',
    inputText: '#1E0A3C',
    inputBg: 'rgba(99,102,241,0.03)',
    inputBorder: 'rgba(99,102,241,0.15)',
    inputBorderFocus: 'rgba(200,16,46,0.3)',
    iconBtn: '#7C7C9A',
    iconBtnHover: '#1E0A3C',
    historyItem: '#6B6B8A',
    historyItemActive: '#1E0A3C',
    footer: '#B0B0C8',
    shortcutBtn: '#6B6B8A',
    shortcutBtnBg: 'rgba(99,102,241,0.05)',
    shortcutBtnBorder: 'rgba(99,102,241,0.12)',
    shortcutBtnHoverBg: 'rgba(200,16,46,0.08)',
    shortcutBtnHoverBorder: 'rgba(200,16,46,0.25)',
    shortcutBtnHoverText: '#C8102E',
    sendBtnDisabled: 'rgba(99,102,241,0.1)',
    sendBtnDisabledIcon: 'rgba(99,102,241,0.25)',
    threadLabel: '#A0A0B8',
    historyHeader: '#7C7C9A',
    historyBorder: 'rgba(99,102,241,0.08)',
    loadingText: '#8B8BA8',
    scrollbarThumb: 'rgba(99,102,241,0.15)',
    scrollbarThumbHover: 'rgba(99,102,241,0.3)',
  },
  // text colors for dark mode
  dark: {
    title: '#FFFFFF',
    subtitle: '#818cf8',
    desc: 'rgba(255,255,255,0.7)',
    hint: 'rgba(255,255,255,0.5)',
    faint: 'rgba(255,255,255,0.3)',
    bubbleAi: 'rgba(255,255,255,0.88)',
    bubbleAiBg: 'rgba(255,255,255,0.06)',
    bubbleAiBorder: 'rgba(255,255,255,0.08)',
    time: 'rgba(255,255,255,0.25)',
    inputPlaceholder: 'rgba(255,255,255,0.3)',
    inputText: 'rgba(255,255,255,0.9)',
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.1)',
    inputBorderFocus: 'rgba(200,16,46,0.4)',
    iconBtn: 'rgba(255,255,255,0.5)',
    iconBtnHover: '#FFFFFF',
    historyItem: 'rgba(255,255,255,0.55)',
    historyItemActive: '#FFFFFF',
    footer: 'rgba(255,255,255,0.15)',
    shortcutBtn: 'rgba(255,255,255,0.6)',
    shortcutBtnBg: 'rgba(255,255,255,0.06)',
    shortcutBtnBorder: 'rgba(255,255,255,0.08)',
    shortcutBtnHoverBg: 'rgba(200,16,46,0.12)',
    shortcutBtnHoverBorder: 'rgba(200,16,46,0.3)',
    shortcutBtnHoverText: '#FFFFFF',
    sendBtnDisabled: 'rgba(255,255,255,0.05)',
    sendBtnDisabledIcon: 'rgba(255,255,255,0.2)',
    threadLabel: 'rgba(255,255,255,0.2)',
    historyHeader: 'rgba(255,255,255,0.4)',
    historyBorder: 'rgba(255,255,255,0.06)',
    loadingText: 'rgba(255,255,255,0.4)',
    scrollbarThumb: 'rgba(255,255,255,0.1)',
    scrollbarThumbHover: 'rgba(255,255,255,0.2)',
  },
} as const;

// ============================================================
// AI Assistant 主组件
// ============================================================

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme);
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 'default',
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
    },
  ]);
  const [activeThreadId, setActiveThreadId] = useState('default');
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [retryMsgId, setRetryMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const isLight = theme === 'light';
  const c = tc[theme]; // current color tokens

  // Listen to theme changes on <html>
  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Auto scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread.messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const createNewThread = () => {
    const id = `thread-${Date.now()}`;
    const newThread: Thread = {
      id,
      title: `新对话 ${threads.length}`,
      messages: [],
      createdAt: Date.now(),
    };
    setThreads((prev) => [...prev, newThread]);
    setActiveThreadId(id);
    setShowHistory(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || processing) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThreadId && t.messages.length === 0) {
        return { ...t, title: text.slice(0, 20) + (text.length > 20 ? '...' : '') };
      }
      return t;
    });
    setThreads(updatedThreads);

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, userMsg] } : t))
    );
    setInput('');
    setProcessing(true);

    const recentHistory = activeThread.messages
      .slice(-6)
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    const reply = await fetchAIResponse(text, recentHistory);
    const assistantMsg: Message = {
      id: `msg-${Date.now()}-reply`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
    };

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, assistantMsg] } : t))
    );
    setProcessing(false);
  };

  const handleRetry = async (msgId: string) => {
    const thread = threads.find(t => t.id === activeThreadId);
    if (!thread || processing) return;
    const lastUserMsg = [...thread.messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;

    setRetryMsgId(msgId);
    setProcessing(true);

    const historyBefore = thread.messages
      .slice(0, thread.messages.findIndex(m => m.id === msgId))
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));

    const reply = await fetchAIResponse(lastUserMsg.content, historyBefore);
    const retryMsg: Message = {
      id: `msg-${Date.now()}-retry`,
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
    };

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, retryMsg] } : t))
    );
    setProcessing(false);
    setRetryMsgId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearThread = () => {
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [] } : t))
    );
    setInput('');
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      {/* ======== 浮动触发按钮 ======== */}
      <button
        onClick={() => setOpen(true)}
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-[90]
          flex items-center gap-2 px-3 py-3 rounded-l-xl
          bg-gradient-to-r from-[#C8102E] to-[#E31837]
          text-white shadow-lg
          hover:shadow-xl
          hover:from-[#E31837] hover:to-[#C8102E]
          transition-all duration-300 group
          ${open ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}
        `}
        aria-label="打开 AI 助手"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-medium whitespace-nowrap hidden md:block" style={{ writingMode: 'vertical-rl' }}>
          AI 助手
        </span>
      </button>

      {/* ======== 侧边栏遮罩（移动端） ======== */}
      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ======== AI 助手侧边栏 ======== */}
      <aside
        className={`
          fixed right-0 top-0 bottom-0 z-[90]
          w-[400px] max-w-[calc(100vw-3rem)]
          transition-all duration-500
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
      >
        <div
          className="relative h-full rounded-l-2xl overflow-hidden shadow-2xl"
          style={{
            boxShadow: isLight
              ? '0 0 0 1px rgba(99,102,241,0.08), 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
              : '0 0 0 1px rgba(200,16,46,0.15), 0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* 主题感知渐变背景 */}
          <ThemeBg theme={theme} />

          {/* 内容层 */}
          <div className="relative z-10 flex flex-col h-full">
            {/* ===== 顶部栏 ===== */}
            <div className="shrink-0 px-5 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <QCharacter size={18} />
                  <div>
                    <h2
                      className="text-sm font-bold flex items-center gap-1.5"
                      style={{ color: c.title }}
                    >
                      AI 智能助手
                      <Sparkles className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                    </h2>
                    <p className="text-[10px] font-medium" style={{ color: c.subtitle }}>
                      已连接 · DeepSeek AI 引擎
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      color: c.iconBtn,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = c.iconBtnHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = c.iconBtn)}
                    onFocus={(e) => (e.currentTarget.style.backgroundColor = isLight ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.08)')}
                    onBlur={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    title="对话历史"
                  >
                    <History className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      color: c.iconBtn,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = c.iconBtnHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = c.iconBtn)}
                    title="关闭"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ===== 对话历史列表 ===== */}
            {showHistory && (
              <div
                className="shrink-0 px-5 pb-3"
                style={{ borderBottom: `1px solid ${c.historyBorder}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: c.historyHeader }}>
                    对话历史
                  </span>
                  <button
                    onClick={createNewThread}
                    className="flex items-center gap-1 text-xs transition-colors"
                    style={{ color: '#C8102E' }}
                  >
                    <Plus className="w-3 h-3" />
                    新建对话
                  </button>
                </div>
                <div className="space-y-1 max-h-[160px] overflow-y-auto scrollbar-thin">
                  {threads.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveThreadId(t.id);
                        setShowHistory(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all"
                      style={{
                        color: t.id === activeThreadId ? c.historyItemActive : c.historyItem,
                        backgroundColor: t.id === activeThreadId
                          ? (isLight ? 'rgba(200,16,46,0.08)' : 'rgba(200,16,46,0.15)')
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (t.id !== activeThreadId) {
                          e.currentTarget.style.backgroundColor = isLight ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (t.id !== activeThreadId) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span className="truncate flex-1">{t.title}</span>
                      <span className="text-[10px]" style={{ color: c.faint }}>
                        {t.messages.length} 条
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== 消息列表 ===== */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {activeThread.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <QCharacter size={48} />
                  <p className="text-sm mt-4" style={{ color: c.desc }}>
                    你好！我是南宁中燃 AI 助手
                  </p>
                  <p className="text-xs mt-1" style={{ color: c.hint }}>
                    问我关于制度规范、业务流程、指标数据等问题
                  </p>
                  {/* 快捷问题 */}
                  <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-xs">
                    {QUICK_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className="px-3 py-2 rounded-lg text-xs transition-all duration-200 border"
                        style={{
                          color: c.shortcutBtn,
                          backgroundColor: c.shortcutBtnBg,
                          borderColor: c.shortcutBtnBorder,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = c.shortcutBtnHoverBg;
                          e.currentTarget.style.borderColor = c.shortcutBtnHoverBorder;
                          e.currentTarget.style.color = c.shortcutBtnHoverText;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = c.shortcutBtnBg;
                          e.currentTarget.style.borderColor = c.shortcutBtnBorder;
                          e.currentTarget.style.color = c.shortcutBtn;
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* 头像 */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #C8102E, #E31837)'
                        : isLight
                          ? 'linear-gradient(135deg, #818CF8, #6366F1)'
                          : 'linear-gradient(135deg, #A78BFA, #7C3AED)',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* 气泡 */}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={
                        msg.role === 'user'
                          ? {
                              background: 'linear-gradient(135deg, #C8102E, #E31837)',
                              color: '#FFFFFF',
                              borderBottomRightRadius: '6px',
                              whiteSpace: 'pre-wrap',
                            }
                          : {
                              backgroundColor: c.bubbleAiBg,
                              border: `1px solid ${c.bubbleAiBorder}`,
                              color: c.bubbleAi,
                              borderBottomLeftRadius: '6px',
                              overflow: 'hidden',
                            }
                      }
                    >
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none"
                          style={{
                            '--tw-prose-body': c.bubbleAi,
                            '--tw-prose-headings': c.bubbleAi,
                            '--tw-prose-bold': c.bubbleAi,
                            '--tw-prose-links': '#6366F1',
                            '--tw-prose-code': c.bubbleAi,
                            '--tw-prose-pre-bg': isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                            '--tw-prose-pre-color': c.bubbleAi,
                          } as React.CSSProperties}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {/* 底部操作栏 */}
                    <div
                      className="flex items-center gap-2 mt-1 px-1"
                      style={{
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <span className="text-[10px]" style={{ color: c.time }}>
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.role === 'assistant' && (
                        <>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              setCopiedId(msg.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="text-[10px] transition-colors flex items-center gap-0.5"
                            style={{ color: c.faint }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = c.iconBtnHover)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = c.faint)}
                            title="复制回答"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3" style={{ color: '#10B981' }} />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRetry(msg.id)}
                            disabled={processing}
                            className="text-[10px] transition-colors flex items-center gap-0.5"
                            style={{
                              color: processing && retryMsgId === msg.id ? c.faint : c.faint,
                              opacity: processing && retryMsgId === msg.id ? 0.5 : 1,
                              cursor: processing && retryMsgId === msg.id ? 'not-allowed' : 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              if (!processing) e.currentTarget.style.color = c.iconBtnHover;
                            }}
                            onMouseLeave={(e) => {
                              if (!processing) e.currentTarget.style.color = c.faint;
                            }}
                            title="重新生成"
                          >
                            <RefreshCw
                              className={`w-3 h-3 ${processing && retryMsgId === msg.id ? 'animate-spin' : ''}`}
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* 加载气泡 */}
              {processing && (
                <div className="flex gap-3">
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: isLight
                        ? 'linear-gradient(135deg, #818CF8, #6366F1)'
                        : 'linear-gradient(135deg, #A78BFA, #7C3AED)',
                    }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      backgroundColor: c.bubbleAiBg,
                      border: `1px solid ${c.bubbleAiBorder}`,
                      borderBottomLeftRadius: '6px',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: c.loadingText }} />
                      <span className="text-sm" style={{ color: c.loadingText }}>
                        正在思考...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ===== 底部操作区 ===== */}
            <div className="shrink-0 px-5 pb-5 pt-2">
              {/* 操作按钮 */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={clearThread}
                  className="flex items-center gap-1 text-[10px] transition-colors"
                  style={{
                    color: c.faint,
                  }}
                  disabled={activeThread.messages.length === 0}
                  onMouseEnter={(e) => (e.currentTarget.style.color = c.iconBtnHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = c.faint)}
                >
                  <Trash2 className="w-3 h-3" />
                  清空对话
                </button>
                <span className="text-[10px]" style={{ color: c.threadLabel }}>
                  Thread: {activeThread.id.slice(0, 8)}...
                </span>
              </div>

              {/* 输入框 */}
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题，按 Enter 发送..."
                  rows={1}
                  className="w-full rounded-xl text-sm outline-none resize-none pr-12 py-3 px-4 transition-all duration-200"
                  style={{
                    backgroundColor: c.inputBg,
                    border: `1px solid ${c.inputBorder}`,
                    color: c.inputText,
                    minHeight: 44,
                    maxHeight: 120,
                  }}
                  disabled={processing}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = c.inputBorderFocus;
                    e.currentTarget.style.boxShadow = isLight
                      ? '0 0 0 3px rgba(200,16,46,0.08)'
                      : '0 0 0 3px rgba(200,16,46,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = c.inputBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = 'auto';
                    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || processing}
                  className="absolute right-1.5 bottom-1.5 p-2 rounded-lg transition-all duration-200"
                  style={
                    input.trim() && !processing
                      ? {
                          background: 'linear-gradient(135deg, #C8102E, #E31837)',
                          color: '#FFFFFF',
                          boxShadow: isLight
                            ? '0 2px 8px rgba(200,16,46,0.25)'
                            : '0 2px 8px rgba(200,16,46,0.3)',
                        }
                      : {
                          backgroundColor: c.sendBtnDisabled,
                          color: c.sendBtnDisabledIcon,
                          cursor: 'not-allowed',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (input.trim() && !processing) {
                      e.currentTarget.style.boxShadow = isLight
                        ? '0 4px 12px rgba(200,16,46,0.35)'
                        : '0 4px 12px rgba(200,16,46,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (input.trim() && !processing) {
                      e.currentTarget.style.boxShadow = isLight
                        ? '0 2px 8px rgba(200,16,46,0.25)'
                        : '0 2px 8px rgba(200,16,46,0.3)';
                    }
                  }}
                  aria-label="发送"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* 页脚提示 */}
              <p className="text-[10px] text-center mt-2" style={{ color: c.footer }}>
                Enter 发送 · Shift+Enter 换行 · DeepSeek AI 驱动
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
