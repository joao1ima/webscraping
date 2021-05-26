const axios = require('axios');
const { load } = require('cheerio');
const cheerio = require('cheerio');

const fatherUrl = 'https://www.gov.br/pt-br/noticias/ultimas-noticias'

axios.get(fatherUrl)
    .then(resp =>{
        let htmlData = resp.data;
        let Alldata = [];
        let $ = cheerio.load(htmlData);
        $('a[class="summary url"]').each((i,e)=>{
            let summaryLink = $(e).attr('href');
            
        })
    })
