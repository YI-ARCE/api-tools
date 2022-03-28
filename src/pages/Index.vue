<template>
  <div class="main">
    <el-dialog :visible.sync="popShow" width="50%" :show-close="false" :before-close="setConfig"
               style="background-color: transparent">
      <div style="width: 100%;display: flex;flex-direction: column">
        <div style="width: 100%;display: flex;align-items: center;flex-direction: row">
          <div style="width: 50px;color: #f3f4f5">
            地址:
          </div>
          <el-select v-model="hostName" placeholder="选择请求地址"
                     style="border-radius:0 0 0 0;flex: 1;border: #f3f4f5 1px solid">
            <el-option v-for="(val,key) in this.config.host.url" :value="val" :key="key">
              <div style="width: 100%;height: 100%;padding: 0 20px">
                <span style="float: left; color: #8492a6; font-size: 13px">{{ val }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div style="width: 100%;height: 10px"></div>
        <div style="width: 100%;display: flex;align-items: center;flex-direction: row">
          <div style="width: 50px;color: #f3f4f5">账户名:</div>
          <el-input v-model="config.user.username" style="flex: 1;"></el-input>
        </div>
        <div style="width: 100%;height: 10px"></div>
        <div style="width: 100%;display: flex;align-items: center;flex-direction: row">
          <div style="width: 50px;color: #f3f4f5">密码:</div>
          <el-input v-model="config.user.password" style="flex: 1;"></el-input>
        </div>
        <div style="width: 100%;height: 10px"></div>
        <div style="width: 100%;display: flex;align-items: center;flex-direction: row">
          <div style="width: 50px;color: #f3f4f5">版本:</div>
          <el-input v-model="config.version" style="flex: 1;"></el-input>
        </div>
      </div>
    </el-dialog>
    <div class="bg">
      <el-image :src="require('@/assets/bg.png')"></el-image>
    </div>
    <div class="main-body">
      <div
          style="width: 100%;height: 60px;display: flex;justify-content: center;align-items: center;flex-direction: row">
        <el-button @click="popShow = true" plain class="main-button"
                   style="right: 160px;color: #000000 !important;display: flex;justify-content: center;align-items: center">
          <i class="el-icon-setting" style="font-size: 20px"></i>
        </el-button>
        <div style="position:absolute;left: 30%">
          {{ this.modName }}
        </div>
        <div v-show="suffixName !== ''" style="position:absolute;left: 46.5%">
          /
        </div>
        <div style="position:absolute;left: 49.2%">
          {{ this.suffixName }}
        </div>
        <el-button plain class="main-button" @click="login" style="margin-right: 10px">{{ !head ? '登录' : '刷新' }}
        </el-button>
        <div v-if="head"
             class="head-avatar">
          <el-avatar :src="require('@/assets/my.jpg')"></el-avatar>
        </div>
      </div>
      <div class="api-body">
        <div class="api-body-background">
          <el-image :src="require('@/assets/bg.png')"
                    style="width: 1274px;height: 717px;left: -64px;top: -60px;position: absolute;opacity: 0.9;z-index: -9;background-color: transparent"></el-image>
          <div style="position: absolute; width: 100%;height: 100%;background-color: #00000090;z-index: -8"></div>
        </div>
        <div class="api-input-action"
             style="height: 40px;display: flex;margin-top: 10px;justify-content: center;align-items: center">
          <div style="width: 90%;display: flex;justify-content: center;align-items: center">
            <el-select v-model="mod" placeholder="模块" style="border-radius:0 0 0 0;" @change="getBaseName">
              <el-option v-for="(val,key) in array" :value="key" :key="key">
                <div style="width: 100%;height: 100%;padding: 0 20px">
                  <span style="float: left">{{ val[0].base }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ key }}</span>
                </div>
              </el-option>
            </el-select>
            <div style="width: 30px;height: 100%;z-index: 9;display: flex;align-items: center;justify-content: center;font-size: 40px;color: #ffffff">/</div>
            <el-select v-model="suffix" placeholder="方法" style="width: 300px" filterable ref="suffixOption" :loading="optionView" @focus="getEvent">
              <el-option v-for="(val,key) in suffixArray" :value="val.suffix" :key="val.suffix" :value-key="key">
                <div @click="getSuffixName(val.name,val.method)" style="width: 100%;height: 100%;padding: 0 20px">
                  <span style="float: left">{{ val.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ val.suffix }}</span>
                </div>
              </el-option>
            </el-select>
            <el-button @click="send" class="api-button-action" style="position:absolute; right: 21%;top: 10px;padding: 0;width: 80px;height: 40px;display: flex;justify-content: center;align-items: center;border-width: 0" round>
              <div style="width: 100%;height: 100%;display: flex;flex-direction: row;justify-content: center;align-items: center">
                <el-image :src="require('@/assets/fasong.png')" style="margin-right: 3px;width: 20px;height: 20px"></el-image>
                <div>请求</div>
              </div>
            </el-button>
            <el-button id="get-word-btn" class="api-button-action" style="position:absolute; right: 11%;top: 10px;padding: 0;width: 80px;height: 40px;display: flex;justify-content: center;align-items: center;border-width: 0" @click="getApiWord" round>
              <div style="width: 100%;height: 100%;display: flex;flex-direction: row;justify-content: center;align-items: center">
                <el-image :src="require('@/assets/word.png')" style="margin-right: 3px;width: 20px;height: 20px;"></el-image>
                <div>文档</div>
              </div>
            </el-button>
          </div>
          <div style="position:absolute;right: 110px" v-if="requestView">
            <div class="dot-windmill"></div>
          </div>
        </div>
        <div style="width: 90%;display: flex;justify-content: flex-start">
          <div style="margin-left: 15px;font-size: 14px;color: #FFFFFF">
            填写请求数据
          </div>
        </div>
        <div class="api-input-box">
          <editor ref="pushEditor" :value="push" :font-size="14" style="width: 100%;" wrap snippets @change="jsonChange"></editor>
        </div>
        <div style="width: 90%;display: flex;justify-content: flex-start;align-items: center">
          <div class="header-button" @click="responseChange('res')">数据</div>
          <div class="header-button" @click="responseChange('header')">请求头</div>
        </div>
        <div class="api-input-box" style="margin-top: 0">
          <editor ref="headerEditor" v-model="response" :font-size="14" style="width: 100%;" wrap snippets readonly></editor>
        </div>
      </div>
    </div>
    <div class="spinner-box" v-if="showLoading">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
      <p style="margin: 0 ;color: #f3f4f5;font-size: 14px;float: left">同步路由中&nbsp;</p>
    </div>
  </div>
