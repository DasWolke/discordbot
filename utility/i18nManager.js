/**
 * Created by julia on 18.09.2016.
 */
var i18nBean;
var setT = (t) => {
    i18nBean = t;
};
var getT = () => {
    return i18nBean;
};
module.exports = {setT:setT, getT:getT};