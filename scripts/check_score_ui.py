from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    # 导航到规范记分页面
    page.goto('http://localhost:5173/nnzr/#/detail/standards')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    # 全页截图
    page.screenshot(path='/tmp/standards_full.png', full_page=True)
    
    # 检查关键元素是否存在
    stats = page.locator('.grid.grid-cols-2.md\\:grid-cols-4 > div').count()
    accordion_items = page.locator('[id^="safety-"]').count()
    print(f"统计概览卡片数: {stats}")
    print(f"HSE手风琴项数: {accordion_items}")
    
    # 检查 CSS 变量是否加载
    score_critical = page.evaluate("() => getComputedStyle(document.documentElement).getPropertyValue('--score-critical').trim()")
    score_major = page.evaluate("() => getComputedStyle(document.documentElement).getPropertyValue('--score-major').trim()")
    print(f"--score-critical: '{score_critical}'")
    print(f"--score-major: '{score_major}'")
    
    browser.close()
