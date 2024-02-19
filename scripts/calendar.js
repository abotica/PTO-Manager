// Get the current date
let date = new Date()
// Extract year from the current date
let year = date.getFullYear()
// Extract month from the current date
let month = date.getMonth()

// Get the unordered list where days of the month will be inserted dynamically
const day = document.getElementById("calendar-dates")
// Get the paragraph element where current month and year will be inserted dynamically
const currDate = document.getElementById("calendar-current-date")
// Get all span elements from div and return them as a NodeList
const prevNext = document.querySelectorAll("#calendar-nav span")

// Create an array of months
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

// Function to generate the calendar
const createCalendar = () => {
 
    // Get the first day of the month
    let dayOne = new Date(year, month, 1).getDay()
 
    // Get the last date of the month
    let lastDate = new Date(year, month + 1, 0).getDate()
 
    // Get the day of the last date of the month
    let dayEnd = new Date(year, month, lastDate).getDay()
 
    // Get the last date of the previous month
    let monthLastDate = new Date(year, month, 0).getDate()
 
    // Variable to store the generated calendar HTML
    let html = ""
 
    // Loop to add the last dates of the previous month (the inactive ones which are not part of the current month)
    for (let i = dayOne; i > 0; i--) {
        html += `<li class="inactive">${monthLastDate - i + 1}</li>`
    }
 
    // Add dates of the current month
    for (let i = 1; i <= lastDate; i++) {
 
        // Check if the current date is today
        let isToday = i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "active" : ""

        html += `<li class="${isToday}">${i}</li>`
    }
 
    // Loop to add the first dates of the next month
    for (let i = dayEnd; i < 6; i++) {
        html += `<li class="inactive">${i - dayEnd + 1}</li>`
    }
 
    // Update the text of the current date element with the formatted current month and year
    currDate.innerText = `${months[month]} ${year}`
 
    // update the HTML of the dates element with the generated calendar
    day.innerHTML = html
}
// Call the createCalendar function to update the calendar display
createCalendar()
 
// Attach a click event listener to each icon
prevNext.forEach(icon => {
 
    // When an icon is clicked
    icon.addEventListener("click", () => {
 
        // Check if the icon is "calendar-prev" or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1
 
        // Check if the month is out of range
        if (month < 0 || month > 11) {
 
            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate())
 
            // Set the year to the new year
            year = date.getFullYear()
 
            // Set the month to the new month
            month = date.getMonth()
        }
        else {
 
            // Set the date to the current date
            date = new Date()
        }
 
        // Call the createCalendar function to update the calendar display
        createCalendar()
        // Call function to add listeners to shown days
        // addEventListenersToDates()
    })
})

// Function to add event listener to the first clicked day when making PTO and returns the selected date
export function addEventListenersToDates() {
    // Get all the list items (days shown on the calendar)
    const allCurrentlyShownDays = document.querySelectorAll("#calendar-dates li")
  
    // Return a new Promise that resolves with the selected date
    return new Promise(resolve => {
      // Attach event listener on each list item
      allCurrentlyShownDays.forEach(day => {

        const currentDateElement = document.getElementById("calendar-current-date")
        let currentMonthAndYear = currentDateElement.textContent.split(" ")
        let currentMonth = months.indexOf(currentMonthAndYear[0])
        let currentYear = Number(currentMonthAndYear[1])
        let currentDay = Number(day.textContent)

        // Using Date object again so that it calculates date correctly if, e.g., we click 30th December of the year before current year
        let clickedDate = new Date(currentYear, currentMonth, currentDay)
        let formattedDate = currentDay + " " + months[clickedDate.getMonth()] + " " + clickedDate.getFullYear()
  
        // This is used to identify if day belongs to month before or after
        // Calendar can show just some days that belong to inactive months so 15 is used like some middle value to calculate it, it does not need to be exact value of inactive days
        if (day.getAttribute("class") === "inactive") {
          if (currentDay >= 1 && currentDay < 15) {
            
            clickedDate = new Date(currentYear, currentMonth + 1, currentDay)
            formattedDate = currentDay + " " + months[clickedDate.getMonth()] + " " + clickedDate.getFullYear()
            

          } else if (currentDay > 15) {

            clickedDate = new Date(currentYear, currentMonth - 1, currentDay)
            formattedDate = currentDay + " " + months[clickedDate.getMonth()] + " " + clickedDate.getFullYear()
  
            
          }
        }
  
        


        // Add the click event listener to each day
        day.addEventListener("click", () => {

          // Resolve the promise with the selected date
          resolve(formattedDate);
        });

      });

    });
  }
  
  