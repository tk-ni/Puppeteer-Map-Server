const functions = require('./../core/functions');
const getLinks = require('./functions/getLinks.function');
const queueBll = require('./../business_logic/queue.bll');
const visitBll = require('./../business_logic/visit.bll');
const logManager = require('./../managers/log.manager');

const init = (io) => {
    queueBll.getRandomQueue(async (e, list) => {
        if (e) {
            console.log(e);
        } else {
            let cluster = await functions.puppeteer.createCluster();
            for (queue of list) {
                cluster.execute({url: queue.url, src: queue.src}).then(async ()=>{
                   emitSocketData(io).then(res =>{
                       console.log(res);
                   }).catch(e =>{
                       console.log(e);
                   });
                }).catch(e =>{
                   logManager.logSync(e);
                });
            }
            initCluster(cluster);
            await cluster.idle();
            await cluster.close();
            init();
        }
    })
}

const initCluster = async (cluster) => {
    cluster.task(async ({ page, data }) => {
        await new Promise((resolve, reject) => {
            visitBll.checkVisited(data.url, async (e)=>{
                if(e){
                    reject(e);
                }else{
                    try{
                        logManager.logSync(`Fetching ${data.url}`);
                        await page.goto(data.url, { waitUntil: 'domcontentloaded' });
                        await page.evaluate(() => window.stop());
                        let links = await getLinks(page);
                        if (links && links.length > 0) {
                            visitBll.addVisit(data.url, data.src, (e) => {
                                if (e) {
                                    reject(e);
                                } else {
                                    queueBll.addToQueueMultiple(links, (e) => {
                                        if (e) {
                                           reject(e);
                                        } else {
                                            queueBll.removeFromQueue(data.url, (e) => {
                                                if (e) {
                                                    reject(e);
                                                } else {
                                                   resolve();
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            reject(`No links found on ${data.url}`)
                        }
                    }catch(e){
                        reject(e);
                    }
                    
                }
            })
            
        })
    });
}

const emitSocketData = async (io) =>{
    return await new Promise(async(resolve,reject)=>{
        if(io && io.sockets.sockets.size > 0){
            visitBll.getVisits((e,visits)=>{
                if(e){
                    reject(e)
                }else{
                    logManager.getLogs((e,logs)=>{
                        if(e){
                            reject(e)
                        }else{
                            io.emit('update',[visits,logs]);
                            resolve(`Emitted data to ${io.sockets.sockets.size} sockets.`);
                        }
                    })
                }
            })
        }else{
            reject('io undefined.');
        }
    })
}

module.exports = {
    init: init,
    emitSocketData: emitSocketData
}