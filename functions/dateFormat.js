const moment = require("moment");

module.exports = {
  getDate: function(dateTime) {
    return moment(dateTime).format("DD-MM-YYYY - HH:mm");
  },
  getTime: function(dateTime) {
    return moment(dateTime).format("HH:mm:ss");
  }
};
