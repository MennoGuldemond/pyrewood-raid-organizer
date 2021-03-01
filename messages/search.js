const _ = require('underscore-node');
const { MessageEmbed } = require('discord.js');
const Formatter = require('./formatter');

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

module.exports = {
  createEmbed: function (data, raid) {
    const embed = new MessageEmbed();
    let description = '';
    let raidAmount = 0;

    // Filter out irrelevant data
    const filteredData = data.filter((x) => {
      return x.raid.toLowerCase() === raid.toLowerCase();
    });

    // Sort by time
    filteredData.sort((a, b) => (a.time > b.time ? 1 : -1));

    // Sort by day
    let sortedByDay = [];
    for (let i = 0; i < daysOfWeek.length; i++) {
      for (let j = 0; j < filteredData.length; j++) {
        if (daysOfWeek[i] === filteredData[j].day.toLocaleLowerCase()) {
          sortedByDay.push(filteredData[j]);
        }
      }
    }

    // Group by day
    let splittedByDay = _.groupBy(sortedByDay, 'day');

    // *******************************
    // Build message content from here
    // *******************************
    for (const [day, raids] of Object.entries(splittedByDay)) {
      description += `**${day}**\n`;
      for (let i = 0; i < raids.length; i++) {
        description += Formatter.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
    }

    // Message for when there are no raids found
    if (raidAmount < 1) {
      embed.setTitle(`No raids found`);
      description = `No raids were found that match your search.`;
    } else {
      embed.setTitle(`Raids for raid: ${raid}`);
    }

    embed.setDescription(description);
    return embed;
  },
};
