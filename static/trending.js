function createEvent(event)
{

    const card = document.createElement('div');
    card.classList.add('event-card');

  // Create image element
  const image = document.createElement('img');
  image.classList.add('event-image');
  image.src = event.imageAddress;
  image.alt = event.name;

  // Create heading element for event name
  const heading = document.createElement('h2');
  heading.textContent = event.name;

  // Create paragraph element for event details
  const details = document.createElement('p');
  details.textContent = event.details;
  details.setAttribute("class", "eventSummary");

  // Create paragraph element for event date
  const date = document.createElement('span');
  date.textContent = event.date;

  // Append elements to card
  card.appendChild(image);
  card.appendChild(heading);
  card.appendChild(details);
  card.appendChild(date);

  return card;
}

function fetchTrends()
{
    // take n from the db. here for the time being we are doing static
    // of 20 items
    fetch('/static/events.json')
    .then(response=> response.json())
    .then(data => {
        renderTrends(data);
    })
    .catch(error=>{
        console.error("error loading events: ", error);
        document.getElementById("trendGrid").innerText = "Could not fetch latest trends";
    
});

}
document.addEventListener('DOMContentLoaded', function () {
    fetchTrends();
    revealTrends();
});

function renderTrends(trends) {
    var trendGrid = document.getElementById('trendGrid');
    trends.forEach(trend => {
        var card = document.createElement('div');
        card.classList.add('card');

        var image = document.createElement('img');
        image.src = trend.imageAddress;
        image.alt = trend.name;

        var content = document.createElement('div');
        content.classList.add('content');

        var heading = document.createElement('h2');
        heading.textContent = trend.name;

        var details = document.createElement('p');
        details.textContent = trend.details;
        details.classList.add("eventSums")
        
        var date = document.createElement('p');
        date.textContent = trend.date;
        date.classList.add("eventDate")

        content.appendChild(heading);
        content.appendChild(details);
        content.appendChild(date);

        card.appendChild(image);
        card.appendChild(content);

        trendGrid.appendChild(card);
    });
}
function revealTrends()
{
    document.getElementById("trending-container").style.opacity = 1;
}


