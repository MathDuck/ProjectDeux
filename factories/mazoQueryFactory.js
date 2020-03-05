module.exports = {
  createMazoTableQuery: function(client, guildId) {
    return client.db.prepare(
      `CREATE TABLE IF NOT EXISTS mazo_${guildId} (guildId TEXT, userId TEXT, username TEXT, currentScore INTEGER DEFAULT 0, topScore INTEGER DEFAULT 0)`
    );
  },

  selectMazoUserQuery: function(client, guildId) {
    return client.db.prepare(
      `SELECT * FROM mazo_${guildId} WHERE userId = ? LIMIT 1`
    );
  },

  registerMazoUserQuery: function(client, guildId) {
    return client.db.prepare(
      `INSERT INTO mazo_${guildId} (guildId, userId, username) VALUES (?, ?, ?)`
    );
  },

  updateMazoCurrentScoreUserQuery: function(client, guildId) {
    return client.db.prepare(
      `UPDATE mazo_${guildId} SET currentScore = ? WHERE userId = ? AND guildId = ? LIMIT 1`
    );
  },

  updateMazoTopScoreUserQuery: function(client, guildId) {
    return client.db.prepare(
      `UPDATE mazo_${guildId} SET topScore = ? WHERE userId = ? AND guildId = ? LIMIT 1`
    );
  },

  getMazoDataQuery: function(client, guildId) {
    return client.db.prepare(
      `SELECT * FROM mazo_${guildId} WHERE guildId = ? ORDER BY topScore DESC LIMIT ?`
    );
  },

  getAllMazoUsersQuery: function(client, guildId) {
    return client.db.prepare(`SELECT * FROM mazo_${guildId} WHERE guildId = ?`);
  },

  deleteMazoUserQuery: function(client, guildId) {
    return client.db.prepare(
      `DELETE FROM mazo_${guildId} WHERE guildId = ? AND userId = ? LIMIT 1`
    );
  }
};
