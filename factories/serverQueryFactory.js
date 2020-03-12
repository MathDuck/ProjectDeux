module.exports = {
  checkDataQuery: function(client) {
    return client.db.prepare(
      "SELECT * FROM servers WHERE guild_id = ? LIMIT 1"
    );
  },

  buildDataQuery: function(client) {
    return client.db.prepare("INSERT INTO servers (guild_id) VALUES (?)");
  },

  updatePrefixQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET prefix = ? WHERE guild_id = ? LIMIT 1"
    );
  },

  getXPSystemEnabled: function(client) {
    return client.db.prepare(
      "SELECT xp_system FROM servers WHERE guild_id = ? LIMIT 1"
    );
  },

  getGameSystemEnabled: function(client) {
    return client.db.prepare(
      "SELECT game_system FROM servers WHERE guild_id = ? LIMIT 1"
    );
  },

  updateXPSystemQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET xp_system = ? WHERE guild_id = ? LIMIT 1"
    );
  },

  updateGameSystemQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET game_system = ? WHERE guild_id = ? LIMIT 1"
    );
  },

  updateMazoSystemQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET mazo_enabled = ?, mazo_configured = ? WHERE guild_id = ? LIMIT 1"
    );
  },

  increaseCommandLaunchedQuery: function(client) {
    return client.db.prepare(
      "UPDATE servers SET commands_launched = commands_launched + 1 WHERE guild_id = ? LIMIT 1"
    );
  },

  updateSupportMessageHeaderId: function(client) {
    return client.db.prepare(
      "UPDATE servers SET support_header_message_id = ? WHERE guild_id = ? LIMIT 1"
    );
  },

  updateTicketsCategoryId: function(client) {
    return client.db.prepare(
      "UPDATE servers SET tickets_category_channel_id = ? WHERE guild_id = ? LIMIT 1"
    );
  }
};
