function showForm() {
    const formContainer = document.querySelector(".specialForm");
    formContainer.innerHTML = "";
    const heading = document.createElement("h2");
    heading.textContent = "Enter the event details";
    heading.id = "createEventHead";
    // Create a new form
    const clsBtn = document.createElement('button');
    const form = document.createElement("form");
    formContainer.appendChild(clsBtn);
    clsBtn.textContent = "X";
    clsBtn.addEventListener('click', ()=>{
        document.querySelector(".specialForm").style.display = "none";
    })
    clsBtn.className = 'closeEvent';
    form.id = "new-event-form";
    form.enctype = "multipart/form-data";
    formContainer.appendChild(heading);
    // Basic fields
    const nameField = createTextBoxField("Event Name", "name");
    const descriptionField = createTextBoxField("Description", "description");
    const dateField = createDateField("Date", "date");
    const objectiveField = createTextBoxField("Objective", "objective");

    // Image upload field
    const imageField = createImageField("Event Images", "image");
    const banner = createImageField("Banner Image", "image");
    // Extra services
    const extraServicesField = createInputField("Extra Services", "extra_services");

    // custom fields
    const addFieldButton = document.createElement("button");
    addFieldButton.type = "button"; // Important: not a submit button
    addFieldButton.textContent = "Add Field";
    addFieldButton.className = "addcustom";
    addFieldButton.addEventListener("click", addField);

    

    // Submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit Event";
    submitButton.className = "eventSub";
    // Append fields to the form
    form.appendChild(nameField);
    form.appendChild(banner);
    form.appendChild(descriptionField);
    form.appendChild(dateField);
    form.appendChild(objectiveField);
    form.appendChild(imageField);
    form.appendChild(extraServicesField);
    form.appendChild(addFieldButton);
    form.appendChild(submitButton);
    formContainer.style.display = "block";
    formContainer.style.opacity = "1";
    formContainer.appendChild(form); // Add the form to the container

    // Handle form submission
    form.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        submitEventForm(form);
    };

    
    
}

//function to create an image field
function createImageField(labelText, fieldName) {
    const div = document.createElement("div");  // Wrapper for the field
    const label = document.createElement("label");  // Label for the input
    const input = document.createElement("input");  // The actual input

    // Set the label text
    label.textContent = labelText;

    // Configure the input as an image file input
    input.type = "file";  // Input type for files
    input.name = fieldName;  // Field name
    input.accept = "image/*";  // Restrict to image files (e.g., PNG, JPEG)

    // Append label and input to the wrapper
    div.appendChild(label);
    div.appendChild(input);

    // Return the field
    return div;
}

// Function to create a generic input field
function createInputField(labelText, fieldName) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");

    label.textContent = labelText;
    input.name = fieldName;

    div.appendChild(label);
    div.appendChild(input);

    return div;
}

function createTextBoxField(labelText, fieldName) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const textarea = document.createElement("textarea");

    label.textContent = labelText;
    label.style.display = "block";
    textarea.name = fieldName;
    textarea.rows = 1;
    

    div.appendChild(label);
    div.appendChild(textarea);
    div.className = 'formField';
    return div;
}

// Function to create a date picker field
function createDateField(labelText, fieldName) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");

    label.textContent = labelText;
    input.type = "date";  // This sets it as a date picker
    input.name = fieldName;

    div.appendChild(label);
    div.appendChild(input);

    return div;
}

function createCustomInputField(labelText, fieldType, fieldName) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement(fieldType);

    label.textContent = labelText;
    input.name = fieldName;
    
    div.appendChild(label);
    div.appendChild(input);

    return div;
}

function addField() {
    const form = document.getElementById("new-event-form");
    const fieldType = (prompt("Enter field type (e.g., text, textarea, date, image):")).toLowerCase();
    const fieldLabel = prompt("Enter label for the new field:");
    const fieldName = fieldLabel; // Unique field name

    let newField;
    if (fieldType === "textarea") {
        newField = createCustomInputField(fieldLabel, "textarea", fieldName);
    } else if (fieldType === "date") {
        newField = createCustomInputField(fieldLabel, "input", fieldName);
        newField.querySelector("input").type = "date"; // Set as date picker
    } else if (fieldType === "image") {
        newField = createCustomInputField(fieldLabel, "input", fieldName);
        newField.querySelector("input").type = "file"; // Set as file input
        newField.querySelector("input").accept = "image/*"; // Restrict to images
    } else {
        newField = createCustomInputField(fieldLabel, "input", fieldName); // Default to text input
    }

    // Add the new field before the submit button
    form.insertBefore(newField, form.querySelector("button[type='submit']"));
}


