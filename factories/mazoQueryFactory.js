module.exports = {
  selectMazoUserQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM mazo_data WHERE user_id = ? LIMIT 1`
    );
  },

  registerMazoUserQuery: function(client) {
    return client.db.prepare(
      `INSERT INTO mazo_data (guild_id, user_id, username) VALUES (?, ?, ?)`
    );
  },

  updateMazoCurrentScoreUserQuery: function(client) {
    return client.db.prepare(
      `UPDATE mazo_data SET current_score = ? WHERE user_id = ? AND guild_id = ? LIMIT 1`
    );
  },

  updateMazoTopScoreUserQuery: function(client) {
    return client.db.prepare(
      `UPDATE mazo_data SET top_score = ? WHERE user_id = ? AND guild_id = ? LIMIT 1`
    );
  },

  getMazoDataQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM mazo_data WHERE guild_id = ? ORDER BY top_score DESC LIMIT ?`
    );
  },

  getAllMazoUsersQuery: function(client) {
    return client.db.prepare(`SELECT * FROM mazo_data WHERE guild_id = ?`);
  },

  deleteMazoUserQuery: function(client) {
    return client.db.prepare(
      `DELETE FROM mazo_data WHERE guild_id = ? AND user_id = ? LIMIT 1`
    );
  }
};
