module.exports = {
  checkActiveTicketDataQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM user_tickets WHERE user_id = ? AND guild_id = ? AND resolved = ? LIMIT 1`
    );
  },
  checkActiveTicketInCurrentChannelQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM user_tickets WHERE guild_id = ? AND channel_id = ? AND resolved = ? LIMIT 1`
    );
  },
  checkTicketDataByHeaderIdQuery: function(client) {
    return client.db.prepare(
      `SELECT * FROM user_tickets WHERE ticket_header_message_id = ? LIMIT 1`
    );
  },
  addTicketDataQuery: function(client) {
    return client.db.prepare(
      `INSERT INTO user_tickets (guild_id, user_id, username, resolved, archived) VALUES (?, ?, ?, ?, ?)`
    );
  },
  updateTicketDataQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_tickets SET channel_id = ?, ticket_header_message_id = ?, timestamp = ? WHERE user_id = ? AND guild_id = ? AND resolved = ? LIMIT 1`
    );
  },
  resolveTicketQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_tickets SET resolved = ? WHERE ticket_header_message_id = ? LIMIT 1`
    );
  },
  resolveAndArchiveTicketQuery: function(client) {
    return client.db.prepare(
      `UPDATE user_tickets SET resolved = ?, archived = ? WHERE ticket_header_message_id = ? LIMIT 1`
    );
  },
  deleteTicketQuery: function(client) {
    return client.db.prepare(
      `DELETE FROM user_tickets WHERE guild_id = ? AND channel_id = ? AND resolved = ? LIMIT 1`
    );
  }
};
