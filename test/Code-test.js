var expect = require('chai').expect;
var Code = require('../Code');



let gmail = {
    getUserLabels: function () {
        return [{
            getName: function () {
                return "gone-in-days/5";
            }
        }];
    },

    search: function(s) {
        return [];
    }
}

let logger = {
    log: console.log
}

describe('Code.js tests', function () {
    it('should pass this canary test', function () {
        expect(true).to.be.true;
        code.findEmails(gmail, logger);
    });

    var code;

    beforeEach(function() {
        code = new Code();
    });
});
