const _ = require('underscore-node');
const Formatter = require('./formatter');
const DriveReader = require('../drive-reader');
const Raids = require('../raids');

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
  handleMessage: function (message, arguments, isTestMode) {
    if (isTestMode) {
      return crafterSearch(message, arguments);
    }
    switch (message.channel.id) {
      case process.env.SEARCH_CHANNEL_ID:
        return raidSearch(message, arguments);
      case process.env.HORDE_TRADE_CHANNEL_ID:
        return crafterSearch(message, arguments);
      default:
        return;
    }
  },
};

function raidSearch(message, arguments) {
  if (arguments.length < 1) {
    message.channel.send(
      'Please provide a raid to search for, like: "!search mc".'
    );
    return;
  }

  // Check if raid exists
  let searchTerm = arguments[0];
  let found = false;
  Raids.all.forEach((raid) => {
    if (
      raid.key.toLowerCase() === searchTerm.toLowerCase() ||
      raid.alternatives.includes(searchTerm.toLowerCase())
    ) {
      searchTerm = raid.key.toLowerCase();
      found = true;
    }
  });
  if (!found) {
    message.channel.send(
      `The raid you are looking for does not exist. ${
        message.author
      }\nPlease use one of the following search terms:\n${Raids.formattedAsString()}`
    );
    return;
  }

  DriveReader.getRaidData()
    .catch((err) => {
      console.error('err:', err);
    })
    .then((data) => {
      const hordeEmbeds = createRaidEmbeds(data, searchTerm, 'Horde');
      for (let i = 0; i < hordeEmbeds.length; i++) {
        message.channel.send(hordeEmbeds[i]);
      }
      const allianceEmbeds = createRaidEmbeds(data, searchTerm, 'Alliance');
      for (let i = 0; i < allianceEmbeds.length; i++) {
        message.channel.send(allianceEmbeds[i]);
      }
    });
}

function createRaidEmbeds(data, raid, faction) {
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
}

function crafterSearch(message, arguments) {
  if (arguments.length < 1) {
    message.channel.send(
      'Please provide an item to search for, like: "!search windstrike gloves".'
    );
    return;
  }

  DriveReader.getCrafterData('horde')
    .catch((err) => {
      console.error(err);
    })
    .then((data) => {
      const searchQuery = arguments.reduce((acc, cur) => (acc += ` ${cur}`));
      const matches = data.filter((x) =>
        x.item.toLowerCase().includes(searchQuery)
      );

      const embed = Formatter.getFactionEmbed('horde');
      let description = '';

      if (matches.length === 1) {
        embed.setTitle(`Horde crafters for: ${matches[0].item}`);
        if (matches[0].crafters && matches[0].crafters.length > 0) {
          const crafters = matches[0].crafters.split(',');
          for (let i = 0; i < crafters.length; i++) {
            if (crafters[i]) {
              description += `${crafters[i]}\n`;
            }
          }
        } else {
          description = 'No crafters currently make this item.';
        }
      } else if (matches.length > 1) {
        embed.setTitle('Multiple items matched');
        description = 'Are you looking for one of the items listed below?\n\n';
        for (let i = 0; i < matches.length; i++) {
          description += `${matches[i].item}\n`;
        }
      } else {
        embed.setTitle('Item could not be found');
        description =
          'No items were found that matched your search.\nCheck your spelling or try searching for part of the name.';
      }

      embed.setDescription(description);
      return message.channel.send(embed);
    });
}
