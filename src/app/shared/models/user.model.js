'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var User = (function() {
  function User(properties) {
    if (!properties) {
      return;
    }
    this.id = properties.id;
    this.firstName = properties.firstName;
    this.lastName = properties.lastName;
    this.email = properties.email;
    this.password = properties.password;
    this.description = properties.description;
  }
  return User;
}());
exports.User = User;
