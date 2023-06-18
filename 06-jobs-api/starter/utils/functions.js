const bcrypt = require("bcryptjs");

const bcryptHash = async (password, salt = 10) => {
  var salt = await bcrypt.genSalt(salt);
  var hash = await bcrypt.hash(password, salt);

  return hash;
};

const bcryptCheck = async (password, hashPassword) => {
  var isChecked = await bcrypt.compare(password, hashPassword);

  return isChecked;
};

module.exports = { bcryptHash, bcryptCheck };
