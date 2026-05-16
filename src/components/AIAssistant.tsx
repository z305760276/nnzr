import { useEffect } from 'react';

export default function AIAssistant() {
  useEffect(() => {
    const BOT_ID = '7640388142570684451';
    const TOKEN = 'cztei_hlsELW1jRDjiJ42FUpuRhxJGnLMxN2kU3Kzi8zwdX89eTANcZEatzjMf9yUDJs43x';
    const SDK_URL = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';

    let chatInstance: any = null;

    const loadSDK = () => {
      if (document.querySelector(`script[src="${SDK_URL}"]`)) {
        initChat();
        return;
      }
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = initChat;
      document.body.appendChild(script);
    };

    const initChat = () => {
      chatInstance = new (window as any).CozeWebSDK.WebChat({
        bot_id: BOT_ID,
        lang: 'zh-CN',
        auth: { type: 'token', token: TOKEN },
        ui: {
          base: {
            icon: './mascot.png',
            iconActive: './mascot.png',
          },
          floatingIcon: {
            backgroundColor: '#C8102E',
          },
        },
      });
    };

    const handleOpen = () => {
      if (chatInstance?.setVisible) {
        chatInstance.setVisible(true);
      }
    };

    window.addEventListener('open-ai-assistant', handleOpen);
    loadSDK();

    return () => {
      window.removeEventListener('open-ai-assistant', handleOpen);
    };
  }, []);

  return null;
}
