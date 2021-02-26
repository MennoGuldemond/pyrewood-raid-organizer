const dotenv = require('dotenv');
const { Client } = require('discord.js');
const DriveReader = require('./drive-reader');
const Overview = require('./messages/overview');

dotenv.config();
const client = new Client();

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
  if (message.content === '!post') {
    DriveReader.getRaidData()
      .catch((err) => {
        console.error('err:', err);
      })
      .then((data) => {
        const day = channels[`c${message.channel.id}`];
        if (day) {
          const hordeEmbed = Overview.createEmbed(data, day, 'Horde');
          const allianceEmbed = Overview.createEmbed(data, day, 'Alliance');
          message.channel.send(hordeEmbed);
          message.channel.send(allianceEmbed);
        }
      });
  }
});

client.login(process.env.BOT_TOKEN);
