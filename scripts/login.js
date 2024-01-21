// Importing functions from module
import { calculateWeekFromNow, getCookieValue } from "./cookie-functions.js"

// Gets email and password input fields from DOM
const emailField = document.getElementById("email-field")
const passwordField = document.getElementById("password-field")

// Gets login form from DOM
const loginForm = document.getElementById("login-form")

/*
Email regex explanation:
Metacharacter '\w' matches any one of word characters.
It is equal to character class [a-zA-Z0-9_].
Character class is used to match any one of characters within square brackets, e.g., class [ab] would match 'a' or 'b' but not 'ab' or 'aa'.
If we want to specify the range for characters we add a hyphen between start and end character (both included into the range), e.g., [a-z] would match 'c' or 'z'.
Class [a-zA-Z0-9_] would match any lower and upper case letter, any digit, and underscore, e.g., 'B', '_', or '2'.
If we want to match words and not single characters, we add the '+' occurrence indicator after the metacharacter '\w', e.g., \w+ would match 'andrija_b1' and 'a'.
We use round brackets to group sub-expressions.
Sub-expression ([.-]?\w+)* uses '*' occurrence indicator that matches 0 or more given characters and '?' occurrence indicator matching 0 or 1 given character.
That expression then matches 0 or more groups of characters containing one or zero '.' or '_' characters and one or more word characters, e.g., '.botica', 'botica', or '_Botica16'.
Regex also contains '@' character and will match strings containing it too.
After '@' we can have any number of domains below top-level domain using the simillar expression from before \w+([.-]?\w+)+.
At the end sub-expression (\.\w{2,}) will match strings containing '.' at the start and then a word containing 2 or more word characters appeearing exactly once to ensure one top-level domain.
The whole regex would then match string, e.g., 'abotic02@fesb.hr' or 'Example123_example@web-designer-expert.com'.
*/

const emailRegex = /\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})/

/*
Password regex explanation:
Same rules apply to password regex. 
Password regex won't allow 'space' character.
The only difference is the usage of positive lookahead (?=pattern).
It performs the match but does not capture it, it only returns the result (match or no match).
Lookahead ?=.*? will match any character except line terminators, zero to unlimited times as few times as possible, expanding if needed.
It will look for lower case letter [a-z], upper case letter [A-Z], atleast one digit [0-9] and alot of special characters written below.
*/

const passwordRegex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]).{8,}/

// Adds event listener to listen to form submission
// When submited read submitted data values and store them into variables
loginForm.addEventListener("submit", (event) => {

    // Prevents form from refreshing page so that we can replace current page with main page
    event.preventDefault()

    // Get values from form fields
    const emailValue = emailField.value
    const passwordValue = passwordField.value



    // Check if entered data matches email and password regex
    if (emailRegex.test(emailValue) && passwordRegex.test(passwordValue)) {
        // Makes a cookie that will be used to check if user is already logged in to main page
        // Cookie will expire in a week from login time
        // Cookie needs to be used on index.html too (set path to root)
        document.cookie = "isLoggedIn=true; expires=" + calculateWeekFromNow() + "; path=/"

        // This will replace current login page with home/main page
        // Also once replaced user can't go back to login which is intended use of this function
        window.location.replace("/index.html")

    }
    else {
        alert("Wrong!!!")
    }

})


