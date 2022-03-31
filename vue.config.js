module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                win: {
                    icon: "F:/ycwl/api_tools/src/assets/icon_256.ico"
                },
                nsis: {
                    oneClick: false, // 一键安装
                    perMachine: true, // 是否开启安装时权限限制（此电脑或当前用户）
                    allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    allowToChangeInstallationDirectory: true, // 允许修改安装目录
                    createDesktopShortcut: true, // 创建桌面图标
                },
                extraResources:{
                    from:"./config.json",
                    to:"./"
                }
            }
        }
    }
}
