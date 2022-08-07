require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "",
    logs: process.env.LOGS || "",
   
    nodes: [
        {
            host: process.env.NODE_HOST || "",
            identifier: process.env.NODE_ID || "",
            port: parseInt(process.env.NODE_PORT || ""),
            password: process.env.NODE_PASSWORD || "",
            secure: parseBoolean(process.env.NODE_SECURE || ""),

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
