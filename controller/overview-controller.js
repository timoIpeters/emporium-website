'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Controller der Overview-Seite
 * 
 * @author Lukas Steen, Timo Peters
 * @date 26.05.2021
 */

/**
 * Stellt Util-Funktionen zur verfühgung.
 */
const UTIL = require('./utility');

/**
 * Erstellt eine Liste aus allen Produkten welche der übergebenen Kategorie angehören.
 * 
 * @param {String} category Kategorie
 * @param {Database} db Datenbank
 * @uses Datei ./data/products
 * @return {List} Liste der Produkte
 */
 function getProductsOf(category, db) {
  const products = db.loadJson("products");

  return products.filter(product => product.category === category);
}

/**
 * Wendet den den aktuellen Filter auf die Liste der Produkte an.
 * 
 * @param {Array} products Liste der Produkte
 * @param {Object} request Requestobjekt
 * @returns {Array} gefilterte Produktliste
 */
function applyFilter(products, request) {
  let filterMinPrice = request.get.minPrice;
  let filterMaxPrice = request.get.maxPrice;

  if(filterMinPrice !== undefined && filterMinPrice !== "") {
    products = products.filter(product => product.minPrice > +filterMinPrice);
  }
  if(filterMaxPrice !== undefined && filterMaxPrice !== "") {
    products = products.filter(product => product.minPrice < +filterMaxPrice);
  }

  return products;
}

/**
 * Lädt die Liste der Produkte und filtert diese, sofer eine Suche vorhanden bzw gewünscht ist.
 * 
 * @param {Array} products Liste der Produkte
 * @param {String} search Suche des Benutzers
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns gefilterte Produktliste
 */
function applySearch(search, data, db) {
    let products = db.loadJson("products").filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
    
    let tempCat = [];
    data.global.categories.forEach(element => tempCat.push(+0));
    products.forEach(product => {
      let idx = data.global.categories.indexOf(product.category);
      tempCat[idx] += 1;
    });
    let idxOfResCat = tempCat.indexOf(+Math.max(...tempCat));
    
    products = products.filter(product => product.category === data.global.categories[idxOfResCat]);

    return products;
}

/**
 * Fügt den Produkten eine Flag hinzu, ob sie in der Wunschliste vorhanden sind
 * 
 * @param {Array} products Produktliste
 * @param {Object} session Session-Objekt des Users
 * @returns geänderte Produktliste
 */
function applyWishlist(products, session) {
  const wishlist = session.getData().wishlist;
  products.forEach(product => {
      product.inWishlist = wishlist === undefined ? false : wishlist.includes(product.id);
  });

  return products;
}

/**
 * Rendert die Overwiew-Seite 
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").PageResult} Objekt der Overwiew-Seite.
 */
function renderOverview(data, db) {
  const categoryCount = +data.global.categories.length - 1;
  const category_id = data.request.path.category_id === "-0" ? 0 : data.request.path.category_id;
  /* Validieren der URL */
  if (
    !UTIL.getLocales().includes("" + data.request.path.locale) ||
    category_id !== undefined && 
    Number.isNaN(+category_id) ||
    category_id < 0 ||
    category_id > categoryCount
  ) {
    return UTIL.redirectTo404(data, db);
  }

  let content = db.loadJson("content");
  let products = [];
  
  let search = data.request.get.search;
  
  if(search !== undefined) {
    products = applySearch(search, data, db);
  }else if(category_id === undefined) {
    return UTIL.redirectTo404(data, db);
  } else {
    products = getProductsOf(data.global.categories[category_id], db);
  }

  products = UTIL.addMinPrices(products, data.request.path.locale, db);

  products = applyFilter(products, data.request);

  products = applyWishlist(products, data.session);
  
  content.products = products;

  return {
    status: 200,
    page: 'overview',
    frontmatter: content
  };
}

module.exports = {
  renderOverview: renderOverview
}