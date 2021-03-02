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
};
