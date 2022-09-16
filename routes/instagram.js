
const express = require('express')
const insta = express.Router();
const path = require('path')
const axios = require('axios')
const fs = require('fs')
//-------------------------------------------------------------------------------------------------------------//
require('dotenv').config();
const INSTA_API_KEY = process.env.INSTA_API_KEY;
const { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi(INSTA_API_KEY);
ig.setCookie(INSTA_API_KEY);
//-------------------------------------------------------------------------------------------------------------//
insta.get('/reels', (req, res) => {
    res.render("instagram", {
        reels: true
    })
})
//-------------------------------------------------------------------------------------------------------------//
insta.get('/profile-picture', (req, res) => {
    res.render("instagram", {
        reels: false
    })
})
//-------------------------------------------------------------------------------------------------------------//
insta.get('/reels/submit', (req, res) => {
    let urlInsta = req.query.q;
    let dd = [];
    if (!(urlInsta.includes("instagram.com/p/") ||
        urlInsta.includes("instagram.com/reel/") ||
        urlInsta.includes("instagram.com/tv/")))
        return res.render("error", {
            insta: true,
            youtube: false,
            twitter: false
        })
    if (urlInsta.includes("?"))
        urlInsta = urlInsta.split("/?")[0];
    ig.fetchPost(urlInsta).then(async (r) => {
        for (let i = 0; i < r.media_count; i++) {
            const p = path.resolve(__dirname, '../data/images', r.links[i].id + ".jpg")
            const writer = fs.createWriteStream(p)
            const response = await axios({
                url: r.links[i].url,
                method: 'GET',
                responseType: 'stream'
            })
            response.data.pipe(writer)
            dd.push(r.links[i].id)
        }
        res.render('instaRender', {
            title: r.caption,
            url: dd,
            media: r.media_count
        })
    })
})
module.exports = insta;
//-------------------------------------------------------------------------------------------------------------//