
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
            text: "Provide Instagram Url Only.",
        })
    if (urlInsta.includes("?"))
        urlInsta = urlInsta.split("/?")[0];
    ig.fetchPost(urlInsta).then(async (r) => {
        for (let i = 0; i < r.media_count; i++) {
            if (r.links[i].type == "image") {
                const p = path.resolve(__dirname, '../data/images', r.links[i].id + ".jpg")
                const writer = fs.createWriteStream(p)
                const response = await axios({
                    url: r.links[i].url,
                    method: 'GET',
                    responseType: 'stream'
                })
                response.data.pipe(writer)
                dd.push({ image: r.links[i].id + '.jpg' })
            }
            if (r.links[i].type == "video") {
                const p = path.resolve(__dirname, '../data/images', r.links[i].id + ".mp4")
                const writer = fs.createWriteStream(p)
                const response = await axios({
                    url: r.links[i].url,
                    method: 'GET',
                    responseType: 'stream'
                })
                response.data.pipe(writer)
                dd.push({ video: r.links[i].id + '.mp4' })
            }
        }
        res.render('instaRender', {
            reels: true,
            url: dd
        })
    })
})
//-------------------------------------------------------------------------------------------------------------//
insta.get('/profile-picture/submit', (req, res) => {
    let user = req.query.q;
    if (user == '') {
        return res.render("error", {
            text: "Provide Instagram Url Only.",
        })
    }
    ig.fetchUser(user).then(async (r) => {
        const p = path.resolve(__dirname, '../data/images', r.id + ".jpg")
        const writer = fs.createWriteStream(p)
        const response = await axios({
            url: r.hd_profile_pic_url_info.url,
            method: 'GET',
            responseType: 'stream'
        })
        response.data.pipe(writer);
        res.render('instaRender', {
            profileUrl: r.id + ".jpg",
            username: r.fullname
        })
    });
})
module.exports = insta;
//-------------------------------------------------------------------------------------------------------------//