# Market Logger

![](MarketLoggerO2.gif)

This is a full stack web project, with Ruby on Rails backend and React frontend. The backend application serves as a JSON API, with endpoints down from '/api/v1/*', where it offers stock and companies profiles data and also users profiles.  
The frontend application consumes data from the API, including POST and DELETE requests for making changes to user data.

## Features
* Most recent stock data is sorted by values percentage change and shown on index page
* Users can register, log in and can like companies.
* Simple search engine that implements vector space model, written in C++. (IPC through UNIX pipes)
* Server side Rake tasks to retrieve stock data from [external API](https://financialmodelingprep.com/api/)
* Authentication tokens with JWT (JSON Web Token) standard.

## TODO
* Fix the fact that many times popovers won't disappear. 
* Create a page for showing all user's likes profiles.
* Fix search bar on-the-fly behavior, it seens to ignore the last character typed.
* Remove outline from like button.
* Store JWT in browser's data, so page every refresh won't void current token.

