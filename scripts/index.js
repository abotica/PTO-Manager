// Importing functions from module
import { getCookieValue } from "./cookie-functions.js"
import { addEventListenersToDates } from "./calendar.js"

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
const pastPtoDiv = document.getElementById("past-pto-div")
const currentPtoDiv = document.getElementById("current-pto-div")
const futurePtoDiv = document.getElementById("future-pto-div")

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



    // Flags say if the start and end dates were changed or not
    let startDateFlag = false
    let endDateFlag = false
    const quitDiv = document.createElement("div")
    const startDateSpan = document.createElement("span")
    const endDateSpan = document.createElement("span")
    const datesDiv = document.createElement("div")
    const dateSeparator = document.createElement("p")

    let startDateText = "Select start date"
    let endDateText = "Select end date"

    const startDateParagraph = document.createElement("p")
    startDateParagraph.innerText = startDateText
    const endDateParagraph = document.createElement("p")
    endDateParagraph.innerText = endDateText

    

    addPtoButton.addEventListener("click", () => {
        addPtoButton.style = `transform: scale(1);
                            cursor: default;
                            width: 98%;
                            height: 55px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;`

        addPtoButton.innerText = ""
        

        dateSeparator.innerText = "-"
        addPtoButton.appendChild(quitDiv)
        addPtoButton.appendChild(datesDiv)
        datesDiv.appendChild(startDateSpan)
        datesDiv.appendChild(dateSeparator)
        datesDiv.appendChild(endDateSpan)
        

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

        endDateSpan.appendChild(endDateParagraph)
        startDateSpan.appendChild(startDateParagraph)
       


        

        quitDiv.innerText = "✕"
        quitDiv.style = `position: absolute;
                        z-index: 3;
                        width: 5%;
                        height: 10%;
                        color: black;
                        font-size: 20px;
                        left: 0;
                        top: 0;
                        cursor: pointer;`

        quitDiv.addEventListener("mouseenter", () => {quitDiv.style.transform = "scale(1.2)"
                                                    quitDiv.style.translate = "all 300ms"})
        quitDiv.addEventListener("mouseleave", () => {quitDiv.style.transform = "scale(1)"})
        
  // When we click onto "Add start date" we want to wait for the click on the clanedar and only then get the clicked value
  // That is where promises and async/await come in
  // We will get selected date only when we resolve the promise inside addEventListenerToDates function
  // That promise will be resolved when we click onto some date on the calendar
  const startDate = startDateSpan.addEventListener("click", async () => {
    
    
    // Wait for the selected date from the addEventListenersToDates function
    const selectedDate = await addEventListenersToDates()
   
    // Set new value of inner HTML
    startDateText = selectedDate
    startDateParagraph.innerText = startDateText
    
    startDateFlag = true
    
        await evaluate()

  })


  // The same thing for end date
  const endDate = endDateSpan.addEventListener("click", async () => {

    
    const selectedDate = await addEventListenersToDates()
    
    endDateText = selectedDate
    endDateParagraph.innerText = endDateText

    endDateFlag = true

    await evaluate()
    
  })
  
  

    })
    
    
async function evaluate(){
    if (startDateFlag && endDateFlag){

        // Make Date object so that we can compare them
        const endDate = new Date(endDateParagraph.textContent.toString())
        const startDate = new Date(startDateParagraph.textContent.toString())

        

        if(startDate > endDate){
           endDateSpan.style.color = "red"
           startDateSpan.style.color = "red"
        }
        else{
        const acceptDiv = document.createElement("div")
        acceptDiv.innerText = "✓"
        acceptDiv.style = `position: absolute;
                         z-index: 3;
                        width: 5%;
                        height: 10%;
                        color: black;
                        font-size: 20px;
                        right: 5px;
                        top: 0;
                        cursor: pointer;`
        addPtoButton.insertBefore(acceptDiv, quitDiv)
        acceptDiv.addEventListener("mouseenter", () => {acceptDiv.style.transform = "scale(1.2)"
                                                    acceptDiv.style.translate = "all 300ms"})
        acceptDiv.addEventListener("mouseleave", () => {acceptDiv.style.transform = "scale(1)"})
        acceptDiv.addEventListener("click", () => {
            determinePtoPeriod(startDate, endDate)
        })
        }
        
        
      }
}


function determinePtoPeriod(startDate, endDate){

const currendDate = new Date()
const pto = checkSeason(startDate, endDate)

// Compare them and add PTO to correct time period (with picture)
if(endDate < currendDate){ // If the end date is less than current date then PTO is past PTO
    
    pastPtoDiv.appendChild(pto)

}
else if(currendDate >= startDate && currendDate <= endDate){ // If the current date is between star and end date then PTO is current PTO
    currentPtoDiv.appendChild(pto)
}
else if(startDate > currendDate){ // If the start date is greater than current date then PTO is future PTO 
    futurePtoDiv.appendChild(pto)
}

}


// Function takes start date of the PTO and checks the season in which PTO started
// If the PTO started in January but ended, for example, in May, it will still be considered winter PTO
function checkSeason(startDate, endDate){
const startDateMonth = new Date(startDate).getMonth()

if(startDateMonth == 11 || startDateMonth == 0 || startDateMonth == 1){ // PTO is winter PTO

    const pto = document.createElement("div")
    pto.style = `width: 100%;
            min-height: 80px;
            display: flex;
            justify-content: center;
            font-size: 30px;
            align-items: center;
            background-position: 50% 55%;
            text-shadow: black 1px 0 10px;`
    pto.style.backgroundImage = "url('https://www.mistay.in/travel-blog/content/images/size/w2000/2020/06/cover-9.jpg')"
    
    
    pto.innerText = startDateParagraph.textContent + " - " + endDateParagraph.textContent
    return pto
}
else if(startDateMonth == 2 || startDateMonth == 3 || startDateMonth == 4){ // PTO is spring PTO

    const pto = document.createElement("div")
    pto.style = `width: 100%;
            min-height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            background-position: bottom;
            text-shadow: black 1px 0 10px;
            `
    pto.style.backgroundImage = "url('resources/spring-season.png')"
    
    pto.innerText = startDateParagraph.textContent + " - " + endDateParagraph.textContent
    return pto

}
else if(startDateMonth == 5 || startDateMonth == 6 || startDateMonth == 7){ // PTO is summer PTO

    const pto = document.createElement("div")
    pto.style = `width: 100%;
            min-height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-position: top 100px;
            font-size: 30px;
            text-shadow: black 1px 0 10px;`
    pto.style.backgroundImage = "url('resources/summer-season.png')"
    
    pto.innerText = startDateParagraph.textContent + " - " + endDateParagraph.textContent
    return pto

}
else if(startDateMonth == 8 || startDateMonth == 9 || startDateMonth == 10){ // PTO is autumn PTO

    const pto = document.createElement("div")
    pto.style = `width: 100%;
            min-height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-shadow: black 1px 0 10px;
            font-size: 30px;`
    pto.style.backgroundImage = "url('https://cdn.britannica.com/88/137188-050-8C779D64/Boston-Public-Garden.jpg')"
    pto.innerText = startDateParagraph.textContent + " - " + endDateParagraph.textContent
    return pto
}

}

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


