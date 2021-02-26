const _ = require('underscore-node');
const { MessageEmbed } = require('discord.js');

module.exports = {
  createEmbed: function (data, day, faction) {
    const embed = new MessageEmbed();
    const isHorde = faction.toLowerCase() === 'horde';
    let description = '';
    let raidAmount = 0;

    // Set embed properties
    embed.setTitle(` ${faction} Raid Schedule - ${day}`);
    embed.setTimestamp();
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
      return x.type.toLowerCase() === 'gdkp' && x.type.toLowerCase() !== 'sr';
    });

    // *******************************
    // Build message content from here
    // *******************************

    if (gdkpData.length > 0) {
      description += '__**GDKP RAIDS**__\n';
    }
    let gdkpSplitted = _.groupBy(gdkpData, 'raid');
    for (const [, raids] of Object.entries(gdkpSplitted)) {
      for (let i = 0; i < raids.length; i++) {
        const emote = raids[i].emote ? `${raids[i].emote} ` : '';
        description += `${emote}**[${raids[i].organizer}](${raids[i].link})** - ${raids[i].time} - ${raids[i].raid}\n`;
        raidAmount++;
      }
      description += `\n`;
    }
    if (gdkpData.length > 0) {
      description += '\n';
    }

    if (srData.length > 0) {
      description += '__**SR RAIDS**__\n';
    }
    let srSplitted = _.groupBy(srData, 'raid');
    for (const [, raids] of Object.entries(srSplitted)) {
      for (let i = 0; i < raids.length; i++) {
        const emote = raids[i].emote ? `${raids[i].emote} ` : '';
        description += `${emote}**[${raids[i].organizer}](${raids[i].link})** - ${raids[i].time} - ${raids[i].raid}\n`;
        raidAmount++;
      }
      description += `\n`;
    }
    if (srData.length > 0) {
      description += '\n';
    }

    if (otherData.length > 0) {
      description += '__**Other RAIDS**__\n';
    }
    let otherSplitted = _.groupBy(otherData, 'raid');
    for (const [, raids] of Object.entries(otherSplitted)) {
      for (let i = 0; i < raids.length; i++) {
        const emote = raids[i].emote ? `${raids[i].emote} ` : '';
        description += `${emote}**[${raids[i].organizer}](${raids[i].link})** - ${raids[i].time} - ${raids[i].raid}\n`;
        raidAmount++;
      }
      description += `\n`;
    }

    // Message for when there are no raids found
    if (raidAmount < 1) {
      description = `No ${faction} raids are planned yet.`;
    }

    embed.setDescription(description);
    return embed;
  },
};
