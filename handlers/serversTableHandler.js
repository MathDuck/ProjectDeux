module.exports = {
    createServerTableQuery: function(client) {
        return client.db
            .prepare(
                "CREATE TABLE IF NOT EXISTS servers (guildId TEXT PRIMARY KEY, prefix TEXT DEFAULT '!!', logChannelId TEXT, mazoConfigured INTEGER DEFAULT 0, mazoEnabled INTEGER DEFAULT 0, xpSystem INTEGER DEFAULT 1)"
            );
    },

    checkDataQuery: function(client) {
        return client.db.prepare(
            "SELECT * FROM servers WHERE guildId = ? LIMIT 1"
        );
    },

    buildDataQuery: function(client) {
        return client.db.prepare(
            "INSERT INTO servers (guildId) VALUES (?)"
        );
    },

    updatePrefixQuery: function(client) {
        return client.db.prepare(
            "UPDATE servers SET prefix = ? WHERE guildId = ? LIMIT 1"
        );
    },
}