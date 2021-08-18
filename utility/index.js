'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Hilfsfunktionen
 * 
 * @author Lukas Steen, Timo Peters
 * @date 26.05.2021
 */

/**
 * Verwaltet global alle möglichen Sprachkürzel.
 */
 const availableLocales = ["de-DE", "en-US", "pl-PL", "he-IL", "ja-JP"];

 /**
 * Speichert die Wechelkurse der Lokalitäten. Für die einzelnen Währungen.
 * Hierbei wird immer von Euro ausgegangen.
 */
const exchange = {
    'de-DE': 1.0,
    'en-US': 1.2,
    'pl-PL': 4.56,
    'he-IL': 3.5,
    'ja-JP': 131.48, 
}

/**
 * Rechnet den übergebenen Preis anhand der übergebenen Lokalität um.
 * @param {Number} price der umzurechnende Preis
 * @param {String} locale die zuverwendene Lokalität
 * @uses Object exchange 
 * @return {Number} der umgerechnete Preis
 */
function convertPrice(price, locale) {
  return price * exchange[locale];
}

/**
 * Erweitert die Produkte in der übergebenen Liste products um den berechneten Minimalpreis
 * des jeweiligen Produktes. Außerdem wird der Preis passent zur Lokalität umgerechnet.
 * 
 * @param {List} products liste der Produkte
 * @param {String} locale derzeitige Lokalität
 * @uses Datei ./data/deals
 * @return {List} erweiterte Liste der Produkte.
 */
 function addMinPrices(products, locale, db) {
  const deals = db.loadJson("deals");

  /* Konvertiert für jedes Produkt den ermittelten Mindestpreis und schreibt 
     ihn in das minPrice Attribut des Produkts */
  products.forEach(product => product.minPrice = 
    convertPrice(
      Math.min.apply(
        Math,
        deals.filter(deal => deal["product-id"] === product.id).map(deal => deal.price)),
      locale)
  );

  return products;
}

/**
 * Leitet um auf die 404-Seite
 * 
 * @returns {import("fhw-web").RedirectResult} Weiterleitung zur 404-Seite
 */
function redirectTo404() {
  return {
    status: 307,
    redirect: '/404'
  }
}

module.exports = {
  convertPrice: convertPrice,
  redirectTo404: redirectTo404,
  addMinPrices: addMinPrices,
  getLocales: () => {
    return availableLocales;
  },
}