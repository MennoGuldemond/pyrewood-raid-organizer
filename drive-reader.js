const { google } = require('googleapis');
const credentialsJson = require('./credentials.json');
const tokenJson = require('./token.json');

module.exports = {
  getRaidData: async function () {
    if (!credentialsJson) {
      return console.error('Error loading credentials file');
    }
    const auth = authorize(credentialsJson);
    return fetchSheetsData(auth);
  },
};

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  if (!tokenJson) {
    console.error(
      'token.json not found, use generate-token.js to generate a token file.'
    );
    return null;
  }
  oAuth2Client.setCredentials(tokenJson);
  return oAuth2Client;
}

async function fetchSheetsData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const result = await sheets.spreadsheets.values
    .get({
      spreadsheetId: '1zBLV3u8JanX-hmiGRgij3ERdyPUyLIa9TyPtbpEYsL8',
      range: 'A:J',
    })
    .then((result) => {
      return result;
    });

  const rows = result.data.values;
  const raidData = [];
  if (rows.length) {
    rows.map((row) => {
      const rowData = {
        day: row[0],
        type: row[1],
        faction: row[2],
        raid: row[3],
        time: row[4],
        organizer: row[5],
        link: row[6],
        cut: row[7],
        signUp: row[8],
        sheet: row[9],
      };
      raidData.push(rowData);
    });
  } else {
    console.error('No data found.');
  }
  return raidData;
}
