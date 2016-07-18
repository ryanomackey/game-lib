'use strict';

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

var open = true;

document.getElementById("navToggle").addEventListener('click', function() {
  if (open) {
    closeNav();
    open = false;
  } else {
    openNav();
    open = true;
  }
});
