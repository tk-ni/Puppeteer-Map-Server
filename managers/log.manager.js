const dal = require('./../data_access/dal');
const env = require('./../core/env');
const Log = require('./../models/log.model');

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
                if(rows > 1000){
                    dal.deleteAll(`DELETE FROM ${env.database.logTableName} LIMIT ${rows - 1000}`, (e)=>{
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
    logSync:logSync
}