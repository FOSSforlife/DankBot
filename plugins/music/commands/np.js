const request = require('request');
const Discord = require(`discord.js`);

const radioServer = {
  voiceChannel: 'EJ the DJ 📻',
  jsonUrl: 'http://stream.eliasjackson.com/status-json.xsl',
  streamUrl: 'http://stream.eliasjackson.com/music1.ogg'
};

// can safely be commented out
const msgToUpdate = {
  id: process.env.RADIO_MSG_ID, 
  channelId: process.env.RADIO_MSG_CHANNELID
} 

exports.run = async(bot, message, args, level) => {
  request(radioServer.jsonUrl, (error, response, body) => {
    if(error || parseInt(response.statusCode) >= 400) return message.channel.send("Error getting stream data");

    let icestats = JSON.parse(body).icestats;
    let server;
    if(Array.isArray(icestats.source)) {
      server = icestats.source.find(s => s.server_name === 'music1.ogg');
    }
    else {
      server = icestats.source;
    }

    var embed = new Discord.RichEmbed();
    embed.setColor(bot.embedColor.info);
    embed.setTitle(`Now playing in ${radioServer.voiceChannel}`);
    embed.setDescription(`${server.artist} - ${server.title}`);
    embed.setFooter(`${message.botDisplayName} v${bot.version}`);
    // embed.setTimestamp();
    message.channel.send({
        embed: embed
    });

    if(msgToUpdate) {
      let channel = bot.channels.find(c => c.id == msgToUpdate.channelId);
      channel.fetchMessage(msgToUpdate.id)
      .then(msg => msg.edit('', {embed: embed}));
    }
  });
}

exports.conf = {
  // Basic Info
  enabled: true,
  guildOnly: false,
  nsfw: false,

  // Command Information
  command_name: "np",
  command_description: "Get the currently playing track in the 24/7 audio channel.",
  command_usage: "np",

  // Alliases
  aliases: ['nowplaying'],

  // User Permissions
  user_permissions: "User",

  // Guild Permissions
  guild_permissions: [],

  // Stats
  userStats: true,
  guildStats: true
}