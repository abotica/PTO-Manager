// Importing functions from module
import { getCookieValue } from "./cookie-functions.js"

// Getting elements from DOM
const logOutButton = document.getElementById("logout-button")
const popupAlignmentDiv = document.getElementById("popup-alignment-div") // Treated as the popup screen because it is its parrent div
const dropdownContent = document.getElementById("dropdown-content")
const topLeftDiv = document.getElementById("left-top-div")
const dropdownButton = document.getElementById("dropdown-button")
const bottomLeftDiv = document.getElementById("left-bottom-div")
const userInfoDiv = document.getElementById("user-info-div")
const dropdownMenu = document.getElementById("dropdown-menu")
const imageDiv = document.getElementById("image-div")

// Fetching data from 
async function getEmployees(fileUrl) {
    try {
        // Fetch data from specified file using GET request
        const employeeObject = await fetch(fileUrl)
        const employeeArray = await employeeObject.json()
        return employeeArray

    } catch (error) {
        console.error(error)
    }

}

// Await data before using it
const employeeArray = await getEmployees("https://jsonplaceholder.typicode.com/users")

// Putting employees into dropdown menu
// Attaching event listener to each button so that we are able to know whick button is chosen
function addEmployeesButtons(employeeArray) {

    for (let i = 0; i < employeeArray.length; i++) {
        // Create node element
        const button = document.createElement("button")
        button.textContent = employeeArray[i].name

        // Setting employee pictures path
        let imagePath = "/resources/employees/" + `${employeeArray[i].name}` + ".jpg"

        // If names include "." like Mrs. or Mr.
        // If there are 2 dots resulting array will have 3 elements
        if (imagePath.split(".").length >= 3) {
            const indexOfDot = imagePath.indexOf(".")
            const firtsPart = imagePath.substring(0, indexOfDot + 1)
            const secondPart = imagePath.substring(indexOfDot + 2)
            imagePath = firtsPart + secondPart

        }

        // Added event listener to button
        // We have a closure returning event handler making it unaffected by enclosing scope (for loop)
        button.addEventListener("mouseover", ((index) => {
            return () => {
                handleButtonHover(index, employeeArray, imagePath)

            }
        })(i))

        button.addEventListener("click", () => {
            dropdownContent.style.display = "none"
        })




        // Append it to drop menu
        dropdownContent.appendChild(button)

    }

}


// Displaying data on user info div
function handleButtonHover(index, employeeArray, imagePath) {
    imageDiv.querySelector("img").setAttribute("src", imagePath)

    // Formatting address
    const addressElement = employeeArray[index].address
    const address = addressElement.street + addressElement.suite + ", " + addressElement.city
        + ", " + addressElement.zipcode + " " + `(${addressElement.geo.lat}, ${addressElement.geo.lng})`

    // Formatting company info
    const companyElement = employeeArray[index].company
    const company = companyElement.name + " " + companyElement.catchPhrase
        + " " + companyElement.vs

    userInfoDiv.innerHTML = `<p>ID: ${employeeArray[index].id}</p>
                        <p>Name: ${employeeArray[index].name}</p>
                        <p>Username: ${employeeArray[index].username}</p>
                        <p>Email: ${employeeArray[index].email}</p>
                        <p>Address: ${address}</p>
                        <p>Phone: ${employeeArray[index].phone}</p>
                        <p>Website: ${employeeArray[index].website}</p>
                        <p>Company: ${company}</p>`
    
    // Setting the "Add PTO" option to each employee shown
    const addPtoButton = document.createElement("button")
    // Adding button id
    addPtoButton.setAttribute("id", "add-pto-button")
    const addPtoButtonText = document.createTextNode(`Add ${employeeArray[index].name}'s PTO`)
    addPtoButton.appendChild(addPtoButtonText)
    userInfoDiv.appendChild(addPtoButton)

    addPtoButton.addEventListener("click", () => {
        addPtoButton.style = `transform: scale(1);
                            cursor: default;
                            width: 98%;
                            height: 55px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;`

        // topLeftDiv.style.filter = "blur(10px)"
        // bottomLeftDiv.style.filter = "blur(10px)"
        // addPtoButton.filter = "none"
        addPtoButton.innerText = ""
        const quitDiv = document.createElement("div")
        const startDateSpan = document.createElement("span")
        const endDateSpan = document.createElement("span")
        const datesDiv = document.createElement("div")
        const dateSeparator = document.createElement("p")
        dateSeparator.innerText = "-"
        addPtoButton.appendChild(quitDiv)
        addPtoButton.appendChild(datesDiv)
        datesDiv.appendChild(endDateSpan)
        datesDiv.appendChild(dateSeparator)
        datesDiv.appendChild(startDateSpan)
        endDateSpan.style.backgroundColor = "black"
        startDateSpan.style.backgroundColor = "red"

        datesDiv.style = `display: flex;
                        width: 100%;
                        height: 40px;
                        align-items: center;
                        justify-content: center;`

        endDateSpan.style = `width: 40%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;`

        dateSeparator.style.width = "40px"

        startDateSpan.style = `width: 40%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;`

        endDateSpan.innerHTML = `<p>Select end date</p>`
        startDateSpan.innerHTML = `<p>Select start date</p>`
       


        

        quitDiv.innerText = "✕"
        quitDiv.style = `position: absolute;
                        width: 5%;
                        height: 10%;
                        color: black;
                        font-size: 20px;
                        left: 0;
                        top: 0;
                        cursor: pointer;`


        
    })
    
}

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


addEmployeesButtons(employeeArray)


// Checking if dropdown was clicked before
let isClicked = false

// Adding dropdown functionalities
dropdownMenu.addEventListener("click", () => {

    if (!isClicked) {
        isClicked = true
        dropdownContent.style.display = "block"
    }
    else {
        isClicked = false
        dropdownContent.style.display = "none"

    }


})

// Making dropdown content same height as its containing div
const topLeftDivHeight = topLeftDiv.offsetHeight
const dropdownButtonHeight = dropdownButton.offsetHeight

// Calculating and setting height of dropdown content
const dropdownContentHeight = (topLeftDivHeight - dropdownButtonHeight).toString()
dropdownContent.style.height = dropdownContentHeight + "px"


