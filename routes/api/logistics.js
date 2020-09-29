const Router = require("express").Router;
const userService = require("../../services/user.service")();
const logisticsService = require("../../services/logistics.service")();
const { verifyToken } = require("../../helpers/verifyToken");
const sortings = require("../../helpers/sortings")();
const timHelper = require("../../helpers/timeHelper")();
const moment = require("moment");
const { boxBookingConfirmation, transporter } = require("../../helpers/mailer");

const router = Router({ mergeParams: true });

// This is the old route that returns everything
// router.get("/departments", verifyToken, async (req, res) => {
//   let departments = await logisticsService.getOverallDepartments();
//   return res.send(departments);
// });

// Route that returns dept+floors
router.get("/depts", verifyToken, async (req, res) => {
  let depts = await logisticsService.getDeptsAndFloors();
  let sortedDepts = sortings.lexicographical(depts);
  let sortedBoxes = sortings.lexicographicalSubArray(sortedDepts, "floors");
  return res.send(sortedBoxes);
});

// Route that returns for a specific department, a specific floor and a specific date the bookings
/**
 * 1 - Get the boxes' bookings with the specified date
 * 2- Get remaining boxes and empty their bookings array
 * 3- Merge
 * 4- Sort
 * 5- Return
 */
router.get(
  "/depts/:dep/floors/:floor/booking",
  verifyToken,
  async (req, res) => {
    let queryRes = await logisticsService.getBookings(
      req.params.dep,
      req.params.floor,
      req.query.date
    );
    let boxes = queryRes[0].floors[0].boxes;
    let sortedBoxes = sortings.lexicographical(boxes);
    return res.status(200).send(sortedBoxes);
  }
);

/**
 * Requirements of a box reservation.
 * 1 - Within opening hours
 * 2 - Should be maximum 3h
 * 3 - Does not have conflict with other bookings during that time interval
 * 4- A user cannot make a box reservation more than once per day
 *
 */
router.post("/book/:boxid", verifyToken, async (req, res) => {
  let user = await userService.getUserById(req.decodedToken._id);
  // check if start/end time in [8:00 , 19:00]
  // 1140 = 19h
  // 480 = 8h
  // 180 = 3h (duration)
  let startTime = parseInt(req.body.startTime);
  let endTime = parseInt(req.body.endTime);
  // Check if endTime > startTime
  if (startTime >= endTime) {
    return res.status(409).send({
      success: false,
      message: "Start time must be less than end time"
    });
  }
  if (endTime > 1140 || startTime < 480) {
    return res.status(409).send({
      success: false,
      message: "Reservation is not within opening hours"
    });
  }
  if (endTime - startTime > 180) {
    return res.status(409).send({
      success: false,
      message: "Reservation should not exceed 3 hours"
    });
  }
  // Check if the user has already booked a box today
  let userBooking = await logisticsService.getUserBoxBookingsByDate(
    req.query.date,
    user._id
  );
  if (userBooking.length >= 1) {
    return res.status(409).send({
      success: false,
      message: "User is allowed to book only once per day"
    });
  }
  // Check if the box has a booking that is in conflict with desired reservation
  // Fetch all bookings of that box during that day
  let boxBookings = await logisticsService.getBoxBookings(
    req.params.boxid,
    req.query.date
  );
  boxBookings.forEach(booking => {
    if (
      (startTime >= booking.startTime && startTime < booking.endTime) ||
      (booking.startTime >= startTime && booking.startTime < endTime)
    ) {
      return res.status(409).send({
        success: false,
        message: "The reservation has a conflict with another reservation"
      });
    }
  });
  // If reservation passes all tests, then we need to create it
  await logisticsService.createBooking(
    req.params.boxid,
    user,
    req.query.date,
    startTime,
    endTime
  );
  // Send email confirmation to the user
  let userFullName = user.firstName + " " + user.lastName;
  let userEmail = user.email;
  let boxInfo = await logisticsService.getBoxInfo(req.params.boxid);
  let boxName = boxInfo.floorId.name + "" + boxInfo.name;
  // TODO: add callback function to get errors
  transporter.sendMail(
    boxBookingConfirmation(
      userFullName,
      userEmail,
      boxName,
      req.query.date,
      timHelper.getTimeFromMins(startTime),
      timHelper.getTimeFromMins(endTime)
    ).sendBoxConfirmation()
  );
  // Return result to the client side
  return res.status(200).send({
    success: true,
    message: `Box ${boxName} has been successfully booked from ${timHelper.getTimeFromMins(
      startTime
    )} until ${timHelper.getTimeFromMins(endTime)} `
  });
});

// Route that returns bookings of a box within a specific date.
router.get("/box/:boxid/booking", verifyToken, async (req, res) => {
  let query = await logisticsService.getBoxBookingsOrdered(
    req.params.boxid,
    req.query.date
  );
  if (query.length >= 1) {
    return res.status(200).send(query[0].bookings);
  } else {
    return res.status(200).send(query);
  }
});

// Route that return a box basic information
router.get("/box/:boxid/info", async (req, res) => {
  let boxInfo = await logisticsService.getBoxInfo(req.params.boxid);
  return res.status(200).send(boxInfo);
});
module.exports = router;
