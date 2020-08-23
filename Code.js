module.exports = function () {
    this.findEmails = function (gmail, logger) {
        findlabelledEmails(gmail, logger);
    };
};


/*
    Don't copy anything above this line to Google Apps Script. ====================
    Everything below here should be copied...
 */

function deleteOldEmails() {
    findlabelledEmails(GmailApp, Logger)
}

function findlabelledEmails(gmailApp, logger) {
    var labels = gmailApp.getUserLabels();
    var periods = [];

    for (let i = 0; i < labels.length; i++) {

        var label = labels[i].getName();
        var period;

        if (label.indexOf("gone-in-days") !== -1 && label.indexOf("/") !== -1) {

            period = parseInt(label.substring(label.indexOf("/") + 1));

            if (!isNaN(period)) {
                periods.push(period);
            }
        }
    }

    logger.log(periods.length);
    logger.log(periods);

    for (x = 0; x < periods.length; x++) {
        deleteEmails(periods[x], gmailApp, logger);
    }
}

function deleteEmails(period, gmailApp, logger) {

    var today = new Date();
    var millisPerDay = 1000 * 60 * 60 * 24;
    var numberToDelete = 0;
    let searchString = "label:gone-in-days/" + period.toString();
    logger.log("searching=" + searchString);
    var threads = gmailApp.search(searchString);

    logger.log("today: " + today);
    logger.log("labelled: " + threads.length);

    for (i = 0; i < threads.length; i++) {
        var daysOld = Math.floor((today - threads[i].getMessages()[0].getDate()) / millisPerDay);

        if (daysOld > period) {
            logger.log(threads[i].getFirstMessageSubject() + " days old: " + daysOld);
            numberToDelete++;
            threads[i].moveToTrash();
        }
    }

    logger.log("deleted: " + numberToDelete + " conversations");
}
