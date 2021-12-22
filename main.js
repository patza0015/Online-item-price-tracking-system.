const { app, BrowserWindow, ipcMain } = require("electron");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const puppeteer = require('puppeteer');
const fsLibrary = require('fs')


require('events').EventEmitter.defaultMaxListeners = 15;
//เพิ่มมาใหม่

let win = null;
var text = 1; // ข้อมูลในการอ่านไฟล์ PriceNow.text
var i = 0;
var Price = null; //อ่านข้อมูลที่ดึงมา
var Dateday = new Date().toLocaleDateString();
// var link = 'https://www.lazada.co.th/products/3-protex-250-i2140440301-s7163694119.html?spm=a2o4m.home.flashSale.4.11254786oYY6Nc&search=1&mp=1&c=fs&clickTrackInfo=rs%3A0.0%3Babid%3A238030%3Bitem_id%3A2140440301%3Bpvid%3A79dc18d6-ad30-4f84-b339-53bb3f5a9944%3Bmt%3Ahot%3Bdata_type%3Aflashsale%3Bscm%3A1007.17760.238030.%3Bchannel_id%3A0000%3Bcampaign_id%3A136114&scm=1007.17760.238030.0';

//https://www.lazada.co.th/products/6243cm-i2347311812-s7922957221.html?spm=a2o4m.home.just4u.4.4ccd1d470HVhNo&scm=1007.17519.162103.0&pvid=835f925e-ded1-4744-8e50-1c6fc6b2f6a1&search=0&clickTrackInfo=tctags%3A830083863+1498575426%3Btcsceneid%3AHPJFY%3Bbuyernid%3Ac7867551-98d0-47b3-89ec-87e54951e60d%3Btcboost%3A0%3Bpvid%3A835f925e-ded1-4744-8e50-1c6fc6b2f6a1%3Bchannel_id%3A0000%3Bmt%3Ahot%3Bitem_id%3A2347311812%3Bself_ab_id%3A162103%3Bself_app_id%3A7519%3Blayer_buckets%3A5437.25236_955.3632_955.7330_6059.28889%3Bpos%3A3%3B
var link;
//ใหม่
const url = require('url');
const path = require('path');

//เริ่มต้นเช็คเลยว่ามีไฟล์ในนี้อยู่ไหมถ้าไม่มีจะไม่เกิดไรขึ้น
// const pathchackfilelink = 'Url_link.txt'
// try {
//     if (fsLibrary.existsSync(pathchackfilelink)) {
//         //file exists
//         fsLibrary.readFile('Url_link.txt', (error, txtString) => {
//             /*  var textcheck = txtString.toString(); */
//             link = txtString.toString();
//         })
//     }
// } catch (err) {
//     console.error(err)
// }

//แบบเขียนต่อ
/* const csvWriter2 = createCsvWriter({
    path: 'fileNEWtest.csv',
    //เขียนต่อ append
    append: true,
    header: [
        { id: 'fullname', title: 'NAME' },
        { id: 'price', title: 'PRICE' },
        { id: 'date', title: 'DATE' }
    ]
}); */

//ใหม่ล่าสุด
const Allurllink = createCsvWriter({
    path: 'Allurllink2.csv',
    //เขียนต่อ append
    append: true,
    header: [
        { id: 'link', title: 'LINK' },
        { id: 'nameINfile', title: 'NAMEfile' }
    ]
});

//แบบเริ่มต้น
async function scrapeProduct(url, filename) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //ตัวชื่อสินค้า
    const [el2] = await page.$x('//*[@id="bodyDom"]/div[2]/div[1]/div[1]/h1');

    /*   const [el2] = await page.$x('//*[@id="module_product_title_1"]/div/div/h1'); ของlazada*/
    const src2 = await el2.getProperty('textContent');
    const srcTxtName = await src2.jsonValue();
    const srcTxtName2 = srcTxtName.replace(",", "");
    const srcTxtName3 = srcTxtName2.replace(" ", "");
    //ตัวราคาสินค้า
    //ของ jdcen
    const [el] = await page.$x('//*[@id="p-infos"]/div[2]/div[1]/div[1]/div[2]/div/div/div[2]/span');
    /* const [el] = await page.$x('//*[@id="module_product_price_1"]/div/div/span'); ของ lazada */
    const src = await el.getProperty('textContent');
    const srcTxtPrice = await src.jsonValue();
    const price = srcTxtPrice.replace("฿", "");
    const price2 = price.replace(",", "");
    /*  Price = srcTxtPrice; */
    ///ส่วนของการดึงข้อมูล
    await page.close();
    await browser.close();
    //ปิดเว็บเพจ ปิด browser
    //เขียนข้อมูลในไฟล์ text
    fsLibrary.writeFile(filename + '.txt', price2, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })
    const records = [
        { fullname: srcTxtName3, price: price2, date: Dateday },
    ];

    const records2 = [
        { link: url, nameINfile: filename },
    ];

    const csvWriter = createCsvWriter({
        path: filename + '.csv',
        /* append: true, */
        header: [
            { id: 'fullname', title: 'NAME' },
            { id: 'price', title: 'PRICE' },
            { id: 'date', title: 'DATE' }
        ]
    });
    //เรื่มเขียน
    csvWriter.writeRecords(records)
        .then(() => {});
    Allurllink.writeRecords(records2)
        .then(() => {});

}




