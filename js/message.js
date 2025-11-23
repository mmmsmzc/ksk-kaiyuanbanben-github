// 处理网站聊天消息功能
console.log('Message script loaded');

// 消息管理器对象
const messageManager = {
    messages: [],
    maxMessages: 50,
    isConnected: false,
    username: '访客',
    inputElement: null,
    sendButton: null,
    messageContainer: null
};

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化消息系统
    initMessageSystem();
    
    // 模拟加载一些历史消息
    loadSampleMessages();
});

// 初始化消息系统
function initMessageSystem() {
    // 在实际项目中，这里应该初始化WebSocket连接或其他消息系统
    // 但在模拟环境中，我们只设置基本的UI和事件处理
    
    console.log('Message system initialized');
    
    // 尝试找到消息相关的DOM元素
    messageManager.messageContainer = document.querySelector('.useiframe iframe');
    
    // 模拟连接状态
    setTimeout(() => {
        messageManager.isConnected = true;
        console.log('Message system connected');
    }, 1000);
}

// 加载示例消息 - 已移除系统消息
function loadSampleMessages() {
    // 添加玩家示例消息到消息列表，移除了系统和服主消息
    const sampleMessages = [
        { username: '玩家1', content: '服务器真不错！', timestamp: Date.now() - 1800000 },
        { username: '玩家2', content: '有人一起玩吗？', timestamp: Date.now() - 900000 },
        { username: '玩家3', content: '这个网站做得很炫酷！', timestamp: Date.now() - 300000 }
    ];
    
    sampleMessages.forEach(msg => {
        addMessage(msg.username, msg.content, msg.timestamp);
    });
    
    // 模拟接收新消息
    simulateNewMessages();
}

// 添加消息到消息列表
function addMessage(username, content, timestamp = Date.now()) {
    // 创建消息对象
    const message = {
        username: username,
        content: content,
        timestamp: timestamp
    };
    
    // 添加到消息列表
    messageManager.messages.push(message);
    
    // 保持消息数量在限制范围内
    if (messageManager.messages.length > messageManager.maxMessages) {
        messageManager.messages.shift();
    }
    
    // 在实际项目中，这里应该更新UI显示新消息
    console.log(`[${formatTime(new Date(timestamp))}] ${username}: ${content}`);
    
    // 如果有iframe，更新iframe内容（模拟聊天界面）
    updateIframeContent();
}

// 发送消息
function sendMessage(content) {
    if (!content.trim() || !messageManager.isConnected) return;
    
    // 添加自己的消息
    addMessage(messageManager.username, content);
    
    // 在实际项目中，这里应该通过WebSocket或其他方式发送消息到服务器
    // 但在模拟环境中，我们只添加本地消息
    
    // 清空输入框（如果存在）
    if (messageManager.inputElement) {
        messageManager.inputElement.value = '';
    }
    
    // 不再模拟服务器回复，避免生成系统提示消息
}

// 模拟服务器响应 - 已禁用系统提示
function simulateServerResponse(userMessage) {
    // 系统提示已禁用，不需要自动回复
    // 移除了系统自动回复逻辑
}

// 模拟接收新消息 - 已移除系统消息生成
function simulateNewMessages() {
    // 随机时间间隔接收新消息
    const delay = Math.random() * 10000 + 5000; // 5-15秒随机延迟
    
    setTimeout(() => {
        // 只有在连接状态下才接收新消息
        if (messageManager.isConnected) {
            // 确保所有用户名都是玩家，不包含系统或服主
            const usernames = ['玩家1', '玩家2', '玩家3', '玩家4', '玩家5'];
            const contents = [
                '有人在吗？',
                '服务器真好玩！',
                '今天天气不错',
                '有人想一起建房子吗？',
                '刚发现了一个有趣的地方！',
                '大家好啊！'
            ];
            
            const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
            const randomContent = contents[Math.floor(Math.random() * contents.length)];
            
            addMessage(randomUsername, randomContent);
        }
        
        // 继续模拟下一条消息
        simulateNewMessages();
    }, delay);
}

