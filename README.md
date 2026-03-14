# JosieBot 💅

JosieBot is a **sassy Discord bot** that runs my homelab game servers while judging everyone in chat.

She can check server status, manage a Minecraft whitelist, run Docker commands, and generally act like she’s **way too busy for your nonsense**.

This is a **small personal project**.

---

# What she does

* checks which game servers are running
* gives you the Minecraft server IP
* lets people whitelist themselves
* shows who's online in Minecraft
* roasts people
* gives terrible advice
* randomly responds to DMs
* lets the admin start/stop/restart servers

all while being extremely dramatic about it 🙄

---

# Setup

clone the repo:

```bash
git clone https://github.com/maxspells/josiebot.git
cd josiebot
```

install dependencies:

```bash
npm install
```

make a config file:

```bash
cp config.example.json config.json
```

edit `config.json`:

```json
{
  "token": "YOUR_DISCORD_TOKEN",
  "adminUserId": "YOUR_DISCORD_USER_ID",
  "serverIP": "YOUR_SERVER_IP"
}
```

start the bot:

```bash
node index.js
```

---

# Commands

## normal people commands

`!status`
check which servers are running

`!mc`
get the minecraft server IP

`!wl <username>`
add yourself to the minecraft whitelist

`!players`
see who's online

`!babe`
talk to josie 💅

`!compliment`
josie says something nice (rare)

`!roast <user>`
bully someone in chat

`!mood`
josie's current emotional state

`!advice`
life advice you probably shouldn't follow

`!help`
see this list again

---

## admin commands (aka the boss)

only the configured admin user can run these.

`!start <container>`
start a docker container

`!stop <container>`
stop a docker container

`!restart <container>`
restart a docker container

`!kick <player>`
kick someone from minecraft

`!ban <player>`
ban someone from minecraft

---

# Files

`index.js`
the bot brain

`responses.json`
all the dumb things josie says

`config.json`
your secret stuff (not in git)

---

# Important

DO NOT commit your bot token.

---

# Notes

this bot was made for a **homelab server setup** using docker containers like:

* minecraft
* valheim
* corekeeper
* hytale
* 7 days to die

if your containers are named something else, change it in the code.

---

# Final thoughts

this bot is chaotic, slightly mean, and surprisingly useful.

basically like a **very judgmental server admin assistant**.

enjoy 💅
