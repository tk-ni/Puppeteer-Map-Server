const cheerio = require('cheerio');
const Queue = require('../../models/queue.model');

const getLinks = async (page) => {
    //Get src
    let src = await page.url();
    let regx = new RegExp(/(?:\w+\.)+\w+/g);
    src = src.match(regx);
    src = src[0];
    if(src.startsWith('www.')){
        src = src.slice(4, src.length);
    }

    //Get HTML
    let html = await page.evaluate(() => {
        if (document && document.documentElement && document.documentElement.innerHTML) {
            return document.documentElement.innerHTML;
        } else {
            return null;
        }
    });
    if (html) {
        let $ = cheerio.load(html);

        //Get all links
        let links = $('a').get().map(l => {
            return $(l).attr('href');
        });

        //Filter unvalidated URLS
        links = links.filter(url => {
            return validateURL(url);
        });

        //Remove duplicates
        links = [...new Set(links)];

        //Create Queue Objects
        links = links.map(url =>{
            return new Queue({url: url, src:src})
        });
        
        //Return
        return links;
    } else {
        return null;
    }

}

const validateURL = (str) => {
    let pattern = new RegExp('^(https|http):\/\/(.*)(?<!pdf|gif|jpeg|jpg|png)$', 'im');
    return pattern.test(str);
}

module.exports = getLinks;