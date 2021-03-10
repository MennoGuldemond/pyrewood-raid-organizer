[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# Pyrewood Raid Organizer
A discord bot that shows raid time table information from google sheets.

## Getting started
1. run 'npm install'
1. open https://developers.google.com/sheets/api/quickstart/nodejs and click the button 'Enable the Google Sheets API'
1. Follow the steps to generate a credentials.json file and replace it with the one in the project (or add it to the root if there is none).
1. run 'node generate-token.js' and follow the steps to create a token.json file.
1. Add a .env file to the root with the following properties:
   * BOT_TOKEN=...
   * SPREADSHEET_ID=...
   * SEARCH_CHANNEL_ID=...
1. run 'node bot.js' to start the bot.
