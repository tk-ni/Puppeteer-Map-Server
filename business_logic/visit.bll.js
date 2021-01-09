const env = require("../core/env")
const dal = require("../data_access/dal")
const Visit = require('./../models/visit.model');

const addVisit = (url, links, cb) => {
    let visit = new Visit({ url: url, date: new Date().getTime(), links: JSON.stringify(links) });
    dal.addOne(`INSERT INTO ${env.database.visitTableName} SET ?`, visit, (e) => {
        if (e) {
            cb(e)
        } else {
            cb(null);
        }
    })
}
const checkVisited = (url, cb) => {
    dal.readOne(`SELECT * FROM ${env.database.visitTableName} WHERE url = '${url}'`, (e,data) => {
        if (e) {
            cb(e)
        } else {
            if (data) {
                cb(`Already visited.`);
            } else {
                cb(null);
            }
        }
    })
}

module.exports = {
    addVisit: addVisit,
    checkVisited: checkVisited
}