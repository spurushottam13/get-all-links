/**
 *  TEST SCRIPT
 */

const {Spider} = require('./index')
console.log(Spider)
const getAllLinks  = new Spider({
    depth: 3,
    url : "https://www.medanta.org",
    onSuccess : console.log,
    onFailure : console.log,
    onFinsh : (data) => console.log(data.length) 
})

getAllLinks.crawl().then( _ => console.log("Done", _))