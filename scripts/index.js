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
const pastPtoDivName = document.getElementById("first-p")
const currentPtoDivName = document.getElementById("second-p")
const futurePtoDivName = document.getElementById("third-p")

// Flags say if the start and end dates were changed or not
let startDateFlag = false
let endDateFlag = false

// Variable to hold selected employee ID so that we can fetch employees PTOs
let selectedId = undefined

// Class that will make objects that hold arrays of nodes for coresponding PTOs
class employeePto{
    constructor(pastPtos, currentPtos, futurePtos){
        this.pastPtos = pastPtos
        this.currentPtos = currentPtos 
        this.futurePtos = futurePtos 
    }
}


// If PTOs are entered show the PTO div name or hide it if there are none entered
function checkPtoDivChildren(){
if(pastPtoDiv.firstChild !== null){
    pastPtoDivName.style.color = "white"
}
else{
    pastPtoDivName.style.color = "transparent"
}

if(currentPtoDiv.firstChild !== null){
    currentPtoDivName.style.color = "white"
}

else{
    currentPtoDivName.style.color = "transparent"
}

if(futurePtoDiv.firstChild !== null){
    futurePtoDivName.style.color = "white"
}
else{
    futurePtoDivName.style.color = "transparent"
}
}

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
                // Handler to show user info when hovered
                handleButtonHover(index, employeeArray, imagePath)
                // Add option to add PTO to employee
                addPtoOption(index, employeeArray)
                
            }
        })(i))

        // When employee is clicked close dropdown and also get the id of selected employee (get it from info written in HTML and use it to fetch PTOs)
        button.addEventListener("click", () => {
            // Hide dropdown
            dropdownContent.style.display = "none"

            const selectedUserInfoArray = userInfoDiv.getElementsByTagName("p")

            // Ensure that only seleceted employees data is handled
            selectedId = Number(selectedUserInfoArray[0].textContent.charAt(selectedUserInfoArray[0].textContent.length - 1))

            // Parse the data saved in local storage (if any)
            localStorageParser()
           
            
            
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

    
    
}

// Function to determine PTO period (is it current, past or future PTO)
function determinePtoPeriod(startDate, endDate, startDateParagraph, endDateParagraph){

    const currendDate = new Date()
    const pto = checkSeason(startDate, startDateParagraph, endDateParagraph)
    currendDate.setHours(0, 0, 0, 0)
    
    // Compare them and add PTO to correct time period (with picture)
    if(endDate < currendDate){ // If the end date is less than current date then PTO is past PTO
        
        pastPtoDiv.appendChild(pto)

        // This could have been done without using another function
        // That way we wouldn't have to check to which time period PTO belongs to by using switch-case because it is already done inside these if-elses
        // Downside is that code will become hard to read
        localStorageSaver(pto, pastPtoDiv.id)

    }
    else if(currendDate >= startDate && currendDate <= endDate){ // If the current date is between star and end date then PTO is current PTO
        currentPtoDiv.appendChild(pto)
        localStorageSaver(pto, currentPtoDiv.id)
    }
    else if(startDate > currendDate){ // If the start date is greater than current date then PTO is future PTO 
        futurePtoDiv.appendChild(pto)
        localStorageSaver(pto, futurePtoDiv.id)
    }

    // Check if there are PTOs in div so that we can hide the div name or leave it
    checkPtoDivChildren()
    
}

// Function takes start date of the PTO and checks the season in which PTO started
// If the PTO started in January but ended, for example, in May, it will still be considered winter PTO
function checkSeason(startDate, startDateParagraph, endDateParagraph){
    const startDateMonth = new Date(startDate).getMonth()
    
    // Months in JS Date object are numerated from 0 to 11, 0 is January and 11 is December
    if(startDateMonth == 11 || startDateMonth == 0 || startDateMonth == 1){ // PTO is winter PTO
    
        const pto = createPto(startDateParagraph, endDateParagraph)
        pto.style.backgroundPosition = "50% 55%"
        pto.style.backgroundImage = "url('https://www.mistay.in/travel-blog/content/images/size/w2000/2020/06/cover-9.jpg')"
        
        return pto
    }
    else if(startDateMonth == 2 || startDateMonth == 3 || startDateMonth == 4){ // PTO is spring PTO
    
        const pto = createPto(startDateParagraph, endDateParagraph)
        pto.style.backgroundPosition = "bottom"
        pto.style.backgroundImage = "url('resources/spring-season.png')"
        
        return pto
    
    }
    else if(startDateMonth == 5 || startDateMonth == 6 || startDateMonth == 7){ // PTO is summer PTO
    
        const pto = createPto(startDateParagraph, endDateParagraph)
        pto.style.backgroundPosition = "top 100px"
        pto.style.backgroundImage = "url('resources/summer-season.png')"
        
        return pto
    
    }
    else if(startDateMonth == 8 || startDateMonth == 9 || startDateMonth == 10){ // PTO is autumn PTO
    
        const pto = createPto(startDateParagraph, endDateParagraph)
        pto.style.backgroundImage = "url('https://cdn.britannica.com/88/137188-050-8C779D64/Boston-Public-Garden.jpg')"

        return pto
    }
    
}

// Function to evaluate PTO flags if PTO flags are set, if they are then let user add PTO
async function evaluatePtoFlags(startDateFlag, endDateFlag, startDateParagraph, endDateParagraph, addPtoButton, quitDiv, startDateSpan, endDateSpan){
    if (startDateFlag && endDateFlag){

        // Make Date object so that we can compare them
        const endDate = new Date(endDateParagraph.textContent.toString())
        const startDate = new Date(startDateParagraph.textContent.toString())

        
        // If start date is greater than end it is not valid period
        if(startDate > endDate){
           endDateSpan.style.color = "red"
           startDateSpan.style.color = "red"
        }
        else{// If it is valid then let admin asign PTO
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
            determinePtoPeriod(startDate, endDate, startDateParagraph, endDateParagraph)
        })
        }
        
        
      }
}


