const fs = require('fs');
const raw = fs.readFileSync('Oppo.csv', 'utf8');
const csvLines = raw.split(/[\r\n|\r|\n]+/);
var i = 0;
/* for (var i = 1; i < csvLines.length; i++) {
    if (csvLines[i].length > 0) {
        points = csvLines[i].split(",");

        console.log('ราคา', points[1]);
        console.log('วันที่', points[2]);

    }
} */

function myLoop() { //  create a loop function
    setTimeout(function() {
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");

            console.log('ราคา', points[0]);
            console.log('วันที่', points[1]);

        }
        i++;
        if (i < csvLines.length) {
            myLoop();
        }
    }, 5000)
}

myLoop();

/* console.log('result', data); */