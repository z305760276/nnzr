// 路由切换时自动滚到顶部
// 解决 HashRouter 不会自动 scroll restoration 的问题
// 同时兜住"从首页带滚动位置进入子页"导致子页也停在底部的场景
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 用 instant 而非 smooth，避免长页面在切换瞬间出现滚动动画抢走渲染
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