// Function to show option to add PTOs for employee
function addPtoOption(index, employeeArray){
    // Setting the "Add PTO" option to each employee shown
    const addPtoButton = document.createElement("button")
    // Adding button id
    addPtoButton.setAttribute("id", "add-pto-button")
    const addPtoButtonText = document.createTextNode(`Add ${employeeArray[index].name}'s PTO`)
    addPtoButton.appendChild(addPtoButtonText)
    userInfoDiv.appendChild(addPtoButton)

    // Creating different containers to structure shown elements
    const quitDiv = document.createElement("div")
    const startDateSpan = document.createElement("span")
    const endDateSpan = document.createElement("span")
    const datesDiv = document.createElement("div")
    const dateSeparator = document.createElement("p")

    // Initial text inside of select and end date divs
    let startDateText = "Select start date"
    let endDateText = "Select end date"

    // Paragraph elements which will store selected and inital date strings
    const startDateParagraph = document.createElement("p")
    startDateParagraph.innerText = startDateText
    const endDateParagraph = document.createElement("p")
    endDateParagraph.innerText = endDateText

    
    // When addPtoButton is clicked animate its appearance and append all previously created divs
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
       
        // Could not implement the removal of this div when X is clicked so it currently has no function, but will have in future
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
        
        // Handle chosen dates
        handleAddingStartEndDate(startDateText, endDateText, startDateParagraph, endDateParagraph, addPtoButton, quitDiv, startDateSpan, endDateSpan)


    })
}

// Function to show start to end date of PTO
function showPtoDate(startDateParagraph, endDateParagraph){
    let date = undefined

    if(startDateParagraph.textContent === endDateParagraph.textContent){
        date = startDateParagraph.textContent
        return date
    }
    else{
        date = startDateParagraph.textContent + " - " + endDateParagraph.textContent
        return date
    }

}

