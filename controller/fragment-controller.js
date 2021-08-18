'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Controller fuer die 404 (Fehler) Seite
 * 
 * @author Lukas Steen, Timo Peters
 * @date 17.06.2021
 */

const UTIL = require("./utility");

/**
 * Simulation von serverseitiger Verarbeitungszeit
 * @param {Number} ms Wartezeit in Millisekunden
 */
function wait(ms) {
    const start = Date.now();
    let now = start;
    while(now - start < ms) {
      now = Date.now();
    }
}

/**
 * Rendert das Wunschlisten-Fragment
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").FragmentResult} Wunschlisten-Fragment.
 */
function renderWishlistFragment(data,db) {
    const session = data.session.getData();
    let products = db.loadJson("products");
    const content = db.loadJson("content"); 

    let wishlist = session.wishlist;
    
    if (wishlist === undefined) {
        products = undefined;
    } else {
        products = products.filter(product => wishlist.includes(+product.id));
        UTIL.addMinPrices(products, session.locale, db);
    }
    
    
    content.products = products;
    wait(2000);

    return {
      status: 200,
      fragment: 'wishlist_content',
      frontmatter: content
    }
}

/**
 * Gibt die Elemente der Ladeanimation zurück.
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").FragmentResult} Fragment der Ladeanimation.
 */
function renderWaitFragment(data, db) {
    return {
        status: 200,
        fragment: 'wishlist_wait',
        frontmatter: {}
      }
}

/**
 * Gibt das passende Herz-Fragment zurück.
 * In der Wunschliste = ausgefülltes Herz.
 * Nicht in der Wunschliste = leeres Herz.
 * 
 * see what we did there? XD
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").FragmentResult} Herz-Fragment.
 */
function renderHeartFragment(data, db) {
    const sessionData = data.session.getData();

    if (sessionData.wishlist !== undefined && 
        sessionData.lastChange !== undefined && 
        sessionData.wishlist.includes(sessionData.lastChange)) {
        return {
            status: 200,
            fragment: 'heart',
            frontmatter: {}
        }
    }

    return {
        status: 200,
        fragment: 'heart_empty',
        frontmatter: {}
    }
}

/**
 * Fügt das Produkt mit der übergebenen Produktid dem Merkzettel hinzu oder
 * löscht es, wenn bereits vorhanden.
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 */
function toggleWishlist(data, db) {
    const sessionData = data.session.getData();
    const productId = data.request.post.id;

    sessionData.wishlist = sessionData.wishlist === undefined ? [] : sessionData.wishlist;
    const wishlist = sessionData.wishlist;

    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
    } else {
        wishlist.splice(wishlist.indexOf(productId), 1);
    }

    sessionData.lastChange = productId;
    data.session.save(sessionData);

    return { status: 200 }
}

module.exports = {
    renderWishlistFragment: renderWishlistFragment,
    toggleWishlist: toggleWishlist,
    renderWaitFragment: renderWaitFragment,
    renderHeartFragment: renderHeartFragment
}