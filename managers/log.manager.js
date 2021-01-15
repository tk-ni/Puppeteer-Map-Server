const dal = require('./../data_access/dal');
const env = require('./../core/env');
const Log = require('./../models/log.model');
let logsIo = null;

const init = (io) =>{
    logsIo = io;
}

const getLogs = (cb) =>{
    dal.readAll(`SELECT * FROM ${env.database.logTableName}`, (e,data)=>{
        if(e){
            cb(e);
        }else{
            if(data && data.length){
                let modelData = data.map(l => new Log(l));
                cb(null,modelData);
            }else{
                cb(`Error: getLogs: data undefined.`)
            }
        }
    })
}
const logSync = async (string) => {
    if(string && typeof string == 'string' && !string.includes('SQL') && !string.includes('Timeout')){
        return await new Promise((resolve,reject)=>{
            console.log(string);
            let log = new Log({string: string});
            dal.addOne(`INSERT INTO ${env.database.logTableName} SET ?`, log, async (e)=>{
                if(e){
                    reject(e)
                }else{
                    try{
                        await trimLogsSync();
                        if(logsIo){
                            getLogs((e,logs)=>{
                                if(!e){
                                    logsIo.sockets.emit('logs', logs);
                                }
                            })
                        }
                        resolve();
                    }catch(e){
                        reject(e);
                    }
                }
            })
        })
    }
}

const trimLogsSync = async () =>{
    return await new Promise((resolve,reject)=>{
        dal.readOne(`SELECT COUNT(*) FROM ${env.database.logTableName}`, (e,count) =>{
            if(e){
                reject(e);
            }else{
                let rows = count['COUNT(*)'];
                if(rows > 200){
                    dal.deleteAll(`DELETE FROM ${env.database.logTableName} LIMIT ${rows - 200}`, (e)=>{
                        if(e){
                            reject(e);
                        }else{
                            resolve();
                        }
                    })
                }else{
                    resolve();
                }
            }
        })
    })

}
module.exports = {
    init: init,
    logSync:logSync
}