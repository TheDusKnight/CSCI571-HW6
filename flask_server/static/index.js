'use strict';
// alert("listen!")
console.log('window inner sizes: ' + window.innerWidth + ' x ' + window.innerHeight)
// console.log('appName = ' + navigator.appName)
// console.log('appVersion = ' + navigator.appVersion)
// console.log('language = ' + navigator.language)
// console.log('platform = ' + navigator.platform)
// console.log('userAgent = ' + navigator.userAgent)

document.title = '学习java'

function toggleSearch() {
  document.getElementsByClassName('search').hidden = false
  document.getElementsByClassName('home').hidden = true
}
function toggleHome() {
  document.getElementsByClassName('search').hidden = true
  document.getElementsByClassName('home').hidden = false
}