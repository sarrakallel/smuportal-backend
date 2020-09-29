const { Floor, Department } = require("./Department");
const { Box, Booking } = require("./Box");
const OpeningHours = require("./openingHours");
const mongoose = require("mongoose");
const moment = require("moment");

function populateDepartment() {
  B0 = Floor({ name: "B0", capacity: 7 });
  B1 = Floor({ name: "B1", capacity: 10 });
  BM = Floor({ name: "BM", capacity: 7 });
  A1 = Floor({ name: "A1", capacity: 8 });
  MedTech = new Department({ name: "MedTech" });
  MedTech.floors.push(B0, B1, BM);

  MSB = new Department({ name: "MSB" });
  MSB.floors.push(A1);
  try {
    MedTech.save();
    MSB.save();
    B0.save();
    B1.save();
    BM.save();
    A1.save();
  } catch (err) {
    console.log(err);
  }
}

async function addBoxes(floor, start, end) {
  for (let i = start; i < end; i++) {
    let box = await Box.create({
      name: "B" + i.toString().padStart(2, 0),
      floorId: floor._id
    });
    floor.boxes.push(box._id);
  }
  await floor.save();
}

async function populateBoxes() {
  Floor.findOne({ name: "B0" }).then(floor => {
    addBoxes(floor, 1, 8).then();
  });
  Floor.findOne({ name: "B1" }).then(floor => {
    addBoxes(floor, 1, 11).then();
  });
  Floor.findOne({ name: "BM" }).then(floor => {
    addBoxes(floor, 1, 8).then();
  });
  Floor.findOne({ name: "A1" }).then(floor => {
    addBoxes(floor, 1, 10).then();
  });
}

function populateOpeningHours() {
  OpeningHours.create({
    day: "Monday",
    openingTime: "08:00",
    closingTime: "20:00"
  });
  OpeningHours.create({
    day: "Tuesday",
    openingTime: "08:00",
    closingTime: "20:00"
  });
  OpeningHours.create({
    day: "Wednesday",
    openingTime: "08:00",
    closingTime: "20:00"
  });
  OpeningHours.create({
    day: "Thursday",
    openingTime: "08:00",
    closingTime: "20:00"
  });
  OpeningHours.create({
    day: "Friday",
    openingTime: "08:00",
    closingTime: "20:00"
  });
  OpeningHours.create({
    day: "Saturday",
    openingTime: "09:00",
    closingTime: "18:00"
  });
  OpeningHours.create({
    day: "Sunday",
    status: "closed"
  });
}

async function populateBookings(boxID) {
  let booking1 = new Booking({
    user: mongoose.Types.ObjectId("5e5bf00f2ef91010c4ddcdce"),
    startTime: moment("16:30: AM", "HH:mm: A").diff(
      moment().startOf("day"),
      "minutes"
    ), // Using momentjs to calculate the nb of seconds from midnight until the specified date
    endTime: moment("18:30: PM", "HH:mm: A").diff(
      moment().startOf("day"),
      "minutes"
    ),
    day: moment().format("MM-DD-YYYY"),
    boxId: mongoose.Types.ObjectId(boxID)
  });
  await booking1.save().then(docs => {
    Box.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(docs.boxId) },
      { $push: { bookings: docs } },
      { new: true },
      (err, result) => {
        console.log(result);
      }
    );
  });
}

// Do not execute the two first at the same time, for some reason floors are not created yet during the second call.
//populateDepartment();
//populateBoxes();
//populateOpeningHours();
//populateBookings("5e651fad3407c839a05ee64e");
//populateBookings("5e651fad3407c839a05ee654");
