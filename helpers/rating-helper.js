/**
 * Erzeugt ein boolsches Array zur Repraesentation der vollen und leeren Sterne. 
 * 
 * @param {Number} amount Abgegebene Bewertung
 * @returns {String} String-Repraesentation der Sterne
 */

function generateStars (amount) {
  let res = new Array(5).fill(false);
  let fullStars = amount > 5 ? 5 : amount;
  let idx = 0;

  res.forEach(_ => res[idx] = idx++ < fullStars);

  return res;
}


/**
 * Erstellt anhand eines Durchschnittswertes der Bewertungen
 * eine boolsches Array zur Repraesentation der vollen und leeren Sterne
 * 
 * @param {Object[]} ratings Bewertungen
 * @returns {String} String-Repraesentation der Bewertung
 */
function generateAverageStars(ratings) {
  let sum = ratings.map(rating => rating.rating).reduce((a,b) => a + b, 0);
  let average = sum / ratings.length;

  return generateStars(Math.round(average));
}

module.exports = {
  "generateStars": generateStars,
  "generateAverageStars": generateAverageStars
}