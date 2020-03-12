module.exports = async (client, reaction, user) => {
  if (user.bot) return;

  if (reaction.message.partial) {
    await reaction.message.fetch();
    console.log("Mise en cache d'un ancien message.");
  }
};
