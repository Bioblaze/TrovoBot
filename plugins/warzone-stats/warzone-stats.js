const https = require('https');
const config = require('./stats.Settings.json');
const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Warzone-Stats',
  description: 'Replies with warzone stat information.',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'warzone-stats', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Teabagz, Updated to TrovoBot 2.0 by Wikinger1988 & modified by Rehkloos',
  execute(client, data, ) {
    const platform = data.args[0];
    const urlEncodedName = encodeURIComponent(data.args[1]);
    if (!data.args[0] && !data.args[1]) {
      client.sendMessage(`Example Usage: = !warzone-stats <"atvi" = activision ID | "psn" = ps4 | "xbl" = xbox live | "battlenet" = battlenet>  <Nickname#TAG>`);
    } else if (data.args[0]) {
      const userUrl = `https://api.tracker.gg/api/v2/warzone/standard/profile/${platform}/${urlEncodedName}`;

      https.get(userUrl, (resp) => {
          let war = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            war += chunk;
          });
          resp.on('end', () => {

            const obj = JSON.parse(war);
            if (obj.data) {
              const brStats = obj.data.segments[1];
              const brStats0 = obj.data.segments[0];
              const kills = brStats.stats.kills.displayValue;
              const deaths = brStats.stats.deaths.displayValue;
              const downs = brStats.stats.downs.displayValue;
              const kdr = brStats.stats.kdRatio.displayValue;
              const wins = brStats.stats.wins.displayValue;
              const top5 = brStats.stats.top5.displayValue;
              const top10 = brStats.stats.top10.displayValue;
              const totma = brStats.stats.gamesPlayed.displayValue;
              const avgLife = brStats.stats.averageLife.displayValue;
              const level = brStats0.stats.level.displayValue;
              client.sendMessage(
                `@${data.user} Here are my Warzone Stats:\rKills: ${kills} / Death: ${deaths}\rK/D Ratio: ${kdr}\r
	  Wins: ${wins}\r Top 5 Placements: ${top5}\r Top 10 Placements: ${top10}\r I played ${totma} rounds\r On average I live for: ${avgLife}\r I am currently level ${level}`,
              );
            } else {
              const err = obj.errors[0];
              const errMsg = err.message;
              if (errMsg) {
                client.sendMessage(
                  'We could not find the player ' +
                  `${data.args[0]}`,
                );
              }
            }
          });
        })
        .on('error', (err) => {
          Bot.log(`Error: ${err.message}`);
        });
    }
  },
};
