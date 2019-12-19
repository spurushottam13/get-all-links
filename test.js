/**
 *  TEST SCRIPT
*/

const {Spider} = require('./index')
const getAllLinks  = new Spider({
    depth: 3,
    url : "https://www.medanta.org",
    onSuccess : console.log,
    onFailure : console.log,
    onFinsh : (data) => console.log(data.length) 
})

getAllLinks.crawl()