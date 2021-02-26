const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
let jsonData = require('./credentials.json');
let token = require('./token.json');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json';

module.exports = {
  getRaidData: async function () {
    if (!jsonData) {
      return console.error('Error loading credentials file');
    }
    const auth = authorize(jsonData);
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
  if (!token) {
    return getNewToken(oAuth2Client, callback);
  }
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          'Error while trying to retrieve access token',
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function fetchSheetsData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const result = await sheets.spreadsheets.values
    .get({
      spreadsheetId: '1zBLV3u8JanX-hmiGRgij3ERdyPUyLIa9TyPtbpEYsL8',
      range: 'A:H',
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
        emote: row[7],
      };
      raidData.push(rowData);
    });
  } else {
    console.error('No data found.');
  }
  return raidData;
}
