const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 15,
    host: 'localhost',
    user:'root',
    database: 'blog'

});

function queryAll(unitData){
    let content = {
        title: unitData.articleTitle,
        lead: unitData.artileLead,
        date: unitData.articleDate
    }
    // novo pool vai aqui

    pool.getConnection( function(err, connection){
        if(err) throw err;
        connection.query('SELECT * FROM `noticias` WHERE `title` = ?', content.title, function(err, result, fields){
            let resultsLength = result.length;
            if (resultsLength === 0){
                salveAll(content);
                console.log('Cadastrando ... Aguarde!');
            } else{
                console.log ('Título(s) já cadastrado(s)');
            }
            if(err) throw err;
        })
    })
}


function salveAll(contentAll){
    pool.getConnection( function(err, connection){
        if(err) throw err;
        connection.query('INSERT INTO noticias set ?', contentAll, function(err, result, fields){
            //console.log(content);
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
            queryAll(dataBlog);
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
    pool.end();
    console.log('Cadastros realizados com sucesso!');
}, 25000);
