const chai = require('chai');
const assert = chai.assert;
const Code = require('../Code');

const millisPerDay = 1000 * 60 * 60 * 24;
const now = new Date();

function user_label(name) {
    return {
        getName: function () {
            return name;
        }
    }
}

function user_thread(date, subject) {
    return {
        result: [],
        describe: function () {
            if (this.result.length === 0)
                return subject;

            return subject + ' -> ' + this.result;
        },
        getMessages: function () {
            return [{
                getDate: function () {
                    return date;
                }
            }];
        },
        getFirstMessageSubject: function () {
            return subject;
        },
        moveToTrash: function () {
            this.result.push("moveToTrash");
        },
        moveToArchive: function () {
            this.result.push("moveToArchive");
        }
    };
}

const deletedIn5 = user_thread(Math.floor(now - (7 * millisPerDay)), "gone-in-5 (days > 5)");
const notDeletedIn5 = user_thread(Math.floor(now - (5 * millisPerDay)), "gone-in-5 (days = 5)");
const deletedIn2 = user_thread(Math.floor(now - (3 * millisPerDay)), "gone-in-2 (days > 2)");
const notDeletedIn2 = user_thread(Math.floor(now - (2 * millisPerDay)), "gone-in-2 (days = 2)");
const archivedIn1 = user_thread(Math.floor(now - (2 * millisPerDay)), "archive-in-1 (days > 1)");
const notArchivedIn1 = user_thread(Math.floor(now - (1 * millisPerDay)), "archive-in-1 (days = 0)");


const gone_in_days_5_messages = [
    deletedIn5,
    notDeletedIn5
];
const gone_in_days_2_messages = [
    deletedIn2,
    notDeletedIn2
];
const archive_in_days_1_messages = [
    archivedIn1,
    notArchivedIn1
];

let gmail = {
    getUserLabels: function () {
        return [
            user_label("gone-in-days/5"),
            user_label("gone-in-days/2"),
            user_label("archive-in-days/2"),
            user_label("archive-in-days/1")
        ];
    },

    search: function (s) {
        if (s === "label:gone-in-days/5") {
            return gone_in_days_5_messages;
        }
        if (s === "label:gone-in-days/2") {
            return gone_in_days_2_messages;
        }
        if (s === "label:archive-in-days/1") {
            return archive_in_days_1_messages;
        }
        return [];
    }
}

let logger = {
    log: console.log //function () {} // ignored for now
}


describe('Code.js tests', function () {
    let code;

    beforeEach(function () {
        code = new Code();
    });

    it('uses hard coded objects', function () {

        code.findEmails(gmail, logger);

        let labelledMessages = [gone_in_days_5_messages, gone_in_days_2_messages, archive_in_days_1_messages].flat();
        assert.equal(
            describe(labelledMessages),
            "gone-in-5 (days > 5) -> moveToTrash\n" +
            "gone-in-5 (days = 5)\n" +
            "gone-in-2 (days > 2) -> moveToTrash\n" +
            "gone-in-2 (days = 2)\n" +
            "archive-in-1 (days > 1) -> moveToArchive\n" +
            "archive-in-1 (days = 0)"
        );
    });

    function describe(messages) {
        let actual = '';

        for (let i = 0; i < messages.length; i++) {
            actual += messages[i].describe() + '\n';
        }

        return actual.trim();
    }
});