/**
 * Created by julia on 18.07.2016.
 */
var cleanMessage = function (message) {
  return message.replace("@", "");
};
module.exports = {cleanMessage:cleanMessage};