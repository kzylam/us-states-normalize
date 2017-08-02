var expect = require('chai').expect;
var normalize = require('../index');

describe('us-states-normalize', function() {
  var USPS = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
    'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
    'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
    'WV', 'WI', 'WY', 'AS', 'GU', 'MP', 'PR', 'VI', 'FM', 'MH', 'PW'
  ];

  var fullNames = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'American Samoa', 'Guam',
    'Northern Mariana Islands', 'Puerto Rico', 'Virgin Islands',
    'Federated States Of Micronesia', 'Marshall Islands', 'Palau'
  ];

  var AP = [
    'Ala.', 'Alaska', 'Ariz.', 'Ark.', 'Calif.', 'Colo.', 'Conn.', 'Del.',
    'D.C.', 'Fla.', 'Ga.', 'Hawaii', 'Idaho', 'Ill.', 'Ind.', 'Iowa', 'Kans.',
    'Ky.', 'La.', 'Maine', 'Md.', 'Mass.', 'Mich.', 'Minn.', 'Miss.', 'Mo.',
    'Mont.', 'Neb.', 'Nev.', 'N.H.', 'N.J.', 'N.M.', 'N.Y.', 'N.C.', 'N.D.',
    'Ohio', 'Okla.', 'Ore.', 'Pa.', 'R.I.', 'S.C.', 'S.D.', 'Tenn.', 'Texas',
    'Utah', 'Vt.', 'Va.', 'Wash.', 'W.Va', 'Wis.', 'Wyo.'
  ];

  describe('region and return type format', function() {
    it('should normalize USPS abbr. to USPS abbr.', function() {
      USPS.forEach(function (state) {
        expect(normalize(state, {region: 'all'})).to.equal(state);
        expect(normalize(state, {region: 'all', returnType: 'USPS'})).to.equal(state);
      });
    });

    it('should normalize full names to USPS abbr.', function() {
      fullNames.forEach(function (state, i) {
        expect(normalize(state, {region: 'all'})).to.equal(USPS[i]);
      });
    });

    it('should normalize AP abbr. to USPS abbr.', function() {
      AP.forEach(function (state, i) {
        expect(normalize(state, {region: 'all'})).to.equal(USPS[i]);
      });
    });

    it('should normalize USPS abbr. to full names', function() {
      USPS.forEach(function (state, i) {
        expect(normalize(state, {region: 'all', returnType: 'name'})).to.equal(fullNames[i]);
      });
    });

    it('should normalize USPS abbr. to AP abbr.', function() {
      USPS.forEach(function (state, i) {
        if (i < AP.length) {
          expect(normalize(state, {region: 'all', returnType: 'AP'})).to.equal(AP[i]);
        } else {
          expect(normalize(state, {region: 'all', returnType: 'AP'})).to.be.null;
        }
      });
    });

    it ('should return customized names', function() {
      var dc = normalize('DC', {
        returnType: function(states) {
          states['DC'] = 'Washington DC';
          return states;
        }
      });

      expect(dc).to.equal('Washington DC');
    });

    it('should only return main states + DC', function() {
      var normalizeOrig = function (state) {
        return normalize(state, {region: 'state'});
      };

      expect(normalize('AL')).to.equal('AL');
      expect(normalize('AS')).to.be.null;
      expect(normalize('FM')).to.be.null;
      expect(normalizeOrig('AL')).to.equal('AL');
      expect(normalizeOrig('AS')).to.be.null;
      expect(normalizeOrig('FM')).to.be.null;
    });

    it('should only return territories', function() {
      var normalizeIns = function (state) {
        return normalize(state, {region: 'territory'});
      };

      expect(normalizeIns('AL')).to.be.null;
      expect(normalizeIns('AS')).to.equal('AS');
      expect(normalizeIns('FM')).to.be.null;
    });

    it('should only return associated states', function() {
      var normalizeFas = function (state) {
        return normalize(state, {region: 'associated'});
      };

      expect(normalizeFas('AL')).to.be.null;
      expect(normalizeFas('AS')).to.be.null;
      expect(normalizeFas('FM')).to.equal('FM');
    });

    it('should omit states', function() {
      expect(normalize('DC', {omit: 'DC'})).to.be.null;
      expect(normalize('DC', {omit: ['AL', 'DC']})).to.be.null;
      expect(normalize('AL', {omit: ['AL', 'DC']})).to.be.null;
    });
  });

  describe('normalization', function() {
    // testing normalization under default options
    var test = function(input, output) {
      expect(normalize(input, {region: 'all'})).to.equal(output);
    };

    it('should handle case insensitivity', function() {
      test('Al', 'AL');
      test('CalIfORnia', 'CA');
      test('georgia', 'GA');
    });

    it('should handle spaces', function() {
      test('New Jersey', 'NJ');
      test(' Hawaii ', 'HI');
      test(' New York', 'NY');
      test('I D', 'ID');
    });

    it('should handle periods', function() {
      test('N.M.', 'NM');
      test('Utah.', 'UT');
      test('South. Dakota.', 'SD');
      test('N. H.', 'NH');
      test(' N. D. ', 'ND');
    });

    it('should handle alternative spellings', function() {
      test('Ala', 'AL');
      test('Ala.', 'AL');
      test('Alas', 'AK');
      test('Ariz', 'AZ');
      test('Ark', 'AR');
      test('CAL', 'CA');
      test('Col', 'CO');
      test('Cl', 'CO');
      test('Conn', 'CT');
      test('Del', 'DE');
      test('WashDC', 'DC');
      test('D.C.', 'DC');
      test('Wash D.C.', 'DC');
      test('Washington DC', 'DC');
      test('FLA', 'FL');
      test('Flor', 'FL');
      test('Ga.', 'GA');
      test('Ida.', 'ID');
      test('Ill', 'IL');
      test('Ills.', 'IL');
      test('Ill\'s', 'IL');
      test('Ind.', 'IN');
      test('Ioa.', 'IA');
      test('Kans.', 'KS');
      test('KA', 'KS');
      test('Ken', 'KY');
      test('Kent.', 'KY');
      test('Mass.', 'MA');
      test('Mich.', 'MI');
      test('Minn.', 'MN');
      test('Miss.', 'MS');
      test('Mont.', 'MT');
      test('NEB', 'NE');
      test('Nebr.', 'NE');
      test('Nb', 'NE');
      test('Nev.', 'NV');
      test('N.H.', 'NH');
      test('N. Jersey', 'NJ');
      test('New M.', 'NM');
      test('N.Mex', 'NM');
      test('NYork', 'NY');
      test('N.Car.', 'NC');
      test('North Car.', 'NC');
      test('NoDak', 'ND');
      test('N.Dak.', 'ND');
      test('North Dak', 'ND');
      test('O.', 'OH');
      test('Okla.', 'OK');
      test('Ore.', 'OR');
      test('Oreg.', 'OR');
      test('Penn.', 'PA');
      test('Penna.', 'PA');
      test('RI & PP', 'RI');
      test('R. Isl.', 'RI');
      test('SCar.', 'SC');
      test('South Car.', 'SC');
      test('SoDak', 'SD');
      test('S. Dak.', 'SD');
      test('South Dak', 'SD');
      test('Tenn.', 'TN');
      test('Tex.', 'TX');
      test('Virg.', 'VA');
      test('Wash.', 'WA');
      test('Wn.', 'WA');
      test('W. Virg.', 'WV');
      test('WEST VIRG', 'WV');
      test('Wis.', 'WI');
      test('Wisc.', 'WI');
      test('WS', 'WI');
      test('Wyo.', 'WY');
      test('USVI', 'VI');
      test('US Virgin Islands', 'VI');
      test('Micronesia', 'FM');
    });
  });
});
