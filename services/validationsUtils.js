module.exports = {
  isValidMail: function (mail) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mailFormat.test(String(mail).toLowerCase());
  },
  isEmpty: function (input) {
    return input ? input.trim().length === 0 : true;
  },
};
