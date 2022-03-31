import {ipcRenderer} from 'electron'

let listenMain = function (channel,listener){
    ipcRenderer.on(channel, listener)
}

let showNotify = function (title,content){
    new Notification(title, { body: content }).onclick
}

let sendMessage = function (channel,args){
    ipcRenderer.send(channel, args)
}


export default {
    showNotify,
    sendMessage,
    listenMain
}
