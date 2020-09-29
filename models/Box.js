const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    day: {
      type: String, // format : MM/DD/YYYY
      required: true
    },
    startTime: {
      type: Number,
      required: true
    },
    endTime: {
      type: Number,
      required: true,
      validate: {
        validator: endTime => {
          return !this.startTime <= endTime;
        },
        message: endTime => `endTime must be larger than startTime`
      }
    },
    boxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Box"
    }
  },
  { strict: false }
);

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
    required: true
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }]
});

boxSchema.path("name").validate(async function(name) {
  const boxExists = await Box.exists({
    name: name,
    floorId: this.floorId
  });
  if (boxExists) return false;
  return true;
}, "Boxes with the same name cannot be on the same floor");

const Box = mongoose.model("Box", boxSchema);

module.exports = {
  Box: Box,
  Booking: mongoose.model("Booking", bookingSchema)
};
