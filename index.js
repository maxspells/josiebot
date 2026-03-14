const { Client, Intents } = require('discord.js');
const { execFile } = require('child_process');
const config = require('./config.json');
const responses = require('./responses.json');

function isAdmin(message) {
    return message.author.id === config.adminUserId;
}

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT
    ],
    partials: ['CHANNEL'] // Needed to receive DMs
});

const token = config.token;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    // Check if it's a DM
    if (!message.guild) {
        const dmResponses = responses.dmResponses.map(template => template.replace('${message.author.username}', message.author.username));

        const randomIndex = Math.floor(Math.random() * dmResponses.length);
        const randomMessage = dmResponses[randomIndex];

        message.channel.send(randomMessage);
        console.log(`Sent DM response: ${randomMessage}`);
        return; 
    }

    // Admin commands
    if (message.content.startsWith('!restart ')) {
        if (!isAdmin(message)) {
            message.channel.send('uhh babe, only the boss can do that 🙄');
            return;
        }
        const server = message.content.slice(9).trim();
        if (!server) {
            message.channel.send('uhh babe, specify a server to restart 🙄');
            return;
        }
        console.log(`!restart command triggered by ${message.author.username} for server: ${server}`);
        execFile('/usr/bin/docker', ['restart', server], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error restarting ${server}:`, error);
                message.channel.send(`oops, something went wrong trying to restart ${server} 😬`);
                return;
            }
            console.log(`Restarted ${server}: ${stdout}`);
            message.channel.send(`ugh fine, restarted ${server} 😒`);
        });
        return;
    }
    if (message.content.startsWith('!stop ')) {
        if (!isAdmin(message)) {
            message.channel.send('uhh babe, only the boss can do that 🙄');
            return;
        }
        const server = message.content.slice(6).trim();
        if (!server) {
            message.channel.send('uhh babe, specify a server to stop 🙄');
            return;
        }
        console.log(`!stop command triggered by ${message.author.username} for server: ${server}`);
        execFile('/usr/bin/docker', ['stop', server], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error stopping ${server}:`, error);
                message.channel.send(`oops, something went wrong trying to stop ${server} 😬`);
                return;
            }
            console.log(`Stopped ${server}: ${stdout}`);
            message.channel.send(`ugh fine, stopped ${server} 😒`);
        });
        return;
    }
    if (message.content.startsWith('!start ')) {
        if (!isAdmin(message)) {
            message.channel.send('uhh babe, only the boss can do that 🙄');
            return;
        }
        const server = message.content.slice(7).trim();
        if (!server) {
            message.channel.send('uhh babe, specify a server to start 🙄');
            return;
        }
        console.log(`!start command triggered by ${message.author.username} for server: ${server}`);
        execFile('/usr/bin/docker', ['start', server], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error starting ${server}:`, error);
                message.channel.send(`oops, something went wrong trying to start ${server} 😬`);
                return;
            }
            console.log(`Started ${server}: ${stdout}`);
            message.channel.send(`ugh fine, started ${server} 😒`);
        });
        return;
    }
    if (message.content.startsWith('!ban ')) {
        if (!isAdmin(message)) {
            message.channel.send('uhh babe, only the boss can do that 🙄');
            return;
        }
        const username = message.content.slice(5).trim();
        if (!username) {
            message.channel.send('uhh babe, specify a username to ban 🙄');
            return;
        }

        console.log(`!ban command triggered by ${message.author.username} for username: ${username}`);
        execFile('/usr/bin/docker', ['exec', 'minecraft', 'rcon-cli', 'ban', username], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error banning ${username}:`, error);
                message.channel.send(`oops, something went wrong trying to ban ${username} 😬`);
                return;
            }
            console.log(`Banned ${username}: ${stdout}`);
            message.channel.send(`ok fine I banned ${username} from the minecraft server 🙄`);
        });
        return;
    }
    if (message.content.startsWith('!kick ')) {
        if (!isAdmin(message)) {
            message.channel.send('uhh babe, only the boss can do that 🙄');
            return;
        }
        const username = message.content.slice(6).trim();
        if (!username) {
            message.channel.send('uhh babe, specify a username to kick 🙄');
            return;
        }

        console.log(`!kick command triggered by ${message.author.username} for username: ${username}`);
        execFile('/usr/bin/docker', ['exec', 'minecraft', 'rcon-cli', 'kick', username], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error kicking ${username}:`, error);
                message.channel.send(`oops, something went wrong trying to kick ${username} 😬`);
                return;
            }
            console.log(`Kicked ${username}: ${stdout}`);
            message.channel.send(`lol ok I kicked ${username} from the minecraft server 😂😂😂😂`);
        });
        return;
    }

    // Normal commands
    if (message.content === '!status') {
        console.log(`!status command triggered by ${message.author.username}`);
        execFile('/usr/bin/docker', ['ps'], (error, stdout, stderr) => {
            if (error) {
                console.error('Error checking Docker status:', error);
                message.channel.send('yikes, something went wrong trying to check the server status 😬');
                return;
            }
            const err = stderr.trim();
            if (err) {
                console.error('Docker stderr:', err);
                message.channel.send('yikes, something went wrong trying to check the server status 😬');
                return;
            }
            const mcRunning = stdout.includes('minecraft');
            const vhRunning = stdout.includes('valheim');
            const ckRunning = stdout.includes('corekeeper');
            const htRunning = stdout.includes('hytale');
            const sdRunning = stdout.includes('7dtd');
            if (mcRunning) {
                message.channel.send('the minecraft server is like, totally up and running! 🎉');
            }
            if (vhRunning) {
                message.channel.send('the valheim server is like, totally up and running! 🎉');
            }
            if (ckRunning) {
                message.channel.send('the corekeeper server is like, totally up and running! 🎉');
            }
            if (htRunning) {
                message.channel.send('the hytale server is like, totally up and running! 🎉');
            }
            if (sdRunning) {
                message.channel.send('the 7dtd server is like, totally up and running! 🎉');
            }
            console.log(`Docker ps output: ${stdout}`);
            console.log(`Servers running: MC:${mcRunning}, VH:${vhRunning}, CK:${ckRunning}, HT:${htRunning}, SD:${sdRunning}`);
        });
        return;
    }

    if (message.content === '!players') {
        console.log(`!players command triggered by ${message.author.username}`);
        execFile('/usr/bin/docker', ['exec', 'minecraft', 'rcon-cli', 'list'], (error, stdout, stderr) => {
            if (error) {
                console.error('Error checking player list:', error);
                message.channel.send('yikes, something went wrong trying to check the player list 😬');
                return;
            }
            const output = stdout.trim();
            if (output.includes('online: ')) {
                const parts = output.split('online: ');
                const playersPart = parts[1];
                const players = playersPart.split(', ').filter(p => p.trim() !== '');
                if (players.length > 0) {
                    message.channel.send(`Ughhh fine, the players currently on the server are: ${players.join(', ')}`);
                } else {
                    message.channel.send('No players online right now 😴');
                }
            } else if (output.includes('players online')) {
                message.channel.send('No players online right now 😴');
            } else {
                message.channel.send('yikes, something went wrong parsing the player list 😬');
            }
        });
    }

     // !wl command
    if (message.content.startsWith('!wl')) {
        const username = message.content.slice(3).trim();
        if (!username) {
            message.channel.send('uhh babe... u need 2 give me ur minecraft username after the !wl... (e.g., !wl alice).');
            return;
        }
        if (username.length > 14) {
            message.channel.send('uhh babe, minecraft usernames can\'t be that long, try again 🙄');
            return;
        }

        console.log(`!wl command triggered by ${message.author.username} for username: ${username}`);
        // run the docker command o boy i sure hope this is sanitized
        execFile('/usr/bin/docker', ['exec', 'minecraft', 'rcon-cli', 'whitelist', 'add', username], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error adding ${username} to whitelist:`, error);
                message.channel.send(`oops, something went wrong trying to add ${username} 😬`);
                return;
            }

            // optionally log stdout/stderr i guess
            console.log(stdout);
            if (stderr) console.error(stderr);

            if (stdout.toLowerCase().includes('added')) {
                message.channel.send(`ugh fine, added ${username} 2 the minecraft whitelist 🙄`);
            } else {
                message.channel.send(`uhh babe, something like, totally went wrong trying to add ${username} to the whitelist? 🙄`);
            }
        });
    }
    // It's a message in a server channel
    if (message.content === '!mc') {
        console.log(`!mc command triggered by ${message.author.username}`);
        message.channel.send(`ughh the server ip is: ${config.serverIP}`);
    }

    if (message.content === '!babe') {
        console.log(`!babe command triggered by ${message.author.username}`);
        const babeResponses = responses.babeResponses.map(template => template.replace('${message.author.username}', message.author.username));
        const randomIndex = Math.floor(Math.random() * babeResponses.length);
        const randomMessage = babeResponses[randomIndex];
        message.channel.send(randomMessage);
        console.log(`Sent !babe response: ${randomMessage}`);
    }

    if (message.content === '!help') {
        console.log(`!help command triggered by ${message.author.username}`);
        message.channel.send(`hey babe, here are the commands u can use:
- !status: check which game servers are currently running
- !mc: get the minecraft server ip
- !wl <username>: add a minecraft username to the whitelist (e.g., !wl alice)
- !players: see who's online
- !babe: 💅💅💅💅
- !compliment: get a compliment from me
- !roast <user>: roast someone
- !mood: check my mood
- !advice: get some sassy advice
- !help: see this message again`);
    }

    if (message.content === '!compliment') {
        console.log(`!compliment command triggered by ${message.author.username}`);
        const random = responses.compliments[Math.floor(Math.random() * responses.compliments.length)];
        message.channel.send(random);
    }

    if (message.content.startsWith('!roast ')) {
        console.log(`!roast command triggered by ${message.author.username}`);
        const target = message.content.slice(7).trim();
        if (!target) {
            message.channel.send('uhh, who am I roasting? 🙄');
            return;
        }
        const random = responses.roasts[Math.floor(Math.random() * responses.roasts.length)].replace('${target}', target);
        message.channel.send(random);
    }

    if (message.content === '!mood') {
        console.log(`!mood command triggered by ${message.author.username}`);
        const random = responses.moods[Math.floor(Math.random() * responses.moods.length)];
        message.channel.send(random);
    }

    if (message.content === '!advice') {
        console.log(`!advice command triggered by ${message.author.username}`);
        const random = responses.advices[Math.floor(Math.random() * responses.advices.length)];
        message.channel.send(random);
    }

    return;
});

client.login(token);