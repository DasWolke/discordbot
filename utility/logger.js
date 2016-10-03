/**
 * Created by julia on 19.09.2016.
 */
var logger;
var setT = (t) => {
    logger = t;
};
var getT = () => {
    return logger;
};
module.exports = {setT:setT, getT:getT};
