const express = require("express");
const router = express.Router();

const get_io=require('../controller/Get_Io')



// ✅ Your GET route to fetch data from MongoDB
router.get('/home' ,  get_io.GetIo)


module.exports = router;