function submitEventForm(form) {
    // Step 1: Retrieve form data using FormData
    const formData = new FormData(form);

    // Step 2: Convert FormData into a JavaScript object
    const eventData = {};
    formData.forEach((value, key) => {
        eventData[key] = value;
    });

    // Step 3: Convert the JavaScript object to JSON
    const jsonData = JSON.stringify(eventData);
    console.log(jsonData);
    // Step 4: Send JSON d ata to the backend using a POST request
    // /* uncommment  here
    fetch('/submit-event', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: formData
    })
    .then(response => {
        // Check if the response was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Return the response data as JSON

        return response.json();
    })
    .then(data => {
        // Step 5: Handle the response from the backend
        console.log('Response from backend:', data);
         
        // Optional: Display a success message or redirect the user
        alert('Event submitted successfully! Unique code: ', data.unique_code);
    })
    .catch(error => {
        // Step 6: Handle errors
        console.error('Error submitting event form:', error);

        // Optional: Display an error message to the user
        alert('There was an error submitting the form. Please try again later.');
    });
     
}



function createEventOptions() {
    // Find or create the div that will contain the buttons
    const eventOptionsDiv = document.querySelector(".specialForm");
    
    if (!eventOptionsDiv) {
        console.error("Div for event options not found.");
        return;
    }

    // Clear existing content in the div
    eventOptionsDiv.innerHTML = '';

    // Create two buttons: Create New Event and Join Event
    const createNewEventButton = document.createElement("button");
    createNewEventButton.textContent = "Create New Event";
    createNewEventButton.className = "createNewEventBtn";

    const joinEventButton = document.createElement("button");
    joinEventButton.textContent = "Join Event";
    joinEventButton.className = "joinEventBtn";

    // Append the buttons to the div
    eventOptionsDiv.appendChild(createNewEventButton);
    eventOptionsDiv.appendChild(joinEventButton);

    // Handle the click event for "Create New Event"
    createNewEventButton.addEventListener("click", () => {
        // Call showForm() to display the event creation form
        showForm();
    });

    // Handle the click event for "Join Event"
    joinEventButton.addEventListener("click", () => {
        // Add the logic for joining an event here
        console.log("Join Event button clicked.");
        showJoinEventForm();
        // Additional logic can be added to join an existing event
    });

    // Display the div
    eventOptionsDiv.style.display = "block"; // Make the div visible
    eventOptionsDiv.style.opacity= "1"; 

}

// Add an event listener to the "Create Event" button
// document.querySelector(".createEventBtn").addEventListener("click", () => {
//     createEventOptions(); // Display the div with two buttons
// });

function showJoinEventForm() {
    // Get the special form container
    const formContainer = document.querySelector(".specialForm");

    // Clear existing content (if any)
    formContainer.innerHTML = '';

    // Create a heading for the form
    const heading = document.createElement("h2");
    heading.textContent = "Join an Event";
    formContainer.appendChild(heading);

    // Create the form element
    const form = document.createElement("form");
    form.id = "join-event-form";

    // Create a field for entering the unique code
    const uniqueCodeField = document.createElement("input");
    uniqueCodeField.type = "text";
    uniqueCodeField.name = "unique_code";
    uniqueCodeField.placeholder = "Enter the unique code";

    // Create a label for the unique code field
    const uniqueCodeLabel = document.createElement("label");
    uniqueCodeLabel.textContent = "Unique Code:";
    uniqueCodeLabel.htmlFor = "unique_code";
    uniqueCodeLabel.id = "uniqueLabel";
    uniqueCodeField.id = "uniqueText";
    // Create a submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Join Event";
    submitButton.id = "join-sub";
    
    // Append the label, input field, and submit button to the form
    form.appendChild(uniqueCodeLabel);
    form.appendChild(uniqueCodeField);
    form.appendChild(submitButton);

    // Append the form to the container
    formContainer.appendChild(form);

    // Make the form container visible
    formContainer.style.display = "block"; // Show the form container
    formContainer.style.opacity = "1"; // Optional: Add a smooth transition effect

    // Handle form submission
    form.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const uniqueCode = uniqueCodeField.value; // Get the unique code from the input field
        joinEvent(uniqueCode);
        // Logic to handle the unique code submission
        console.log("Joining event with unique code:", uniqueCode);

        // You can add additional logic to send this data to the backend
    };
}

function joinEvent(uniqueCode) {
    // Prompt the user for the unique code
    

    // Prepare the request body
    const requestData = {
        unique_code: uniqueCode
    };

    // Send the POST request to join the event
    fetch('/join-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)  // Convert to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to join event');
        }
        return response.json();  // Parse the response JSON
    })
    .then(data => {
        if (data.error) {
            // Handle server-side errors
            alert(`Error: ${data.error}`);
        } else {
            // Handle success response
            console.log("Successfully joined the event.");
            document.querySelector(".specialForm").display = "none";
            document.getElementById("myevents").click();
            // Optionally, update the UI to reflect that the user has joined the event
        }
    })
    .catch(error => {
        console.error('Error joining event:', error);
        alert("There was an error joining the event. Please try again.");
    });
}
