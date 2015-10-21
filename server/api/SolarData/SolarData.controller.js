'use strict';

var _ = require('lodash');
var SolarData = require('./SolarData.model');

// Get list of SolarDatas
exports.index = function(req, res) {
  SolarData.find(function (err, SolarDatas) {
    if(err) { return handleError(res, err); }
    return res.json(200, SolarDatas);
  });
};

// Get a single SolarData
exports.show = function(req, res) {
  SolarData.findById(req.params.id, function (err, SolarData) {
    if(err) { return handleError(res, err); }
    if(!SolarData) { return res.send(404); }
    return res.json(SolarData);
  });
};

// Creates a new SolarData in the DB.
exports.create = function(req, res) {
  SolarData.create(req.body, function(err, SolarData) {
    if(err) { return handleError(res, err); }
    return res.json(201, SolarData);
  });
};

// Updates an existing SolarData in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  SolarData.findById(req.params.id, function (err, SolarData) {
    if (err) { return handleError(res, err); }
    if(!SolarData) { return res.send(404); }
    var updated = _.merge(SolarData, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, SolarData);
    });
  });
};

// Deletes a SolarData from the DB.
exports.destroy = function(req, res) {
  SolarData.findById(req.params.id, function (err, SolarData) {
    if(err) { return handleError(res, err); }
    if(!SolarData) { return res.send(404); }
    SolarData.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}