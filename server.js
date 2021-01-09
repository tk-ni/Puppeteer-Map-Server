const express = require('express');
const app = express();

const env = require('./core/env');
const crawler = require('./crawler/crawler');

app.listen(env.PORT, ()=>{
    console.log('Server listening on', env.PORT);
    crawler.init('https://pinchofyum.com/')
})