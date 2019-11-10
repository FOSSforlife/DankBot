const { google } = require('googleapis');

const ytPattern = /<@[0-9]*>, https:\/\/youtube.com\/watch/;

exports.run = async(bot, message, args, level) => {
  let query = message.content.substr(7);

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
  });

  try {
    // console.log(query);
    let link = await youtube.search.list({
      part: 'id,snippet',
      q: query
    })
    .then(res => `https://youtube.com/watch?v=${res.data.items[0].id.videoId}`);
    
    let replyMsg = await message.reply(link);
    replyMsg.react('🤘');
  }
  catch {
    message.reply('Search error');
  }

};

exports.conf = {
  // Basic Info
  enabled: true,
  guildOnly: false,
  nsfw: false,

  // Command Information
  command_name: "yt",
  command_description: "Shares a YouTube link based on a search query",
  command_usage: "yt <search query>",

  // Alliases
  aliases: ['youtube', 'share'],

  // User Permissions
  user_permissions: "User",

  // Guild Permissions
  guild_permissions: [],

  // Stats
  userStats: true,
  guildStats: true
}