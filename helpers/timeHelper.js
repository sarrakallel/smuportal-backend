const moment = require("moment");

function timHelper() {
  function getTimeFromMins(mins) {
    let h = (mins / 60) | 0,
      m = mins % 60 | 0;
    return moment
      .utc()
      .hours(h)
      .minutes(m)
      .format("hh:mm A");
  }
  return {
    getTimeFromMins
  };
}

module.exports = timHelper;
