'use strict';
// alert("listen!")
console.log('window inner sizes: ' + window.innerWidth + ' x ' + window.innerHeight)

// document.title = '学习java'

function toggleSearch() {
  document.getElementById('home').style.display = "none"
  document.getElementById("search").style.display="block";
  console.log("show search")
}

function toggleHome() {
  document.getElementById('search').style.display = "none"
  document.getElementById('home').style.display = "block"
}

// AJAX
// var lnkHome = "http://127.0.0.1:5000/api/movies"
// var lnkHome = "http://localhost:5000/api/movies"
async function fetchR(inputLnk) {
  const response = await fetch(inputLnk, {
    method: 'GET',
    // mode:'cors',
    // responseType: 'json',
  });
  let result = await response.text()
  // alert(result)
  console.log(result)
  // document.getElementById('trending_movie').innerHTML = result
  return result
}
fetchR("http://localhost:5000/api/movies").then(result=>display_trending_movie(result, 'trending_movie'))

// Display AJAX result in html
function display_trending_movie(result,id) {
  // alert(typeof result)
  // document.getElementById(id).innerHTML = result
}