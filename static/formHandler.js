function showForm() {
    const formContainer = document.querySelector(".specialForm");
    formContainer.innerHTML = "";
    const heading = document.createElement("h2");
    heading.textContent = "Enter the event details";
    heading.id = "createEventHead";
    // Create a new form
    formContainer.appendChild(heading);
    const form = document.createElement("form");
    form.id = "new-event-form";

    // Basic fields
    const nameField = createTextBoxField("Event Name", "name");
    const descriptionField = createTextBoxField("Description", "description");
    const dateField = createDateField("Date", "date");
    const objectiveField = createTextBoxField("Objective", "objective");

    // Image upload field
    const imageField = createImageField("Event Images", "Enter the images of the event");

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
    const fieldType = prompt("Enter field type (e.g., text, textarea, date, image):").toLowerCase();
    const fieldLabel = prompt("Enter label for the new field:");
    const fieldName = `custom_${Date.now()}`; // Unique field name

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

