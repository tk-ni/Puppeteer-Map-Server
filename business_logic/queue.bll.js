const dal = require('./../data_access/dal');
const env = require('./../core/env/env');
const Queue = require('./../models/spiders/queue.model');
const winstonHandler = require('../handlers/winston.handler');

const addToQueue = (url, cb) => {
    if (url) {
        let newEntry = new Queue({ url: url });
        dal.addOne(`INSERT INTO ${env.database.queueTableName} SET ?`, newEntry, (e) => {
            if (e) {
                cb(e)
            } else {
                cb(null);
            }
        })
    } else {
        cb(`Error: queue.bll.js: addToQueue: undefined data.`)
    }
}

const addToQueueMultiple = async (queue_arr, cb) => {
    clearToAdd = true;
    for (queue of queue_arr) {
        if (!queue.url) {
            clearToAdd = false;
        }
    }

    if (clearToAdd) {
        let query = `INSERT IGNORE INTO ${env.database.queueTableName} (url) VALUES `
        for (queue of queue_arr) {
            query += `('${queue.url}'),`;
        }
        query = query.slice(0, -1);
        dal.addOneQuery(query, (e)=>{
            if(e){
                winstonHandler.logError(e);
                cb(e)
            }else{
                cb(null);
            }
        })

    }
}
const removeFromQueue = (url, cb) => {
    if (url) {
        dal.deleteOne(`DELETE FROM ${env.database.queueTableName} WHERE url = '${url}'`, (e) => {
            if (e) {
                cb(e)
            } else {
                cb(null);
            }
        })
    } else {
        cb(`Error: queue.bll.js: removeFromQueue: undefined data.`)
    }
}

const getNextQueue = (cb) =>{
    dal.readOne(`SELECT * FROM ${env.database.queueTableName} ORDER BY RAND() LIMIT 1`, (e,data)=>{
        if(e){
            cb(e)
        }else{
            if(data){
                let next = new Queue(data);
                cb(null,next);
            }else{
                cb(`Error: queue.bll.js: getNextQueue: data undefined.`);
            }
        }
    })
}

const getAllQueue = (cb) =>{
    dal.readAll(`SELECT * FROM ${env.database.queueTableName}`, (e,data)=>{
        if(e){
            cb(e)
        }else{
            if(data && data.length){
                let modelData = data.map(queue =>{
                    return new Queue(queue);
                })
                cb(null,modelData);
            }else{
                cb(`Error: queue.bll.js: getAllQueue: data undefined.`);
            }
        }
    })
}

module.exports = {
    addToQueue: addToQueue,
    addToQueueMultiple: addToQueueMultiple,
    removeFromQueue: removeFromQueue,
    getNextQueue: getNextQueue,
    getAllQueue: getAllQueue
}