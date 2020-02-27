module.exports = {
  querySelectServer: function(client) {
    return client.db.prepare(
      "SELECT mazoEnabled FROM servers WHERE guildid = ? LIMIT 1"
    );
  },

  queryInsertServer: function(client) {
    return client.db.prepare(
      "INSERT INTO servers (guildid, mazoEnabled) VALUES (?, ?)"
    );
  },

  queryUpdateServer: function(client) {
    return client.db.prepare(
      "UPDATE servers SET mazoEnabled = ? WHERE guildid = ? LIMIT 1"
    );
  },

  queryCreateMazoTable: function(client, guildid) {
    return client.db.prepare(
      `CREATE TABLE IF NOT EXISTS mazo_${guildid} (guildid TEXT, userid TEXT, username TEXT, currentscore INTEGER, topscore INTEGER)`
    );
  },

  querySelectMazoUser: function(client, guildid) {
    return client.db.prepare(
      `SELECT * FROM mazo_${guildid} WHERE userid = ? LIMIT 1`
    );
  },

  queryRegisterMazoUser: function(client, guildid) {
    return client.db.prepare(
      `INSERT INTO mazo_${guildid} (guildid, userid, username, currentscore, topscore) VALUES (?, ?, ?, ?, ?)`
    );
  },

  queryUpdateMazoCurrentScoreUser: function(client, guildid) {
    return client.db.prepare(
      `UPDATE mazo_${guildid} SET currentscore = ? WHERE userid = ? AND guildid = ? LIMIT 1`
    );
  },

  queryUpdateMazoTopScoreUser: function(client, guildid) {
    return client.db.prepare(
      `UPDATE mazo_${guildid} SET topscore = ? WHERE userid = ? AND guildid = ? LIMIT 1`
    );
  }
};