</template>

<script>
import editor from "bin-ace-editor";

const clipboard = require('electron').clipboard
export default {
  data() {
    return {
      head: false,
      mod: '',
      modName: '',
      suffix: '',
      suffixName: '',
      array: [],
      suffixArray: [],
      suffixView: true,
      optionView: false,
      header: {},
      translation: {},
      push: undefined,
      suffixEvent: undefined,
      headers: undefined,
      token: '',
      data: {},
      showLoading: false,
      time: 0,
      focus: false,
      res: undefined,
      response: '',
      requestView: false,
      start: false,
      cache: {},
      popShow: false,
      config: {
        host: {
          default: 0,
          url: [],
        },
        user: {
          username: "",
          password: ""
        },
        route: "",
        version: ""
      },
      hostName: "",
      word: '',
    }
  },
  components: {
    editor
  },
  mounted() {
    this.$y.listenMain('getJson', (e, v) => {
      this.json = v
    })
    this.$y.listenMain('getConfig', (e, v) => {
      this.config = v
      this.hostName = this.config.host.default
      this.$yiarce.setBaseUrl(this.hostName)
      this.$yiarce.setVersion(this.config.version)
      this.getRoutes(0)
      setTimeout(() => {
        this.listenFocus()
      }, 500)
      this.start = true
      this.login()
    })
    this.$y.sendMessage('getJson')
    this.$y.sendMessage('getConfig')
  },
  methods: {
    //获得需要清除的选择器event
    getEvent(e) {
      this.suffixEvent = e
    },
    login() {
      let result = this.$yiarce.post('/login/phone', {
        phone: this.config.user.username,
        code: this.config.user.password
      })
      result.response.then((res) => {
        this.token = res['data']["token"]
        if (!this.head) {
          this.head = !this.head
        }
        this.$yiarce.setToken(this.token)
      })
    },
    listenFocus() {
      this.$y.listenMain('getFocus', () => {
        if (this.start) {
          this.getRoutes()
        }
      })
    },
    getRoutes(r) {
      let route = async () => {
        if (!this.showLoading) {
          this.showLoading = true
          this.time = parseInt((new Date()).getTime() / 100, 10)
        }

        let result = this.$yiarce.get('/getRoutes')
        result.response.then((res) => {
          if (res["code"] === undefined) {
            this.array = res
          }
          if (this.modName !== '') {
            this.suffixArray = this.array[this.mod]
          }
          let m = parseInt(Math.random() * (5 - 2 + 1) + 2, 10)
          let max = parseInt(((new Date()).getTime() / 100), 10);
          let interval = max - this.time;
          let times = m - interval;
          if (!this.focus) {
            if (interval < m) {
              setTimeout(() => {
                this.showLoading = false
              }, times * 1000)
              this.getRoutes(60000)
            } else {
              this.showLoading = false
              this.getRoutes(60000)
            }
          } else {
            this.focus = false
            if (interval < m) {
              setTimeout(() => {
                this.showLoading = false
              }, times * 1000)
            }
          }
        })
      }
      if (r === undefined || r === null) {
        this.focus = true
        route()
      } else {
        setTimeout(route, r)
      }
    },
    send() {
      let children = this.$refs.pushEditor.$el.children.item(1).children.item(0).children
      for (let i = 0; i < children.length; i++) {
        if (children.item(i).className === 'ace_gutter-cell  ace_error') {
          this.$notify({
            message: '数据格式错误',
            position: 'top-left',
            type: 'error',
            duration: 3000,
            showClose: false
          })
          return
        }
      }
      this.requestView = true;
      let result;
      if (this.suffixMethod === 'get') {
        result = this.$yiarce.get(this.mod + '/' + this.suffix, this.data)
      } else {
        result = this.$yiarce.post(this.mod + '/' + this.suffix, this.data)
      }
      result.response.then((res) => {
        this.res = res
        this.response = JSON.stringify(res, null, 2)
        let body = {key: this.mod + '/' + this.suffix};
        if (this.data === undefined || this.data.length === 0) {
          body["val"] = ""
        } else {
          body["val"] = this.data
        }
        this.requestView = false;
        this.$y.sendMessage('setJson', body)
        this.json[this.mod + '/' + this.suffix] = this.data
      })
      setTimeout(() => {
        if (this.requestView === true) {
          this.requestView = false
        }
      }, 5000)
      this.headers = result.header
    },
    getBaseName(name) {
      this.modName = this.array[name][0].base
      this.suffixArray = this.array[name]
      if (this.suffixEvent !== undefined) {
        //执行清除方法
        this.$refs.suffixOption.deleteSelected(this.suffixEvent)
      }
      this.suffixName = ''
    },
    getSuffixName(name, method) {
      this.suffixName = name
      this.suffixMethod = method
      setTimeout(() => {
        if (this.json[this.mod + '/' + this.suffix] === undefined) {
          this.push = ''
          return
        }
        let json = JSON.stringify(this.json[this.mod + '/' + this.suffix], null, 2)
        if (json === '""') {
          json = ''
        }
        this.push = json
      }, 10)
    },
    responseChange(type) {
      let data
      if (type === 'header') {
        data = this.headers
      }
      if (type === 'res') {
        data = this.res
      }
      this.response = JSON.stringify(data, null, 2)
    },
    jsonChange(text) {
      try {
        this.push = text
        let data = JSON.parse(text)
        if (typeof data != 'number') {
          this.data = data
        } else {
          this.data = undefined
        }
      } catch (e) {
        this.data = undefined
      }
    },
    setConfig(e) {
      this.config.host.default = this.hostName;
      this.$y.sendMessage('setConfig', this.config)
      this.$yiarce.setBaseUrl(this.hostName)
      this.$yiarce.setVersion(this.config.version)
      this.getRoutes(0)
      e()
    },
    getApiWord() {
      let content = '**简要描述**' + "\n\n"
      content += '- ' + this.suffixName + "\n\n"
      content += '**请求URL**' + "\n\n"
      content += '- `' + this.mod + '/' + this.suffix + '`' + "\n\n"
      content += '**请求方式**' + "\n\n"
      content += '- ' + this.suffixMethod.toUpperCase() + "\n\n"
      if (typeof this.data === 'object') {
        if (Object.keys(this.data).length > 0) {
          content += '**参数**' + "\n\n" + '| 字段名 | 类型 | 解释 |' + "\n" + '| ------| ----- | ----- |' + "\n"
          Object.keys(this.data).forEach((val) => {
            let t = this.getType(this.data[val])
            if(t === 'array'){
              content += '| '+ val +' | array |'+' 描述 |'+"\n"+this.getArray(this.data[0][val],0,'&emsp;',0)
            }else if(t === 'object'){
              content += '| '+ val +' | object |'+' 描述 |'+"\n"+this.getArray(this.data[val],1,'&emsp;',0)
            }else{
              content += '| '+ val +' | '+this.getType(this.data[val]) + ' | '
              content += (this.data[val].length !== 0 ? '描述 |' : '非必传 |') + "\n"
            }
          })
          content += "\n" + '**请求示例**' + "\n\n"
          content += '```' + "\n" + this.push + "\n" + '```' + "\n\n"
        }
      }
      content += '**返回示例**' + "\n"
      content += '```' + "\n" + this.response + "\n" + '```' + "\n\n"
      let res = JSON.parse(this.response)
      if (res.data.length !== undefined) {
        if (res.data[0] !== undefined) {
          content += '| 返回字段 | 解释 |' + "\n" + '| ------ | ----- |' + "\n"
          Object.keys(res.data[0]).forEach((val) => {
            let t = this.getType(res.data[0][val])
            if(t === 'array'){
              content += this.getArray(res.data[0][val],0,1)
            }else if(t === 'object'){
              content += this.getArray(res.data[0][val],1,1)
            }else{
              content += '| '+ val+' |  |'+"\n"
            }
          })
        }
      } else {
        if (Object.keys(res.data).length > 0) {
          content += '| 返回字段 | 解释 |' + "\n" + '| ------ | ----- |' + "\n"
          Object.keys(res.data).forEach((val) => {
            let t = this.getType(res.data[val])
            if(t === 'array'){
              content += '| '+ val +' | array |'+"\n"+this.getArray(res.data[val],0,'&emsp;')
            }else if(t === 'object'){
              content += '| '+ val +' | object |'+"\n"+this.getArray(res.data[val],1,'&emsp;')
            }else{
              content += '| '+ val+' |  |'+"\n"
            }
          })
        }
      }
      clipboard.writeText(content)
    },
    getType(val) {
      switch (typeof val) {
        case 'number':
          if (String(val).indexOf('.') === -1) {
            return 'int'
          } else {
            return 'float'
          }
        case 'string':
          return 'string'
        case 'object':
          if (val.length !== undefined) {
            return 'array'
          } else {
            if (val === null) {
              return '空'
            } else {
              return 'object'
            }
          }
        case 'undefined':
          return '未知'
        case 'boolean':
          return 'bool'
      }
    },
    getArray(data,type,emsp,ts){
      let content = '';
      if (emsp === null || emsp === undefined){
        emsp = ''
      }
      if(type === 0){
        Object.keys(data[0]).forEach((val,key)=>{
          if(emsp === ''){
            content += '| '+val+' |'
          }else if(ts !== 0){
            if((data.length-1) !== key){
              content += '| ├─'+emsp+' '+val+' |'
            }else{
              content += '| └─ '+emsp +' '+ val+' |'
            }
          }
          let t = this.getType(data[0][val])
          if(t === 'object'){
            content += ' object |'+"\n"
            content += this.getArray(data[0][val],1,emsp+'&emsp;',1)
          }else if(t === 'array'){
            content += ' array |'+"\n"
            content += this.getArray(data[0][val],0,emsp+'&emsp;',1)
          }else{
            if(ts !== 0){
              content += '  |'+"\n"
            }else{
              if(data.length-1 !== key){
                content += '| ├─'+emsp+' '+val+' | '+t+' |'+' 描述 |'+"\n"
              }else{
                content += '| └─'+emsp+' '+val+' | '+t+' |'+' 描述 |'+"\n"
              }
            }
          }
        })
      }else{
        let len = Object.keys(data).length
        Object.keys(data).forEach((val,key)=>{
          if(emsp === ''){
            content += '| '+val+' |'
          }else if(ts !== 0){
            if((len - 1) !== key){
              content += '| ├─'+emsp+' '+val+' |'
            }else{
              content += '| └─ '+emsp +' '+ val+' |'
            }
          }
          let t = this.getType(data[val])
          if(t === 'object'){
            content += this.getArray(data[val],1,emsp+'&emsp;',ts)
          }else if(t === 'array'){
            content += ' array |'+"\n"
            content += this.getArray(data[val],0,emsp+'&emsp;',ts)
          }else{
            if(ts !== 0){
              content += '  |'+"\n"
            }else{
              if(data.length-1 !== key){
                content += '| ├─'+emsp+' '+val+' | '+t+' |'+' 描述 |'+"\n"
              }else{
                content += '| └─'+emsp+' '+val+' | '+t+' |'+' 描述 |'+"\n"
              }
            }
          }
        })
      }
      return content;
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
}

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -9999;
}

/deep/ .el-image__inner {
  /*backdrop-filter: blur(1px);*/
}

.main-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-button {
  height: 40px;
  min-width: 60px !important;
  max-width: 200px !important;
  background-color: #42b98333 !important;
  color: #FFFFFF !important;
  border-color: #42b983 !important;
  border-width: 2px !important;
  position: absolute;
  right: 5px;
}

.el-select-dropdown__item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}


