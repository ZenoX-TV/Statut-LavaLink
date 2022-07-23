const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const { Manager } = require("erela.js");
const { nodes, token, logs } = require("./config.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});
client.manager = new Manager({
    nodes: nodes,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
}).on("nodeConnect", node => console.log(`Le serveur "${node.options.identifier}" est connecté`));
//client.rest.on('rateLimited', (info) => console.log(info));
client.on("ready", async () => {
    client.manager.init(client.user.id);
    console.log(`${client.user.username} est en ligne !`);

    const channel = await client.channels.fetch(logs);
    const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Veuillez patienter une minute !\nLe statut est prêt !`)
    channel.bulkDelete(10);
    channel.send({ embeds: [embed] }).then((msg) => {
        setInterval(() => {
            let all = []
            client.manager.nodes.forEach(node => {
                let info = []
                info.push(`Statut : ${node.connected ? "🟢" : "🔴"}`)
                info.push(`Serveur : ${(node.options.identifier)}`)
                info.push(`Connexions : ${node.stats.players}`)
                info.push(`En ligne : ${new Date(node.stats.uptime).toISOString().slice(11, 19)}`)
                info.push("\nCPU :")
                info.push(`Cœur : ${node.stats.cpu.cores}`)
                info.push(`Charge du système : ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`)
                info.push(`Charge du serveur : ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`)
                all.push(info.join('\n'))
            });
            const rembed = new EmbedBuilder()
                .setAuthor({ name: 'Serveur LavaLink :', iconURL: client.user.displayAvatarURL() })
                .setURL(`https://discord.gg/ns8CTk9J3e`)
                .setDescription(`\`\`\`${all.join('\n\n----------------------------\n')}\n\n` +
                    `Mémoire totale : ${Math.round(require('os').totalmem() / 1024 / 1024)} mb\n` +
                    `Mémoire libre : ${Math.round(require('os').freemem() / 1024 / 1024)} mb\n` +
                    `Modèle du CPU : ${require('os').cpus()[0].model}\n` +
                    `Cœur : ${require('os').cpus().length}\n` +
                    `Vitesse : ${require('os').cpus()[0].speed}Mhz\n` +
                    `Platforme : ${process.platform}\n` +
                    `\n` + `\`\`\``)
                .setColor("Red")
                .setTimestamp(Date.now());
            msg.edit({ embeds: [rembed] });
        }, 2000);
    })
})
client.login(token);

process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
});
