const dal = require('./../data_access/dal');
const env = require('./../core/env');
const Queue = require('./../models/queue.model');

const addToQueueMultiple = async (queue_arr, cb) => {
    let query = `INSERT IGNORE INTO ${env.database.queueTableName} (url,src) VALUES `
    for (queue of queue_arr) {
        query += `('${queue.url.toString()}', '${queue.src.toString()}'),`;
    }
    query = query.slice(0, -1);
    dal.addOneQuery(query, (e) => {
        if (e) {
            cb(e)
        } else {
            cb(null);
        }
    })
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


const getRandomQueue = (cb) => {
    dal.readOne(`SELECT COUNT(*) FROM ${env.database.queueTableName}`, (e, count) => {
        if (e) {
            cb(e)
        } else {
            let rnd = Math.floor(Math.random() * 300) + 200;
            dal.readAll(`SELECT * FROM ${env.database.queueTableName} ORDER BY RAND() LIMIT ${rnd}`, (e, data) => {
                if (e) {
                    cb(e)
                } else {
                    if (data && data.length) {
                        let modelData = data.map(queue => {
                            return new Queue(queue);
                        })
                        cb(null, modelData);
                    } else {
                        cb(`Error: queue.bll.js: getRandomQueue: data undefined.`);
                    }
                }
            })
        }
    })

}

const resetQueue = (cb) => {
    dal.readOne(`SELECT COUNT(*) FROM ${env.database.queueTableName}`, (e, count) => {
        if (e) {
            cb(e)
        } else {
            let rnd = Math.floor(Math.random() * (count['COUNT(*)'] - 1)) + 1;
            dal.deleteAll(`DELETE FROM ${env.database.queueTableName} LIMIT ${rnd}`, (e) => {
                if (e) {
                    cb(e)
                } else {
                    cb(null);
                }
            })
        }
    });
}

module.exports = {
    addToQueueMultiple: addToQueueMultiple,
    removeFromQueue: removeFromQueue,
    getRandomQueue: getRandomQueue,
    resetQueue: resetQueue
}