// 更新iframe内容（模拟聊天界面）
function updateIframeContent() {
    if (!messageManager.messageContainer) return;
    
    // 检查iframe是否已加载
    if (messageManager.messageContainer.contentDocument) {
        const iframeDoc = messageManager.messageContainer.contentDocument;
        
        // 创建简单的聊天界面HTML
        let chatHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>聊天界面</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 20px;
                    height: 100%;
                    overflow-y: auto;
                }
                .chat-container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .message {
                    background-color: white;
                    border-radius: 10px;
                    padding: 10px 15px;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .message-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                .username {
                    font-weight: bold;
                    color: #3498db;
                }
                .timestamp {
                    font-size: 12px;
                    color: #7f8c8d;
                }
                .message-content {
                    color: #333;
                    word-wrap: break-word;
                }
                .system-message {
                    background-color: #e8f4f8;
                }
                .system-message .username {
                    color: #2980b9;
                }
                .input-area {
                    margin-top: 20px;
                    display: flex;
                }
                .input-area input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px 0 0 5px;
                    font-size: 16px;
                }
                .input-area button {
                    padding: 10px 20px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 0 5px 5px 0;
                    cursor: pointer;
                    font-size: 16px;
                }
                .input-area button:hover {
                    background-color: #2980b9;
                }
                .status {
                    text-align: center;
                    color: #7f8c8d;
                    font-size: 14px;
                    margin-bottom: 15px;
                }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div class="status">${messageManager.isConnected ? '已连接' : '连接中...'}</div>
        `;
        
        // 添加消息到HTML
        messageManager.messages.forEach(msg => {
            const isSystemMessage = msg.username === '系统' || msg.username === '服主';
            const messageClass = isSystemMessage ? 'message system-message' : 'message';
            
            chatHtml += `
                <div class="${messageClass}">
                    <div class="message-header">
                        <span class="username">${msg.username}</span>
                        <span class="timestamp">${formatTime(new Date(msg.timestamp))}</span>
                    </div>
                    <div class="message-content">${msg.content}</div>
                </div>
            `;
        });
        
        // 添加输入区域
        chatHtml += `
                <div class="input-area">
                    <input type="text" id="messageInput" placeholder="输入消息...">
                    <button id="sendButton">发送</button>
                </div>
            </div>
            
            <script>
                document.getElementById('sendButton').addEventListener('click', function() {
                    const input = document.getElementById('messageInput');
                    const content = input.value.trim();
                    if (content) {
                        // 只在iframe内部显示用户消息，不添加任何系统回复
                        const newMessage = document.createElement('div');
                        newMessage.className = 'message';
                        const now = new Date();
                        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                                          now.getMinutes().toString().padStart(2, '0') + ':' + 
                                          now.getSeconds().toString().padStart(2, '0');
                        newMessage.innerHTML = 
                            '<div class="message-header">' +
                            '    <span class="username">访客</span>' +
                            '    <span class="timestamp">' + timeString + '</span>' +
                            '</div>' +
                            '<div class="message-content">' + content + '</div>';
                        
                        const container = document.querySelector('.chat-container');
                        container.insertBefore(newMessage, document.querySelector('.input-area'));
                        
                        // 清空输入框
                        input.value = '';
                        
                        // 滚动到底部
                        window.scrollTo(0, document.body.scrollHeight);
                    }
                });
                
                // 回车键发送消息
                document.getElementById('messageInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        document.getElementById('sendButton').click();
                    }
                });
                
                // 滚动到底部
                window.scrollTo(0, document.body.scrollHeight);
            </script>
        </body>
        </html>
        `;
        
        // 写入iframe内容
        iframeDoc.open();
        iframeDoc.write(chatHtml);
        iframeDoc.close();
    }
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}

// 设置用户名
function setUsername(username) {
    if (username && username.trim()) {
        messageManager.username = username.trim();
        console.log('Username set to:', messageManager.username);
    }
}

// 断开连接
function disconnect() {
    messageManager.isConnected = false;
    console.log('Message system disconnected');
}

// 重新连接
function reconnect() {
    messageManager.isConnected = false;
    console.log('Reconnecting...');
    
    // 模拟重连延迟
    setTimeout(() => {
        messageManager.isConnected = true;
        console.log('Reconnected');
        updateIframeContent();
    }, 2000);
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        sendMessage,
        setUsername,
        disconnect,
        reconnect
    };
}