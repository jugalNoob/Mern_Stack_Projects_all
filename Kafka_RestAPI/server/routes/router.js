const express = require("express");
const shortid = require("shortid");

const Register = require("../module/student");


const Createone=require("../controller/Create")

const Getone=require("../controller/Get")

const Updateone=require("../controller/Update")

const Deleteone=require("../controller/Delete")

const GetAdvance=require("../controller/AdvanceGet")


const router = express.Router();

// Initialize Kafka Producer
// initProducer();


// API versioning and route
//post information
router.post('/v1/signup', Createone.UserCreate)


//get information about
router.get("/v2/DataGet",Getone.usersGet) //http://localhost:9000/v2/Dataget/45


router.get("/v2/AdGet",GetAdvance.Advanceusers ) //http://localhost:9000/v2/Dataget/45




// Update  information 
router.patch("/updates/:id",Updateone.updatesAll)


//delete Information about

router.delete("/v1/delId/:id/:name",Deleteone.deleteuser)


module.exports = router;