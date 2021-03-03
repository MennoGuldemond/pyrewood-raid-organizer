module.exports = {
  all: [
    { key: 'MC', name: 'Molten Core' },
    { key: 'Ony', name: 'Onyxia' },
    { key: 'BWL', name: 'Blackwing Lair' },
    { key: 'ZG', name: "Zul'Gurub" },
    { key: 'AQ20', name: "The Ruins of Ahn'Qiraj" },
    { key: 'AQ40', name: "Temple of Ahn'Qiraj" },
    { key: 'Nax', name: 'Naxxramas' },
  ],
  formattedAsString: function () {
    let text = '';
    for (let i = 0; i < this.all.length; i++) {
      text += this.all[i].key;
      if (i < this.all.length - 1) {
        text += ' / ';
      }
    }
    return text;
  },
  // TODO: add support for alternative spellings
  // Need to take into consideration that sheet data only has one name/spelling.
};
