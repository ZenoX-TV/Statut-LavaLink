require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "", // Token de votre bot
    logs: process.env.LOGS || "", // Salon pour le statut du serveur LavaLink
    nodes: [
        {
            host: process.env.NODE_HOST || "", // Host du serveur
            identifier: process.env.NODE_ID || "", // Nom du serveur
            port: parseInt(process.env.NODE_PORT || ""), // Port du serveur
            password: process.env.NODE_PASSWORD || "", // Mot de passe du serveur
            secure: parseBoolean(process.env.NODE_SECURE || ""), // sécurité du serveur (true ou false)

        }
    ],

}

function parseBoolean(value) {
    if (typeof (value) === 'string') {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}
