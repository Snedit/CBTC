let menu = document.querySelector("#menu-bars");
let navbar = document.querySelector(".navbar");

var swiper = new Swiper(".home-slider", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 2,
      slideShadows: true,
    },
   loop: true,
   autoplay:{
delay: 1500,
disableOnInteraction: false,

   }
  });

  const slide = document.querySelector(".swiper-slide");
  const slideInfo = document.querySelector("#booking-info");
  const info = ["Parties", "Weddings", "Hackathon", "Birthday","Moment of Celebration"];
  let i= 0;

    setInterval(() => {
      if(i >= info.length)
      i = 0;

        slideInfo.textContent = info[i++];
        setTimeout(()=>{
          slideInfo.style.opacity = 0;
          setTimeout(()=>{
            slideInfo.style.opacity = 1;
  
          }, 1000)
        }, 1000)


    }, 2000);



    const gallery = document.querySelector('.section');
function reveal()

{

setTimeout(() => {
  document.querySelector("#s1").style.opacity = 1;
  setTimeout(() => {
    
    document.querySelector("#s2").style.opacity = 1;
    setTimeout(() => {
      
      document.querySelector("#s3").style.opacity = 1;
}, 1000);

}, 1000);

}, 1000);

}

let type = 0; // 0 means login

function showForm()
{
const formContainer = document.querySelector(".formContainer");
formContainer.style.display = "block";
setTimeout(() => {
  
  formContainer.style.opacity= 1;
}, 1000);
  const formm = document.querySelector(".contact-form");
  formm.style.display = "block";
  formm.style.opacity = 1;


    if(type == 0)
    {

      document.querySelector("#nameP").style.display = "none";
      document.querySelector("#name-field").style.display = "none";
      type = 1;
    
  
  }
  
}

function closeForm()
{
  const formContainer = document.querySelector(".formContainer");
  formContainer.style.opacity= 0;
  setTimeout(() => {
    formContainer.style.display= 'block';
  }, 1000);
}



function toggleForm() {
  
  var formTitle = document.getElementById('form-title');
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  var submitBtn = document.getElementById('submit-btn');
  var toggleBtn = document.getElementById('toggle-btn');
  var nameField = document.getElementById('name-field');

  if (formTitle.textContent === 'LOGIN') {
    document.querySelector("#nameP").style.display = "block";
    formTitle.textContent = 'SIGN UP';
    submitBtn.value = 'Sign up';
    toggleBtn.textContent = 'Login';
    nameField.style.display = 'block'; // Display the name field for sign up
  } else {
    formTitle.textContent = 'LOGIN';
    submitBtn.value = 'Sign in';
    toggleBtn.textContent = 'Sign Up';
    nameField.style.display = 'none'; // Hide the name field for login
    document.querySelector("#nameP").style.display = "none";
  }

  // Clear input fields
  emailInput.value = '';
  passwordInput.value = '';
  document.getElementById('name').value = ''; // Clear the name field

}
