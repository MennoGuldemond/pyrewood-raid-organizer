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
  createEmbed: function (data, raid, faction) {
    const embed = new MessageEmbed();
    let description = '';
    let raidAmount = 0;

    // Set horde/alliance style
    const isHorde = faction.toLowerCase() === 'horde';
    if (isHorde) {
      embed.setColor(0x8c1616);
      embed.attachFiles(['./assets/Horde.png']);
      embed.setThumbnail('attachment://Horde.png');
    } else {
      embed.setColor(0x162c57);
      embed.attachFiles(['./assets/Alliance.png']);
      embed.setThumbnail('attachment://Alliance.png');
    }

    // Filter out irrelevant data
    const filteredData = data.filter((x) => {
      return (
        x.raid.toLowerCase() === raid.toLowerCase() &&
        x.faction.toLowerCase() === faction.toLowerCase()
      );
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
      description = `No ${raid} raids were found for the ${faction}`;
    } else {
      const raidName = sortedByDay[0].raid;
      embed.setTitle(`${raidName} raids for ${faction}`);
    }

    embed.setDescription(description);
    return embed;
  },
};
