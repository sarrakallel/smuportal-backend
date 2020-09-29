const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255
  },
});

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255
  },
  desc: {
    type: String,
    required: true,
    min: 10,
    max: 255
  },
  _roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  features: [featureSchema]
});

module.exports = mongoose.model("App", appSchema);
