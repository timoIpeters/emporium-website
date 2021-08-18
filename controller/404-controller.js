'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Controller fuer die 404 (Fehler) Seite
 * 
 * @author Lukas Steen, Timo Peters
 * @date 26.05.2021
 */

/**
 * Stellt Util-Funktionen zur verfühgung.
 */
const UTIL = require("./utility");

/**
 * Rendert die 404 Seite mit der passenden Fehlernachricht. 
 * Moegliche Fehlernachrichten sind Produkt oder Seite nicht gefunden.
 * 
 * @param {Object} data Session, Request und Global Daten
 * @param {Database} db Datenbank
 * @returns {import("fhw-web").PageResult} 404 Seite
 */
function render404(data, db) {
  let content = db.loadJson("content");  
  let sessionData = data.session.getData();

  if(sessionData.error === 1) {
    content.lang["404"].txt_subject = content.lang["404"].txt_subject[sessionData.error];
    sessionData.error = 0;
  } else {
    sessionData.error = 0;
    content.lang["404"].txt_subject = content.lang["404"].txt_subject[sessionData.error];
  }
  data.session.save(sessionData);

  return {
    status: 404,
    page: '404',
    frontmatter: content
  };
}

module.exports = {
  render404: render404,
  redirectTo404: UTIL.redirectTo404
}