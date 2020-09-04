const Bot = require('../../modules/Bot.js');
let active = false;
const entrees = [];
const chance = require('chance').Chance();
const settings = require('./giveaway.json');

module.exports = {
  name: 'Giveaway',
  description: "Giveaway System for Trovo",
  author: "Original by Krammy, Converted by Bulllox",
  license: "Apache-2.0",
  command: 'giveaway', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 60, // this is Set in Seconds, how long between the next usage of this command.

  execute(client, data) {
    if (data.args[0] != undefined && data.args[1] != undefined) {
      let timer = "";
      timer = data.args[0] * 60 * 60 * 1000 + data.args[1] * 60 * 1000;

      client.sendMessage(Bot.translate("plugins.giveaway.started", {
        h: data.args[0],
        m: data.args[1]
      }));

      active = true;
      if(data.args[1] > 0 && data.args[0] > 0) {
        setInterval(() => {
          
          client.sendMessage(Bot.translate("plugins.giveaway.runningGiveaway"));

        }, settings.nodification);
      }

      setTimeout(() => {
        active = false;
        if(entrees.length > 0) {
          const winner = chance.pickone(entrees);
          client.sendMessage(Bot.translate("plugins.giveaway.winner", {
            user: winner
          }));
        } else {
          client.sendMessage(Bot.translate("plugins.giveaway.noOneJoined"));
        }

      }, timer);
    } else {
      client.sendMessage(Bot.translate("plugins.giveaway.noTime"));
    }

  },

  add(client, user) {
    if(active == true) {
      if(entrees.includes(entrees)) {
         client.sendMessage(Bot.translate("plugins.giveaway.userExists"));
         return false;
      }
      entrees.push(user);      
      client.sendMessage(Bot.translate("plugins.giveaway.userJoined", {
        username: user
      }));
    } else {
      client.sendMessage(Bot.translate("plugins.giveaway.notRunning"));
    }
  },

  activate() {
    Bot.log(Bot.translate("plugins.giveaway.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.giveaway.deactivated"));
  }
};
