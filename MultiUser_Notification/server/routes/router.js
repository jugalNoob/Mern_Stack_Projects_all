const express = require("express");


const Goodmorning = require("../controller/GoodMorning");


const router = express.Router();


router.get('/v1/signup', Goodmorning.Good_Morn)



module.exports = router;