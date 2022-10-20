"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeason = exports.SeasonType = void 0;
const date_fns_1 = require("date-fns");
// TODO make it change based on hemisphere ( ie swap winter and summer)
var SeasonType;
(function (SeasonType) {
    SeasonType["WINTER"] = "WINTER";
    SeasonType["SPRING"] = "SPRING";
    SeasonType["SUMMER"] = "SUMMER";
    SeasonType["FALL"] = "FALL";
})(SeasonType = exports.SeasonType || (exports.SeasonType = {}));
const getSeason = (dateInSecs) => {
    const month = (0, date_fns_1.getMonth)(new Date(dateInSecs * 1000));
    const seasons = [
        SeasonType.WINTER,
        SeasonType.WINTER,
        SeasonType.SPRING,
        SeasonType.SPRING,
        SeasonType.SPRING,
        SeasonType.SUMMER,
        SeasonType.SUMMER,
        SeasonType.SUMMER,
        SeasonType.FALL,
        SeasonType.FALL,
        SeasonType.FALL,
        SeasonType.WINTER,
    ];
    return seasons[month];
};
exports.getSeason = getSeason;
//# sourceMappingURL=dateUtils.js.map