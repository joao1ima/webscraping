const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user:'root',
    database: 'blog'

});

function saveAll(unitData){
    let content = {
        title: unitData.articleTitle,
        lead: unitData.artileLead,
        date: unitData.articleDate
    }

    pool.getConnection( function(err, connection){
        if(err) throw err;
        connection.query('INSERT INTO noticias set ?', content, function(err, result, fields){
            console.log(content);
            connection.release();
            if(err) throw err;
        })
    })
}

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
            let dataBlog = { articleTitle, artileLead, articleDate }
            saveAll(dataBlog);
        })
}


async function main() {
    const unitUrl = await links
    unitUrl.map(i => {
        extractData(i)
    })
}

main()