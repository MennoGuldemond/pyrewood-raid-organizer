const _ = require('underscore-node');
const dotenv = require('dotenv');
const { Client } = require('discord.js');
const DriveReader = require('./drive-reader');
const Overview = require('./messages/overview');
const Search = require('./messages/search');
const Raids = require('./raids');
const packageJson = require('./package.json');

dotenv.config();
const client = new Client();
const isTestMode = false;

const channels = {
  c814826044283813988: 'Monday',
  c814826058201038848: 'Tuesday',
  c814826238283612200: 'Wednesday',
  c814826251646664704: 'Thursday',
  c814826263104978944: 'Friday',
  c814826274442838076: 'Saturday',
  c814826286018330644: 'Sunday',
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  if (message.content[0] !== '!') {
    return;
  }
  const command = message.content.split(' ')[0].toLowerCase();

  // ******** POST ********
  if (command === '!post') {
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
    // ******** SEARCH ********
  } else if (command === '!search') {
    if (!isTestMode && message.channel.id != process.env.SEARCH_CHANNEL_ID) {
      return;
    }
    const arguments = message.content.split(' ');

    if (arguments.length < 2) {
      message.channel.send(
        'Please provide a raid to search for, like: "!search mc".'
      );
      return;
    }

    // Check if raid exists
    let searchTerm = arguments.slice(1).join().replace(',', ' ');
    let found = false;
    Raids.all.forEach((raid) => {
      if (
        raid.key.toLowerCase() === searchTerm.toLowerCase() ||
        raid.alternatives.includes(searchTerm.toLowerCase())
      ) {
        searchTerm = raid.key.toLowerCase();
        found = true;
      }
    });
    if (!found) {
      message.channel.send(
        `The raid you are looking for does not exist. ${
          message.author
        }\nPlease use one of the following search terms:\n${Raids.formattedAsString()}`
      );
      return;
    }

    DriveReader.getRaidData()
      .catch((err) => {
        console.error('err:', err);
      })
      .then((data) => {
        const hordeEmbeds = Search.createEmbeds(data, searchTerm, 'Horde');
        for (let i = 0; i < hordeEmbeds.length; i++) {
          message.channel.send(hordeEmbeds[i]);
        }
        const allianceEmbeds = Search.createEmbeds(
          data,
          searchTerm,
          'Alliance'
        );
        for (let i = 0; i < allianceEmbeds.length; i++) {
          message.channel.send(allianceEmbeds[i]);
        }
      });
  } else if (command === '!version') {
    if (!isTestMode && message.channel.id != process.env.SEARCH_CHANNEL_ID) {
      return;
    }
    const versionString = `The Raid Organizer bot current version is ${packageJson.version}`;
    message.channel.send(versionString);
  }
});

if (isTestMode === true) {
  client.login(process.env.BOT_TOKEN_TEST);
} else {
  client.login(process.env.BOT_TOKEN);
}
