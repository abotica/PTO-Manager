This was the practical assignment for my Internet Programming course written in HTML, CSS and JS.

# **Assignment**

The goal of this project is to apply all the skills acquired through laboratory exercises on the website.

The website should represent an imitation of an administrator page within a company, displaying information about employees and providing the ability to view and manipulate Paid Time Off (PTO) schedules for employees (annual leave, sick leave, and other types of paid absences).

At the bottom of this project description, design prototypes for this page are provided.

These prototypes do not strictly represent the design to be followed but serve as examples to give a visual idea of what is required. Students are allowed to apply their design vision (color scheme, layout, element positioning on the page, functionality triggers, etc.) as long as the design meets the project's functionality and goals. For example: the user sign-in can be a separate page as shown in the prototype, it can be in the form of a modal, a separate tab on the page, a popup, within a dropdown under the header, etc. It is also not necessary to strictly adhere to the text written in the prototypes as long as the information from the text is somehow conveyed.

Since the project's goal is the application of learned skills, this includes HTML, CSS, and JavaScript, meaning that functionality with a maximally simplified appearance without applying learned CSS skills, and vice versa, complicating the appearance without implementing functionality, does not meet that goal.

HTML, CSS, and JavaScript code should be structured according to the principles learned in exercises.

All code must be written in English (content of the page itself is not crucial).

The code should include comments describing what each code segment does.

The website should be responsive for mobile devices.

Functionalities:

1. There should be a user sign-in, with the implementation focused on form validation and saving validated data in a cookie. The form should include email and password validation. The password should have a minimum of 8 characters, at least one number, at least one uppercase letter, at least one lowercase letter, and at least one special character. If regex is used to validate the password, add a comment explaining it. Upon successful validation, a cookie is stored indicating that the user is logged in, and the page reveals data that is hidden from non-logged-in users. This form should represent a hybrid between login and register in the sense that the requested data imitates register, and the submission of validated data imitates login. Security is not a concern; data is not stored in any database. If the user logs out and logs in again, the data entered last time is not stored anywhere; the form accepts any input that meets validation.

2. There should be a log-out option for a logged-in user. When the user logs out, data is deleted from the cookie, and employee data and their PTOs are no longer displayed.

3. On the main page, data about all "employees" is fetched from https://jsonplaceholder.typicode.com/users, and the logged-in user's data is displayed.

4. A logged-in user can add a PTO schedule for each employee. The PTO schedule includes a start and end date, where the start date must not be after the end date. The start and end dates can be the same day, indicating a schedule that includes only that one day. Adding can be achieved in different ways: a form for each employee's data, one form on the page where the PTO schedule details (start and end date) are selected, and the employee for whom the PTO is added is chosen, etc.

5. Custom calendars must be created for date selection (do not use default input type date calendars). An example of a custom calendar is shown in the prototype image. Hint: If a form is used to submit PTO data (which employee, start date, end date), the values for dates are taken from default input type date calendars, which are hidden with CSS. By selecting a date on the custom calendar, the corresponding hidden input is assigned a value. This way, on submission, data from all form inputs will be collected. An example of a custom calendar is shown in the prototype; it should have the ability to "switch" months, display the year of the shown month, show the current date in one style, and show the selected date in another style.

6. When PTO is added, it should be displayed on the screen alongside the employee's data for whom it was added. In this section, there should be 3 subsections: one for past PTO schedules, one for PTO schedules currently ongoing, and one for upcoming PTO schedules. The section for which there is no schedule is not displayed.

7. The background of PTO should be an image representing the season during which the PTO takes place. For 2 seasons, choose an image to add to the project and link it using a relative URL, and for the other 2 seasons, link the image using an absolute URL.

8. Data about all PTO schedules for employees is stored in localStorage so that when the page is refreshed, data is not lost but is loaded from memory.

9. A logged-in user can delete PTO schedules.
