const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Cluster } = require('puppeteer-cluster');

module.exports = {
    puppeteer: {
        createCluster: async () => {
            await puppeteer.use(StealthPlugin());
            const cluster = await Cluster.launch({
                concurrency: Cluster.CONCURRENCY_PAGE,
                maxConcurrency: 1,
                monitor: false,
                puppeteer: puppeteer,
                puppeteerOptions: {
                    headless: true,
                    defaultViewport: null,
                    args: ['--lang=en-US',
                        `--window-size=${1920},${1080}`,
                        '--no-sandbox']
                },
                timeout: 20000,
                retryLimit: null,
            });

            return cluster;
        }
    }
}