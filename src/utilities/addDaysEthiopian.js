// Function to determine if a given Ethiopian year is a leap year
const isLeapYear = (year) => {
     return year % 4 === 3; // Leap year every 4 years (0, 4, 8, 12, etc.)
};

export const addDaysEthiopian = (dateString, daysToAdd) => {
     // Parse the custom date format 'DD-MM-YYYY'
     const [day, month, year] = dateString.split('-').map(Number);

     let totalDays = day + daysToAdd;
     let newMonth = month;
     let newYear = year;

     // Loop until all days are added
     while (true) {
          // Calculate the number of days in the current month
          const daysInCurrentMonth = (newMonth === 13) ? (isLeapYear(newYear) ? 6 : 5) : 30;

          // Check if totalDays fits within the current month
          if (totalDays <= daysInCurrentMonth) {
               break; // If it fits, we're done
          }

          // Otherwise, subtract the days in the current month and move to the next month
          totalDays -= daysInCurrentMonth;
          newMonth += 1;

          // If we exceed the 13th month, roll over to the next year
          if (newMonth > 13) {
               newMonth = 1;
               newYear += 1;
          }
     }

     // Format the resulting date as 'DD-MM-YYYY'
     const formattedDate = `${String(totalDays).padStart(2, '0')}-${String(newMonth).padStart(2, '0')}-${newYear}`;
     return formattedDate;
}