const bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync('admin@123#sms', salt);

console.log(hash);