.main-button:active:hover {
  color: #ffffff !important;
  border-color: #4CD964 !important;
  border-width: 2px !important;
  background-color: #ffffff33 !important;
}

.api-body {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  height: calc(100% - 100px);
  flex-direction: column;
}

.api-body-background {
  width: 90%;
  position: absolute;
  z-index: -8;
  border-radius: 25px;
  overflow: hidden;
  margin-left: 5%;
  margin-right: 5%;
  height: 100%;
  filter: blur(5px);
}

.api-input-action {
  width: 100%;
  display: flex;
  border-radius: 5px;
  overflow: hidden;
}

/deep/ .el-input__inner {
  border-radius: 0;
  border: 0;
}

.api-button-action {
  background-color: #ffffff;
}

.api-button-action:hover {
  background-color: #e9e9e9;
}

.api-button-action:active {
  background-color: #e0e0e0;
}

.api-input-box {
  width: 90%;
  position: relative;
  height: 230px;
  overflow: hidden;
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-left: -20px;
}

/deep/ .el-textarea__inner {
  min-height: 120px !important;
  width: 600px;
}

/deep/ .ace_gutter {
  color: #f3f4f5 !important;
  background-color: transparent !important;
}

/deep/ .ace_variable {
  color: #4CD000 !important;
}

