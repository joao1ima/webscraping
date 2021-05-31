const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const blog = require('./schema-mdb')
const senha = require('./ps-mdb');

mongoose.connect(`mongodb+srv://joao1ima:${senha}@cluster0.lmwvw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(result =>{
        console.log('Conexão estabelecida com sucesso!')
    }).catch(error =>{
        console.log(`Deu esse erro: ${error}`)
    })

function salveData (dt){
    const newData = new blog({
        title: dt.articleTitle,
        lead: dt.artileLead,
        date: dt.articleDate
    });
    newData
        .save();
}   


function extractData(link) {
    axios.get(link)
        .then(resp => {
            let htmlAll = resp.data;
            let $ = cheerio.load(htmlAll);
            let articleTitle = $('h1').text();
            let artileLead = $('div[class="documentDescription"]').text();
            let articleDate = $('span[class="value"]').text();
            let dataBlog = { articleTitle, artileLead, articleDate }
            salveData(dataBlog);
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

async function main() {
    const unitUrl = await links
    unitUrl.map(i => {
        extractData(i)
    })
}

main()

// setTimeout(()=>{ 
//     pool.end();
//     console.log('Cadastros realizados com sucesso!');
// }, 25000);
