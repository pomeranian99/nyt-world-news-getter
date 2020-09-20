# NYT World News Daily Alert

So, I subscribe to the _New York Times_, but I keep on skipping the "international news" section.

## Why?

Back in the day, I used to read the dead-tree copy of the _Times_ every day, holding the paper pages and turning them with my hands, _like an animal_. Back then, I often read the international section, because it was the first dozen pages in the "A" section. To get to the national/domestic news you _had_ to flip through the international stuff.

These days, I don't read the paper copy any more. I use the app. And I find that I don't read the international news any more ... because the ergonomics of the app do not, as with the paper, _force_ me to encounter international news.

Out of sight, out of mind. It's a big problem with the app, really. The app makes it too easy to ignore the news you don't actively seek out.

Anyway, I decided to write this bot to _remind_ me, everyday, to read the international section.

## How it works

It uses the _New York Times_' API to grab the current world-news headlines/abstract/URLs and email it to me.

If you want to remix it, you'll need to:

- set up a new email account that this bot will use. [Some instructions are here for Gmail.](https://blog.mailtrap.io/nodemailer-gmail/) Me, I use Yahoo; you create a new email address, then [create a password for your bot to use.](https://help.yahoo.com/kb/generate-third-party-passwords-sln15241.html)
- put your bot's Gmail/Yahoo address and password into the ".env" file in your remix
- get a free _New York Times_ API account. You can [sign up here](https://developer.nytimes.com). Once you have an account, inside their service you create a new app and get an API key for it. That API key will also go in the ".env" file here.
- put _your_ email -- i.e. the email of the recipient for this daily bot email -- into the ".env" file, too. That way the email of the person the bot is emailing is kept secret from anyone inspecting your code.
- create a secret URL endpoint and put it in the ".env" file. Why a secret endpoint? Because the bot sends an email every time someone makes an HTTP call to the URL. Since you don't want someone accidentally (or maliciously) sending you tons of bot-driven emails, I wrote this code so the URL is a secret. You can make it something like /funny87rando314 or whatever.
- once you've picked your secret URL, you can set up a service to ping that URL once a day. I use [Python Anywhere](http://www.pythonanywhere.com) to set up a little cron job that pings my secret URL at 10 am every morning. That way I have a reminder to read the international news every day.

Ping me at [clive@clivethompson.net](mailto:clive@clivethompson.net) if for some crazy reason you wind up actually remixing this, I'd enjoy knowing ...
