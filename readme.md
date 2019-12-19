# `get-all-links`
### Fetch all links of website from one point of website with depth control

### Example:

```javascript
const {Spider} = require('./index')
const getAllLinks  = new Spider({
    depth: 3,
    url : "https://www.medanta.org",
    onSuccess : console.log,
    onFailure : console.log,
    onFinsh : (data) => console.log(data) 
})

getAllLinks.crawl()
```
---

### Options
| Parameter        | Required           | Functionality  |
| :------------- |:---------------------|:-----|
| depth      | NO | level of pages it goes inside the website from starting point <br> Default <b>2</b>|
| url| YES     |  Starting point |
| onSuccess| No     |  callback on every link fetched with url as parameter, |
| onFailure| No     |  callback on error for specific link, retruns error object |
| onFinsh | YES     |  callback on finsh. |


---
If you find this project useful, please star on github

[![GitHub stars](https://img.shields.io/github/stars/tterb/playmusic.svg?style=social&label=Star)](https://github.com/spurushottam13/get-all-links)