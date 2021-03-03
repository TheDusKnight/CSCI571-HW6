'use strict';
// alert("listen!")
console.log('window inner sizes: ' + window.innerWidth + ' x ' + window.innerHeight)

document.title = '学习java'

function toggleSearch() {
  document.getElementById('home').style.display = "none"
  document.getElementById("search").style.display="block";
  console.log("show search")
}

function toggleHome() {
  document.getElementById('search').style.display = "none"
  document.getElementById('home').style.display = "block"
}