
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
    status.classList.add = myevent.status;

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
                participantDiv.appendChild(participantTitle);

                // Loop through participants and create elements for them
                participants.forEach((participant) => {
                    const participantDetail = document.createElement("div");
                    participantDetail.className = "participant";
                    participantDetail.innerHTML = `<strong>Username:</strong> ${participant.username} 
                        <br> <strong>Email:</strong> ${participant.email}
                        <br> <strong>Status:</strong> ${participant.status}`;
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