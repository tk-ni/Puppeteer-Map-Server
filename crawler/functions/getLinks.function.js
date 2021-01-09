const cheerio = require('cheerio');

const getLinks = async (page) =>{    
    let html = await page.evaluate(()=>{
        if(document && document.documentElement && document.documentElement.innerHTML){
            return document.documentElement.innerHTML;
        }else{
            return null;
        }
    });
    if(html){
        let $ = cheerio.load(html);
        let links = $('a').get().map(l =>{
           return $(l).attr('href');
        });
    
        links = links.filter(url =>{
            return url != null || undefined;
        })
    
        links = links.filter(url =>{
            return url.startsWith('http');
        })

        links = links.filter(url =>{
            return validURL(url);
        });
        
        return links;
    }else{
        return null;
    }

}

const validURL = (str) => {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

module.exports = getLinks;