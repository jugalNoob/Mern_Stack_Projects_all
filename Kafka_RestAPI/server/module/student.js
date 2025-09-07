// const mongoose = require("mongoose");

// const shortid = require('shortid'); // Import shortid library

// // Define the student schema
// const studentSchema = new mongoose.Schema({
//     name: { type: String  ,required:true},
//     email: { type: String , required:true }, //unique email address
//     password: { type: String, required:true},
//     date: { type: Date, default: Date.now }, // Default date time
//     shortId: { type: String, unique: true }, // Ensure shortId is unique
// });



// const Register  = mongoose.model("Url", studentSchema);
// module.exports = Register ;



const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
   name: { type: String, required: true, unique: true },
   price:{type:Number , required: true},
   age:{type:Number , required: true},
   birthDate:{type:Date, required: true},
   bloodGroup:{type:String, required: true},
   email:{type:String, required: true},
   hobbies:{   type: [String], required: true},
   country:{type:String, required: true},
   bio:{type:String, required: true},

   gender:{type:String, required: true},
  date: {type: Date, default: Date.now ,required: true// Default value for date required: true
      },
});



const Register = new mongoose.model("Means", userSchema)
    // Error handler function
  module.exports = Register;




  // _id
// 6517918a4f599b5c0ef5f01e
// name
// "janad"
// price
// 100
// age
// 12
// birthDate
// "1996-5-30"
// bloodGroup
// "AB+"
// email
// "emily.johnson@x.dummyjson.com"

// hobbies
// Array (2)
// country
// "United States"
// bio
// "I am a actor and travling"
// isEligible
// false
// gender
// "female"