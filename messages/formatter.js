const _ = require('underscore-node');
const { MessageEmbed } = require('discord.js');

module.exports = {
  getRaidText: function (raid) {
    const cut = raid.cut ? ` - Cut ${raid.cut}` : '';
    const signUp =
      raid.signUp && raid.sheet ? ` - **[${raid.signUp}](${raid.sheet})**` : '';
    return `**[${raid.organizer}](${raid.link})** - ${raid.time} - ${raid.raid}${cut}${signUp}\n`;
  },
  getFactionEmbed: function (faction) {
    const embed = new MessageEmbed();
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
    return embed;
  },
  getSearchDescriptions: function (gdkpData, srData, otherData, sortedByDay) {
    const maxDescriptionLength = 1600;
    let descriptionTexts = [];
    let description = '';
    let raidAmount = 0;

    // Group by day
    let gdkpByDay = _.groupBy(gdkpData, 'day');
    let srByDay = _.groupBy(srData, 'day');
    let otherByDay = _.groupBy(otherData, 'day');

    if (gdkpData.length > 0) {
      description += '__**GDKP RAIDS**__\n';
    }
    for (const [day, raids] of Object.entries(gdkpByDay)) {
      description += `**${day}**\n`;
      for (let i = 0; i < raids.length; i++) {
        description += this.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
      // cut up too long texts
      if (description.length > maxDescriptionLength) {
        descriptionTexts.push(description);
        description = '';
      }
    }

    if (srData.length > 0) {
      description += '__**SR RAIDS**__\n';
    }
    for (const [day, raids] of Object.entries(srByDay)) {
      description += `**${day}**\n`;
      for (let i = 0; i < raids.length; i++) {
        description += this.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
      // cut up too long texts
      if (description.length > maxDescriptionLength) {
        descriptionTexts.push(description);
        description = '';
      }
    }

    if (otherData.length > 0) {
      description += '__**Other RAIDS**__\n';
    }
    for (const [day, raids] of Object.entries(otherByDay)) {
      description += `**${day}**\n`;
      for (let i = 0; i < raids.length; i++) {
        description += this.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
      // cut up too long texts
      if (description.length > maxDescriptionLength) {
        descriptionTexts.push(description);
        description = '';
      }
    }

    descriptionTexts.push(description);
    return descriptionTexts;
  },
  getPostDescriptions: function (gdkpData, srData, otherData) {
    const maxDescriptionLength = 1600;
    let descriptionTexts = [];
    let description = '';
    let raidAmount = 0;

    if (gdkpData.length > 0) {
      description += '__**GDKP RAIDS**__\n';
    }
    let gdkpSplitted = _.groupBy(gdkpData, 'raid');
    for (const [, raids] of Object.entries(gdkpSplitted)) {
      for (let i = 0; i < raids.length; i++) {
        description += this.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
      // cut up too long texts
      if (description.length > maxDescriptionLength) {
        descriptionTexts.push(description);
        description = '';
      }
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
        description += this.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
      // cut up too long texts
      if (description.length > maxDescriptionLength) {
        descriptionTexts.push(description);
        description = '';
      }
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
        description += this.getRaidText(raids[i]);
        raidAmount++;
      }
      description += `\n`;
      // cut up too long texts
      if (description.length > maxDescriptionLength) {
        descriptionTexts.push(description);
        description = '';
      }
    }

    // Message for when there are no raids found
    if (raidAmount < 1) {
      description = `No ${faction} raids are planned yet.`;
    }

    descriptionTexts.push(description);
    return descriptionTexts;
  },
};
