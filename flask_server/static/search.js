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
      return false; // TODO: change to true
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
  console.log(result) // display fetch result log
  return result
}

function showResults() {
  var keyword = document.getElementById("keyword")
  var category = document.getElementById("category")
  var results = document.getElementById("results")
  if (isnull(keyword.value) === true || isnull(category.value) === true) {
    alert("Please enter valid values.")
  } else {
    // fetch movie results by key word
    if (category.value === "movies") {
      window.onload = fetchR(serverUrl + "/api/search/movie/" + keyword.value).then(json=>showMovies(json))
    }
    results.style.display = "block" // display show results
    for (var i = 0; i < 3; i++) {
      // results.innerHTML += "<span>child</span><br>"
      var card = document.createElement('DIV')
      card.className = "card"
      results.appendChild(card)
      var img = document.createElement('IMG');
      img.className = "result-img"
      img.src = 'static/img/poster-placeholder.png'
      card.appendChild(img)
    }

    // var btn = document.createElement("BUTTON")   // Create a <button> element
    // btn.innerHTML = "CLICK ME"                   // Insert text
    // results.appendChild(btn)          // Append <button> to <body>
  }
}

function showMovies(json) {
  
}