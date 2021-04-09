const _ = require('underscore-node');
const { MessageEmbed } = require('discord.js');
const Formatter = require('./formatter');

module.exports = {
  createEmbeds: function (data, day, faction) {
    // Filter out irrelevant data
    const filteredData = data.filter((x) => {
      return (
        x.day.toLowerCase() === day.toLowerCase() &&
        x.faction.toLowerCase() === faction.toLowerCase()
      );
    });

    // Sort by time
    filteredData.sort((a, b) => (a.time > b.time ? 1 : -1));

    // GDKP - SR - OTHER
    const gdkpData = filteredData.filter((x) => {
      return x.type.toLowerCase() === 'gdkp';
    });
    const srData = filteredData.filter((x) => {
      return x.type.toLowerCase() === 'sr';
    });
    const otherData = filteredData.filter((x) => {
      return x.type.toLowerCase() !== 'gdkp' && x.type.toLowerCase() !== 'sr';
    });

    let descriptions = Formatter.getPostDescriptions(
      gdkpData,
      srData,
      otherData
    );

    // Remove empty descriptions
    descriptions = descriptions.filter((d) => d.length > 1);

    const embeds = [];
    for (let i = 0; i < descriptions.length; i++) {
      const embed = Formatter.getFactionEmbed(faction);
      embed.setDescription(descriptions[i]);
      if (descriptions.length < 2 && descriptions[0].length < 30) {
        embed.setTitle(`No ${faction} raids found for ${day}`);
      } else {
        // If the message was cut up into multiple lines, show part numbers in title.
        if (descriptions.length > 1) {
          embed.setTitle(
            `${faction} Raid Schedule - ${day} - ${i + 1}/${
              descriptions.length
            }`
          );
        } else {
          embed.setTitle(`${faction} Raid Schedule - ${day}`);
        }
      }
      embeds.push(embed);
    }

    return embeds;
  },
};
