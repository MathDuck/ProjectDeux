module.exports = {
  createDefaultTables: function(client) {
    client.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS servers (guild_id TEXT PRIMARY KEY, prefix TEXT DEFAULT '!!', log_channel_id TEXT, mazo_configured INTEGER DEFAULT 0, mazo_enabled INTEGER DEFAULT 0, xp_system INTEGER DEFAULT 1, game_system INTEGER DEFAULT 0, commands_launched INTEGER DEFAULT 0, support_header_message_id TEXT, tickets_category_channel_id TEXT)`
      )
      .run();
    client.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS user_data (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, username TEXT, xp_points INTEGER DEFAULT 0, level INTEGER DEFAULT 0, game_points INTEGER DEFAULT 0)`
      )
      .run();
    client.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS mazo_data (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, user_id TEXT, username TEXT, current_score INTEGER DEFAULT 0, top_score INTEGER DEFAULT 0)`
      )
      .run();

    console.log(`Tables créées (si non existantes)...`);
  }
};
