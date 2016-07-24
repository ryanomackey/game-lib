'use strict';

var open = true;

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

if (window.screen.width < 450) {
  closeNav();
  open = false;
}

document.getElementById("navToggle").addEventListener('click', function() {
  if (open) {
    closeNav();
    open = false;
  } else {
    openNav();
    open = true;
  }
});
