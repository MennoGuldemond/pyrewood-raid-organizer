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
    { key: 'Kara', name: 'Karazhan', alternatives: ['karazhan'] },
    {
      key: 'Gruul',
      name: "Gruul's Lair",
      alternatives: ["gruul's lair", 'gruuls lair', 'grull', 'grulls'],
    },
    {
      key: 'Mag',
      name: "Magtheridon's Lair",
      alternatives: ["magtheridon's lair", 'magtheridons lair', 'magtheridons'],
    },
    {
      key: 'SSC',
      name: 'Serpentshrine Cavern',
      alternatives: ['serpentshrine cavern', 'serpentshrine'],
    },
    {
      key: 'TK',
      name: 'Tempest Keep',
      alternatives: ['tempest keep', 'tempest'],
    },
    {
      key: 'Hyjal',
      name: 'Hyjal Summit',
      alternatives: ['hyjal summit', 'hyjal'],
    },
    { key: 'BT', name: 'Black Temple', alternatives: ['black temple'] },
    { key: 'ZA', name: "Zul'Aman", alternatives: ["zul'aman", 'zulaman'] },
    {
      key: 'Sunwell',
      name: 'Sunwell Plateau',
      alternatives: ['sunwell Plateau', 'sun'],
    },
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
