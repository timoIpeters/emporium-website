'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Controller fuer die Detailseite
 * 
 * @author Lukas Steen, Timo Peters
 * @date 26.05.2021
 */

/**
 * Stellt Util-Funktionen zur verfühgung.
 */
const UTIL = require("./utility");

/**
 * Speichert alle Daten, die zu einer Produkt-ID innerhalb einer gegebenen
 * JSON-Datei gefunden wurden. 
 * 
 * @param {String} jsonFileName Name der JSON-Datei
 * @param {Number} productId ID des Produktes
 * @param {Database} db Basisdatenbank
 * 
 * @returns {Array} Array aus Objekten mit gefundenen Daten
 */
 function getForProduct(jsonFileName, productId, db) {
  const json = db.loadJson(jsonFileName);
  
  return json.filter(elem => elem["product-id"] === productId);
}

/**
 * Erzeugt ein Objekt mit Details zu dem geladenen Produkt.
 * 
 * @param {Array} ratings Bewertungen des jeweiligen Produkts
 * @param {Array} deals Deals des jeweiligen Produkts
 * @param {String} locale Lokalisierung zur Preisformatierung
 * @returns {Object} Objekt mit Produktdetails
 */
function getDetailInfo(ratings, deals, locale) {
  let res = {};
  let minPrice = deals[0].price;
  let maxPrice = deals[0].price;
  
  deals.forEach(deal => {
    maxPrice = deal.price > maxPrice ? deal.price : maxPrice;
    minPrice = deal.price < minPrice ? deal.price : minPrice;      
  });

  res.numDeals = deals.length;
  res.minPrice = UTIL.convertPrice(+minPrice, locale);
  res.maxPrice = UTIL.convertPrice(+maxPrice, locale);
  res.numRatings = ratings.length;

  return res;
}

/**
 * Speichert eine abgeschickte Bewertung in die Datenbank.
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").RedirectResult} Weiterleitung auf die Ausgangs-URL
 */
function saveRating(data, db) {
  let ratings = db.loadJson("ratings");
  const sessionData = data.session.getData();

  const newRating = {
    "product-id": +sessionData.product_id,
    "rating": +data.request.post.rating_value,
    "author": data.request.post.rating_author,
    "text": data.request.post.rating_text
  };

  ratings.push(newRating);
  db.saveJson("ratings", ratings);

  const redirectUrl = "/" + sessionData.locale + "/detail/" + sessionData.product_id;

  return {
    status: 307,
    redirect: redirectUrl
  }
}

/**
 * Rendert die Detailseite
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").PageResult} Detailseite
 */
function renderDetail(data, db) {
  const productCount = +db.loadJson("products").length - 1;
  const product_id = data.request.path.product_id === "-0" ? 0 : data.request.path.product_id;
  let sessionData = data.session.getData();
  
  /* Validieren der URL */
  if(Number.isNaN(+product_id)
      || product_id < 0
      || product_id > productCount) {
    sessionData.error = +1;
    data.session.save(sessionData);

    return UTIL.redirectTo404(data, db);
  }
  if(!UTIL.getLocales().includes("" + data.request.path.locale)) {
    return UTIL.redirectTo404(data, db);
  }

  let content = db.loadJson("content");
  let productId = product_id != undefined ? product_id : 0;

  /* Produktionformationen hinzufuegen */
  content.product = db.loadJson("products")[productId];
  content.product.inWishlist = sessionData.wishlist === undefined ? false : sessionData.wishlist.includes(content.product.id);
  content.deals = getForProduct("deals", +productId, db);
  content.ratings = getForProduct("ratings", +productId, db);
  content.productDetail = getDetailInfo(content.ratings, content.deals, data.request.path.locale);

  return {
    status: 200,
    page: 'detail',
    frontmatter: content
  };
}

module.exports = {
  saveRating: saveRating,
  renderDetail: renderDetail
}