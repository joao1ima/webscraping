const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');


const jsonData = path.join('dadosJson.jason');

//console.log(jsonData);

const fatherUrl = 'https://www.gov.br/pt-br/noticias/ultimas-noticias'

const links = axios.get(fatherUrl)
    .then(resp => {
        let htmlData = resp.data;
        let allData = [];
        let $ = cheerio.load(htmlData);
        $('a[class="summary url"]').each((i, e) => {
            let summaryLink = $(e).attr('href');
            allData.push(summaryLink);
        })
        return allData;
    })


function extractData(link) {
    axios.get(link)
        .then(resp => {
            let htmlAll = resp.data;
            let $ = cheerio.load(htmlAll);
            let articleTitle = $('h1').text();
            let artileLead = $('div[class="documentDescription"]').text();
            let articleDate = $('span[class="value"]').text();
            let dataBlog = {articleTitle, artileLead, articleDate}

            let novinhoDado = JSON.stringify(dataBlog);
            fs.appendFileSync(jsonData, novinhoDado);           
            
        })
}


async function main() {
    const unitUrl = await links
    unitUrl.map(i => {
        extractData(i)
    })
}

main()

setTimeout(()=>{ 
    console.log('Cadastros realizados com sucesso!');
}, 10000);
