$(document).ready(function () {
  const BACKEND_URL = "https://yourbackend.epizy.com/signup.php"; // ⬅️ Replace with your actual backend URL

  const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  const contactRegex = /^[0-9]{10}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  function validateField(id, isValid, msg) {
    const input = $(`#${id}`);
    const error = $(`#${id}Error`);
    if (!isValid) {
      input.removeClass('is-valid').addClass('is-invalid');
      error.text(msg);
    } else {
      input.removeClass('is-invalid').addClass('is-valid');
      error.text('');
    }
  }

  $('#email').on('input', () =>
    validateField('email', emailRegex.test($('#email').val()), 'Please enter a valid email address.')
  );
  $('#contact').on('input', () =>
    validateField('contact', contactRegex.test($('#contact').val()), 'Enter a valid 10-digit phone number.')
  );
  $('#password').on('input', () =>
    validateField('password', passwordRegex.test($('#password').val()), 'Password must be 6+ chars with caps, number & symbol.')
  );

  $('#signupForm').submit(function (e) {
    e.preventDefault();

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    const age = $('#age').val().trim();
    const dob = $('#dob').val().trim();
    const contact = $('#contact').val().trim();

    let isValid = true;

    if (name === "") isValid = false;
    if (!emailRegex.test(email)) { validateField('email', false, 'Enter a valid email.'); isValid = false; }
    if (!passwordRegex.test(password)) { validateField('password', false, 'Weak password.'); isValid = false; }
    if (!contactRegex.test(contact)) { validateField('contact', false, 'Invalid contact number.'); isValid = false; }

    if (age === "" || isNaN(age) || parseInt(age) <= 0) {
      $('#age').addClass('is-invalid');
      $('#ageError').text('Enter a valid age.');
      isValid = false;
    } else {
      $('#age').removeClass('is-invalid').addClass('is-valid');
      $('#ageError').text('');
    }

    if (dob === "") {
      $('#dob').addClass('is-invalid');
      $('#dobError').text('Please enter DOB.');
      isValid = false;
    } else {
      $('#dob').removeClass('is-invalid').addClass('is-valid');
      $('#dobError').text('');
    }

    if (!isValid) {
      $('#responseMsg').html(`<div class="alert alert-danger">Please fill all fields correctly.</div>`);
      return;
    }

    const data = { name, email, password, age, dob, contact };

    $.ajax({
      type: 'POST',
      url: BACKEND_URL, // ✅ Using full URL to hosted PHP file
      data: data,
      dataType: 'json',
      success: function (response) {
        if (response.status === 'success') {
          $('#responseMsg').html(`<div class="alert alert-success">${response.message}</div>`);
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
        } else {
          $('#responseMsg').html(`<div class="alert alert-danger">${response.message}</div>`);
        }
      },
      error: function () {
        $('#responseMsg').html(`<div class="alert alert-danger">Something went wrong. Try again.</div>`);
      }
    });
  });
});
