const { Department, Floor } = require("../models/Department");
const { Box, Booking } = require("../models/Box");
const mongoose = require("mongoose");

function logisticsService() {
  async function getBoxInfo(boxId) {
    return Box.findById(boxId)
      .select("-__v -bookings -_id")
      .populate({
        path: "floorId",
        select: "name -_id"
      });
  }
  // Function that returns the departments along with their floors
  // and the boxes within each floor
  async function getOverallDepartments() {
    const query = {};
    return (
      Department.find(query)
        // "-__[Field name]" to exclude fields after querying
        .select("-_id -__v")
        .populate({
          path: "floors",
          select: "-_id -__v",
          populate: {
            path: "boxes",
            select: "name -_id"
          }
        })
        .lean()
        .exec()
    );
  }

  async function getBoxesByFloorID(floorID) {
    const query = { floorId: floorID };
    return Box.find(query)
      .select("-_id -__v")
      .lean()
      .exec();
  }

  async function getDeptsAndFloors() {
    return Department.find({})
      .select("-__v")
      .populate({
        path: "floors",
        select: "-__v -boxes"
      })
      .lean()
      .exec();
  }

  async function getBookings(depID, floorID, date) {
    return Department.find({ _id: mongoose.Types.ObjectId(depID) })
      .select("floors -_id")
      .populate({
        path: "floors",
        select: "-__v -_id -name -capacity",
        match: { _id: floorID },
        populate: {
          path: "boxes",
          select: "bookings name",
          populate: {
            path: "bookings",
            match: { day: date }
          }
        }
      })
      .lean();
  }

  async function getBoxBookings(boxID, date) {
    return Booking.find({ boxId: mongoose.Types.ObjectId(boxID), day: date });
  }

  async function getUserBoxBookingsByDate(date, userID) {
    return Booking.find({ user: mongoose.Types.ObjectId(userID), day: date });
  }

  async function createBooking(boxId, user, day, startTime, endTime) {
    let booking = new Booking({
      user,
      startTime,
      endTime,
      day,
      boxId
    });
    await booking
      .save()
      .then(async docs => {
        await Box.updateOne(
          { _id: mongoose.Types.ObjectId(boxId) },
          { $push: { bookings: docs } }
        );
      })
      .catch(err => {
        throw err;
      });
  }
  /**
   * Returns bookings (array) of a specific box within a day in the following format
   * [
    {
        "_id": BoxID,
        "bookings": [
            {
                "startTime": ,
                "endTime": ,
                "day":
            },
            ...
        ]
    }
]
  */
  async function getBoxBookingsOrdered(boxID, date) {
    return Booking.aggregate([
      { $match: { boxId: mongoose.Types.ObjectId(boxID), day: { $eq: date } } },
      {
        $group: {
          _id: "$boxId",
          bookings: {
            $addToSet: {
              startTime: "$startTime",
              endTime: "$endTime",
              day: "$day"
            }
          }
        }
      }
    ]);
  }
  return {
    getBoxInfo,
    getOverallDepartments,
    getBoxesByFloorID,
    getDeptsAndFloors,
    getBookings,
    getBoxBookings,
    getUserBoxBookingsByDate,
    createBooking,
    getBoxBookingsOrdered
  };
}

module.exports = logisticsService;