//แบบUpdate
async function UpdateProduct(url, filename2) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //ตัวชื่อสินค้า
    /* const [el2] = await page.$x('//*[@id="module_product_title_1"]/div/div/h1'); ของ lazada*/
    const [el2] = await page.$x('//*[@id="bodyDom"]/div[2]/div[1]/div[1]/h1');
    const src2 = await el2.getProperty('textContent');
    const srcTxtName = await src2.jsonValue();
    const srcTxtName2 = srcTxtName.replace(",", "");
    const srcTxtName3 = srcTxtName2.replace(" ", "");
    //ตัวราคาสินค้า
    const [el] = await page.$x('//*[@id="p-infos"]/div[2]/div[1]/div[1]/div[2]/div/div/div[2]/span');
    /*     const [el] = await page.$x('//*[@id="module_product_price_1"]/div/div/span');ของlazada */
    const src = await el.getProperty('textContent');
    const srcTxtPrice = await src.jsonValue();
    const price = srcTxtPrice.replace("฿", "");
    const price2 = price.replace(",", "");
    //อ่านไฟล์
    fsLibrary.readFile(filename2 + '.txt', (error, txtString) => {
        if (error) throw err;
        var textcheck = txtString.toString();
        //กรณีมีค่าเปลี่ยนทำการsave ราคาแล้วทำการsave ลงในไฟล์ csv
        if (textcheck !== price2) {
            fsLibrary.writeFile(filename2 + '.txt', price2, (err) => {
                // In case of a error throw err.
                if (err) throw err;

                text = 'มีการอัพเดท' + filename2;
            })
            const records = [
                { fullname: srcTxtName3, price: price2, date: Dateday },
            ];
            const csvWriter2 = createCsvWriter({
                path: filename2 + '.csv',
                //เขียนต่อ append
                append: true,
                header: [
                    { id: 'fullname', title: 'NAME' },
                    { id: 'price', title: 'PRICE' },
                    { id: 'date', title: 'DATE' }
                ]
            });
            //เรื่มเขียน

            csvWriter2.writeRecords(records) // returns a promise
                .then(() => {});
            //ถึงนี้
        } else {
            text = 'ไม่มีการอัพเดท' + filename2;
        }
    })

}



//สร้างหน้าต่าง แสดงกราฟ
function createGraphWindow() {
    // create new window
    addWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'graph.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage  collection handle
}

/* 
//สร้างหน้าต่าง แสดงกราฟ
function createTablehWindow() {
    // create new window
    addWindow = new BrowserWindow({
        width: 600,
        height: 400,
           title: 'Add Shopping List Item', 
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'table.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage  collection handle
}
 */



const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    win.loadFile('index.html');

};
//เมื่อพร้อม run createWindow
app.whenReady().then(createWindow);

ipcMain.on('select', (event, data, filename) => {

    /*   win.webContents.send('receivePassword', randomPassword); */
    /*   win.webContents.send('receivePassword', text); //อ่านไฟล์ราคาได้ */
    /* scrapeProduct(link); */
    //ทำใส่กรอกเว็บไซต์แล้วแต่ไม่ได้ทำเช็คหากเกิด errrorให้แจ้ง
    scrapeProduct(data, filename);
    /*  link = data; */
    setTimeout(function() {
        win.webContents.send('receivePassword', 'เพิ่มข้อมูลลงแล้ว' + filename); //อ่านไฟล์ puppeteer ได้

    }, 5000);
    /*   win.webContents.send('receivePassword', 'เพิ่มข้อมูลลงแล้ว' + Price); //อ่านไฟล์ puppeteer ได้ อันนี้ราคา*/

});

ipcMain.on('updataValue', () => {
    const raw = fsLibrary.readFileSync('Allurllink2.csv', 'utf8');
    const csvLines = raw.split(/[\r\n|\r|\n]+/);
    var myloopcheck = 0;
    var myloop3hcheck = 0;
    //เช็คให้เองได้แต่ต้องกดเริ่มครั้งแรก
    function myloop3h() {
        function myLoop() { //  create a loop function

            points = csvLines[myloopcheck].split(",");
            UpdateProduct(points[0], points[1]);

            setTimeout(function() {
                    win.webContents.send('receivePassword', text);
                    myloopcheck++;
                    if (myloopcheck < csvLines.length - 1) {
                        //-1 เนื่องจากการเขียนไฟล์ csv มีการเว้นบรรทัดไว้
                        myLoop();
                    }
                }, 20000) //เพิ่ม20วิ
        }
        myLoop();

        setTimeout(function() {
                myloop3hcheck++;
                myloopcheck = 0;
                if (myloop3hcheck < 999) {
                    myloop3h();
                }
            }, 240000) //4นาที   3600000 1ชม

    }
    myloop3h();
    //  start the loop

});


ipcMain.on('showGraph', () => {
    createGraphWindow();
});



/* 
ipcMain.on('showtable', (event, data) => {
    createTablehWindow();
}); */