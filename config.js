require('dotenv').config();
const config = {
    // Bot Name
    botDisplaName: 'VISION',

    // Default Settings
    prefix: '$',
    modRole: 'Mod',
    adminRole: 'Admin',

    owner: {
        discord_tag: process.env.DISCORD_TAG,
        discord_id: process.env.DISCORD_USER_ID,
        email: process.env.EMAIL
    },

    // Bot Admins, level 9 by default. Array of user ID strings.
    admins: [],

    // Bot Support, level 8 by default. Array of user ID strings
    support: [],

    // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
    token: process.env.DISCORD_TOKEN,

    // TODO: set up mongodb
    mongodb: {
        host: process.env.MONGODB_HOST,
        database: process.env.MONGODB_DATABASE,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
    },

    // Where bot errors are logged to on discord.
    errorChatLog: {
        server: "",
        channel: ""
    },

    /*defaultSettings: {
        settings: {
            bot_name: "VISION",
            bot_prefix: "-",
            role_admin: "Admin",
            role_mod: "Mod",
            role_user: "*",
            role_mute: "Muted",
            premium: false
        },
        blacklist: [],
        join_roles: [],
        react_roles: [],
        plugins: {
            admin: {
                enabled: true,
                commands: {
                    botname: true,
                    prefix: true,
                    actionlog: true,
                    joinrole: true,
                    reactrole: true,
                    settings: true,
                    welcome: true
                }
            },
            mod: {
                enabled: true,
                commands: {
                    warn: true,
                    mute: true,
                    unmute: true,
                    kick: true,
                    ban: true,
                    softbane: true,
                    unban: true,
                    blacklist: true,
                    whois: true,
                    purge: true
                }
            },
            user: {
                enabled: true,
                commands: {
                    botstats: true,
                    invite: true,
                    serverinfo: true,
                    userinfo: true,
                    help: true
                }
            },
            fun: {
                enabled: true,
                commands: {
                    advice: true,
                    catfact: true,
                    chucknorris: true,
                    fortune: true,
                    joke: true,
                    qotd: true,
                    trump: true,
                    ask: true,
                    coinflip: true,
                    insult: true,
                    roll: true,
                    meirl: true,
                    memes: true,
                    twitter: true
                }
            },
            nsfw: {
                enabled: true,
                commands: {
                    penis: true,
                    urban: true,
                    nsfw: true,
                    hentai: true,
                    gonewild: true,
                    ahegao: true
                }
            },
            actionlog: {
                enabled: false,
                channel: null,
                actions: {
                    user_join: true,
                    user_leave: true,
                    user_banned: true,
                    user_kicked: true,
                    user_unbanned: true,
                    user_softbanned: true,
                    user_role_add: true,
                    user_role_remove: true,
                    user_nickname_change: true,
                    user_username_change: true,
                    msg_delete: true,
                    msg_edit: true,
                    msg_purge: true,
                    channel_create: true,
                    channel_delete: true,
                    channel_update: true,
                    role_create: true,
                    role_delete: true,
                    role_update: true,
                    blacklist_user_add: true,
                    blacklist_user_remove: true
                }
            },
            welcome_message: {
                enabled: false,
                channel: null,
                message: "Welcome {user} to {server}!"
            },
            announcements: {
                enabled: false,
                channel: null,
                actions: {
                    user_join: {
                        enabled: true,
                        message: "{user} has joined."
                    },
                    user_leave: {
                        enabled: true,
                        message: "{user} has left."
                    }
                }
            }
        }
    }, */

    defaultSettings: {
        General: {
            prefix: '$',
            role_admin: 'Admin',
            role_mod: 'Mod',
            role_mute: 'Muted',
            role_nomention: 'No Mention'
        },
        DisabledChannels: [],
        UserBlacklist: [],
        Plugins: {
            fun: {
                yomammma: false
            }
        }
    },

    // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
    // VIA COMMANDS IN THE GUILD.

    // PERMISSION LEVEL DEFINITIONS.

    permLevels: [
        // This is the lowest permisison level, this is for non-roled users.
        {
            level: 0,
            name: 'User',
            // Don't bother checking, just return true which allows them to execute any command their
            // level allows them to.
            check: () => true
        },

        // This is your permission level, the staff levels should always be above the rest of the roles.
        {
            level: 2,
            // This is the name of the role.
            name: 'Mod',
            // The following lines check the guild the message came from for the roles.
            // Then it checks if the member that authored the message has the role.
            // If they do return true, which will allow them to execute the command in question.
            // If they don't then return false, which will prevent them from executing the command.
            check: message => {
                try {
                    const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.guildSettings.settings.role_mod.toLowerCase());
                    if (modRole && message.member.roles.has(modRole.id)) return true;
                } catch (e) {
                    return false;
                }
            }
        },

        {
            level: 3,
            name: 'Admin',
            check: message => {
                try {
                    const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.guildSettings.settings.role_admin.toLowerCase());
                    return adminRole && message.member.roles.has(adminRole.id);
                } catch (e) {
                    return false;
                }
            }
        },
        // This is the server owner.
        {
            level: 4,
            name: 'Server Owner',
            // Simple check, if the guild owner id matches the message author's ID, then it will return true.
            // Otherwise it will return false.
            check: message => (message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false)
        },

        // Bot Support is a special inbetween level that has the equivalent of server owner access
        // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
        {
            level: 8,
            name: 'Bot Support',
            // The check is by reading if an ID is part of this array. Yes, this means you need to
            // change this and reboot the bot to add a support user. Make it better yourself!
            check: message => config.support.includes(message.author.id)
        },

        // Bot Admin has some limited access like rebooting the bot or reloading commands.
        {
            level: 9,
            name: 'Bot Admin',
            check: message => config.admins.includes(message.author.id)
        },

        // This is the bot owner, this should be the highest permission level available.
        // The reason this should be the highest level is because of dangerous commands such as eval
        // or exec (if the owner has that).
        {
            level: 10,
            name: 'Bot Owner',
            // Another simple check, compares the message author id to the one stored in the config file.
            check: message => message.client.config.owner.discord_id === message.author.id
        }
    ]
};

module.exports = config;