/deep/ .ace_string {
  color: #4CD000 !important;
}

/deep/ .bin-ace-editor {
  color: #f3f4f5 !important;
  background-color: transparent !important;
  border: none !important;
}

/deep/ .ace_gutter-active-line {
  background-color: transparent !important;
}

/deep/ .ace_cursor {
  color: #42b983 !important;
}

/deep/ .ace_scrollbar-v::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

/deep/ .ace_scrollbar-v::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
  background: rgba(0, 0, 0, 0.1);
}

/deep/ .ace_scrollbar-v::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
  border-radius: 10px;
  background: transparent;
}

/deep/ .el-notification__content {
  margin: 0 !important;
}

.spinner-box {
  position: absolute;
  right: 5px;
  bottom: 5px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  align-items: center;
}

.spinner {
  width: 30px;
  height: 30px;
  position: relative;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #42b983;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: bounce 2.0s infinite ease-in-out;
  animation: bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes bounce {
  0%, 100% {
    -webkit-transform: scale(0.0)
  }
  50% {
    -webkit-transform: scale(1.0)
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}

/deep/ .dot-windmill {
  background-color: #fff !important;
}

/deep/ .dot-windmill::before, .dot-windmill::after {
  background-color: #fff !important;
}

.header-button {
  margin-left: 20px;
  font-size: 14px;
  padding: 11px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  background-color: #121a2a10;
  color: #f3f4f5;
}

.header-button:hover {
  background-color: #121a2a20;
}

.header-button:active {
  background-color: #121a2a30;
}

/deep/ .ace_numeric {
  color: coral !important;
}

/deep/ .ace_selection {
  background-color: #224b8fa0 !important;
}

/deep/ .ace_folding-enabled {
  width: 49px !important;
}

/deep/ .el-avatar {
  background-color: transparent;
}

.head-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /*border: #4CD964aa 2px solid;*/
  position: absolute;
  right: 100px;
}

/deep/ .el-dialog {
  background-color: #ffffff59;
}
</style>
