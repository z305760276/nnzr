from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    console_logs = []
    page.on('console', lambda msg: console_logs.append(f'[{msg.type}] {msg.text}'))
    page.on('pageerror', lambda err: console_logs.append(f'[ERROR] {err}'))
    
    page.goto('http://localhost:3000/', wait_until='networkidle', timeout=30000)
    
    # Screenshot
    page.screenshot(path='/tmp/page.png', full_page=True)
    
    # Check page content
    title = page.title()
    body_text = page.inner_text('body')[:500]
    root_children = page.eval_on_selector('#root', 'el => el.children.length')
    
    print(f'Title: {title}')
    print(f'Root children count: {root_children}')
    print(f'Body text (first 500): {body_text}')
    print(f'\nConsole logs ({len(console_logs)}):')
    for log in console_logs:
        print(f'  {log}')
    
    # Check if there's an error boundary or empty state
    error_elements = page.locator('[class*="error"], [class*="Error"], [role="alert"]')
    error_count = error_elements.count()
    if error_count > 0:
        print(f'\nError elements found: {error_count}')
        for i in range(error_count):
            print(f'  {error_elements.nth(i).inner_text()[:200]}')
    
    browser.close()
