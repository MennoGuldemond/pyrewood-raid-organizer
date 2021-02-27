module.exports = {
  getRaidText: function (raid) {
    const cut = raid.cut ? ` - Cut ${raid.cut}` : '';
    const signUp =
      raid.signUp && raid.sheet ? ` - **[${raid.signUp}](${raid.sheet})**` : '';
    return `**[${raid.organizer}](${raid.link})** - ${raid.time} - ${raid.raid}${cut}${signUp}\n`;
  },
};
