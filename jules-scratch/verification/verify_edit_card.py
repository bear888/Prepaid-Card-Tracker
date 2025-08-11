from playwright.sync_api import sync_playwright, Page, expect

def verify_edit_card(page: Page):
    """
    This test verifies that clicking the 'Edit Card' button opens the edit modal.

    NOTE: This script assumes that there is at least one card on the page.
    """
    # 1. Arrange: Go to the application homepage.
    page.goto("http://localhost:5174/")

    # Wait for the card to appear
    expect(page.locator(".card-item").first).to_be_visible()

    # 2. Act: Find the first card and click the "More" button.
    first_card = page.locator(".card-item").first
    more_button = first_card.locator("button:has(svg.lucide-more-horizontal)")
    more_button.click()

    # Click the "Edit Card" button
    edit_button = page.get_by_role("menuitem", name="Edit Card")
    edit_button.click()

    # 3. Assert: Confirm the edit modal is visible.
    expect(page.get_by_role("dialog", name="Edit Card")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_edit_card(page)
        browser.close()
