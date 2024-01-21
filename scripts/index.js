// Importing functions from module
import { getCookieValue } from "./cookie-functions.js"

/*
 The main reason why I decided to use 'location.replace' instead of anchors for navigating
 between login and index page is that it removes the page from document history.
 It means that when logged in user will not be able to go back to login page because
 there is no need to anyway.
 User will be able to see login page again when logged out.
*/

// This will execute when there is no cookie on webpage
// That includes running webpage for the first time to ensure login.html shows first
if (getCookieValue("isLoggedIn") == "") {
    // Redirect to login.html
    window.location.replace("/pages/login.html")
}

// If statement did not execute continue normally on index.html
