const ipcRenderer = require("electron").ipcRenderer;

//ค้นหา keywordที่เป็นส่วนของ button
const select = () => {
    ipcRenderer.send(
        "select",
        document.querySelector('.keyWord').value,
        document.querySelector('.filename').value

    );
};


//ค้นหา keywordที่เป็นส่วนของ button
const updataValue = () => {
    ipcRenderer.send(
        "updataValue"
    );
};

//ค้นหา keyword ที่เป็นส่วนของ button
const showGraph = () => {
    ipcRenderer.send(
        "showGraph",

    );
};

const handleSubmit = () => {
    ipcRenderer.send(
        "handleSubmit",
        //ไม่มีอะไรเดียวลบ
    );
};

//แจ้งเตือนข้อความ
ipcRenderer.on('receivePassword', (event, data) => {
    alert(data);
});