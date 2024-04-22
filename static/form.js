
function loginUser(email, password)
{

checkUser(email, password);

}
function signUp(name, email, password)
{

}

async function submitForm() {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const title = document.querySelector("#form-title");

    if(title.textContent == 'SIGN UP')
    {
        var formData = {
            username: document.getElementById('name-field').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 409) {
                return response.json().then(data => Promise.reject(data.error));
            } else {
                return Promise.reject('Signup failed');
            }
        })
        .then(data => {
            console.log(data);
            alert('Signup successful');
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error); // Alert the error message if signup fails
        });
    }

    
    else
    {
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                return Promise.reject('User not found');
            } else if (response.status === 401) {
                return Promise.reject('Invalid password');
            } else {
                return Promise.reject('Login failed');
            }
        })
        .then(data => {
            console.log(data.user_id);
            alert('Login successful. Redirecting you to the main page');
            window.location.href = `/main/${data.user_id}` ;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error); // Alert the error message if login fails
        });

    }
    // Log form data to console (you can perform other operations here)
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Name:', name);

    // You can now send this data to your server or perform other operations
  }
