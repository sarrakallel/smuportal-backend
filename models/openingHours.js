const mongoose = require("mongoose");

const openingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    unique: true,
    lowercase: true,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ],
    validate: {
      validator: async day =>
        (await OpeningHours.where({ day }).countDocuments()) === 0,
      message: "Day is already added"
    }
  },
  openingTime: {
    type: String,
    validate: {
      validator: startTime => {
        var timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;
        timeRegex.test(startTime);
      },
      message: startTime => `${startTime} is not a valid time format!`
    }
  },
  closingTime: {
    type: String,
    validate: {
      validator: endTime => {
        var timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;
        timeRegex.test(endTime);
      },
      message: endTime => `${endTime} is not a valid time format!`
    }
  },
  status: {
    type: String,
    lowercase: true,
    enum: ["open", "closed"],
    default: "open"
  }
});

openingHoursSchema.path("status").validate(function(status) {
  if (
    status.toLowerCase() === "closed" &&
    (this.openingTime || this.closingTime)
  ) {
    return false;
  }
  return true;
}, "Cannot set start or end time when closed");

const OpeningHours = mongoose.model("OpeningHours", openingHoursSchema);

module.exports = OpeningHours;
