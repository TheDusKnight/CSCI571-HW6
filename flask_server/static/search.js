'use strict';
console.log("search.js triggered")
var serverUrl = "http://127.0.0.1:5000"

function clearText() {
  document.getElementById("search-form").reset()
}

function isnull(val) {
  var str = val.replace(/(^\s*)|(\s*$)/g, '');//把val首尾的空格去掉。

  if (str == '' || str == undefined || str == null) {//输入框中输入空格也为空
      console.log('空');
      console.log("str.length===" + str.length);
      return true; // TODO: change to true
  } else {
      console.log('非空');//输入框中输入null、undefined也为非空
      console.log("str.length===" + str.length);
      return false;
  }
}

async function fetchR(inputLnk) {
  const response = await fetch(inputLnk, {
    method: 'GET',
    mode:'cors',
    responseType: 'json',
  });
  let result = await response.text()
  // console.log(result) // display fetch result log
  return result
}

function showResults() {
  var keyword = document.getElementById("keyword")
  var category = document.getElementById("category")
  // var results = document.getElementById("results")
  if (isnull(keyword.value) === true || isnull(category.value) === true) {
    alert("Please enter valid values.")
  } else {
    // fetch movie results by key word
    if (category.value === "movies") {
      window.onload = fetchR(serverUrl + "/api/search/movie/" + keyword.value).then(json=>showAll(json))
    } else if (category.value === "tvs") {
      window.onload = fetchR(serverUrl + "/api/search/tv/" + keyword.value).then(json=>showAll(json))
    } else if (category.value === "multi") {
      window.onload = fetchR(serverUrl + "/api/search/multi/" + keyword.value).then(json=>showAll(json))
    } else { alert("category incorrect!") } // TODO: change alert to console.log
  }
}

function showAll(json) {
  var results = document.getElementById("results")
  const res = JSON.parse(json).results
  if (res.length < 1 || res == undefined) {
    results.innerHTML = "<p id='no-result'>No results found.</p>"
  } else {
    results.innerHTML = "<p>Showing results...</p>" // 清除之前内容，显示新的内容
    // alert(res[0].poster_path)
    // alert(res.length)
    // results.style.display = "block" // display show results?
    for (var i = 0; i < res.length; i++) {
      var card = document.createElement('DIV')
      card.className = "card"
      results.appendChild(card)

      var img = document.createElement('IMG');
      img.className = "result-img"
      // img.src = 'static/img/poster-placeholder.png'
      img.src = res[i].poster_path
      card.appendChild(img)

      var cardText = document.createElement("DIV")
      cardText.className = "card-text"
      // result.appendChild(cardText)
      card.appendChild(cardText)
      
      var title = document.createElement("H4")
      title.className = "card-title"
      title.innerText = (res[i].title || res[i].name)
      cardText.appendChild(title)
      // if (res[i].title) alert("Movie")

      cardText.appendChild(document.createElement("BR"))

      var yearType = document.createElement("P")
      yearType.innerText = (res[i].release_date || res[i].first_air_date) + " | " + res[i].genres.join(", ")
      cardText.appendChild(yearType)

      // var vote = document.createElement("P")
      // vote.innerText = 
    }
  }
}