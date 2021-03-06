var router = getRouter();
var app = getApp();
var User = require('../users/model');
var Url = require('./model');

/**
* Shorten a URL
* AUTH: staff, admin
* POST: full, short
*/
router.post('/urls/shorten', User.Auth([User.ADMIN, User.STAFF]), function (req, res) {
  var errors = Url.validate(req.body);
  if (errors.length) return res.multiError(errors);
  var url = new Url(req.body);
  url.save(function (err, url) {
    if (err) return res.singleError('The URL must be unique');
    return res.send(url);
  });
});

/**
* Resolve a shortened URL
* URL param: the short url
*/
app.get('/go/:url', function (req, res) {
  Url.findOne({short: req.params.url}, function (err, url) {
    if (err) return res.send(404);
    return res.redirect(url.full);
  });
});

/**
* Remove a shortened URL
* AUTH: staff, admin
* POST: id
*/
router.post('/urls/remove', User.Auth([User.ADMIN, User.STAFF]), function (req, res) {
  Url.remove({_id: req.body.id}, function (err) {
    if (err) return res.singleError('URL not found');
    return res.send({});
  });
});

/**
* Get a list of URLs currently available
* AUTH: staff, admin
*/
router.get('/urls', User.Auth([User.ADMIN, User.STAFF]), function (req, res) {
  Url.find({}, function (err, urls) {
    if (err) return res.internalError();
    return res.send({urls: urls});
  });
});