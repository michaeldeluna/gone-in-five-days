var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var Code = require('../Code');
var sinon = require('sinon');


const millisPerDay = 1000 * 60 * 60 * 24;

function user_label(name) {
    return {
        getName: function() {
            return name;
        }
    }
}


let gmail = {
    getUserLabels: function () {
        return [
            user_label("gone-in-days/5"),
            user_label("gone-in-days/2")
        ];
    },

    search: function (s) {
        if (s === "label:gone-in-days/5") {
            return [{
                getMessages: function () {
                    return [{
                        getDate: function () {
                            return Math.floor(new Date() - (7 * millisPerDay));
                        }
                    }];
                },
                getFirstMessageSubject: function() {
                    return "hello world";
                },
                moveToTrash: function() {
                    console.log("moved to trash...")
                },
                hello: "value"
            }];
        }
        return [];
    }
}

let logger = {
    log: console.log
}


describe('Code.js tests', function () {
    it('uses hard coded objects', function () {


        code.findEmails(gmail, logger);
    });

    it('uses sinon', function () {
        var gmailmock = sinon.stub(gmail, "getUserLabels")
            .callsFake(function () {
                return [{
                    getName: function () {
                        return "gone-in-days/5";
                    }
                }];
            });

        var logmock = sinon.mock(logger);


        code.findEmails(gmailmock, logmock);
    });

    var code;

    beforeEach(function () {
        code = new Code();
    });


    it('calls the original function', function () {
        var callback = sinon.fake();
        var proxy = once(callback);

        proxy();

        assert(callback.called);
    });


    it('calls the original function only once', function () {
        var callback = sinon.fake();
        var proxy = once(callback);

        proxy();
        proxy();

        assert(callback.calledOnce);
        // ...or:
        // assert.equals(callback.callCount, 1);
    });

    it('calls original function with right this and args', function () {
        var callback = sinon.fake();
        var proxy = once(callback);
        var obj = {};
        proxy.call(obj, 1, 2, 3);

        assert(callback.calledOn(obj));
        assert(callback.calledWith(1, 2, 3));
    });
});


function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}