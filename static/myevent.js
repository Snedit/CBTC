// Function to handle the status button click
function processStatus(button, eventUniqueCode) {
    alert("works");
    const statusChangeDiv = document.getElementById("statusChangeDiv");

    // Position the div relative to the clicked button
    const rect = button.getBoundingClientRect();
    statusChangeDiv.style.left = `${rect.left}px`;
    statusChangeDiv.style.top = `${rect.bottom}px`;
    statusChangeDiv.style.display = "block"; // Make it visible

    // Store context for later use
    statusChangeDiv.dataset.email = button.id; // Store the participant's email
    statusChangeDiv.dataset.currentStatus = button.textContent.trim(); // Store the current status
    statusChangeDiv.dataset.eventUniqueCode = eventUniqueCode; // Store the event's unique code
}

// Function to handle status change confirmation
function confirmStatusChange() {
    const statusChangeDiv = document.getElementById("statusChangeDiv");

    const email = statusChangeDiv.dataset.email; // Get the participant's email
    const eventUniqueCode = statusChangeDiv.dataset.eventUniqueCode; // Event's unique code
    const newStatus = document.querySelector("input[name='status']:checked").value; // Selected status

    const currentStatus = statusChangeDiv.dataset.currentStatus;
    if (currentStatus === newStatus) {
        statusChangeDiv.style.display = "none"; // No change, hide the div
        return;
    }

    const confirmChange = confirm(`Change status from ${currentStatus} to ${newStatus}?`);
    if (confirmChange) {
        dataTosend = {
            "email": email,
            "eventUniqueCode" : eventUniqueCode,
            "newStatus" : newStatus
        }
        fetch("/update-participant-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataTosend),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update status");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Status updated:", data);
            alert(`Status updated to ${newStatus}`);
            statusChangeDiv.style.display = "none"; // Hide the div after confirmation
            location.reload(); // Refresh the page to reflect changes
        })
        .catch((err) => {
            console.error("Error updating status:", err);
        });
    } else {
        statusChangeDiv.style.display = "none"; // Hide the div if the user cancels
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const confirmButton = document.getElementById("confirmStatusChange");

    // Handle confirmation of status change
    confirmButton.addEventListener("click", confirmStatusChange);

    // Hide the status change div if clicking outside it
    document.addEventListener("click", function (event) {
        const statusChangeDiv = document.getElementById("statusChangeDiv");

        if (
            !statusChangeDiv.contains(event.target) &&
            !event.target.closest(".lifechangingbtn")
        ) {
            statusChangeDiv.style.display = "none"; // Hide if clicking outside
        }
    });
});



function displayMyEvents(data){

const container = document.querySelector("#listofevents");

container.innerHTML = "";

data.forEach(myevent => {
    const eventDIV = document.createElement("div");
    eventDIV.className = "event";
    const anchor = document.createElement('a');
    anchor.className = "eventLink";
    const img = document.createElement('img');
    img.className = "eventImg";
    const lastSlashIndex = (myevent.image_path).lastIndexOf('\\');

// Get the substring after the last '/'
const fileName = (myevent.image_path).slice(lastSlashIndex + 1); 
    const rylSrc = "/static/images/" + fileName;
    console.log(myevent.image_path);
    img.src = rylSrc;

    const eventHead = document.createElement("p");
    const status = document.createElement('p');
    status.textContent  = myevent.status;
    status.className = "status";
    status.classList.add(myevent.status);

    eventHead.textContent = myevent.name;
    eventHead.className = "eventHead";
    anchor.appendChild(img);
    anchor.appendChild(eventHead);
    anchor.appendChild(status);
    eventDIV.appendChild(anchor);
    container.appendChild(eventDIV);

    anchor.addEventListener("click", () => printDetailedEvent(myevent));    
});


const eventDIV = document.createElement("div");
    eventDIV.className = "event createEvent";

    const anchor = document.createElement('a');
    anchor.className = "eventLink";
    const img = document.createElement('img');
    img.className = "eventImg";
    img.src = "https://icon-library.com/images/white-plus-icon/white-plus-icon-8.jpg";
    const eventHead = document.createElement("p");
    eventHead.textContent = "Create an event" ;
    anchor.appendChild(img);
    anchor.appendChild(eventHead);
    
    eventDIV.appendChild(anchor);
    container.appendChild(eventDIV);
    anchor.addEventListener("click", ()=> { createEventOptions()});
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the "My Events" link element
    var myEventsLink = document.getElementById("myevents");

    // Add click event listener to the "My Events" link
    myEventsLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        document.querySelector("#listofevents").classList.add("loader");
        // Send a GET request to the Flask backend
        fetch('/myevents')
            .then(response => {
                // Check if the response is OK (status code 200)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse JSON response
                return response.json();
            })
            .then(data => {
                // Handle successful response
                document.querySelector("#listofevents").classList.remove("loader");
                console.log('My Events:', data);
                displayMyEvents(data);
                // Update UI with fetched data (e.g., display in a modal, update a list, etc.)
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching My Events:', error);
            });
    });
});
/*
function printDetailedEvent(Event)
{

 const mainForm = document.querySelector(".specialForm");
 
 mainForm.innerHTML = '';
const eventName = document.createElement("h2");
eventName.className = "eventName";
const crossBtn = document.createElement("button");
crossBtn.textContent = "X";
crossBtn.className = "closeEvent";
crossBtn.addEventListener("click", ()=>{
    closeSpecialForm();
})

const details = document.createElement("div");
const eventImg  = document.createElement("img");
eventImg.src = Event.image_path;

details.className = "eventDetails";
const date = document.createElement("div");
date.className = "eventDate";
const status = document.createElement("div");
status.className = "eventStatus";
eventName.textContent = Event.name;
details.textContent = Event.description;
date.textContent = Event.created_at;
mainForm.appendChild(eventName);
mainForm.appendChild(crossBtn);

mainForm.appendChild(eventImg);
mainForm.appendChild(details);
mainForm.appendChild(date);
mainForm.appendChild(status);

document.querySelector("#ufo").style.display = "block";
setTimeout(() => {
    
    document.querySelector("#ufo").style.display = "none";
}, 5000);

mainForm.style.display = "block";
setTimeout(() => {
    
    mainForm.style.opacity= "1";
}, 1500);
// add other details as well    
}
*/

