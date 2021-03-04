# CSCI571-HW6

==@297 Max 10 for search results, max 8 for actors, max 5 for reviews, max 5 for slideshows.==

you can create any HTML element you would like dynamically in JavaScript by using document.createElement() - https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement

let element = document.createElement(tagName[, options]); 

只在创建show movies的时候用到, You should use JavaScript to dynamically generate the cards.

Use AJAX calls to make requests to the backend. Once you have the data, can manipulate the DOM to display contents (Use JavaScript to add different components). 

---

Forntend:

- We've used a Google font (which is free) for this assignment
- by default (when we first open the page), the Home page will be red and Search in white since the home page would be displayed first.
- Home and Search should toggle on a same page.
- height of the navbar @292

- Hi all, don't worry about screen sizes, just make sure that your page on 100% browser zoom level looks similar to what it looks like in the homework description. As long as your page is functional, it is alright. To make it responsive is up to you. The goal of this assignment is to test functionality of your website.
- how would I go about setting up the scrolling effect where only the popup is scrolling? 

- > Try looking into the overflow property in css.

- Get Movie/TV Details Endpoint - Runtime Field? No need

- The overview is too long.

- > In this case, you can add an ellipse (...) after 3 lines of the overview. 

- Border after left menu and below the Home and search 

- > You are on the right track.
  >
  > While development, we gave a bottom border for the tabs and a left border for the content on the right. 
  >
  > Try checking if you have any other css property overriding the border property.

- show more button. @337
- XHR: Call a function after previous function is complete @350

---

Toggling feature @182

> A simple way to do this would be to just manipulate the DOM in JavaScript when you click on the tabs!

> P.S.: you wouldn't have to render each and every element on click, if you have a single parent element...

---

CORS Error in Requests @227 `from flask_cor import cors`?

---

status code 0 xmlHttpRequest @257

if you are sending xhr object syncly then set it to false and do it asyncly. Simply setting the parameter from true to false is what I did to get rid of the status code 0 and retrieve data successfully. Hope it helps.





# Submission

- Your python endpoint is the API endpoint you are calling from the frontend javascript code. Example you might have http://%3Capp-name%3E.azurewebsites.net/getTrendingMovies as one of your python endpoints. We are required to submit a link to any one of these endpoints apart from the link to the home page of our application (hosted at - [http://.azurewebsites.net](http://.azurewebsites.net/)). This is to ensure we are not directly calling the TMDB API from Javascript.