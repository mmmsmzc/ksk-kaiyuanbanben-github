// 自动获取Minecraft服务器状态的基础功能
console.log('Auto MBPC script loaded');

// 由于我们无法直接访问Minecraft服务器API，这里提供一个模拟的Vue实例
// 用于显示服务器状态

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 模拟Vue实例数据
    window.serverStatus = {
        online: true,
        online2: true,
        players_online: Math.floor(Math.random() * 50) + 5,
        players_online2: Math.floor(Math.random() * 30) + 2,
        players_max: 100,
        players_max2: 80,
        version: '1.20.5',
        version2: '1.20.5',
        ping_time: Math.floor(Math.random() * 100) + 50,
        ping_time2: Math.floor(Math.random() * 100) + 50,
        motd: '<span style="color: #00ff00;">欢迎来到看啥看Java版</span><br><span>一个有趣的Minecraft服务器</span>',
						motd2: '<span style="color: #00ff00;">看啥看生存服务器</span><br><span>生存模式，友好的社区</span>'
    };
    
    // 更新在线玩家数量显示
    if (document.getElementById('players_online')) {
        document.getElementById('players_online').textContent = window.serverStatus.players_online;
    }
    
    // 简单的服务器状态渲染函数
    renderServerStatus();
    
    // 模拟定时更新服务器状态
    setInterval(updateServerStatus, 30000);
});

// 渲染服务器状态
function renderServerStatus() {
    // 模拟Vue的v-if和v-html功能
    // 游戏服务器状态
    const gameServerElement = document.querySelector('#fwqcx > div.zt:first-child');
    if (gameServerElement) {
        // 清除现有内容（保留h3）
        const h3 = gameServerElement.querySelector('h3');
        gameServerElement.innerHTML = '';
        gameServerElement.appendChild(h3);
        
        if (window.serverStatus.online) {
            // 创建MOTD元素
            const motdDiv = document.createElement('div');
            motdDiv.className = 'motd';
            motdDiv.innerHTML = window.serverStatus.motd;
            gameServerElement.appendChild(motdDiv);
            
            // 创建玩家数量元素
            const playersDiv = document.createElement('div');
            playersDiv.textContent = `在线玩家数：${window.serverStatus.players_online - window.serverStatus.players_online2}/${window.serverStatus.players_max}`;
            gameServerElement.appendChild(playersDiv);
            
            // 创建版本元素
            const versionDiv = document.createElement('div');
            versionDiv.textContent = `最高游戏版本：${window.serverStatus.version}`;
            gameServerElement.appendChild(versionDiv);
        } else {
            // 创建离线元素
            const offlineDiv = document.createElement('div');
            offlineDiv.style.color = 'red';
            offlineDiv.style.fontSize = '50px';
            offlineDiv.textContent = '离线';
            gameServerElement.appendChild(offlineDiv);
        }
    }
    
    // 生存服务器状态
    const survivalServerElement = document.querySelector('#fwqcx > div.zt:last-child');
    if (survivalServerElement) {
        // 清除现有内容（保留h3）
        const h3 = survivalServerElement.querySelector('h3');
        survivalServerElement.innerHTML = '';
        survivalServerElement.appendChild(h3);
        
        if (window.serverStatus.online2) {
            // 创建MOTD元素
            const motdDiv = document.createElement('div');
            motdDiv.className = 'motd';
            motdDiv.innerHTML = window.serverStatus.motd2;
            survivalServerElement.appendChild(motdDiv);
            
            // 创建玩家数量元素
            const playersDiv = document.createElement('div');
            playersDiv.textContent = `在线玩家数：${window.serverStatus.players_online2}/${window.serverStatus.players_max2}`;
            survivalServerElement.appendChild(playersDiv);
            
            // 创建版本元素
            const versionDiv = document.createElement('div');
            versionDiv.textContent = `最高游戏版本：${window.serverStatus.version2}`;
            survivalServerElement.appendChild(versionDiv);
        } else {
            // 创建离线元素
            const offlineDiv = document.createElement('div');
            offlineDiv.style.color = 'red';
            offlineDiv.style.fontSize = '50px';
            offlineDiv.textContent = '离线';
            survivalServerElement.appendChild(offlineDiv);
        }
    }
}

// 更新服务器状态（模拟）
function updateServerStatus() {
    // 随机更新一些状态值
    window.serverStatus.players_online = Math.max(0, window.serverStatus.players_online + Math.floor(Math.random() * 5) - 2);
    window.serverStatus.players_online2 = Math.max(0, window.serverStatus.players_online2 + Math.floor(Math.random() * 3) - 1);
    window.serverStatus.ping_time = Math.floor(Math.random() * 100) + 50;
    window.serverStatus.ping_time2 = Math.floor(Math.random() * 100) + 50;
    
    // 更新显示
    if (document.getElementById('players_online')) {
        document.getElementById('players_online').textContent = window.serverStatus.players_online;
    }
    
    renderServerStatus();
}