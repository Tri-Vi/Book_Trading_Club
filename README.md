# Manage Book Trading Club Application

## Project Overview
Manage Book Trading Club is a full stack application that allows the user to search for books and add them to a collection in the user's account. The user can see all books from other users, make a request/receive trade requests to trade book with others or cancel the trade request at anytime. 

## Environment
- MongoDB 
- Express 
- Node 
- EJS 
- Passport, 
- Google Book API 
- Javascript 
- HTML
- CSS

The logic of the application is described below:

**As an authenticated user**
- The user can view all books posted by other users
- THe user can add a new book
- The user can update his/her profile setting 
- The user can propose a trade and wait for the other users to accept the trade.


## How did I build this application?
The application is divided into 3 parts:
  1. Backend:
      - **bcrypt**: hashing user's password when signing up and compare hashed password
      - **body-parser**: parsing form input
      - **connect-flash** : raising error messages when errors occur
      - **cookie-parser** : parsing cookie
      - **ejs** : view engine
      - **express** : routing middleware
      - **express-session** : session
      - **helmet** : secure express app by setting various HTTP header
      - **mongoose** : database 
      - **morgan**: HTTP request logger middleware
      - **passport**: Authentication Middleware
      - **passport-local**: Authentication Strategy
  2. Frontend:
      - **Bootstrap**
  3. Book API
      - **Google Book API**

## What's Still to Come
 - Create a Reset password handler
 - Use a Front End Framework to seperate backend and frontend.










 



