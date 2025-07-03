$(document).ready(function () { 
  console.log("🧠 profile.js is running!");

  const BACKEND_BASE_URL = "https://guvi-backend-1-a6kc.onrender.com/php"; // ✅ Added /php

  const email = localStorage.getItem("loggedInUser");
  console.log("📧 Found email in localStorage:", email);

  if (!email) {
    alert("User not logged in.");
    window.location.href = "login.html";
    return;
  }

  // 🔄 Fetch user profile
  $.ajax({
    url: `${BACKEND_BASE_URL}/fetch_profile.php`,
    method: "POST",
    data: { email },
    dataType: "json",
    success: function (res) {
      console.log("✅ fetch_profile.php response:", res);

      if (res.success && res.user) {
        $("#userName").text(res.user.name || "No Name");
        $("#userEmail").text(res.user.email || email);
        $("#userAge").text(res.user.age || "--");
        $("#userDob").text(res.user.dob || "--");
        $("#userContact").text(res.user.contact || "--");
      } else {
        alert(res.message || "User not found.");
      }
    },
    error: function (xhr, status, err) {
      console.error("❌ Fetch error:", err, xhr.responseText);
      alert("Failed to load profile.");
    }
  });

  // 💾 Save profile
  $(".btn-success").click(function () {
    const data = {
      email,
      age: $("#editAge").val(),
      dob: $("#editDob").val(),
      contact: $("#editContact").val()
    };

    console.log("💾 Sending update data:", data);

    $.ajax({
      url: `${BACKEND_BASE_URL}/update_profile.php`,
      method: "POST",
      data: data,
      dataType: "json",
      success: function (res) {
        console.log("✅ update_profile.php response:", res);

        if (res.success) {
          $("#userAge").text(data.age);
          $("#userDob").text(data.dob);
          $("#userContact").text(data.contact);
          toggleEdit(false);
          alert("Profile updated successfully!");
        } else {
          alert(res.message || "Update failed.");
        }
      },
      error: function (xhr, status, err) {
        console.error("❌ Update error:", err, xhr.responseText);
        alert("Error updating profile.");
      }
    });
  });

  // 🚪 Logout
  $(".btn-logout").click(function () {
    console.log("👋 Logging out...");
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });
});

// ✨ Toggle edit mode
function toggleEdit(force = null) {
  const staticView = $("#staticView");
  const editView = $("#editView");
  const toggleBtn = $(".btn-toggle-edit");

  const editing = force !== null ? force : editView.css("display") === "none";

  if (editing) {
    $("#editAge").val($("#userAge").text());
    $("#editDob").val($("#userDob").text());
    $("#editContact").val($("#userContact").text());
    staticView.hide();
    editView.show();
    toggleBtn.text("Cancel");
  } else {
    staticView.show();
    editView.hide();
    toggleBtn.text("Edit Profile");
  }
}
