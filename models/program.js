const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
    Name : {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    min: 10,
    max: 255,
    },

    Information :{
    type: String,
    min: 10,
    max: 255,
    },

    Country: {
    type: String,
    },

    University : {
    type: String,
    },

    Deadline  : {
    type: String,
    },
    
    GPA : {
    type: Number,
    min: 2.5,
    max: 4.0,
    },

    ProgramType : {
    type: String,
    }
});
module.exports = mongoose.model("Program", ProgramSchema);