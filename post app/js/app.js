import supabase from "./supabase.js";

function showSignup() {
    document.getElementById("signUp").style.display = "flex";
    document.getElementById("login").style.display = "none";
    document.getElementById("btns2").style.backgroundColor = "white";
    document.getElementById("btns1").style.backgroundColor = "#cdb4db";
}

function showLogin() {
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "flex";
    document.getElementById("btns1").style.backgroundColor = "white";
    document.getElementById("btns2").style.backgroundColor = "#cdb4db";
}

window.showLogin = showLogin;
window.showSignup = showSignup;

async function login(event) {
    event.preventDefault();
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert(error.message);
    } else {
        alert("Login successful!");
        window.location.href = "dashboard.html";
    }
}
window.login = login;
async function google(event) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://127.0.0.1:5500/dashboard.html'
        }
    })
    if (error) {
        console.log(error);
        alert(error.message)
    }
}

window.google = google;
async function signup(event) {
    event.preventDefault();
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert(error.message);
    } else {
        alert("Signup successful! Redirecting to dashboard...");
        window.location.href = "dashboard.html";
    }
}
window.signup = signup;
