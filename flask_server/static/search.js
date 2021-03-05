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
    mode: 'cors',
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
      window.onload = fetchR(serverUrl + "/api/search/movie/" + keyword.value).then(json => showAll(json))
    } else if (category.value === "tvs") {
      window.onload = fetchR(serverUrl + "/api/search/tv/" + keyword.value).then(json => showAll(json))
    } else if (category.value === "multi") {
      window.onload = fetchR(serverUrl + "/api/search/multi/" + keyword.value).then(json => showAll(json))
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

      var title = document.createElement("H2")
      title.className = "card-title"
      // title.innerText = (res[i].title || res[i].name)
      if (res[i].title) {
        title.innerText = res[i].title
        title.id = "movie"
      } else {
        title.innerText = res[i].name
        title.id = "tv"
      }
      cardText.appendChild(title)
      // if (res[i].title) alert("Movie")

      cardText.appendChild(document.createElement("BR"))

      var yearType = document.createElement("p")
      yearType.innerText = (res[i].release_date || res[i].first_air_date) + " | " + res[i].genres.join(", ")
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
        // alert(this.id)
        var id = this.id // parseInt() ?
        var index = this.index
        var overview = document.getElementsByClassName("text-overflow")[index].innerHTML
        var type = document.getElementsByClassName("card-title")[index].id
        // alert(type)

        // Call API first
        if (type === "movie") {
          // 看看对不对
          window.onload = fetchR(serverUrl + "/api/get/movie/detail/" + id).then(json => showDetail(json, "detail", overview))
          // window.onload = fetchR(serverUrl + "/api/get/movie/credit/" + id).then(json => showDetail(json, "credit"))
          // window.onload = fetchR(serverUrl + "/api/get/movie/review/" + id).then(json => showDetail(json, "review"))
        } 
        // else if (type === "tv") {

        // } else {
        //   alert("title or name field is invalid")
        // }

        // open model second
        modal.style.display = "block"
      }

      // When the user clicks on <span> (x), close the modal finally
      span.onclick = function () {
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
    title.innerText = (res.title || res.name)
    if (res.name) {alert("This is a tv, not movie")} // TODO: remove this
    var yearType = document.getElementById("inner-yeartype")
    yearType.innerText = (res.release_date || res.first_air_date) + " | " + res.genres.join(", ")
    var vote = document.getElementById("inner-vote")
    vote.innerHTML = "<span>" + "\u2B51" + " " + res.vote_average + "</span>" + " " + res.vote_count
    + " votes"
    var overview = document.getElementById("inner-overview")
    overview.innerHTML = rest
    var language = document.getElementById("language")
    language.innerText = "Spoken languages: " + res.spoken_languages.join(", ")
  } else if (type === "credit") {
    var tmp = res.results
    // var modalContnet = document.getElementsByClassName("modal-content")[0]
    // if (tmp.length < 1) {
    //   var na = document.createElement("P")
    //   na.innerText = "N/A" // TODO: check 是不是有效果
    //   modalContnet.appendChild(na)
    // } else {
    //   for (var i = 0; i < tmp.length; i++) {
    //     var row = document.createElement("DIV")
    //     row.className = "row"
    //     // modalContnet.appendChild(row)
    //     modalContnet.appendChild(document.createElement("DIV"))
    //     // alert(row)

    //     var column = document.createElement("DIV")
    //     column.className = "column"
    //     row.appendChild(column)

    //     var personImg = document.createElement("IMG")
    //     personImg.className = "person-img"
    //     personImg.src = tmp[i].poster_path
    //     column.appendChild(personImg)
    //   }
    // }



    // 注入图片方式
    // if (tmp.length < 1) {
    //   document.getElementsByClassName("row").style.display = "none"
    // } else {
    //   var imgs = document.getElementsByClassName("person-img")
    //   var boldNames = document.getElementsByClassName("bold-name")
    //   var thinNames = document.getElementsByClassName("thin-name")
    //   for (var i = 0; i < tmp.length; i++) {
    //     imgs[i].src = tmp[i].profile_path
    //     boldNames[i].innerText = tmp[i].name
    //     thinNames[i].innerText = tmp[i].character
    //   }
    //   var cols = document.getElementsByClassName("column")
    //   for (var j = i; j < 8; j++) {
    //     cols[j].innerHTML = ""
    //   }
    // }
  } 
  // else if (type === "review") {

  // } else {
  //   alert("wrong type of detail request!")
  // }
}