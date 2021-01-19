const cron = require('node-cron');
const queueBll = require('../business_logic/queue.bll');
const visitBll = require('../business_logic/visit.bll');
const logManager = require('./log.manager');
const initReset = () =>{
    cron.schedule(`*/2 * * * *`, ()=>{
        queueBll.resetQueue((e)=>{
            if(e){
                console.log(e)
            }else{
                visitBll.resetVisits((e)=>{
                    if(e){
                        reject(e)
                    }else{
                        logManager.logSync('Resetting database...');
                    }
                })
            }
        })
    })
}

module.exports = {
    initReset: initReset
}