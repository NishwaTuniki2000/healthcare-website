# Healthcare-website
Simple healthcare website one page, where the patient details are displayed from doctor's website.

# Getting Started with Create React App

Install node.js 
open terminal 
create a folder by using the command below.
### `mkdir project`
go into project folder
### `cd project`
I have used react to create this project.
### `npx create-react-app healthcare-website`
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

please install any other modules tha are required, since I have used [(https://fedskillstest.coalitiontechnologies.workers.dev/patients) this json data.
To Access this json data we need username and password.
These are environmental variables. 
When you use environment variables correctly, they are not exposed to the client-side code (like JavaScript in the browser) and remain hidden during runtime.
When user of tries to inspect the code ,username and password entered can be visible in the frontend code(client-side). so it's better to keep it server-side(backend)
To do that we require
dotenv so install it.

### `npm install dotenv`

I have created .env file which has sensitive data(username and password)
please contact tunikinishwa@gmail.com for .env
or
Use jsondata I have provided without any authentication.


