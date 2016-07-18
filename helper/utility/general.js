/**
 * Created by julia on 18.07.2016.
 */
var random = function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
var convertSeconds = function (s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
};
module.exports = {random: random, convertSeconds:convertSeconds};