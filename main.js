const { app, BrowserWindow, ipcMain } = require("electron");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const puppeteer = require('puppeteer');
const fsLibrary = require('fs')
let win = null;
var text = 1; // ข้อมูลในการอ่านไฟล์ PriceNow.text
var Price = null; //อ่านข้อมูลที่ดึงมา
var Dateday = new Date().toLocaleDateString();
var link = 'https://www.lazada.co.th/products/3-protex-250-i2140440301-s7163694119.html?spm=a2o4m.home.flashSale.4.11254786oYY6Nc&search=1&mp=1&c=fs&clickTrackInfo=rs%3A0.0%3Babid%3A238030%3Bitem_id%3A2140440301%3Bpvid%3A79dc18d6-ad30-4f84-b339-53bb3f5a9944%3Bmt%3Ahot%3Bdata_type%3Aflashsale%3Bscm%3A1007.17760.238030.%3Bchannel_id%3A0000%3Bcampaign_id%3A136114&scm=1007.17760.238030.0';

//แบบเริ่มต้น
const csvWriter = createCsvWriter({
    path: 'fileNEWtest.csv',
    /* append: true, */
    header: [
        { id: 'fullname', title: 'NAME' },
        { id: 'price', title: 'PRICE' },
        { id: 'date', title: 'DATE' }
    ]
});
//แบบเขียนต่อ
const csvWriter2 = createCsvWriter({
    path: 'fileNEWtest.csv',
    //เขียนต่อ append
    append: true,
    header: [
        { id: 'fullname', title: 'NAME' },
        { id: 'price', title: 'PRICE' },
        { id: 'date', title: 'DATE' }
    ]
});
//แบบเริ่มต้น
async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //ตัวชื่อสินค้า
    const [el2] = await page.$x('//*[@id="module_product_title_1"]/div/div/h1');
    const src2 = await el2.getProperty('textContent');
    const srcTxtName = await src2.jsonValue();
    //ตัวราคาสินค้า
    const [el] = await page.$x('//*[@id="module_product_price_1"]/div/div/span');
    const src = await el.getProperty('textContent');
    const srcTxtPrice = await src.jsonValue();
    //ตัด $ออก
    /*  const price = srcTxtPrice.replace("฿", ""); */
    Price = srcTxtPrice;
    ///ส่วนของการดึงข้อมูล
    await page.close();
    await browser.close();
    //ปิดเว็บเพจ ปิด browser
    //เขียนข้อมูลในไฟล์ text
    fsLibrary.writeFile('PriceNowtest.txt', Price, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })
    const records = [
        { fullname: srcTxtName, price: Price, date: Dateday },
    ];
    //เรื่มเขียน
    csvWriter.writeRecords(records)
        .then(() => {
            /* console.log(srcTxtPrice); */
        });
    //ถึงนี้
    //ส่วนของการเก็บข้อมูล
}

//แบบUpdate
async function UpdateProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //ตัวชื่อสินค้า
    const [el2] = await page.$x('//*[@id="module_product_title_1"]/div/div/h1');
    const src2 = await el2.getProperty('textContent');
    const srcTxtName = await src2.jsonValue();
    //ตัวราคาสินค้า
    const [el] = await page.$x('//*[@id="module_product_price_1"]/div/div/span');
    const src = await el.getProperty('textContent');
    const srcTxtPrice = await src.jsonValue();
    Price = srcTxtPrice;
    //อ่านไฟล์
    fsLibrary.readFile('PriceNowtest.txt', (error, txtString) => {

        if (error) throw err;
        var textcheck = txtString.toString();
        //กรณีมีค่าเปลี่ยนทำการsave ราคาแล้วทำการsave ลงในไฟล์ csv
        if (textcheck !== Price) {
            fsLibrary.writeFile('PriceNowtest.txt', Price, (err) => {
                // In case of a error throw err.
                if (err) throw err;

                text = 'มีการอัพเดท';
            })
            const records = [
                { fullname: srcTxtName, price: Price, date: Dateday },
            ];
            //เรื่มเขียน
            csvWriter2.writeRecords(records) // returns a promise
                .then(() => {});
            //ถึงนี้
        } else {
            text = 'ไม่มีการอัพเดท';
        }
    })
}
/* 
///ใช้puppeteer
async function scrapeProduct(url) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //ตัวราคาสินค้า
    const [el] = await page.$x('//*[@id="module_product_price_1"]/div/div/span');
    const src = await el.getProperty('textContent');
    const srcTxtPrice = await src.jsonValue();
    Price = srcTxtPrice;


}
var link = 'https://www.lazada.co.th/products/3-protex-250-i2140440301-s7163694119.html?spm=a2o4m.home.flashSale.4.11254786oYY6Nc&search=1&mp=1&c=fs&clickTrackInfo=rs%3A0.0%3Babid%3A238030%3Bitem_id%3A2140440301%3Bpvid%3A79dc18d6-ad30-4f84-b339-53bb3f5a9944%3Bmt%3Ahot%3Bdata_type%3Aflashsale%3Bscm%3A1007.17760.238030.%3Bchannel_id%3A0000%3Bcampaign_id%3A136114&scm=1007.17760.238030.0';

scrapeProduct(link);

//อ่านไฟล์
fsLibrary.readFile('PriceNow.txt', (error, txtString) => {
    text = txtString.toString();
})

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

ipcMain.on('generatePassword', (event, data) => {
    const randomPassword = data + Math.random().toString(36).substr(2, 5);
    /*   win.webContents.send('receivePassword', randomPassword); */
    /*   win.webContents.send('receivePassword', text); //อ่านไฟล์ราคาได้ */

    scrapeProduct(link);

    setTimeout(function() {
        win.webContents.send('receivePassword', 'เพิ่มข้อมูลลงแล้ว' + Price); //อ่านไฟล์ puppeteer ได้

    }, 3000);
    /*   win.webContents.send('receivePassword', 'เพิ่มข้อมูลลงแล้ว' + Price); //อ่านไฟล์ puppeteer ได้ */

});

ipcMain.on('updataValue', (event, data) => {

    UpdateProduct(link);

    //เซตdelay
    setTimeout(function() {
        win.webContents.send('receivePassword', text); //อ่านไฟล์ puppeteer ได้ 

    }, 5000);
    /*     win.webContents.send('receivePassword', text); //อ่านไฟล์ puppeteer ได้  */

});


//เหลือแบบupdateเดียวทำที่หลัง