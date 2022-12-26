"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatetimeToUnix = void 0;
const DatetimeToUnix = (date, addDay = 1) => {
    date.setUTCHours(0, 0, 0, 0);
    let nextDate = date;
    nextDate.setUTCHours(23, 59, 59, 999);
    nextDate.setDate(date.getDate() + addDay);
    return Math.floor(nextDate.getTime() / 1000);
};
exports.DatetimeToUnix = DatetimeToUnix;
//# sourceMappingURL=helpers.js.map