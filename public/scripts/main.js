//Login Pop-up logic
function loginForm() {
    $(".regLink").removeClass("active");
    $(".logLink").addClass("active");
    $("#register").css("display", "none");
    $("#login").css("display", "block");
}

function registerForm() {
    $(".logLink").removeClass("active");
    $(".regLink").addClass("active");
    $("#login").css("display", "none");
    $("#register").css("display", "block");
}

//Not logged in popup
function oops() {
    $(".oops").remove();
    $(".modal-body").before("<div class=' oops alert alert-dismissable fade show' role='alert'>You need to be logged in to do that <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>")
};

// Login form tab logic
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabContent, tabLinks;

    // Get all elements with class="tabcontent" and hide them
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tabLinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Check password logic
var pass1 = ""
function getPassVal(pass) {
    return pass1 = pass;
};
function checkPass(pass2) {
    if(pass1 === pass2) {
        $(".userButton").removeClass("disabled");
        $(".userButton").removeAttr("disabled");
    } else {
        $(".userButton").addClass("disabled");
        $(".userButton").attr("disabled", "true");
    }
}