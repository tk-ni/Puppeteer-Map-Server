const cron = require('node-cron');
const queueBll = require('../business_logic/queue.bll');
const visitBll = require('../business_logic/visit.bll');
const initReset = () =>{
    cron.schedule(`*/1 * * * *`, ()=>{
        queueBll.resetQueue((e)=>{
            if(e){
                console.log(e)
            }else{
                visitBll.resetVisits((e)=>{
                    if(e){
                        reject(e)
                    }else{
                        console.log('RESET')
                    }
                })
            }
        })
    })
}

module.exports = {
    initReset: initReset
}