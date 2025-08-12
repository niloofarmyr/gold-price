const fs = require('fs/promises');

(async () => {
  try {
    const response = await fetch('https://www.tgju.org/profile/geram18', {
      headers: { 'user-agent': 'Mozilla/5.0' }
    });
    const html = await response.text();
    // Convert Persian digits to English
    const fa = '۰۱۲۳۴۵۶۷۸۹';
    const en = '0123456789';
    const normalized = html.replace(/[۰-۹]/g, d => en[fa.indexOf(d)]);
    // Extract numbers of 6 or more digits (riyal prices) and find the maximum within a logical range
    const matches = normalized.match(/[\d,]{6,}/g) || [];
    const numbers = matches
      .map(str => parseInt(str.replace(/,/g, ''), 10))
      .filter(n => n > 500000 && n < 500000000);
    const gold18_rial = numbers.length ? Math.max(...numbers) : null;
    const gold18_toman = gold18_rial !== null ? Math.round(gold18_rial / 10) : null;
    const data = {
      source: 'tgju',
      gold18_rial,
      gold18_toman,
      updated_at: new Date().toISOString()
    };
    await fs.mkdir('data', { recursive: true });
    await fs.writeFile('data/gold18.json', JSON.stringify(data, null, 2));
    console.log('Gold price data updated:', data);
  } catch (error) {
    console.error('Error fetching or processing gold price:', error);
    process.exit(1);
  }
})();
