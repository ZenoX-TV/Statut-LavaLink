require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "",
    logs: process.env.LOGS || "",
    nodes: [
        {
            host: process.env.NODE_HOST || "54.37.6.86",
            identifier: process.env.NODE_ID || "LavaLink",
            port: parseInt(process.env.NODE_PORT || "80"),
            password: process.env.NODE_PASSWORD || "Blacky#9125",
            secure: parseBoolean(process.env.NODE_SECURE || "false"),

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