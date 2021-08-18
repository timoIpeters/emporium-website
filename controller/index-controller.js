'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Controller der Index-Seite
 * 
 * @author Lukas Steen, Timo Peters
 * @date 26.05.2021
 */

/**
 * Stellt Util-Funktionen zur verfühgung.
 */
const UTIL = require('./utility');

/**
 * Leitet auf die Startseite mit der Standartlokalität "de-DE" um.
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").RedirectResult} Index-Seite mit Lokalität.
 */
function redirect(data,db) {
  return {
    status: 307,
    redirect: '/de-DE' 
  }
}

/**
 * Rendert die Index-Seite 
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").PageResult} Objekt der Index-Seite.
 */
function renderIndex(data, db) {
  /* Validieren der URL */
  if(!UTIL.getLocales().includes("" + data.request.path.locale)) {
    return UTIL.redirectTo404();
  }

  return {
    status: 200,
    page: 'index',
    frontmatter: db.loadJson("content")
  };
}

module.exports = {
  redirect: redirect,
  renderIndex: renderIndex
}