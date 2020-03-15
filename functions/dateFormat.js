const moment = require("moment");

module.exports = {
  getDate: function(dateTime) {
    return moment(dateTime).format("DD-MM-YYYY - HH:mm");
  },
  getMinimalDate: function(dateTime) {
    return moment(dateTime).format("DD-MM-YYYY");
  },
  getTime: function(dateTime) {
    return moment(dateTime).format("HH:mm:ss");
  },
  formatUptime: function(sec) {
    let days = Math.floor(sec / (60 * 60 * 24));
    let hours = Math.floor(sec / (60 * 60));
    let minutes = Math.floor((sec % (60 * 60)) / 60);
    let seconds = Math.floor(sec % 60);

    return (
      this.pad(days) +
      ":" +
      this.pad(hours) +
      ":" +
      this.pad(minutes) +
      ":" +
      this.pad(seconds)
    );
  },
  pad: function(s) {
    return (s < 10 ? "0" : "") + s;
  },
  leadPad: function(s) {
    return (s < 10 ? "000" : "") + s;
  }
};
