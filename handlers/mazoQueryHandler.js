module.exports = {
    querySelectServer: function(client) {
        return client.db.prepare(
            "SELECT mazoConfigured, mazoEnabled FROM servers WHERE guildId = ? LIMIT 1"
        );
    },

    queryUpdateServer: function(client) {
        return client.db.prepare(
            "UPDATE servers SET mazoEnabled = ?, mazoConfigured = ? WHERE guildId = ? LIMIT 1"
        );
    },

    queryCreateMazoTable: function(client, guildId) {
        return client.db.prepare(
            `CREATE TABLE IF NOT EXISTS mazo_${guildId} (guildId TEXT, userId TEXT, username TEXT, currentScore INTEGER DEFAULT 0, topScore INTEGER DEFAULT 0)`
        );
    },

    querySelectMazoUser: function(client, guildId) {
        return client.db.prepare(
            `SELECT * FROM mazo_${guildId} WHERE userId = ? LIMIT 1`
        );
    },

    queryRegisterMazoUser: function(client, guildId) {
        return client.db.prepare(
            `INSERT INTO mazo_${guildId} (guildId, userId, username, currentScore, topScore) VALUES (?, ?, ?, ?, ?)`
        );
    },

    queryUpdateMazoCurrentScoreUser: function(client, guildId) {
        return client.db.prepare(
            `UPDATE mazo_${guildId} SET currentScore = ? WHERE userId = ? AND guildId = ? LIMIT 1`
        );
    },

    queryUpdateMazoTopScoreUser: function(client, guildId) {
        return client.db.prepare(
            `UPDATE mazo_${guildId} SET topScore = ? WHERE userId = ? AND guildId = ? LIMIT 1`
        );
    },

    queryGetMazoData: function(client, guildId) {
        return client.db.prepare(
            `SELECT * FROM mazo_${guildId} WHERE guildId = ? ORDER BY topScore DESC LIMIT ?`
        );
    },

    queryGetAllMazoUsers: function(client, guildId) {
        return client.db.prepare(
            `SELECT * FROM mazo_${guildId} WHERE guildId = ?`
        );
    },

    queryDeleteMazoUser: function(client, guildId) {
        return client.db.prepare(
            `DELETE FROM mazo_${guildId} WHERE guildId = ? AND userId = ? LIMIT 1`
        );
    },
};