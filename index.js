var _ = require('lodash');

var states = require('./jsons/states');
var territories = require('./jsons/territories');
var associations = require('./jsons/associations');

var allRegions = Object.assign({}, states, territories, associations);
var uspsFullNameMap = _.mapValues(allRegions, function(value) {
  return value.name || null;
});


// sanitize words to only lowercase and uppercase letters
function sanitizeToLettersOnly(words) {
  if (!words) return [];

  var sanitize = function(word) {
    return word.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();
  };

  return Array.isArray(words) ? words.map(sanitize) : sanitize(words);
}


// map all state variations to their USPS abbreviation
function getPatterns(json) {
  return _.reduce(json, function(result, value, key) {
    var values = [key, value['name'], value['AP'], value['other']];

    result[key] = _.flatMap(values, sanitizeToLettersOnly);
    return result;
  }, {});
}

var patterns = {
  state: getPatterns(states),
  territory: getPatterns(territories),
  associated: getPatterns(associations)
};


/*
    options: {
      region: [String|Array] ('all', 'state', 'territory', 'associated'),
      returnType: [String|Function] ('USPS', 'name', 'AP', function(states){}),
      omit: [String/Array] - USPS abbr. to omit
    }
 */
var defaultOptions = {
  region: 'state',
  returnType: 'USPS',
  omit: null
};

module.exports = function normalize(state, options) {
  var sanitizedState = sanitizeToLettersOnly(state);
  var opts = Object.assign({}, defaultOptions, options);

  var regions = opts.region === 'all'
    ? ['state', 'territory', 'associated']
    : _.castArray(opts.region);
  var regionPatterns = _.map(regions, function(r) { return patterns[r]; });

  var keys = Object.assign.apply(this, [{}].concat(regionPatterns));

  if (opts.omit) {
    _.castArray(opts.omit).forEach(function(key) {
      delete keys[key];
    });
  }

  var uspsKey = _.findKey(keys, function(p) { return ~p.indexOf(sanitizedState); });

  if (_.isFunction(opts.returnType)) {
    return opts.returnType(uspsFullNameMap)[uspsKey] || null;
  }

  switch (opts.returnType) {
    case 'USPS':
      return uspsKey || null;

    case 'name':
    case 'AP':
      return allRegions[uspsKey][opts.returnType] || null;
  }

  return null;
};
