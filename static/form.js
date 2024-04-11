function submitForm() {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Log form data to console (you can perform other operations here)
    console.log('Email:', email);
    console.log('Password:', password);

    // You can now send this data to your server or perform other operations
  }
