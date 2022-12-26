export const DatetimeToUnix = (date: Date, addDay: number = 1) => {
    date.setUTCHours(0, 0, 0, 0);
    let nextDate = date;
    nextDate.setUTCHours(23, 59, 59, 999);
    nextDate.setDate(date.getDate() + addDay);
    return Math.floor(nextDate.getTime() / 1000)
}