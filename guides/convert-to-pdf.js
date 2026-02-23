const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function convertToPDF(htmlFile, pdfFile) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, htmlFile);
  const pdfPath = path.resolve(__dirname, pdfFile);
  
  console.log(`Converting ${htmlFile} to ${pdfFile}...`);
  
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    margin: {
      top: '0.75in',
      right: '0.75in',
      bottom: '1in',
      left: '0.75in'
    },
    printBackground: true,
    displayHeaderFooter: false
  });
  
  const stats = fs.statSync(pdfPath);
  console.log(`✓ Created ${pdfFile} (${Math.round(stats.size / 1024)} KB)`);
  
  await browser.close();
}

async function main() {
  const guides = [
    ['foia-mastery.html', 'foia-mastery.pdf'],
    ['osint-playbook.html', 'osint-playbook.pdf'],
    ['background-check-diy.html', 'background-check-diy.pdf']
  ];
  
  for (const [html, pdf] of guides) {
    await convertToPDF(html, pdf);
  }
  
  console.log('\nAll PDFs created successfully!');
}

main().catch(console.error);
