//-------------------------------------------------------------------------------------------------------------//
const express = require('express')
const youtube = express.Router();
//-------------------------------------------------------------------------------------------------------------//
const youtubedl = require('youtube-dl-exec')
const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` };

//-------------------------------------------------------------------------------------------------------------//
youtube.get('/', (req, res) => {
    res.render('youtube');
})
//-------------------------------------------------------------------------------------------------------------//
youtube.get('/submit', (req, res) => {
    const qua = { video_link: `${req.query.q}` };
    try {
        let fileDown = getRandom(".mp4");
        youtubedl(qua.video_link, { format: 'mp4', output: "./data/video/" + fileDown }).then(() => {
            const steam = youtubedl.exec(qua.video_link, { format: "mp4", getFilename: true });
            steam.then((r) => {
                res.render('ytRender', {
                    title: r.stdout,
                    video: fileDown,
                });
            }).catch(err => {
                console.log(err);
                res.render('error')
            })
        }).catch(err => {
            console.log(err);
            res.send("error");
        })
    } catch (err) {
        console.log(err);
        res.send("error");
    }
})
//-------------------------------------------------------------------------------------------------------------//
module.exports = youtube;
//-------------------------------------------------------------------------------------------------------------//