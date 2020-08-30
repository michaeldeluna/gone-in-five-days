module.exports = function () {
    this.findEmails = function (gmail, logger) {
        findLabelledEmails(gmail, logger);
    };
};

/*
    Don't copy anything above this line to Google Apps Script. ====================
    Everything below here should be copied...
 */

const millisPerDay = 1000 * 60 * 60 * 24;

function deleteOldEmails() {
    findLabelledEmails(GmailApp, Logger)
}

function archiveOldEmails() {
    findLabelledEmails(GmailApp, Logger)
}

function findLabelledEmails(gmailApp, logger) {
    let labels = gmailApp.getUserLabels();

    for (let i = 0; i < labels.length; i++) {

        let label = labels[i].getName();
        let period;

        if (label.indexOf("gone-in-days") !== -1 && label.indexOf("/") !== -1) {

            period = parseInt(label.substring(label.indexOf("/") + 1));

            if (!isNaN(period))
                deleteEmails(period, gmailApp, logger);
        }

        if (label.indexOf("archive-in-days") !== -1 && label.indexOf("/") !== -1) {

            period = parseInt(label.substring(label.indexOf("/") + 1));

            if (!isNaN(period)) {
                archiveEmails(period, gmailApp, logger);
            }
        }
    }
}

function deleteEmails(period, gmailApp, logger) {
    let today = new Date();
    let numberToDelete = 0;
    let searchString = "label:gone-in-days/" + period.toString();
    logger.log("searching=" + searchString);
    let threads = gmailApp.search(searchString);

    logger.log("today: " + today);
    logger.log("labelled: " + threads.length);

    for (i = 0; i < threads.length; i++) {
        let daysOld = Math.floor((today - threads[i].getMessages()[0].getDate()) / millisPerDay);

        if (daysOld > period) {
            logger.log(threads[i].getFirstMessageSubject() + " days old: " + daysOld);
            numberToDelete++;
            threads[i].moveToTrash();
        }
    }

    logger.log("deleted: " + numberToDelete + " conversations");
}

function archiveEmails(period, gmailApp, logger) {
    let today = new Date();
    let numberToDelete = 0;
    let searchString = "label:archive-in-days/" + period.toString();
    logger.log("searching=" + searchString);
    let threads = gmailApp.search(searchString);

    logger.log("today: " + today);
    logger.log("labelled: " + threads.length);

    for (i = 0; i < threads.length; i++) {
        let daysOld = Math.floor((today - threads[i].getMessages()[0].getDate()) / millisPerDay);

        if (daysOld > period) {
            logger.log(threads[i].getFirstMessageSubject() + " days old: " + daysOld);
            numberToDelete++;
            threads[i].moveToArchive();
        }
    }

    logger.log("deleted: " + numberToDelete + " conversations");
}
