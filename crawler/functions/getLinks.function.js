const cheerio = require('cheerio');
const Queue = require('../../models/queue.model');

const getLinks = async (page) => {
    let src = await page.url();
    let html = await page.evaluate(() => {
        if (document && document.documentElement && document.documentElement.innerHTML) {
            return document.documentElement.innerHTML;
        } else {
            return null;
        }
    });
    if (html) {
        let $ = cheerio.load(html);
        let links = $('a').get().map(l => {
            return $(l).attr('href');
        });

        links = links.filter(url => {
            return validURL(url);
        });

        links = [...new Set(links)];

        links = links.map(url =>{
            return new Queue({url: url, src:src})
        });
        
        return links;
    } else {
        return null;
    }

}

const validURL = (str) => {
    let pattern = new RegExp('^(https|http):\/\/(.*)(?<!pdf|gif|jpeg|jpg|png)$', 'im');
    return pattern.test(str);
}

module.exports = getLinks;