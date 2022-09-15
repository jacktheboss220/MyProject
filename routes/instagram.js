const express = require('express')
const insta = express.Router();
const path = require('path')
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
module.exports = insta;
//-------------------------------------------------------------------------------------------------------------//