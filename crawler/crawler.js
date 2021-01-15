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
                cluster.execute({url: queue.url, src: queue.src}).then(()=>{
                    visitBll.getVisits((e,visits)=>{
                        if(!e){
                            io.sockets.emit('visits', visits);
                        }
                    })
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

module.exports = {
    init: init
}