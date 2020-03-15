module.exports = client => {
  console.log(
    `Le bot ${client.user.tag} est en ligne sur ${client.guilds.cache.size} serveurs !`
  );
};
