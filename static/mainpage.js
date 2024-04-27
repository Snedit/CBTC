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


function myAccount()
{
hideEvent();
hideTrending();
hideNotify();
document.querySelector("#profileTab").style.display = "block";
setTimeout(() => {
    
    document.querySelector("#profileTab").style.opacity= "1";
}, 100);

}


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
    hideAccount();    
    document.querySelector("#trendTab").style.display = "block";
    setTimeout(() => {
        document.querySelector("#trendTab").style.opacity= "1";
    }, 100);

}
function showEvent()
{
hideTrending();
hideAccount();
document.querySelector("#MyEventTab").style.display = "block";
setTimeout(() => {
    
    document.querySelector("#MyEventTab").style.opacity= "1";
}, 100);
}
function showNotify()
{

}
function hideNotify()
{

}

function hideAccount()
{

    document.querySelector("#profileTab").style.opacity= "0";
    setTimeout(() => {
        
        document.querySelector("#profileTab").style.display = "none";
    }, 100);

}

function hideEvent()
{
    document.querySelector("#MyEventTab").style.opacity= "0";
    setTimeout(() => {
        
        document.querySelector("#MyEventTab").style.display = "none";
    }, 100);
}


