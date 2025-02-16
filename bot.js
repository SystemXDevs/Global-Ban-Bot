const { Client, CommandInteraction, MessageEmbed, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const configPath = './config.json';

let config = {
    token: "",// Discord Token
    clientId: "", // Discord Bot ClientID
    guildId: "",// Guild ID
    ownerId: "",// Owner ID
    permissionRole: null,
    logChannel: null,
    appealLogChannel: "", //AppealLogChannel ID
    allowedGuilds: ["BCSO SERVER ID ", "SAST SERVER ID", "LAPD SERVER ID", "AND MORE!","MORE","MORE","MORE","MORE","MORE"],// YOU CAN ADD MORE OR REMOVE THEM TO AD MORE JUST ADD  ,"ADD"
    appealServerInvite: "https://discord.gg/SERVER"// DISCORD INVITE LINK TO A APPLE DISCORD SERVER
};

// Load configuration from file if it exists
if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS 
    ]
});

const commands = [
    {
        name: 'gban',
        description: 'Globally ban a user',
        options: [
            {
                name: 'userid',
                type: 3,
                description: 'User ID to globally ban',
                required: true
            },
            {
                name: 'reason',
                type: 3,
                description: 'Reason for the ban',
                required: false
            }
        ]
    },
    {
        name: 'ungban',
        description: 'Unban a globally banned user',
        options: [
            {
                name: 'userid',
                type: 3,
                description: 'User ID to unban',
                required: true
            },
            {
                name: 'reason',
                type: 3,
                description: 'Reason for the unban',
                required: false
            }
        ]
    },
    {
        name: 'setlogs',
        description: 'Set the log channel for global bans and unbans',
        options: [
            {
                name: 'channel',
                type: 7,
                description: 'Channel to set as log channel',
                required: true
            }
        ]
    },
    {
        name: 'setp',
        description: 'Set the role required to use global ban and unban commands',
        options: [
            {
                name: 'role',
                type: 8,
                description: 'Role to set as permission role',
                required: true
            }
        ]
    },
    {
        name: 'appeal',
        description: 'Appeal a ban',
        options: [
            {
                name: 'reason',
                type: 3, 
                description: 'Reason for the appeal',
                required: true
            },
            {
                name: 'rpname',
                type: 3, 
                description: 'RP Name',
                required: true
            },
            {
                name: 'discordid',
                type: 3, 
                description: 'Discord ID',
                required: true
            }
        ]
    },
    {
        name: 'a',
        description: 'Approve an appeal',
        options: [
            {
                name: 'userid',
                type: 3,
                description: 'User ID of the appeal to approve',
                required: true
            },
            {
                name: 'reason',
                type: 3, 
                description: 'Reason for the approval',
                required: true
            },
            {
                name: 'appealnumber',
                type: 3, 
                description: 'Appeal Number for the approval',
                required: true
            }
        ]
    },
    {
        name: 'd',
        description: 'Deny an appeal',
        options: [
            {
                name: 'userid',
                type: 3, 
                description: 'User ID of the appeal to deny',
                required: true
            },
            {
                name: 'reason',
                type: 3, 
                description: 'Reason for the denial',
                required: true
            },
            {
                name: 'appealnumber',
                type: 3, 
                description: 'Appeal Number for the approval',
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application commands.');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
        updateStatus(guild);
        setInterval(() => updateStatus(guild), 60000);
    } else {
        console.error('Guild not found');
    }
});

function updateStatus(guild) {
    guild.bans.fetch().then(bannedUsers => {
        const bannedUsersCount = bannedUsers.size;
        console.log(`Number of bans: ${bannedUsersCount}`);

        let appeals = loadAppeals();
        const appealsCount = Object.keys(appeals).length;
        console.log(`Number of appeals: ${appealsCount}`);

        client.user.setActivity(`${bannedUsersCount} bans | ${appealsCount} appeals`, { type: 'WATCHING' });
    }).catch(console.error);
}

let database = {};
if (fs.existsSync('./database.json')) {
    const data = fs.readFileSync('./database.json');
    database = JSON.parse(data);
}

function loadAppeals() {
    try {
        if (fs.existsSync('./appeals.json')) {
            const data = fs.readFileSync('./appeals.json', 'utf8');
            return JSON.parse(data);
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error loading appeals:', error);
        return {};
    }
}

function saveAppeals(appeals) {
    try {
        fs.writeFileSync('./appeals.json', JSON.stringify(appeals, null, 2));
    } catch (error) {
        console.error('Error saving appeals:', error);
    }
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, guild } = interaction;

    if (commandName === 'gban') {
        if (!interaction.member.roles.cache.has(config.permissionRole)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
    
        const userID = options.getString('userid');
        const reason = options.getString('reason') || 'No reason provided';
        const staffMember = interaction.user.tag;
        const currentDate = new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
    
        await interaction.deferReply();
    
        const banEmbed = new MessageEmbed()
            .setTitle('Global Ban Initiated')
            .setDescription(`User with ID ${userID} is being globally banned.`)
            .setColor('#ff0000')
            .setTimestamp();
    
        await interaction.editReply({ embeds: [banEmbed] });
    
        const user = await client.users.fetch(userID);
        const bannedServers = [];
    
        for (const allowedGuildID of config.allowedGuilds) {
            const allowedGuild = client.guilds.cache.get(allowedGuildID);
            if (allowedGuild) {
                bannedServers.push(allowedGuild.name);
                try {
                    await allowedGuild.members.ban(userID, { reason: reason });
                    const guildEmbed = new MessageEmbed()
                        .setTitle('Global Ban')
                        .setDescription(`User with ID ${userID} has been banned.`)
                        .addField('Reason', reason)
                        .setColor('#ff0000')
                        .setTimestamp();
                    const allowedLogChannel = allowedGuild.channels.cache.get(config.logChannel);
                    if (allowedLogChannel) {
                        allowedLogChannel.send({ embeds: [guildEmbed] });
                    } else {
                        console.error(`Log channel not found in guild: ${allowedGuild.name}`);
                    }
                } catch (error) {
                    console.error(`Failed to ban user in guild ${allowedGuild.name}:`, error);
                }
            } else {
                console.error(`Allowed guild not found: ${allowedGuildID}`);
            }
        }
    
        const dmEmbed = new MessageEmbed()
            .setTitle('Global Ban Notification')
            .setDescription(`You have been globally banned from ARP. This ban is appealable.`)
            .addField('Staff Member', `@${staffMember}`)
            .addField('Guilds Banned From', `${bannedServers.length}`)
            .addField('Date Issued', currentDate)
            .addField('Server Name', 'Atlantis Roleplay')
            .addField('Appeal Ban', `[Click here to appeal ban](${config.appealServerInvite})`)
            .addField('Reason', reason)
            .setColor('#ff0000')
            .setTimestamp();
    
        try {
            await user.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`Failed to send DM to user with ID ${userID}:`, error);
        }
    
        database[userID] = { type: 'ban', reason: reason, timestamp: Date.now() };
        fs.writeFileSync('./database.json', JSON.stringify(database));
    
        interaction.followUp({ content: `User with ID ${userID} has been globally banned from ${bannedServers.length} servers.` });
    } else if (commandName === 'ungban') {
        if (!interaction.member.roles.cache.has(config.permissionRole)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
    
        const userID = options.getString('userid');
        const reason = options.getString('reason') || 'No reason provided';
        const staffMember = interaction.user.tag;
    
        const unbanEmbed = new MessageEmbed()
            .setTitle('Global Unban Initiated')
            .setDescription(`User with ID ${userID} is being globally unbanned.`)
            .setColor('#00ff00')
            .setTimestamp();
    
        await interaction.deferReply();
    
        let unbannedServersCount = 0;
        for (const allowedGuildID of config.allowedGuilds) {
            const allowedGuild = client.guilds.cache.get(allowedGuildID);
            if (allowedGuild) {
                try {
                    await allowedGuild.members.unban(userID, reason);
                    unbannedServersCount++;
                    const guildEmbed = new MessageEmbed()
                        .setTitle('Global Unban')
                        .setDescription(`User with ID ${userID} has been unbanned.`)
                        .addField('Reason', reason)
                        .setColor('#00ff00')
                        .setTimestamp();
                    const allowedLogChannel = allowedGuild.channels.cache.get(config.logChannel);
                    if (allowedLogChannel) {
                        allowedLogChannel.send({ embeds: [guildEmbed] });
                    } else {
                        console.error(`Log channel not found in guild: ${allowedGuild.name}`);
                    }
                } catch (error) {
                    console.error(`Failed to unban user in guild ${allowedGuild.name}:`, error);
                }
            } else {
                console.error(`Allowed guild not found: ${allowedGuildID}`);
            }
        }
    
        unbanEmbed.addField('Unbanned by', staffMember)
                  .addField('Reason', reason)
                  .addField('Servers Unbanned From', `${unbannedServersCount}`);
    
        await interaction.editReply({ embeds: [unbanEmbed] });
    
        database[userID] = { type: 'unban', reason: reason, timestamp: Date.now(), unbannedBy: staffMember };
        fs.writeFileSync('./database.json', JSON.stringify(database, null, 2));
    } else if (commandName === 'setlogs') {
        if (interaction.member.id !== config.ownerId) return interaction.reply('Only the owner of the server can use this command.');

        const logChannelID = options.getChannel('channel').id;
        config.logChannel = logChannelID;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        await interaction.reply(`Log channel has been set to <#${logChannelID}>.`);
    } else if (commandName === 'setp') {
        if (interaction.member.id !== config.ownerId) return interaction.reply('Only the owner of the server can use this command.');

        const roleID = options.getRole('role').id;
        config.permissionRole = roleID;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        await interaction.reply(`Permission role has been set to <@&${roleID}>.`);
    } else if (commandName === 'appeal') {
        const reason = options.getString('reason');
        const rpname = options.getString('rpname');
        const discordid = options.getString('discordid');

        let appeals = loadAppeals();
        appeals[discordid] = { reason, rpname, timestamp: Date.now() };
        saveAppeals(appeals);

        const appealLogChannel = client.channels.cache.get(config.appealLogChannel);
        if (appealLogChannel) {
            const embed = new MessageEmbed()
                .setTitle('Ban Appeal')
                .addField('RP Name', rpname)
                .addField('Discord ID', discordid)
                .addField('Reason', reason)
                .setColor('#ffff00')
                .setTimestamp();
            appealLogChannel.send({ embeds: [embed] });
        } else {
            console.error('Appeal log channel not found');
        }
        await interaction.reply(`Your appeal has been submitted.`);
    }
});

client.login(config.token);
