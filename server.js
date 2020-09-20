
const axios = require("axios");
const express = require("express");
const nodemailer = require('nodemailer');
const app = express();

// go to the .env folder here in your Glitch app (in the far left pane), and create a variable called URLTOHIT. As its value, make up a hard-to-guess route name, like weird835route432chicken87 or something. You'll use this route down below, as one of the GET routes ...
var x = "/" + process.env.URLTOHIT;

// you need to create a free account at the NYT's API portal (https://developer.nytimes.com/), and then create a new app. When you've created it, it'll give you a "key" that looks like shTHsennvTprKebM8QL4DTdFNbZAjqmh or something (that's a fake one there, I just made it up). Then you go to your .env folder (here at Glitch), create a variable called NYTKEY, and assign to it your NYT API key
var nytHit = "https://api.nytimes.com/svc/topstories/v2/world.json?api-key=" + process.env.NYTKEY;

// here we set up the email address your bot will use, using nodemailer. Check the instructions I wrote up in the README.md file, in the far left panel ... 
const transporter = nodemailer.createTransport({
  // I used Yahoo email for my bot. If you use Gmail or another service, list the name here. Nodemailer can recognize and use nearly any popular webmail (they're all listed here: https://community.nodemailer.com/2-0-0-beta/setup-smtp/well-known-services/)
  service: 'Yahoo',
  auth: {
    // in the .env folder, make a variable called EMAILACCOUNT, and as its value, put in the Yahoo or Gmail address you created for your bot
    user: process.env.EMAILACCOUNT,
    // in the .env folder, make a variable called PASSWORD, and as its value, put in the password for the email account you created for your bot
    pass: process.env.PASSWORD 
  }
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// the basic route when anyone browses the server
app.get("/", (request, response) => {
  response.send("We're up!");
});

// this is the GET request for the secret route x (defined up above); whenever the server gets a request for this secret route, it'll fire the function that requests the NYT stories and then fire the function that mails out the results
app.get(x, async function (request, response) {
  let theList = await getStories(nytHit);
  await mailIt(theList);
  console.log(theList);
  console.log("You got a secret-route request!");
  response.send("You found the secret route!");
}) 

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// grab the stories from the NYT World section, put title-abstract-link for each into an HTML string that we'll email to ourselves
async function getStories(a) {
  try {
    let response = await axios.get(a);
    let storyList = response.data.results;
    let stories = "";
    for (let c = 0; c < storyList.length; c++) {
      let story = storyList[c];
      stories += "<h1>" + story.title + "</h1><p>" + story.abstract + "</p><div id='urlHere'>" + story.url + "</div><p>-----------------------------------------------------------------<p>";
    }
    return stories
  } catch (error) {
    console.log(error);
  }
}

async function mailIt(d) {
  // let's get the date
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  
  // here we set up the mail ...
  const mailOptions = {
  // create a variable in the .env folder called EMAILACCOUNT, and set it to the Yahoo or Gmail address you created for your bot 
  from: process.env.EMAILACCOUNT,
    // create a variable in the .env folder called EMAILTO, and set it to *your* email -- this is the address the bot will send its email to!
  to: process.env.EMAILTO,
  subject: "Here are the NYT's World headlines for " + date + "/" + month + "/" + year,
    // I added some CSS styling to the email, by importing a couple of Google fonts, and setting the font size of h1, h2 and <p> elements in the email. You could change the fonts if you want, or the size, etc! 
  html: "<!doctype html><html lang='en'><head><meta charset='utf-8'><link href='https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap' rel='stylesheet'><style>h1 {font-family: 'Roboto', sans-serif; font-size: 2.1em;} p {font-family: 'Crimson Text', serif; font-size: 1.6em;} #urlHere { font-family: 'Roboto', serif; font-size: 1.1em;}</style></head>" + d + "</html>"
  };
  
  // .... and send the email off!
  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
  });
}
