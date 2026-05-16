import { useEffect, useRef } from 'react';

const BOT_ID = '7640388142570684451';
const TOKEN = 'cztei_q8DfPR6nMe9wXxsSdpt7FIBHHuEoomgjuaZhnC3NiNdBxsnOblC5homy6DPuiKXdp';
const SDK_URL = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';

let chatInstance: any = null;
let sdkLoading = false;

function initChat() {
  if (chatInstance) return;
  if (!(window as any).CozeWebSDK) {
    if (!sdkLoading) {
      sdkLoading = true;
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => { sdkLoading = false; initChat(); };
      document.body.appendChild(script);
    }
    return;
  }
  chatInstance = new (window as any).CozeWebSDK.WebChatClient({
    config: {
      type: 'bot',
      bot_id: BOT_ID,
      isIframe: false,
    },
    auth: {
      type: 'token',
      token: TOKEN,
      onRefreshToken: async () => TOKEN,
    },
    userInfo: {
      id: 'user',
      url: '/nnzr/mascot.png',
      nickname: '客服部',
    },
    ui: {
      base: {
        icon: '/nnzr/mascot.png',
        layout: 'pc',
        lang: 'zh-CN',
        zIndex: 1000,
      },
      header: {
        isShow: true,
        isNeedClose: true,
      },
      asstBtn: {
        isNeed: true,
      },
      footer: {
        isShow: false,
      },
      chatBot: {
        title: '燃气管家',
        uploadable: false,
        width: 390,
      },
    },
  });
}

export default function AIAssistant() {
  const listenerAdded = useRef(false);

  useEffect(() => {
    if (!listenerAdded.current) {
      listenerAdded.current = true;
      initChat();
    }

    const handleOpen = () => {
      if (chatInstance?.setVisible) {
        chatInstance.setVisible(true);
      }
    };

    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  return null;
}
