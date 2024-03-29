'use strict';
console.log("search.js triggered")
// var serverUrl = "http://127.0.0.1:5000"
var serverUrl = "https://trevor-hello-movie.azurewebsites.net"

function clearText() {
  document.getElementById("search-form").reset()
}

function isnull(val) {
  var str = val.replace(/(^\s*)|(\s*$)/g, '');//把val首尾的空格去掉。

  if (str == '' || str == undefined || str == null) {//输入框中输入空格也为空
    console.log('empty');
    console.log("str.length===" + str.length);
    return true;
  } else {
    console.log('non empty');//输入框中输入null、undefined也为非空
    console.log("str.length===" + str.length);
    return false;
  }
}

async function fetchR(inputLnk) {
  const response = await fetch(inputLnk, {
    method: 'GET',
    mode: 'cors',
    responseType: 'json',
  });
  let result = await response.text()
  return result
}

function showResults() {
  var keyword = document.getElementById("keyword")
  var category = document.getElementById("category")
  if (isnull(keyword.value) === true || isnull(category.value) === true) {
    alert("Please enter valid values.")
  } else {
    // fetch movie results by key word
    if (category.value === "movies") {
      window.onload = fetchR(serverUrl + "/api/search/movie/" + keyword.value).then(json => showAll(json))
    } else if (category.value === "tvs") {
      window.onload = fetchR(serverUrl + "/api/search/tv/" + keyword.value).then(json => showAll(json))
    } else if (category.value === "multi") {
      window.onload = fetchR(serverUrl + "/api/search/multi/" + keyword.value).then(json => showAll(json))
    } else { alert("category incorrect!") }
  }
}

function showAll(json) {
  var results = document.getElementById("results")
  const res = JSON.parse(json).results
  if (res.length < 1 || res == undefined) {
    results.innerHTML = "<p id='no-result'>No results found.</p>"
  } else {
    results.innerHTML = "<p>Showing results...</p>" // 清除之前内容，显示新的内容
    for (var i = 0; i < res.length; i++) {
      var card = document.createElement('DIV')
      card.className = "card"
      results.appendChild(card)

      var img = document.createElement('IMG');
      img.className = "result-img"
      img.src = res[i].poster_path
      card.appendChild(img)

      var cardText = document.createElement("DIV")
      cardText.className = "card-text"
      card.appendChild(cardText)

      var title = document.createElement("H2")
      title.className = "card-title"
      if (res[i].title) {
        title.innerText = res[i].title
        title.id = "movie"
      } else {
        title.innerText = res[i].name
        title.id = "tv"
      }
      cardText.appendChild(title)

      cardText.appendChild(document.createElement("BR"))

      var yearType = document.createElement("p")
      if (res[i].genres.length < 1) {
        yearType.innerText = (res[i].release_date || res[i].first_air_date) + " | " + "N/A"
      } else {
        yearType.innerText = (res[i].release_date || res[i].first_air_date) + " | " + res[i].genres.join(", ")
      }
      cardText.appendChild(yearType)

      var vote = document.createElement("P")
      vote.innerHTML = "<span>" + "\u2B51" + " " + res[i].vote_average + "</span>" + " " + res[i].vote_count
        + " votes"
      cardText.appendChild(vote)

      var txt = document.createElement("p")
      txt.className = "text-overflow"
      txt.innerText = res[i].overview
      cardText.appendChild(txt)

      var showMore = document.createElement("BUTTON")
      showMore.className = "detail"
      showMore.innerText = "Show more"
      showMore.id = res[i].id // 将id信息加入button index
      showMore.index = i
      cardText.appendChild(showMore)

      // When click a show more button, get the model and span that closes the model
      var modal = document.getElementById("myModal")
      var span = document.getElementsByClassName("close")[0]
      showMore.onclick = function () {
        var id = this.id // parseInt() ?
        var index = this.index
        var overview = document.getElementsByClassName("text-overflow")[index].innerHTML
        var type = document.getElementsByClassName("card-title")[index].id

        // Call API first
        if (type === "movie") {
          window.onload = fetchR(serverUrl + "/api/get/movie/detail/" + id).then(json => showDetail(json, "detail", overview))
          window.onload = fetchR(serverUrl + "/api/get/movie/credit/" + id).then(json => showDetail(json, "credit"))
          window.onload = fetchR(serverUrl + "/api/get/movie/review/" + id).then(json => showDetail(json, "review"))
        }
        else if (type === "tv") {
          window.onload = fetchR(serverUrl + "/api/get/tv/detail/" + id).then(json => showDetail(json, "detail", overview))
          window.onload = fetchR(serverUrl + "/api/get/tv/credit/" + id).then(json => showDetail(json, "credit"))
          window.onload = fetchR(serverUrl + "/api/get/tv/review/" + id).then(json => showDetail(json, "review"))
        } else {
          alert("title or name field is invalid")
        }
        // open model second
        modal.style.display = "block"
      }
      // When the user clicks on <span> (x), close the modal finally
      span.onclick = function () {
        document.getElementById("no-cast").style.display = "none"
        document.getElementById("no-review").style.display = "none"
        modal.style.display = "none";
      }
    }
  }
}

