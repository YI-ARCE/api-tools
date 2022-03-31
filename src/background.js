'use strict'

import { app, protocol, BrowserWindow,ipcMain,Notification} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import * as fs from "fs";
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let json = {};

let config = {};
// let flag = fs.existsSync('yiarce_route.jsonp')
// if(flag){
//   console.log('存在')
// }else{
//   console.log('不存在')
// }

fs.readFile('yiarce_route.json',{flag:'r'},(e,b)=>{
  if (e){
    new Notification({title:'API',body:'读取数据失败'})
  }else{
    try {
      json = JSON.parse(b.toString())
    }catch (e){
      json = {}
    }
  }
})

fs.readFile('config.json',{flag:'r'},(e,b)=>{
  if (e){
    new Notification({title:'CONFIG',body:'读取数据失败'})
  }else{
    try {
      config = JSON.parse(b.toString())
    }catch (e){
      config = {}
    }
  }
})

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true,
    show: false,
    backgroundColor:'#000000',
    resizable:false,
    frame:false,
    // icon:path.join(__dirname,"/icon/icon_64.ico"),
    webPreferences: {
      webSecurity:false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.once('ready-to-show',()=>{
    win.setTitle('API测试工具')
    win.show()
  })
  ipcMain.on('setBounds',async (event, args) => {
    await win.setBounds({width: 1280, height: 720})
    app.on('browser-window-focus',()=>{
      win.webContents.send('getFocus')
    })
  })
  ipcMain.on('getJson',async (event, args)=>{
    win.webContents.send('getJson',json)
  })
  ipcMain.on('setJson',async (event, args)=>{
    json[args["key"]] = args["val"]
  })
  ipcMain.on('getConfig',async (event, args)=>{
    win.webContents.send('getConfig',config)
  })
  ipcMain.on('setConfig',async (event, args)=>{
    config = args
  })
  ipcMain.on('appClose',async (event, args)=>{
    // let flag = false;
    fs.writeFile('yiarce_route.json',JSON.stringify(json,null,2),e=>{
      if(e){
        new Notification({
          title:'路由',
          body:'数据保存失败'
        })
      }
    })
    fs.writeFile('config.json',JSON.stringify(config,null,2),e=>{
      if(e){
        new Notification({
          title:'配置',
          body:'数据保存失败'
        })
      }
      app.quit()
    })
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  fs.writeFile('yiarce_route.json',JSON.stringify(json,null,2),e=>{
    if(e){
      new Notification({
        title:'路由',
        body:'数据保存失败'
      })
    }
  })
  fs.writeFile('config.json',JSON.stringify(config,null,2),e=>{
    if(e){
      new Notification({
        title:'配置',
        body:'数据保存失败'
      })
    }
  })
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
