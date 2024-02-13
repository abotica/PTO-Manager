let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()

const day = document.getElementById("calendar-dates")
const currDate = document.getElementById("calendar-current-date")
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
    let dayOne = new Date(year, month, 1).getDay();
 
    // Get the last date of the month
    let lastDate = new Date(year, month + 1, 0).getDate();
 
    // Get the day of the last date of the month
    let dayEnd = new Date(year, month, lastDate).getDay();
 
    // Get the last date of the previous month
    let monthLastDate = new Date(year, month, 0).getDate();
 
    // Variable to store the generated calendar HTML
    let lit = "";
 
    // Loop to add the last dates of the previous month
    for (let i = dayOne; i > 0; i--) {
        lit +=
            `<li class="inactive">${monthLastDate - i + 1}</li>`;
    }
 
    // Loop to add the dates of the current month
    for (let i = 1; i <= lastDate; i++) {
 
        // Check if the current date is today
        let isToday = i === date.getDate()
            && month === new Date().getMonth()
            && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}">${i}</li>`;
    }
 
    // Loop to add the first dates of the next month
    for (let i = dayEnd; i < 6; i++) {
        lit += `<li class="inactive">${i - dayEnd + 1}</li>`
    }
 
    // Update the text of the current date element 
    // with the formatted current month and year
    currDate.innerText = `${months[month]} ${year}`;
 
    // update the HTML of the dates element 
    // with the generated calendar
    day.innerHTML = lit;
}
 
createCalendar();
 
// Attach a click event listener to each icon
prevNext.forEach(icon => {
 
    // When an icon is clicked
    icon.addEventListener("click", () => {
 
        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
 
        // Check if the month is out of range
        if (month < 0 || month > 11) {
 
            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate());
 
            // Set the year to the new year
            year = date.getFullYear();
 
            // Set the month to the new month
            month = date.getMonth();
        }
 
        else {
 
            // Set the date to the current date
            date = new Date();
        }
 
        // Call the createCalendar function to 
        // update the calendar display
        createCalendar();
    });
});