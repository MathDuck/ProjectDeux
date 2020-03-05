module.exports = {
  getXPSystemEnabled: function(client) {
    return client.db.prepare(
      "SELECT xpSystem FROM servers WHERE guildId = ? LIMIT 1"
    );
  },
  getGameSystemEnabled: function(client) {
    return client.db.prepare(
      "SELECT gameSystem FROM servers WHERE guildId = ? LIMIT 1"
    );
  },
  createUserTableQuery: function(client, guildId) {
    return client.db.prepare(
      `CREATE TABLE IF NOT EXISTS users_${guildId} (guildId TEXT, userId TEXT, username TEXT, xpPoints INTEGER DEFAULT 0, level INTEGER DEFAULT 0, gamePoints INTEGER DEFAULT 0)`
    );
  },

  selectUserQuery: function(client, guildId) {
    return client.db.prepare(
      `SELECT * FROM users_${guildId} WHERE userId = ? LIMIT 1`
    );
  },

  registerUserQuery: function(client, guildId) {
    return client.db.prepare(
      `INSERT INTO users_${guildId} (guildId, userId, username) VALUES (?, ?, ?)`
    );
  },

  addPointToUserQuery: function(client, guildId) {
    return client.db.prepare(
      `UPDATE users_${guildId} SET xpPoints = ? WHERE userId = ? LIMIT 1`
    );
  },

  changeGamePointUserQuery: function(client, guildId) {
    return client.db.prepare(
      `UPDATE users_${guildId} SET gamePoints = ? WHERE userId = ? LIMIT 1`
    );
  },

  addLevelToUserQuery: function(client, guildId) {
    return client.db.prepare(
      `UPDATE users_${guildId} SET level = ? WHERE userId = ? LIMIT 1`
    );
  },

  getUsersQuery: function(client, guildId) {
    return client.db.prepare(
      `SELECT * FROM users_${guildId} WHERE guildId = ?`
    );
  },

  getSortedUsersByXPQuery: function(client, guildId) {
    return client.db.prepare(
      `SELECT * FROM users_${guildId} WHERE guildId = ? ORDER BY xpPoints DESC LIMIT ?`
    );
  },

  getSortedUsersByGPQuery: function(client, guildId) {
    return client.db.prepare(
      `SELECT * FROM users_${guildId} WHERE guildId = ? ORDER BY gamePoints DESC LIMIT ?`
    );
  },

  deleteUserQuery: function(client, guildId) {
    return client.db.prepare(
      `DELETE FROM users_${guildId} WHERE guildId = ? AND userId = ? LIMIT 1`
    );
  },

  purgeUsersGamePointsQuery: function(client, guildId) {
    return client.db.prepare(`UPDATE users_${guildId} SET gamePoints = 0`);
  }
};
