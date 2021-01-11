const express = require('express');
const app = express();
const cronManager = require('./managers/cron.manager');

const env = require('./core/env');
const crawler = require('./crawler/crawler');

app.listen(env.PORT, ()=>{
    console.log('Server listening on', env.PORT);
    // crawler.init();
    // cronManager.initReset();
    //To do - reset crawler db every 10 minutes;
    //To do - show log
})