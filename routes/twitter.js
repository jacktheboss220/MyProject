const express = require('express');
const twitter = express.Router();
const twitterGetUrl = require("twitter-url-direct");
//-------------------------------------------------------------------------------------------------------------//
twitter.get('/', (req, res) => {
    res.render('twitter');
})
//-------------------------------------------------------------------------------------------------------------//
twitter.get('/submit', (req, res) => {
    const qua = req.query.q;

    if (!qua.startsWith('https://twitter.com')) {
        res.render('error', {
            text: "Provide the twitter URL only!!"
        })
    }
    (async () => {
        await twitterGetUrl(qua).then(response => {
            console.log(response);
            if (response.found == 'false') {
                res.render('error', {
                    text: "Unable to download the given post. Try different"
                })
            } else {
                if (response.type == 'video/gif') {
                    data = response.download[response.download.length - 1]
                    res.render("twtRender", {
                        download: data.url,
                        image: false
                    })
                } else if (response.type == 'image') {
                    res.render("twtRender", {
                        download: response.download,
                        image: true
                    })
                }
            }
        });
    })();
})
//-------------------------------------------------------------------------------------------------------------//
module.exports = twitter;
//-------------------------------------------------------------------------------------------------------------//