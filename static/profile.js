document.addEventListener("DOMContentLoaded", function () {
    const profileTab = document.getElementById("profileTab");
let btn = 0;
    function loadUserProfile() {
        document.querySelector(".profileDetails").classList.add("loader")
        
        fetch('/get-user-profile')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                return response.json();
            })
            .then((data) => {
        
                console.log(data);
                document.querySelector(".profileDetails").classList.remove("loader")
                // const username = document.createElement("")
                document.getElementById("userName").textContent = data.name;
                document.getElementById("userEmail").textContent = data.email;
                const cat = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRLPpm5qa_1W_KGAYsp1fHk9_PkhN338hDgeiMg5hWPQ&s";
                document.getElementById("pp").querySelector("img").src = data.profilePic || cat;

                const personalDetails = data.personal_details;
                const profileForm = document.querySelector(".profileForm");

                    
                const userInfo = document.getElementById("additionalDetails");
                userInfo.innerHTML = "";
                    if (Object.keys(personalDetails).length > 0) {
                        populateForm(personalDetails);
                        Object.entries(personalDetails).forEach(([key, value]) => {
                            const detailElement = document.createElement("p");
                            if(key === "dob")
                            {key = "Date of Birth";
                            }
                            else if(key === "accountType")
                            {key = "Account Type";}

                            detailElement.innerHTML = `<strong>${key}:</strong> ${value}`;
                            userInfo.appendChild(detailElement);
                        });
                    }
                    
                 
                
                    // If not, hide the form and display a message
                    if(btn == 0)
                    {btn = 1;
                    profileForm.style.display = "none";
                    const editProfile = document.createElement("button");
                    editProfile.textContent = "Edit Profile";
                    editProfile.id = "edit-profile"
                    editProfile.addEventListener("click", () => {
                        toggleEditForm();
                        

                    });
                    document.querySelector(".profileDetails").appendChild(editProfile);
                }
                
            })
            .catch((err) => {
                console.error("Error fetching user profile:", err);
            });
    }


    function populateForm(personalDetails) {
        const form = document.getElementById("personalDetailsForm");

        form.querySelector("input[name='dob']").value = personalDetails.dob || "";
        form.querySelector("input[name='phone']").value = personalDetails.phone || "";
        form.querySelector("textarea[name='about']").value = personalDetails.about || "";
        form.querySelector("input[name='linkedin']").value = personalDetails.linkedin || "";
        form.querySelector("input[name='github']").value = personalDetails.github || "";
        form.querySelector("select[name='accountType']").value = personalDetails.accountType || "user";

        
    }

    document.querySelector("#account").addEventListener("click", loadUserProfile);

    const personalDetailsForm = document.getElementById("personalDetailsForm");
    personalDetailsForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(personalDetailsForm);

        fetch('/update-user-profile', {
            method: 'POST',
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update profile");
            }
            return response.json();
        })
        .then((data) => {
            alert("Profile updated!");
            console.log("Profile updated:", data);
        })
        .catch((err) => {
            console.error("Error updating profile:", err);
        });
    });
});


let soham = 0;
    function toggleEditForm() {

        const profileForm = document.querySelector(".profileForm");
        const detailsDiv = document.querySelector(".profileDetails");
        if(soham === 0 )
        {   soham = 1;
            profileForm.style.display = "block";
            setTimeout(() => {
                
                profileForm.style.opacity= 1;
                detailsDiv.style.opacity = 0;
                setTimeout(() => {
                    detailsDiv.style.display  = "none";
                }, 100);
            }, 100);
        }
        else{
            soham = 0;
            
            detailsDiv.style.display = "block";
            setTimeout(() => {
                
                profileForm.style.opacity= 0;
                detailsDiv.style.opacity = 1;
                setTimeout(() => {
                    profileForm.style.display  = "none";
                }, 100);
            }, 100);

        }

    }