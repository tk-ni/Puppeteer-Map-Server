const env = require("../core/env")
const dal = require("../data_access/dal")
const Visit = require('./../models/visit.model');

const addVisit = (url, src, cb) => {
    let visit = new Visit({ url: url, date: new Date().getTime(), src: src });
    dal.addOne(`INSERT INTO ${env.database.visitTableName} SET ?`, visit, (e) => {
        if (e) {
            cb(e)
        } else {
            cb(null);
        }
    })
}
const checkVisited = (url, cb) => {
    dal.readOne(`SELECT * FROM ${env.database.visitTableName} WHERE url = '${url}'`, (e, data) => {
        if (e) {
            cb(e)
        } else {
            if (data) {
                cb(`Already visited ${url}`);
            } else {
                cb(null);
            }
        }
    })
}

const resetVisits = (cb) => {
    dal.deleteAll(`DELETE FROM ${env.database.visitTableName}`, (e) => {
        if (e) {
            cb(e)
        } else {
            cb(null);
        }
    })
}

const getVisits = (cb) =>{
    dal.readAll(`SELECT * FROM ${env.database.visitTableName}`, (e,data)=>{
        if(e){
            cb(e)
        }else{
            if(data && data.length){
                let modelData = data.map(v => new Visit(v));
                cb(null,modelData);
            }else{
                cb(`Error: getVisits: data undefined.`)
            }
        }
    })
}

module.exports = {
    addVisit: addVisit,
    checkVisited: checkVisited,
    resetVisits: resetVisits,
    getVisits: getVisits
}