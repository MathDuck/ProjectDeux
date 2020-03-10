module.exports = {
  createUserTableQuery: function(client) {
    return client.db.prepare(
      `CREATE TABLE IF NOT EXISTS user_data (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, username TEXT, xp_points INTEGER DEFAULT 0, level INTEGER DEFAULT 0, game_points INTEGER DEFAULT 0)`
    );
  },

  selectUserQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM user_data WHERE user_id = ? AND guild_id = ? LIMIT 1`
    );
  },

  registerUserQuery: function(client) {
    return client.db.prepare(
      `INSERT INTO user_data (guild_id, user_id, username) VALUES (?, ?, ?)`
    );
  },

  addPointToUserQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_data SET xp_points = ? WHERE user_id = ? AND guild_id = ? LIMIT 1`
    );
  },

  changeGamePointUserQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_data SET game_points = ? WHERE user_id = ? AND guild_id = ? LIMIT 1`
    );
  },

  addLevelToUserQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_data SET level = ? WHERE user_id = ? AND guild_id = ? LIMIT 1`
    );
  },

  getUsersQuery: function(client) {
    return client.db.prepare(`SELECT * FROM user_data WHERE guild_id = ?`);
  },

  getSortedUsersByXPQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM user_data WHERE guild_id = ? ORDER BY xp_points DESC LIMIT ?`
    );
  },

  getSortedUsersByGPQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM user_data WHERE guild_id = ? ORDER BY game_points DESC LIMIT ?`
    );
  },

  deleteUserQuery: function(client) {
    return client.db.prepare(
      `DELETE FROM user_data WHERE guild_id = ? AND user_id = ? LIMIT 1`
    );
  },

  purgeUsersGamePointsQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_data SET game_points = 0 WHERE guild_id = ?`
    );
  }
};
