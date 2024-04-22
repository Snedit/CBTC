document.addEventListener('DOMContentLoaded', function () {
    // Get all the links in the navbar
    var links = document.querySelectorAll('.navbar a');

    // Add click event listener to each link
    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            // Prevent the default behavior of the link
            event.preventDefault();

            // Remove active class from all links
            links.forEach(function (link) {
                link.classList.remove('active');
            });

            // Add active class to the clicked link
            link.classList.add('active');
        });
    });
});


function hideTrending()
{
    document.querySelector("#trendTab").style.opacity= 0;
setTimeout(() => {
    document.querySelector("#trendTab").style.display= "none";
}, 500);

}
function showTrending()
{
    hideEvent();
    hideNotify();
    
    document.querySelector("#trendTab").style.display = "block";
    setTimeout(() => {
        document.querySelector("#trendTab").style.opacity= "1";
    }, 100);

}
function showEvent()
{
hideTrending();
document.querySelector("#MyEventTab").style.display = "block";
setTimeout(() => {
    
    document.querySelector("#MyEventTab").style.opacity= "1";
}, 100);
}
function showNotify()
{

}
function myAccount()
{

}

function hideEvent()
{
    document.querySelector("#MyEventTab").style.opacity= "0";
    setTimeout(() => {
        
        document.querySelector("#MyEventTab").style.display = "none";
    }, 100);
}

function hideNotify()
{

}

