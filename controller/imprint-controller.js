'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Controller der Imprint-Seite
 * 
 * @author Lukas Steen, Timo Peters
 * @date 26.05.2021
 */

/**
 * Stellt Util-Funktionen zur verfühgung.
 */
const UTIL = require('./utility');

/**
 * Rendert die Imprint-Seite 
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").PageResult} Objekt der Imprint-Seite.
 */
function renderImprint(data,db) {
  /* Validieren der URL */
  if(!UTIL.getLocales().includes("" + data.request.path.locale)) {
    return UTIL.redirectTo404();
  }

  return {
    status: 200,
    page: 'imprint',
    frontmatter: db.loadJson("content")
  };
}

module.exports = {
  renderImprint: renderImprint
}