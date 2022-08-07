const { Client, EmbedBuilder } = require("discord.js");
const { logs } = require("../config.js");
const si = require('systeminformation');
const os = require("node:os");
const pretty = require('prettysize');
const moment = require("moment");
require("moment-duration-format");
/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    client.manager.init(client.user.id);
    console.log(`${client.user.username} est en ligne !`);

    const channel = await client.channels.fetch(logs);


    let cl = await si.currentLoad();
    const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Veuillez patienter...")
    channel.bulkDelete(10);
    channel.send({ embeds: [embed] }).then((msg) => {
        setInterval(async () => {

            let netdata = await si.networkStats();
            let memdata = await si.mem();
            let diskdata = await si.fsSize();
            let osdata = await si.osInfo();
            let cpudata = await si.cpu();
            let uptime = await os.uptime();

            const rembed = new EmbedBuilder()
                .addFields([
                    {
                        name: "SERVEUR LAVALINK :", value: `\`\`\`nim\n${client.manager.nodes.map((node) =>
                            `Serveur : ${node.connected ? "🟢" : "🔴"} ${node.options.identifier}
Utilisation de la mémoire : ${formatBytes(node.stats.memory.allocated)} - ${node.stats.cpu.lavalinkLoad.toFixed(2)}%
Connexions : ${node.stats.playingPlayers} / ${node.stats.players}
Disponibilité : ${moment(node.stats.uptime).format(
                                "D[ jours], H[ heures], M[ minutes], S[ secondes]"
                            )}`)}\`\`\``, inline: true
                    },

                    { name: "**CPU :**", value: `\`\`\`nim\nCPU : ${cpudata.manufacturer + " " + cpudata.brand}\nCharge : ${cl.currentLoad.toFixed(2)}%\nCœur : ${cpudata.cores}\nPlatforme : ${osdata.platform}\`\`\``, inline: true },
                    { name: "**RAM :**", value: `\`\`\`nim\nDisponible : ${pretty(memdata.total)}\nMémoire utilisée : ${pretty(memdata.active)}\`\`\``, inline: true },
                    { name: "**DISQUE :**", value: `\`\`\`nim\nDisque utilisé : ${pretty(diskdata[0].size)} / ${pretty(diskdata[0].used)}\`\`\``, inline: true },
                    { name: "**INTERNET :**", value: `\`\`\`nim\nLatence : ${Math.round(netdata[0].ms)}ms\nAscendant : ${pretty(netdata[0].tx_sec)}/s\nDescendant : ${pretty(netdata[0].rx_sec)}/s\n\nTotal ascendant : ${pretty(netdata[0].tx_bytes)}\nTotal descendant : ${pretty(netdata[0].rx_bytes)}\`\`\`` },
                    { name: "**API DISCORD / LATENCE :**", value: `\`\`\`nim\n${Math.round(client.ws.ping)}ms\`\`\``, inline: true },
                    { name: "**EN LIGNE :**", value: `\`\`\`nim\n${uptimer(uptime)}\`\`\``, inline: true }
                ])
                .setColor("Blue")
                .setFooter({ text: `Dernière mise à jour ` })
                .setTimestamp(Date.now());
            msg.edit({ embeds: [rembed] });

        }, 5000);
    })

}

function uptimer(seconds) {
    seconds = seconds || 0;
    seconds = Number(seconds);
    seconds = Math.abs(seconds);

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var parts = new Array();

    if (d > 0) {
        var dDisplay = d > 0 ? d + ' ' + (d == 1 ? "jour" : "jours") : "";
        parts.push(dDisplay);
    }

    if (h > 0) {
        var hDisplay = h > 0 ? h + ' ' + (h == 1 ? "heure" : "heures") : "";
        parts.push(hDisplay)
    }

    if (m > 0) {
        var mDisplay = m > 0 ? m + ' ' + (m == 1 ? "minute" : "minutes") : "";
        parts.push(mDisplay)
    }

    if (s > 0) {
        var sDisplay = s > 0 ? s + ' ' + (s == 1 ? "seconde" : "secondes") : "";
        parts.push(sDisplay)
    }

    return parts.join(', ', parts);
}
function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return `${(
        bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))
    ).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
}
