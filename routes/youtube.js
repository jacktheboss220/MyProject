//-------------------------------------------------------------------------------------------------------------//
const axios = require('axios')
const express = require('express')
const youtube = express.Router();
const path = require('path')
//-------------------------------------------------------------------------------------------------------------//
youtube.get('/', (req, res) => {
    res.render('youtube');
})
//-------------------------------------------------------------------------------------------------------------//
youtube.get('/submit', (req, res) => {
    const qua = { video_link: `${req.query.q}` };
    //-------------------------------------------------------------------------------------------------------------//
    const querystring = require('querystring');
    const ytUrl = "https://social-downloader-i01.herokuapp.com/api/youtube";
    (async () => {
        try {
            const resV = await axios.get(ytUrl + "/video?" + querystring.stringify(qua));
            const resA = await axios.get(ytUrl + "/audio?" + querystring.stringify(qua));
            let YTtitle = resV.data.body.meta.title;
            let found = false, k;
            if (resV.data.body.hasOwnProperty("diffConverter")) {
                video = resV.data.body.diffConverter;
                found = true;
            }
            if (resA.data.body.hasOwnProperty("diffConverter")) {
                audio = resV.data.body.diffConverter;
            }
            for (let i = 0; i < resV.data.body.url.length; i++) {
                if (
                    resV.data.body.url[i].quality == 720
                    && resV.data.body.url[i].no_audio == false
                ) {
                    if (found == false) {
                        found = true;
                        video = resV.data.body.url[i].url
                    }
                } else if
                    (
                    resV.data.body.url[i].quality == 360
                    && resV.data.body.url[i].no_audio == false
                ) {
                    if (found == false) {
                        k = i;
                    }
                }
            }
            if (found == false) {
                video = resV.data.body.url[k].url
            }
            // return video;
            res.render('ytRender', {
                image: resV.data.body.thumb || resA.data.body.thumb,
                title: YTtitle,
                video: video,
                audio: audio
            })
        } catch {
            // return -1;
            res.send("error")
        }
    })();
})
//-------------------------------------------------------------------------------------------------------------//
module.exports = youtube;