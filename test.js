/**
 *  TEST SCRIPT
 */

const {Spider} = require('./index')
console.log(Spider)
const getAllLinks  = Spider({
    depth: 2,
    currentURL : "https://www.medanta.org/",
    onSuccess : console.log,
    onFailure : console.log,
    onFinsh : (data) => console.log(data.length) 
})

getAllLinks.crawl()