function printDetailedEvent(Event) {
    const mainForm = document.querySelector(".specialForm");
    mainForm.innerHTML = ''; // Clear previous content
    mainForm.classList.add("printingEvent");
    
    // Banner image (optional, if Event contains a specific field for this)
    const bannerImg = document.createElement("img");
    bannerImg.className = "banner-img"; // Custom class for styling
    if (Event.banner_path) { // Assuming the banner image is stored in a field called 'banner_path'
        bannerImg.src = Event.banner_path; // Set the banner image source
    }

    const eventName = document.createElement("h2");
    eventName.className = "eventName";
    eventName.textContent = Event.name; // Assuming 'name' is always present

    // Close button
    const crossBtn = document.createElement("button");
    crossBtn.textContent = "X";
    crossBtn.className = "closeEvent";
    crossBtn.addEventListener("click", () => {
        closeSpecialForm();
        
    });

    // Add the banner image and event name at the top
    mainForm.appendChild(bannerImg);
    mainForm.appendChild(eventName);
    mainForm.appendChild(crossBtn);
    const entries = Object.entries(Event).reverse();
    // Loop through the Event dictionary to create elements for each key-value pair
    for (const [key, value] of entries) {
        // Skip fields you don't want to display, like ObjectId fields or hidden data
        if (key === "user_id" || key === "_id" || key==='image_path' || key  ==='name' || value === "") {
            continue;
        }
        
        const detailDiv = document.createElement("div");
        detailDiv.className = `event-${key}`; // Classname based on the key
        detailDiv.innerHTML = `<strong>${key.toUpperCase()}:</strong> ${value}`; // Display the key and value
        mainForm.appendChild(detailDiv); // Add to the main container
    }


    if (Event.status === "owner") {
        fetchParticipantDetails(Event.unique_code).then((participants) => {
            if (participants.length > 0) {
                const participantDiv = document.createElement("div");
                participantDiv.className = "participants";

                const participantTitle = document.createElement("h3");
                participantTitle.textContent = "Participants";
                participantTitle.className = "participantHead";
                participantDiv.appendChild(participantTitle);

                // Loop through participants and create elements for them
                participants.forEach((participant) => {
                    const participantDetail = document.createElement("div");
                    participantDetail.className = "participant";
                    
                    participantDetail.innerHTML = `<strong>Username:</strong> ${participant.username} 
                        <br> <strong>Email:</strong> ${participant.email}
                        <br> <strong>Status:</strong> <button id="${participant.email}" onclick="processStatus(this, '${Event.unique_code}')" class="lifechangingbtn drs status ${participant.status}">${participant.status} </button>
                        ` ;
                        // document.querySelector(`#${participant.email}`).addEventListener('click', ()=>{processStatus(this, Event.unique_code)});
                    participantDiv.appendChild(participantDetail);
                });

                mainForm.appendChild(participantDiv);
            } else {
                const noParticipants = document.createElement("p");
                noParticipants.textContent = "No participants have joined yet.";
                mainForm.appendChild(noParticipants);
            }
        });
    }
        
    document.querySelector("#ufo").style.display = "block";
    setTimeout(() => {
        document.querySelector("#ufo").style.display = "none";
    }, 5000);

    mainForm.style.display = "block";
    setTimeout(() => {
        mainForm.style.opacity = "1";
    }, 1500);
}

 async function fetchParticipantDetails(unique_code) {
    try {
         const response = await fetch(`/participants?event_code=${unique_code}`);
         if (!response.ok) {
             throw new Error("Failed to fetch participants");
         }
         return await response.json();
     } catch (error) {
         console.error("Error fetching participants:", error);
         return [];
     }
}

function closeSpecialForm()
{const mainForm = document.querySelector(".specialForm");
document.querySelector("#ufo").style.display = "block";
document.querySelector("#ufo").style.display = "block";
document.querySelector("#ufo").style.display = "none";
document.querySelector("#ufo").style.display = "block";
setTimeout(() => {
    
    mainForm.style.opacity = 0;
}, 2000);


    setTimeout(() => {
        
        document.querySelector("#ufo").style.display = "none";
        mainForm.style.display= 'none';
        mainForm.classList.remove("printingEvent");

    }, 4000);

}




