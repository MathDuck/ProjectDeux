module.exports = {
  createServerTableQuery: function(client) {
    return client.db.prepare(
      "CREATE TABLE IF NOT EXISTS servers (guildId TEXT PRIMARY KEY, prefix TEXT DEFAULT '!!', logChannelId TEXT, mazoConfigured INTEGER DEFAULT 0, mazoEnabled INTEGER DEFAULT 0, xpSystem INTEGER DEFAULT 1, gameSystem INTEGER DEFAULT 0)"
    );
  },

  checkDataQuery: function(client) {
    return client.db.prepare("SELECT * FROM servers WHERE guildId = ? LIMIT 1");
  },

  buildDataQuery: function(client) {
    return client.db.prepare("INSERT INTO servers (guildId) VALUES (?)");
  },

  updatePrefixQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET prefix = ? WHERE guildId = ? LIMIT 1"
    );
  },

  updateXPSystemQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET xpSystem = ? WHERE guildId = ? LIMIT 1"
    );
  },

  updateGameSystemQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET gameSystem = ? WHERE guildId = ? LIMIT 1"
    );
  },

  updateMazoSystemQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET mazoEnabled = ?, mazoConfigured = ? WHERE guildId = ? LIMIT 1"
    );
  }
};