// Function to create PTO element to minimize copy-pasting code
function createPto(startDateParagraph, endDateParagraph){
    const pto = document.createElement("div")
    const quitDiv = document.createElement("div")

    pto.style = `width: 100%;
    min-height: 80px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    align-items: center;
    text-shadow: black 1px 0 10px;
    margin-bottom: 5px;
    position: relative;`


    quitDiv.innerText = "✕"
    quitDiv.style = `
                        display: flex;
                        justify-content: center;
                        align-items: center;    
                        position: absolute;
                        z-index: 3;
                        width: 20px;
                        height: 20px;
                        font-size: 20px;
                        right: 0;
                        top: 0;
                        cursor: pointer;
                        color: white;
                        background: transparent;
                        backdrop-filter: blur(3px);
                        `

   
    quitDiv.addEventListener("mouseenter", () => {quitDiv.style.transform = "scale(1.2)"
    quitDiv.style.translate = "all 300ms"})
    quitDiv.addEventListener("mouseleave", () => {quitDiv.style.transform = "scale(1)"})
    pto.innerText = showPtoDate(startDateParagraph, endDateParagraph)
    pto.appendChild(quitDiv)
    // When clicked delete PTO from DOM and local storage so that it does not appear now and in future
    quitDiv.addEventListener("click", () => {
        
        localStorageRemove(pto, pto.parentElement.id)
        pto.parentElement.removeChild(pto)
        checkPtoDivChildren()
    })


    return pto
}

// Function to handle adding start and end dates from calendar
async function handleAddingStartEndDate(startDateText, endDateText, startDateParagraph, endDateParagraph, addPtoButton, quitDiv, startDateSpan, endDateSpan){
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
  
      // Evaluate if both flags are set, works fine but duplicates the checkmark which appears after successful evaluation
      // Bug does not interfere with the workings of program
       await evaluatePtoFlags(startDateFlag, endDateFlag, startDateParagraph, endDateParagraph, addPtoButton, quitDiv, startDateSpan, endDateSpan)
  
    })
  
  
    // The same thing for end date
    const endDate = endDateSpan.addEventListener("click", async () => {
  
      
      const selectedDate = await addEventListenersToDates()
      
      endDateText = selectedDate
      endDateParagraph.innerText = endDateText
  
      endDateFlag = true

      await evaluatePtoFlags(startDateFlag, endDateFlag, startDateParagraph, endDateParagraph, addPtoButton, quitDiv, startDateSpan, endDateSpan)
      
    })
    
   
  }

// Adds PTO to coresponding employee local storage
function localStorageSaver(pto, ptoType){
    
    // If it doesn't exist create it and append to it
    if(localStorage.getItem(selectedId) === null){
        const localStorageData = new employeePto([], [], [])
        
        switch (ptoType) {
            case "past-pto-div": // past PTO
                localStorageData.pastPtos.push(pto.outerHTML)
                break
        
            case "current-pto-div": // current PTO
                localStorageData.currentPtos.push(pto.outerHTML)
                break

            case "future-pto-div": // future PTO
                localStorageData.futurePtos.push(pto.outerHTML)
                break
        }

        // Before adding our data to local storage we need to convert it to JSON string
        const localStorageString = JSON.stringify(localStorageData)
        localStorage.setItem(String(selectedId), localStorageString)
    }
    else{// If it does exist append to an object inside local storage
        let localStorageString = localStorage.getItem(String(selectedId))
        const localStorageObject = JSON.parse(localStorageString)
        
        console.log(localStorageObject)
        switch (ptoType) {
            case "past-pto-div": // past PTO
                localStorageObject.pastPtos.push(pto.outerHTML)
                break
        
            case "current-pto-div": // current PTO
                localStorageObject.currentPtos.push(pto.outerHTML)
                break

            case "future-pto-div": // future PTO
                localStorageObject.futurePtos.push(pto.outerHTML)
                break
        }

        // Before adding our data to local storage we need to convert it to JSON string
        localStorageString = JSON.stringify(localStorageObject)
        localStorage.setItem(String(selectedId), localStorageString)
    }
}

