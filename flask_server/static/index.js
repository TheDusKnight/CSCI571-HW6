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
  // alert(result)
  console.log(result)
  // document.getElementById('trending_movie').innerHTML = result
  return result
}

var slideIndex = 0
window.onload = fetchR("http://localhost:5000/api/movies").then(result=>display_trending(result, "slides", "movie"))
// fetchR("http://localhost:5000/api/movies").then(result=>showSlides(result, "slides", "movie"))

function display_trending(result, id, type) {
  const obj = JSON.parse(result)
  if (type === "movie") {
    // document.getElementById("img_test").src = "https://image.tmdb.org/t/p/w780/srYya1ZlI97Au4jUYAktDe3avyA.jpg"
    // var slides = document.getElementsByClassName("slides")
    var captions = document.getElementsByClassName("movieCaption")
    var slides = document.getElementsByClassName("movieSlide")
    var res = obj.results
    
    for (var i in res) {
      var imgPath = res[i].backdrop_path
      var name = res[i].title
      var year = res[i].release_date
      // alert(slides[i].src)
      slides[i].src = imgPath
      captions[i].innerHTML = name + " (" + year + ")"
    }
    console.log("Trending Movies changed")
    // alert(document.getElementsByClassName("slides")[0].src)
    showSlides()
  } 
  else if (id === "tv") {
    
  }
}

// Display AJAX result in html
function showSlides() {
  // document.getElementById(id).src = result
  var i;
  var slides = document.getElementsByClassName("slides");
  // alert(slides[0].src)
  // var captions = document.getElementsByClassName("captions");

  // if (slides) {alert(slides[i])}
  // alert(slides[0].innerHTML)
  for (i = 0; i < 5; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 5; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  // if (slideIndex > slides.length) {slideIndex = 1} // 恢复index
  if (slideIndex > 5) {slideIndex = 1} // 恢复index
  slides[slideIndex-1].style.display = "block";
  slides[slideIndex+5-1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 3 seconds
}

// function display_trending_2(result, id) {
//   var slideIndex = 0
//   var i
//   var slides = document.getElementsByClassName("slides")
//   var captions = document.getElementsByClassName("captions")

//   while (true) {
//     for (i = 0; i < slides.length; i++) {
//       slides[i].style.display = "none"
//     }

//     slideIndex++
//     if (slideIndex >= slides.length) {slideIndex = 0}
//     slides[slideIndex].style.display = "block"
//     delay()
//   }

//   function delay() {
//     setTimeout(3000)
//   }
// }