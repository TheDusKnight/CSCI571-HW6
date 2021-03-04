'use strict';
console.log('window inner sizes: ' + window.innerWidth + ' x ' + window.innerHeight)

function toggleSearch() {
  document.getElementById('home').style.display = "none"
  document.getElementById("search").style.display="block";
  console.log("show search")
}

function toggleHome() {
  document.getElementById('search').style.display = "none"
  document.getElementById('home').style.display = "block"
}

function sleep(ms) {
  return new Promise(resolve => 
      setTimeout(resolve, ms)
  )
}

// AJAX
// var lnkHome = "http://127.0.0.1:5000/api/movies"
async function fetchR(inputLnk) {
  const response = await fetch(inputLnk, {
    method: 'GET',
    // TODO: 在server和browser添加cor功能
    // mode:'cors',
    responseType: 'json',
  });
  let result = await response.text()
  console.log(result)
  return result
}

var slideIndex = 0
window.onload = fetchR("http://localhost:5000/api/movies").then(result=>display_trending(result, "movie"))
window.onload = fetchR("http://localhost:5000/api/tvs").then(result=>display_trending(result, "tv"))
showSlides()

function display_trending(result, type) {
  const obj = JSON.parse(result)
  const res = obj.results
  if (type === "movie") {
    var captions = document.getElementsByClassName("movieCaption")
    var slides = document.getElementsByClassName("movieSlide")
    for (var i in res) {
      var imgPath = res[i].backdrop_path
      var name = res[i].title
      var year = res[i].release_date
      slides[i].src = imgPath
      captions[i].innerHTML = name + " (" + year + ")"
    }
    console.log("Trending Movies changed")
  } 
  else if (type === "tv") {
    var captions = document.getElementsByClassName("tvCaption")
    var slides = document.getElementsByClassName("tvSlide")
    for (var i in res) {
      var imgPath = res[i].backdrop_path
      var name = res[i].name
      var year = res[i].first_air_date
      slides[i].src = imgPath
      captions[i].innerHTML = name + " (" + year + ")"
    }
    console.log("TV show changed")
  }
}

// Display AJAX result in html
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("slides");
  for (i = 0; i < 5; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 5; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > 5) {slideIndex = 1} // 恢复index
  slides[slideIndex-1].style.display = "block";
  slides[slideIndex+5-1].style.display = "block";
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}