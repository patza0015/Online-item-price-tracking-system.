const ipcRenderer = require("electron").ipcRenderer;

//ค้นหา keywordที่เป็นส่วนของ button
const generatePassword = () => {
    ipcRenderer.send(
        "generatePassword",
        document.querySelector('.keyWord').value
    );
};


//ค้นหา keywordที่เป็นส่วนของ button
const updataValue = () => {
    ipcRenderer.send(
        "updataValue"
    );
};

//แจ้งเตือนข้อความ
ipcRenderer.on('receivePassword', (event, data) => {
    alert(data);
});