import { chromium } from 'playwright';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..');

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto('http://localhost:5173');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);

// Calendar
await page.screenshot({ path: join(outDir, 'screenshot-calendar.png') });
console.log('Calendar screenshot saved');

// Shifts (second nav item)
await page.click('nav button:nth-child(2)');
await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'screenshot-shifts.png') });
console.log('Shifts screenshot saved');

// Statistics (third nav item)
await page.click('nav button:nth-child(3)');
await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'screenshot-stats.png') });
console.log('Statistics screenshot saved');

// Swaps (fourth nav item)
await page.click('nav button:nth-child(4)');
await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'screenshot-swaps.png') });
console.log('Swaps screenshot saved');

// Export (fifth nav item)
await page.click('nav button:nth-child(5)');
await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'screenshot-export.png') });
console.log('Export screenshot saved');

// Settings (sixth nav item)
await page.click('nav button:nth-child(6)');
await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, 'screenshot-settings.png') });
console.log('Settings screenshot saved');

await browser.close();
console.log('Done!');
