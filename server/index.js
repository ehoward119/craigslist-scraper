const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const PORT = process.env.PORT || 3001;

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

app.get("/api", async (_, res) => {
    console.log('use post request');
    res.status(200);
});

app.post('/api', async (req, res) => {
    let {lat, lon} = req.params;
    const response = await fetch(`https://sfbay.craigslist.org/search/san-francisco-ca/apa?lat=${lat}&lon=${lon}&search_distance=8.3#search=1~gallery~0~0`);
    const text = await response.text();
    const dom = new JSDOM(text);
    const apartments = dom.window.document.querySelectorAll('li');
    const apartmentsList = Array.from(apartments).slice(1,11);
    const aptObjs = [];
    for await (const apartment of apartmentsList) {
        const link = apartment.querySelector('a')?.href;
        const title = apartment.querySelector('.title')?.textContent;
        let isDogFriendly = false;
        if (link) {
            const aptPage = await fetch(link);
            const aptText = await aptPage.text();
            const aptDom = new JSDOM(aptText);
            const attrs = aptDom.window.document.querySelector('.mapAndAttrs');
            isDogFriendly = attrs.textContent.indexOf('dogs are OK') > 0;
        }
        aptObjs.push({title, link, isDogFriendly});
    }
    res.json({ apartments: aptObjs});
})
   
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
