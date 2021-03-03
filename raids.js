module.exports = {
  // Alternatives must be lowercase
  all: [
    { key: 'MC', name: 'Molten Core', alternatives: ['molten core'] },
    { key: 'Ony', name: 'Onyxia', alternatives: ['onyxia'] },
    { key: 'BWL', name: 'Blackwing Lair', alternatives: ['blackwing lair'] },
    { key: 'ZG', name: "Zul'Gurub", alternatives: ["zul'gurub", 'zulgurub'] },
    {
      key: 'AQ20',
      name: "the ruins of ahn'qiraj",
      alternatives: ["the ruins of ahn'qiraj"],
    },
    {
      key: 'AQ40',
      name: "Temple of Ahn'Qiraj",
      alternatives: ["temple of ahn'qiraj"],
    },
    { key: 'Nax', name: 'Naxxramas', alternatives: ['naxxramas', 'naxx'] },
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
};