// Reads PTOs from selected employee
function localStorageParser(){
    // Fetch data from local storage
    const localStorageString = localStorage.getItem(String(selectedId))
    // If there is data then convert it to JS object and use it
    if(localStorageString !== null){
    const localStorageObject = JSON.parse(localStorageString)
    

    if(localStorageObject.pastPtos.length !== 0){
        localStorageObject.pastPtos.forEach(node => {
            
            pastPtoDiv.appendChild(addRemoveHandlers(node, pastPtoDiv.id))
        })
    }
    if(localStorageObject.currentPtos.length !== 0){
        localStorageObject.currentPtos.forEach(node => {
            
            currentPtoDiv.appendChild(addRemoveHandlers(node, currentPtoDiv.id))
        })
    }
    if(localStorageObject.futurePtos.length !== 0){
        localStorageObject.futurePtos.forEach(node => {
            
            futurePtoDiv.appendChild(addRemoveHandlers(node, futurePtoDiv.id))
        })
    }
}
checkPtoDivChildren()
}

// Removes clicked PTO from localstorage object
function localStorageRemove(pto, ptoType){

    let localStorageString = localStorage.getItem(String(selectedId))
        const localStorageObject = JSON.parse(localStorageString)
        let index = undefined

        // Switch case to find which category does PTO belong to
        switch (ptoType) {
            case "past-pto-div": // past PTO
                index = localStorageObject.pastPtos.indexOf(pto.outerHTML)
                localStorageObject.pastPtos.pop(index)
                checkPtoDivChildren()
                break
        
            case "current-pto-div": // current PTO
                index = localStorageObject.currentPtos.indexOf(pto.outerHTML)
                localStorageObject.currentPtos.pop(index)
                checkPtoDivChildren()
                break

            case "future-pto-div": // future PTO
                index = localStorageObject.futurePtos.indexOf(pto.outerHTML)
                localStorageObject.futurePtos.pop(index)
                checkPtoDivChildren()
                break
        }

        localStorageString = JSON.stringify(localStorageObject)
        localStorage.setItem(String(selectedId), localStorageString)
        
}

// Function to add event handlers to node gotten from local storage ensuring node deletion from local storage and DOM
function addRemoveHandlers(ptoInnerHTML, ptoType){
    // Creating temporary div element so that we can manipulate innerHTML (can not do it directly without its parent)
    let temp = document.createElement("div")
    temp.innerHTML = ptoInnerHTML

    let childNodes = temp.getElementsByTagName("div")
    // What we want is the first child shown in HTML
    const ptoNode = childNodes[0]

    childNodes = ptoNode.getElementsByTagName("div")
    const quitDiv = childNodes[0]
    
    quitDiv.addEventListener("mouseenter", () => {
        quitDiv.style.transform = "scale(1.2)"
        quitDiv.style.translate = "all 300ms"
    })

    

    quitDiv.addEventListener("mouseleave", () => {
        quitDiv.style.transform = "scale(1)"
    })

    // When X is clicked remove node from local storage and from DOM
    quitDiv.addEventListener("click", () => {
        localStorageRemove(ptoInnerHTML, ptoType)
        ptoNode.parentElement.removeChild(ptoNode)
        checkPtoDivChildren()
    })

    return ptoNode
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

// Call the function to add employees in dropdown
addEmployeesButtons(employeeArray)


// Checking if dropdown was clicked before
let isClicked = false

// Adding dropdown functionalities
dropdownMenu.addEventListener("click", () => {

    if (!isClicked) {
        isClicked = true
        dropdownContent.style.display = "block"
        pastPtoDiv.innerHTML = ""
        currentPtoDiv.innerHTML = ""
        futurePtoDiv.innerHTML = ""
        checkPtoDivChildren()
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

