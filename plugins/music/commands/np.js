const request = require('request-promise');
const Discord = require(`discord.js`);
const cronJob = require('cron').CronJob;

const radioServer = {
  voiceChannel: 'EJ the DJ 📻',
  jsonUrl: 'http://stream.eliasjackson.com/status-json.xsl',
  streamUrl: 'http://stream.eliasjackson.com/music1.ogg'
};

const updateNowPlaying = true;
const nowPlayingMsg = {
  id: process.env.RADIO_MSG_ID, 
  channelId: process.env.RADIO_MSG_CHANNELID
};

const getNowPlayingEmbed = async (bot) => {
  let body = await request(radioServer.jsonUrl);
  let icestats = JSON.parse(body).icestats;
  let server;
  if(Array.isArray(icestats.source)) {
    server = icestats.source.find(s => s.server_name === 'music1.ogg');
  }
  else {
    server = icestats.source;
  }
  let npString = `${server.artist} - ${server.title}`;
  // bot.logger.debug(npString);

  let embed = new Discord.RichEmbed();
  embed.setColor(bot.embedColor.info);
  embed.setTitle(`Now playing in ${radioServer.voiceChannel}`);
  embed.setDescription(npString);
  // embed.setFooter(`${bot.config.DisplaName} v${bot.version}`);
  // embed.setTimestamp();

  return [embed, npString];
}

exports.run = async(bot, message, args, level) => {
  [embed, currentNowPlaying] = await getNowPlayingEmbed(bot);
  message.channel.send({
      embed: embed
  });

  if(updateNowPlaying) {
    if(currentNowPlaying !== bot.currentNowPlaying) {
      bot.currentNowPlaying = currentNowPlaying;
      let channel = bot.channels.find(c => c.id == nowPlayingMsg.channelId);
      channel.fetchMessage(nowPlayingMsg.id)
      .then(msg => msg.edit('', {embed: embed}));
    }

    if(!bot.updateNowPlayingCronJob) {
      bot.updateNowPlayingCronJob = new cronJob("*/1 * * * *", () => {
        getNowPlayingEmbed(bot)
        .then(([embed, currentNowPlaying]) => {
          if(currentNowPlaying !== bot.currentNowPlaying) {
            bot.currentNowPlaying = currentNowPlaying;
            let channel = bot.channels.find(c => c.id == nowPlayingMsg.channelId);
            channel.fetchMessage(nowPlayingMsg.id)
            .then(msg => msg.edit('', {embed: embed}));
          }
        })
      });
      bot.updateNowPlayingCronJob.start();

    }
  }
  

  if(updateNowPlaying && !bot.updateNowPlayingCronJob) {
    
  }
  
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