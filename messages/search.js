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
  createEmbeds: function (data, raid, faction) {
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

    const gdkpData = sortedByDay.filter((x) => {
      return x.type.toLowerCase() === 'gdkp';
    });
    const srData = sortedByDay.filter((x) => {
      return x.type.toLowerCase() === 'sr';
    });
    const otherData = sortedByDay.filter((x) => {
      return x.type.toLowerCase() !== 'gdkp' && x.type.toLowerCase() !== 'sr';
    });

    let descriptions = Formatter.getSearchDescriptions(
      gdkpData,
      srData,
      otherData,
      sortedByDay
    );

    // Remove empty descriptions
    descriptions = descriptions.filter((d) => d.length > 1);

    const embeds = [];
    for (let i = 0; i < descriptions.length; i++) {
      const embed = Formatter.getFactionEmbed(faction);
      embed.setDescription(descriptions[i]);
      if (descriptions.length < 2 && descriptions[0].length < 10) {
        embed.setTitle(`No raids found`);
        description = `No ${raid} raids were found for the ${faction}`;
      } else {
        const raidName = sortedByDay[0].raid;
        // If the message was cut up into multiple lines, show part numbers in title.
        if (descriptions.length > 1) {
          embed.setTitle(
            `${raidName} raids for ${faction} - ${i + 1}/${descriptions.length}`
          );
        } else {
          embed.setTitle(`${raidName} raids for ${faction}`);
        }
      }
      embeds.push(embed);
    }

    return embeds;
  },
};
