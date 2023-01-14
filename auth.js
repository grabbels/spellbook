import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseUrl = "https://gpciwfqwgaphkdqlqutq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwY2l3ZnF3Z2FwaGtkcWxxdXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM3MzA5OTksImV4cCI6MTk4OTMwNjk5OX0.j4ZXU5w3u_5vG9D_WA0DrObEX0sfeMVlnfS5-pcH24w";
// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

let loginOpenButton = document.getElementById("login");
let loginModal = document.getElementById("loginmodal");
let loginRegisterForm = document.getElementById("loginregisterform");
let switchToLogin = document.getElementById("switchtosignin");
let switchToRegister = document.getElementById("switchtoregister");
let loginButton = document.getElementById("loginbtn");
let registerButton = document.getElementById("registerbtn");
let emailField = document.getElementById("email");
let passwordField = document.getElementById("psw");
let passwordControlField = document.getElementById("psw-repeat");

loginOpenButton.addEventListener("click", () => {
  loginModal.style.display = "flex";
  loginModal.parentElement.style.display = "block";
  document.body.style.position = "fixed";
  document.body.style.overflowY = "scroll";
  var closeButton = loginModal.querySelector(".remove_spell");
  closeButton.addEventListener("click", (e) => {
    closeTempSpell();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTempSpell();
    }
  });
  function closeTempSpell() {
    event.preventDefault();
    loginModal.style.display = "none";
    loginModal.parentElement.style.display = "none";
    document.body.style.position = "static";
    document.body.style.overflowY = "auto";
    let savedScrollPosition = document.documentElement.getAttribute("data-scroll");
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, savedScrollPosition);
    document.documentElement.style.scrollBehavior = "smooth";
  }
});

switchToRegister.addEventListener("click", () => {
  loginRegisterForm.className = "register";
  passwordControlField.required = true;

});
switchToLogin.addEventListener("click", () => {
  loginRegisterForm.className = "login";
  passwordControlField.required = false;
});

async function registerLoginUser() {
  if (passwordField.value === passwordControlField.value) {
    const { data, error } = await supabase.auth
      .signUp({
        email: emailField,
        password: passwordField,
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("Password fields do not match.");
  }
}

//Account creation
