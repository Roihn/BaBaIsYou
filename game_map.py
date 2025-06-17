from playwright.sync_api import sync_playwright
import time

def execute_action(page, action):
    """
    Execute a game action based on the provided string command.
    Args:
        page: Playwright page object
        action: String command ('up', 'down', 'left', 'right', 'reset')
    """
    action_map = {
        'up': 'ArrowUp',
        'down': 'ArrowDown',
        'left': 'ArrowLeft',
        'right': 'ArrowRight',
        'reset': 'r'
    }
    
    if action in action_map:
        page.keyboard.press(action_map[action])
        time.sleep(0.2)  # Prevent too rapid movement
    else:
        print(f"Invalid action: {action}. Valid actions are: {list(action_map.keys())}")

def navigate_and_print_map():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            # headless=False  # Set to True for headless mode
        )
        page = browser.new_page()
        
        try:
            # 1. Navigate to home page
            print("Navigating to home page...")
            page.goto('http://localhost:5173')
            
            # Wait for the Start button to be visible
            print("Waiting for Start button...")
            # The button is inside a router-link, so we need to be more specific
            page.click('a:has(button:has-text("Start"))')
            
            # 3. Wait for level selection grid to load
            print("Waiting for level selection...")
            page.wait_for_selector('.card-container button', timeout=5000)

            # Print available level names
            level_buttons = page.query_selector_all('.card-container button')
            for i, btn in enumerate(level_buttons):
                print(f"{i+1}: {btn.inner_text()}")

            # Click first level
            print("Selecting first level...")
            level_buttons[0].click()

            # 5. Wait for game layout to render
            print("Waiting for game to load...")
            page.wait_for_selector('#game-layer', timeout=8000)
            time.sleep(1.5)  # Let any transitions/initialization finish

            # For each action, execute the action and print the game map
            # for action in ['up', 'down', 'left', 'right', 'reset']:
            for action in ['up', 'up', 'reset']:
                execute_action(page, action)
                time.sleep(1)
                game_map = page.evaluate("() => window.game.getMapAsObject()")
                print(game_map)
            
            # # 6. Extract and print the game map
            # print("\nExtracted Game Map:")
            # game_map = page.evaluate("() => window.game.getMapAsObject()")
            # print(game_map)

            # print("\nAvailable actions:")
            # print("- 'up': Move Up")
            # print("- 'down': Move Down")
            # print("- 'left': Move Left")
            # print("- 'right': Move Right")
            # print("- 'reset': Reset Level")
            
            # Example of how to use the execute_action function:
            # execute_action(page, "up")
            # execute_action(page, "right")
            # execute_action(page, "reset")
                
        finally:
            browser.close()

if __name__ == "__main__":
    navigate_and_print_map()