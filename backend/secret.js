const secrets = {
  dbUri: "mongodb+srv://anjan:anjan63207anjan@cluster0-kaxoj.mongodb.net/quotes?retryWrites=true&w=majority"
};

const getSecret = key => secrets[key];

module.exports = getSecret;
