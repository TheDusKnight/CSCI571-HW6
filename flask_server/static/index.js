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
    // TODO: 在server和browser添加cor功能
    // mode:'cors',
    // responseType: 'json',
  });
  let result = await response.text() // TODO: 为什么要有text?
  // alert(result)
  console.log(result)
  // document.getElementById('trending_movie').innerHTML = result
  return result
}
// fetchR("http://localhost:5000/api/movies").then(result=>display_trending(result, "slides", "movie"))
var slideIndex = 0
display_trending_movie()
// trending_movie()

// Display AJAX result in html
function display_trending(result, id, type) {
  // alert(typeof result)
  // document.getElementById(id).innerHTML = result

  const obj = JSON.parse(result)
  if (type === "movie") {
    // trending_movie()
    console.log("nothing")
  } else if (id === "tv") {
    
  }

  // for (var i in obj.results) {
  //   console.log(obj.results[i].title)
  // }
  // console.log(obj.results[val].title);
  // var info = {
  //   imgPath = result.backdrop_path,
  //   year = result.release_date,
  //   title = result.title
  // }
  // alert(JSON)

  // var i;
  // var slides = document.getElementsByClassName(id);
  // console.log(slides)
  // var captions = document.getElementsByClassName("captions");
  // for (i = 0; i < slides.length; i++) {
  //   slides[i].style.display = "none";
  // }
  // slideIndex++;
  // if (slideIndex > slides.length) {slideIndex = 1} // 恢复index
  // slides[slideIndex-1].style.display = "block";

  // alert(obj.results[slideIndex-1].backdrop_path)
  // slides[slideIndex-1].src = obj.results[slideIndex-1].backdrop_path
  // console.log(obj.results[slideIndex-1].backdrop_path)
  
  // setTimeout(display_trending(id), 3000); // Change image every 2 seconds
}

function display_trending_movie(result,id) {
  var i;
  var slides = document.getElementsByClassName("slides");
  var captions = document.getElementsByClassName("captions");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1} // 恢复index
  slides[slideIndex-1].style.display = "block";
  setTimeout(display_trending_movie, 3000); // Change image every 2 seconds
}

function trending_movie() {
  var i;
  var slides = document.getElementsByClassName("slides");
  console.log(slides)
  var captions = document.getElementsByClassName("captions");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1} // 恢复index
  slides[slideIndex-1].style.display = "block";
  // alert(obj.results[slideIndex-1].backdrop_path)

  // slides[slideIndex-1].src = obj.results[slideIndex-1].backdrop_path
  // console.log(obj.results[slideIndex-1].backdrop_path)
  
  setTimeout(trending_movie, 3000); // Change image every 2 seconds
}