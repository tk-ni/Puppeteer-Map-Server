const functions = require('./../core/functions');
const getLinks = require('./functions/getLinks.function');
const queueBll = require('./../business_logic/queue.bll');

const init = async () => {
    // let cluster = await functions.puppeteer.createCluster();
    
}

const initCluster = (cluster) => {
    cluster.on('taskerror', (e) => {
        console.log(e);
    });

    cluster.task(async ({ page, data }) => {
        await page.goto(data.url, {waitUntil: 'networkidle2'});

    })
}

module.exports = {
    init: init
}