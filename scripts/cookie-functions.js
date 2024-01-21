// THIS IS A MODULE THAT CONTAINS FUNCTIONS USED FOR HANDLING COOKIES

// Get cookie value
export function getCookieValue(cookieName) {
    // To get "isLoggedIn=" substring from cookie
    const cname = cookieName + "="
    // Array of substrings from cookie, gets individual parts of cookie (key-value pairs) divided by ";"
    const cookieArray = document.cookie.split(";")
    // Read through array to find value of cookie
    for (let i = 0; i < cookieArray.length; i++) {
        // Read each array element (key-value pair)
        let arrayElement = cookieArray[i]

        // Remove spaces if they exist
        while (arrayElement.charAt(0) == " ") {
            arrayElement = arrayElement.substring(1)
        }

        // Extract cookie value
        if (arrayElement.indexOf(cname) == 0) {
            return arrayElement.substring(cname.length, arrayElement.length)
        }
    }

    // If cookie with given name is not found return empty string
    return ""
}

// Function to calculate a week from current date and time
export function calculateWeekFromNow() {
    // Saves current date and time to variable
    const weekFromNow = new Date()
    // GetDate() returns day of the month
    // We add 7 to get a day week from current date
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    // Convert UTC date to UTC string so that we can use it in cookie
    return weekFromNow.toUTCString()
}