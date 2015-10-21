/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var SolarData = require('./SolarData.model');

exports.register = function(socket) {
  SolarData.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  SolarData.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('SolarData:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('SolarData:remove', doc);
}