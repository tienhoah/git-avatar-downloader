var request = require('request');
var fs = require('fs');
var token = require('./secrets');
var ownerInput = process.argv[2];
var repoNameInput = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if (err) {
      cb(err);
    } else {
      cb(undefined, JSON.parse(body));
    }
  });
}

function downloadImageByURL(url, filePath) {
  request(url).pipe(fs.createWriteStream(filePath));
}

getRepoContributors(ownerInput, repoNameInput, function(err, result) {
  if (err) {
    console.log("My friend, I must confess: shit is fucked! ", err.message);
    return;
  }

  var contributors = [];

  if (ownerInput === undefined || repoNameInput === undefined){
    console.log("Please input owner and repo name correctly!!!");
    return;
  }
  for (var i = 0; i < result.length; i++){
    var person = {
      login : result[i].login,
      avatarURL : result[i].avatar_url
    };
    var filepath = "avatars/" + person.login + ".jpg";
    var urlLink = person.avatarURL;
    downloadImageByURL(urlLink,filepath);
  }
});



