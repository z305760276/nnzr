import { useEffect } from 'react';

const BOT_ID = '7640388142570684451';
const TOKEN = 'cztei_q8DfPR6nMe9wXxsSdpt7FIBHHuEoomgjuaZhnC3NiNdBxsnOblC5homy6DPuiKXdp';
const SDK_URL = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';

let chatInstance: any = null;
let sdkLoaded = false;

function ensureSDK(callback: () => void) {
  if ((window as any).CozeWebSDK) { callback(); return; }
  if (sdkLoaded) return;
  sdkLoaded = true;
  const script = document.createElement('script');
  script.src = SDK_URL;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

function initChat(reinstantiate = false) {
  if (chatInstance && !reinstantiate) return;
  ensureSDK(() => {
    if (chatInstance) {
      try { chatInstance.destroy?.(); } catch (_) {}
    }
    chatInstance = new (window as any).CozeWebSDK.WebChat({
      bot_id: BOT_ID,
      lang: 'zh-CN',
      auth: { type: 'token', token: TOKEN },
      ui: {
        base: {
          icon: '/nnzr/mascot.png',
          iconActive: '/nnzr/mascot.png',
        },
        floatingIcon: {
          backgroundColor: '#C8102E',
        },
      },
    });
  });
}

export default function AIAssistant() {
  useEffect(() => {
    initChat();
    const handler = () => {
      if (chatInstance?.setVisible) chatInstance.setVisible(true);
    };
    window.addEventListener('open-ai-assistant', handler);
    return () => window.removeEventListener('open-ai-assistant', handler);
  }, []);

  return null;
}
