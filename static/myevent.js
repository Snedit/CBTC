
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
    img.src = myevent.img;
    const eventHead = document.createElement("p");
    const status = document.createElement('p');
    status.textContent  = "Accepted";
    status.className = "status";
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
    anchor.addEventListener("click", ()=> {showForm()});
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
eventImg.src = Event.img;

details.className = "eventDetails";
const date = document.createElement("div");
date.className = "eventDate";
const status = document.createElement("div");
status.className = "eventStatus";
eventName.textContent = Event.name;
details.textContent = Event.des;
date.textContent = Event.time;
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


    }, 4000);

}