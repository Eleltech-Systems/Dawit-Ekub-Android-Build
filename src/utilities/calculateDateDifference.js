// Parse Ethiopian date string DD-MM-YYYY
function parseEthDate(dateString) {
     const [day, month, year] = dateString.split("-").map(Number);
     return { day, month, year };
}


// Check Ethiopian leap year
function isLeapYear(year) {
     return year % 4 === 3;
}


// Get days in Ethiopian month
function getDaysInMonth(month, year) {
     if (month >= 1 && month <= 12) return 30;

     // Month 13 (Pagume)
     return isLeapYear(year) ? 6 : 5;
}


// Convert Ethiopian date to total days from year 0
function convertToTotalDays(day, month, year) {

     let totalDays = 0;

     // Add days from full years
     for (let y = 0; y < year; y++) {
          totalDays += isLeapYear(y) ? 366 : 365;
     }

     // Add days from full months in current year
     for (let m = 1; m < month; m++) {
          totalDays += getDaysInMonth(m, year);
     }

     // Add days in current month
     totalDays += day;

     return totalDays;
}


// Convert total days back to Ethiopian date
function convertDaysToEthDate(totalDays) {

     let year = 0;

     // Calculate year
     while (true) {
          const daysInYear = isLeapYear(year) ? 366 : 365;

          if (totalDays > daysInYear) {
               totalDays -= daysInYear;
               year++;
          } else {
               break;
          }
     }

     // Calculate month
     let month = 1;

     while (true) {
          const daysInMonth = getDaysInMonth(month, year);

          if (totalDays > daysInMonth) {
               totalDays -= daysInMonth;
               month++;
          } else {
               break;
          }
     }

     // Remaining days
     let day = totalDays;

     return { year, month, day };
}


// Main function to calculate difference
export function getEthiopianDateDifference(date1Str, date2Str) {

     const d1 = parseEthDate(date1Str);
     const d2 = parseEthDate(date2Str);

     const totalDays1 = convertToTotalDays(d1.day, d1.month, d1.year);
     const totalDays2 = convertToTotalDays(d2.day, d2.month, d2.year);

     let diffDays = Math.abs(totalDays2 - totalDays1);

     const result = convertDaysToEthDate(diffDays);

     const weeks = Math.floor(diffDays / 7);

     const totalMonths = Math.floor(diffDays / 30);

     return {
          years: result.year,
          months: result.month - 1,
          days: result.day,
          weeks,
          totalMonths
     };
}