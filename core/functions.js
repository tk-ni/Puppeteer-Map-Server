const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Cluster } = require('puppeteer-cluster');
module.exports = {
    puppeteer: {
        createCluster: async () => {
            await puppeteer.use(StealthPlugin());
            const cluster = await Cluster.launch({
                concurrency: Cluster.CONCURRENCY_PAGE,
                maxConcurrency: 60,
                monitor: false,
                puppeteer: puppeteer,
                puppeteerOptions: {
                    headless: false,
                    defaultViewport: null,
                    args: ['--lang=en-US',
                        `--window-size=${1920},${1080}`,
                        '--no-sandbox']
                },
                timeout: env.puppeteer.navigationTimeout,
                retryLimit: 10,
                retryDelay: 1000
            });

            return cluster;
        }
    }
}