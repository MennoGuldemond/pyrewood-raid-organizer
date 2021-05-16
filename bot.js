const _ = require('underscore-node');
const dotenv = require('dotenv');
const { Client } = require('discord.js');
const DriveReader = require('./drive-reader');
const Overview = require('./messages/overview');
const Search = require('./messages/search');
const packageJson = require('./package.json');

dotenv.config();
const client = new Client();
const isTestMode = false;
const prefix = '!';

const channels = {
  c834162692721868862: 'Monday',
  c834162723981754458: 'Tuesday',
  c834162745451872318: 'Wednesday',
  c834162759884079126: 'Thursday',
  c834162770982600724: 'Friday',
  c834162783297470464: 'Saturday',
  c834162793875636325: 'Sunday',
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }
  const arguments = message.content.slice(prefix.length).trim().split(' ');
  const command = arguments.shift().toLowerCase();

  if (command === 'post') {
    return handlePost(message, arguments);
  } else if (command === 'search') {
    return Search.handleMessage(message, arguments, isTestMode);
  } else if (command === 'version') {
    return handleVersion(message, arguments);
  }
});

if (isTestMode === true) {
  client.login(process.env.BOT_TOKEN_TEST);
} else {
  client.login(process.env.BOT_TOKEN);
}

function handlePost(message, arguments) {
  DriveReader.getRaidData()
    .catch((err) => {
      console.error('err:', err);
    })
    .then((data) => {
      let day = channels[`c${message.channel.id}`];
      if (isTestMode === true) {
        day = 'Thursday';
      }
      if (day) {
        const hordeEmbeds = Overview.createEmbeds(data, day, 'Horde');
        for (let i = 0; i < hordeEmbeds.length; i++) {
          message.channel.send(hordeEmbeds[i]);
        }
        const allianceEmbeds = Overview.createEmbeds(data, day, 'Alliance');
        for (let i = 0; i < allianceEmbeds.length; i++) {
          message.channel.send(allianceEmbeds[i]);
        }
      }
    });
}

function handleVersion(message) {
  if (!isTestMode && message.channel.id != process.env.SEARCH_CHANNEL_ID) {
    return;
  }
  const versionString = `My current version is ${packageJson.version}`;
  message.channel.send(versionString);
}
