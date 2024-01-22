// Importing functions from module
import { getCookieValue } from "./cookie-functions.js"

const logOutButton = document.getElementById("logout-button")

// Treated as the popup screen because it is its parrent div
const popupAlignmentDiv = document.getElementById("popup-alignment-div")

//Fetching data from 





/*
 The main reason why I decided to use 'location.replace' instead of anchors for navigating
 between login and index page is that it removes the page from document history.
 It means that when logged in user will not be able to go back to login page because
 there is no need to anyway.
 User will be able to see login page again when logged out.
*/

// This will execute when there is no cookie on webpage
// That includes running webpage for the first time to ensure login.html shows first
// If statement did not execute continue normally on index.html
if (getCookieValue("isLoggedIn") == "") {
    // Redirect to login.html
    window.location.replace("/pages/login.html")
}

// If logout button is clicked display popup screen
logOutButton.onclick = () => {
    popupAlignmentDiv.style.display = "flex"

    // Get yes and no buttons from popup screen
    const yesButton = document.getElementById("logout-accept")
    const noButton = document.getElementById("logout-decline")

    yesButton.onclick = () => {
        // Logout user by deleting cookie (set it to past date)
        document.cookie = "isLoggedIn=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        window.location.reload()
    }
    noButton.onclick = () => {
        // Hide popup screen
        popupAlignmentDiv.style.display = "none"
    }
}