function showDetail(json, type, ...rest) {
  const res = JSON.parse(json)
  if (type === "detail") {
    var img = document.getElementById("inner-img")
    img.src = res.backdrop_path
    var title = document.getElementById("inner-title")
    var website = "https://www.themoviedb.org/movie/" + res.id
    title.innerHTML = (res.title || res.name) + "<a id='website' href=" + website + " target='_blank'"
     + ">" + " \u24D8" + "</a>"
    if (res.name) {console.log("This is a tv, not movie")}
    var yearType = document.getElementById("inner-yeartype")
    if (res.genres.length < 1) {
      yearType.innerText = (res.release_date || res.first_air_date) + " | " + "N/A"
    } else {
      yearType.innerText = (res.release_date || res.first_air_date) + " | " + res.genres.join(", ")
    }
    var vote = document.getElementById("inner-vote")
    vote.innerHTML = "<span>" + "\u2B51" + " " + res.vote_average + "</span>" + " " + res.vote_count
    + " votes"
    var overview = document.getElementById("inner-overview")
    overview.innerHTML = rest
    var language = document.getElementById("language")
    if (res.spoken_languages.length < 1) {
      language.innerText = "Spoken languages: " + "N/A"
    } else {
      language.innerText = "Spoken languages: " + res.spoken_languages.join(", ")
    }
  }
  else if (type === "credit") {
    var tmp = res.results
    // 注入图片方式
    var cols = document.getElementsByClassName("column")
    if (tmp.length < 1) {
      document.getElementById("no-cast").style.display = "block"
    }

    var imgs = document.getElementsByClassName("person-img")
    var boldNames = document.getElementsByClassName("bold-name")
    var thinNames = document.getElementsByClassName("thin-name")
    for (var i = 0; i < tmp.length; i++) {
      imgs[i].src = tmp[i].profile_path
      boldNames[i].innerText = tmp[i].name
      thinNames[i].innerText = tmp[i].character
      cols[i].style.display = "block"
    }
    // 剩余图片全部隐藏
    for (var j = i; j < 8; j++) {
      cols[j].style.display = "none"
    }
  } 
  else if (type === "review") {
    var tmp = res.results
    // 注入内容
    if (tmp.length < 1) {
      document.getElementById("no-review").style.display = "block"
    }
    var reviews = document.getElementsByClassName("review")
    var nameDates = document.getElementsByClassName("name-date")
    var ratings = document.getElementsByClassName("rating")
    var comments = document.getElementsByClassName("comment")
    for (var i = 0; i < tmp.length; i++) {
      nameDates[i].innerHTML = "<span>" + tmp[i].username + "</span>" + " on " + tmp[i].created_at
      ratings[i].innerText = "\u2B51" + tmp[i].rating
      comments[i].innerText = tmp[i].content
      reviews[i].style.display = "block"
    }
    for (var j = i; j < 5; j++) {
      reviews[j].style.display = "none"
    }
  } else {
    alert("wrong type of detail request!")
  }
}