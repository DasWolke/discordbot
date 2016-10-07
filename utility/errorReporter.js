/**
 * Created by julia on 18.09.2016.
 */
var errorBean;
var setT = (t) => {
    errorBean = t;
};
var getT = () => {
    return errorBean;
};
module.exports = {setT:setT, getT:getT};/**
 * Created by julia on 19.09.2016.
 */
