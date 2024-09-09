function getMonthNumber(monthName) {
    const months = {
        "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
        "jul": "07", "aug": "08", "sep": "09", "oct": "10", "nov": "11", "dec": "12",
        "january": "01", "february": "02", "march": "03", "april": "04", "may": "05", 
        "june": "06", "july": "07", "august": "08", "september": "09", "october": "10", 
        "november": "11", "december": "12"
    };

     const cleanedMonthName = monthName.trim().toLowerCase();
    if (months.hasOwnProperty(cleanedMonthName)) {
        return months[cleanedMonthName];
    } else {
        return monthName;
    }
}

function checkDateFormat(dateString) {
    // Regular expressions to match yyyy-mm-dd and dd-mm-yyyy formats
    const yyyy_mm_dd_regex = /^\d{4}-\d{2}-\d{2}$/;
    const dd_mm_yyyy_regex = /^\d{2}-\d{2}-\d{4}$/;

    if (yyyy_mm_dd_regex.test(dateString)) {
        return true
    } else if (dd_mm_yyyy_regex.test(dateString)) {
        return false
    } else {
        return false
    }
}
const formatDate = (inputDate) => {
    if (!inputDate || inputDate === undefined || inputDate === null
    || inputDate === "undefined" || inputDate === "null" ||
    inputDate === "") return ""; // Check if inputDate is falsy
    if(checkDateFormat(inputDate))
     return inputDate;

    let dateParts = inputDate.split(/[-/ ]/);
    let year, month, day;

    if (dateParts.length === 3) {
        // Case: dd/mm/yyyy or dd-mm-yyyy
        day = dateParts[0];
        month = getMonthNumber(dateParts[1]);
        year = dateParts[2];
    } else if (dateParts.length === 2 && dateParts[1].length === 4) {
        // Case: jan-yyyy or jan/yyyy
        day = '01'; // Assuming the first day of the month
        month = getMonthNumber(dateParts[0]);
        year = dateParts[1];
    } else if (dateParts.length === 3 && isNaN(dateParts[1])) {
        // Case: dd-jan-yyyy
        day = dateParts[0];
        month = getMonthNumber(dateParts[1]);
        year = dateParts[2];
    } else {
        return "";
    }

    day = day.padStart(2, '0');
    month = month.padStart(2, '0');

    console.log(inputDate,`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
}

module.exports = { formatDate };
