import { test, expect, takeSnapshot } from '@chromatic-com/playwright'
  test.describe("Restaurants ", () => {
    test.use({
      delay: 3000,
      disableAutoSnapshot: true,
    })
    test("Home page loads", async ({ page }) => {
      await page.goto('/')

      await expect(page).toHaveTitle(/Mealdrop - find your next meal/)
    
      await page.waitForTimeout(3000)
    })
    test('Order created', async ({ page }, testInfo) => {

      await page.goto('/restaurants/2')
    
      await page.waitForTimeout(1000)
      await takeSnapshot(page, testInfo)
    
      await page.getByText('Fries').first().click()
    
      await expect(page.getByTestId('modal')).toBeVisible()
      await takeSnapshot(page, testInfo)
    
      await page.getByText(/add for €2\.50/).click()
    
      await page.waitForTimeout(3000)
    })

    test('Loads an non-existing category page', async ({ page },testInfo) => {
      await page.goto('/categories/non-existing-category')
      await page.waitForTimeout(1000)
      await page.screenshot({
        path: "./test-results/NonExistingCategoryPageLoad.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Non Existing Category Initial load',testInfo)
      await expect(page.getByText('This is not the food you\’re looking for.')).toBeVisible()
      await page.screenshot({
        path: "./test-results/NonExistingCategorLoaded.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Non Existing Category loaded',testInfo)
    })
    test('Loads an non-existing category page and goes back to homepage', async ({ page },testInfo) => {
      await page.goto('/categories/non-existing-category')
      await page.waitForTimeout(1000)
      await page.screenshot({
        path: "./test-results/FullNonExistingCategoryPageLoad.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Full Non Existing Category Initial load',testInfo)
      await expect(page.getByText('This is not the food you\’re looking for.')).toBeVisible()
      await page.screenshot({
        path: "./test-results/FullNonExistingCategorLoaded.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Full Non Existing Category loaded',testInfo)

      await page.getByRole('button', { name: 'See all restaurants' }).click({timeout: 3000})

      await page.screenshot({
        path: "./test-results/BackToHomepage.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Goes back Homepage',testInfo)

    })
    test('Loads an non-existing restaurant page', async ({ page },testInfo) => {
      await page.goto('/restaurants/non-existing-restaurant')
      await page.waitForTimeout(1000)
      await page.screenshot({
        path: "./test-results/NonExistingRestaurantLoad.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Non Existing Restaurant Initial load',testInfo)
      await expect(page.getByText('We can\'t find this page')).toBeVisible()
      await page.screenshot({
        path: "./test-results/NonExistingRestaurantLoaded.png",
        fullPage: true,
      })
      await takeSnapshot(page, 'Playwright - Non Existing Restaurant loaded',testInfo)
    })
    
  })