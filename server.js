"use strict";

const Server = require("fhw-web");
const fs = require("fs");

/**
 * Searches products.json for categories
 * 
 * @returns list of categories
 */
function getCategories() {
  const products = require("./data/products");
  let list = [];

  products.map(element => element.category)
          .forEach(category => {
            if (!list.includes(category)) {
              list.push(category);
            }
          });

  return list;
}

const global = require("./global");
global.categories = getCategories();

// create json
// last parameter = "pretty-print"
const globalJsonString = JSON.stringify(global, null, 4)

// save global as json string
fs.writeFileSync('global.json', globalJsonString)

const config = {
  server: { host: "localhost", port: 8080 },
  routing: { magic: false },
  templating: {
    validation: true,
    allowedExtensions: ["hbs"],
  },
  sessions: { active: true },
  database: {
    fileData: { active: true },
  },
};

const app = new Server(config);
app.start();
