import { useEffect } from 'react';

const BOT_ID = '7640388142570684451';
const TOKEN = 'cztei_h3vq5a3aTgh7qLiALLqp0GhhrxjX0bPD9yLSTRPbFsqEfNzrgaJNW5tekRsdswq92';

function getSDK() {
  return (window as any).CozeWebSDK || (window as any).CozeWebSDKmain;
}

const SDK_URL = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';

function loadSDK() {
  if (getSDK() || document.querySelector('script[data-coze-sdk]')) return;
  const script = document.createElement('script');
  script.src = SDK_URL;
  script.async = true;
  script.dataset.cozeSdk = '1';
  document.body.appendChild(script);
}

function initChat() {
  const sdk = getSDK();
  if (!sdk) return;
  const Ctor = sdk.WebChatClient || sdk.WebChat;
  if (!Ctor) return;
  new Ctor({
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
    },
  });
}

export default function AIAssistant() {
  useEffect(() => {
    loadSDK();
    const timer = setInterval(() => {
      if (getSDK()) {
        clearInterval(timer);
        initChat();
      }
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return null;
}
