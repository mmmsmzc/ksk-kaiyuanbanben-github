# Minecraft 看啥看 Java版官方网站

## 项目概述
这是一个为Minecraft看啥看Java版设计的官方网站，包含服务器状态显示、玩家信息、赞助者列表等功能。

## 网站结构
```
服务器官网/
├── css/
│   └── index.css      # 主样式文件
├── img/
│   └── logo.svg       # 网站Logo
├── js/
│   ├── autombpc.js    # 服务器状态获取
│   ├── autosetcss.js  # 自动CSS设置
│   ├── clickevent.js  # 点击事件处理
│   ├── getonline3.js  # 在线玩家信息
│   ├── message.js     # 聊天消息功能
│   ├── music.js       # 音乐播放器
│   ├── setbg.js       # 背景设置
│   ├── sponsor.js     # 赞助商管理
│   └── time.js        # 时间显示
├── loading.html       # 加载页面
├── 服务器官网.html     # 主页面
└── README.md          # 项目说明
```

## 如何运行网站

### 方法1：使用Python内置HTTP服务器
1. 确保您已安装Python
2. 打开命令提示符（CMD）或PowerShell
3. 导航到网站目录：
   ```
   cd c:\Users\830g6\Desktop\服务器官网
   ```
4. 运行以下命令启动服务器：
   ```
   python -m http.server 8000
   ```
5. 打开浏览器，访问 http://localhost:8000/服务器官网.html

### 方法2：使用VS Code的Live Server扩展
1. 在VS Code中安装Live Server扩展
2. 打开网站文件夹
3. 右键点击"服务器官网.html"文件
4. 选择"Open with Live Server"

## 功能特性
- 服务器状态实时显示（在线/离线、玩家数量、版本信息）
- 赞助商列表展示
- 主题切换功能（明/暗模式）
- 响应式设计，支持不同屏幕尺寸
- 背景切换和音乐播放功能
- 简洁模式切换

## 注意事项
- 网站使用模拟数据展示服务器状态，实际使用时需要连接到真实的服务器API
- 所有JavaScript文件都是独立模块，负责不同的功能
- CSS文件包含响应式设计，确保在移动设备上也能正常显示

## 技术栈
- HTML5
- CSS3
- JavaScript (原生)
- jQuery (外部依赖)