'use strict';

const debug = require('debug')('artc:mock-multiple-artists');
const Artist = require('../../model/artist.js');
const User = require('../../model/user.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('creating 5 artists');
  let artistsMock = [];
  for(let i = 0; i < 5; i++){
    artistsMock.push(mockArtist());
  }
  Promise.all(artistsMock)
  .then(artists => {
    this.tempArtists = artists;
    done();
  })
  .catch(done);
};

function mockArtist(){
  debug('create artist mock');
  mockUser().then(userData => {
    let exampleArtist = {
      firstname: lorem({count:2, units: 'word'}),
      lastname: lorem({count:2, units: 'word'}),
      city: lorem({count:2, units: 'word'}),
      zip: lorem({count:2, units: 'word'}),
      about: lorem({count:2, units: 'sentence'}),
      phone: lorem({count:2, units: 'word'}),
    };

    exampleArtist.userID = userData.tempUser._id.toString();
    exampleArtist.username = userData.tempUser.username;
    exampleArtist.email = userData.tempUser.email;
    return new Artist(exampleArtist).save();
  })
  .catch(console.error);
}

function mockUser() {
  debug('create mock user');
  let username = lorem({count: 5, units: 'word'}).split(' ').join('-');
  let password = lorem({count: 5, units: 'word'}).split(' ').join('-');
  let email = lorem({count: 5, units: 'word'}).split(' ').join('-');
  console.log('name, ', username);
  let exampleUser = {
    username,
    password,
    email: `${email}@art.fancyartist`,
  };
  let result = {};

  result.tempPassword = password;
  return new User(exampleUser)
  .generatePasswordHash(exampleUser.password)
  .then(user => {
    result.tempUser = user;
    return user.generateToken();
  })
  .then( token  =>{
    result.tempToken = token;
    return result.tempUser.save();
  })
  .then(user => {
    result.tempUser = user;
    return result;
  })
  .catch(console.error);
}

// function mockArtist(userID, username, userEmail){
//   let firstname = lorem({count:2, units: 'word'});
//   let lastname = lorem({count:2, units: 'word'});
//   let city = lorem({count:2, units: 'word'});
//   let zip = lorem({count:2, units: 'word'});
//   let about = lorem({count:2, units: 'sentence'});
//   let phone = lorem({count:2, units: 'word'});
//   let exampleArtist = {
//     firstname,
//     lastname,
//     city,
//     zip,
//     about,
//     phone,
//     userID,
//     username,
//     userEmail,
//   };
//   return new Artist(exampleArtist).save();
// }

// function mockUser(){
//   let username = lorem({count: 2, units: 'word'}).split(' ').join('-');
//   let password = lorem({count: 2, units: 'word'}).split(' ').join('-');
//   let email = lorem({count: 2, units: 'word'}).split(' ').join('-');
//   let exampleUser = {
//     username,
//     password,
//     email: `${email}@art.fancyartist`,
//   };
//   return new User(exampleUser).save();
// }
