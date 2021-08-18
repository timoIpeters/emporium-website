/**
 * Moegliche Lokalisierungen mit zugewiesener Waehrung
 */
const lookup = {
  'de-DE': 'EUR',
  'en-US': 'USD',
  'pl-PL': 'PLN',
  'he-IL': 'ILS',
  'ja-JP': 'JPY',
}

/**
 * Waehrung je nach Lokalisierung formatieren.
 * 
 * @param {String} locale eine Lokalisierung aus lookup
 * @param {Number} price zu formatierender Preis
 * @returns {String} formatierter Preis
 */
function formatCurrency(locale, price) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: lookup[locale]
  });

  return formatter.format(price);
}

module.exports = {
  "formatCurrency": formatCurrency,
  "localeFormatDate": locale => {
    return new Date().toLocaleString(locale);
  }
}