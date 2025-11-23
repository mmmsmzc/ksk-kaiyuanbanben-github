// 获取服务器在线玩家信息
console.log('Get online players script loaded');

// 立即尝试更新在线玩家数（不依赖DOMContentLoaded）
try {
    // 先尝试直接更新，如果DOM已经加载完成
    updateOnlinePlayers();
    console.log('Initial player count update attempted');
} catch (error) {
    console.warn('Initial update failed, will try again on DOMContentLoaded:', error);
}

// 确保页面加载完成后再次执行
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, updating player count');
    // 初始化在线玩家数
    updateOnlinePlayers();
    
    // 定时更新在线玩家数，每30秒更新一次
    setInterval(updateOnlinePlayers, 30000);
});

// 更新在线玩家数
function updateOnlinePlayers() {
    // 模拟从服务器获取数据
    // 实际项目中，这里应该发送API请求到后端获取真实数据
    
    // 模拟数据
    const onlinePlayers = {
        main: Math.floor(Math.random() * 50) + 5,  // 主服务器在线玩家数
        survival: Math.floor(Math.random() * 30) + 2  // 生存服务器在线玩家数
    };
    
    // 更新页面上的显示
    updatePlayerCountDisplay(onlinePlayers);
    
    // 记录到控制台，便于调试
    console.log('在线玩家数更新：主服务器 ' + onlinePlayers.main + ' 人，生存服务器 ' + onlinePlayers.survival + ' 人');
}

// 更新玩家数量显示
function updatePlayerCountDisplay(players) {
    console.log('Updating player count display with:', players);
    
    // 更新主页面的在线玩家数
    const mainOnlineElement = document.getElementById('players_online');
    if (mainOnlineElement) {
        console.log('Found players_online element, updating to:', players.main);
        // 使用动画效果更新数字
        animateNumber(mainOnlineElement, parseInt(mainOnlineElement.textContent) || 0, players.main);
    } else {
        console.error('Cannot find players_online element!');
        // 如果找不到元素，尝试直接设置默认值
        setTimeout(() => {
            const retryElement = document.getElementById('players_online');
            if (retryElement) {
                console.log('Found players_online element on retry, setting to:', players.main);
                retryElement.textContent = players.main;
            }
        }, 1000);
    }
    
    // 更新服务器查询弹窗中的玩家数
    // 这里依赖于autombpc.js中定义的window.serverStatus对象
    if (window.serverStatus) {
        window.serverStatus.players_online = players.main;
        window.serverStatus.players_online2 = players.survival;
        
        // 重新渲染服务器状态
        if (typeof renderServerStatus === 'function') {
            renderServerStatus();
        }
    }
}

// 数字动画效果
function animateNumber(element, start, end, duration = 1000) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数使动画更自然
        const easeProgress = easeOutQuad(progress);
        const current = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // 确保最终值准确
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 缓动函数 - 二次方缓动（减速）
function easeOutQuad(t) {
    return t * (2 - t);
}

// 模拟API请求函数（供其他模块使用）
function fetchServerStatus(callback) {
    // 模拟网络延迟
    setTimeout(() => {
        const status = {
            online: true,
            online2: true,
            players_online: Math.floor(Math.random() * 50) + 5,
            players_online2: Math.floor(Math.random() * 30) + 2,
            players_max: 100,
            players_max2: 80,
            version: '1.20.51',
            version2: '1.20.51',
            ping_time: Math.floor(Math.random() * 100) + 50,
            ping_time2: Math.floor(Math.random() * 100) + 50,
            motd: '<span style="color: #00ff00;">欢迎来到看啥看Java版</span><br><span>一个有趣的Minecraft服务器</span>',
						motd2: '<span style="color: #00ff00;">看啥看生存服务器</span><br><span>生存模式，友好的社区</span>'
        };
        
        if (callback) {
            callback(status);
        }
    }, 500);
}

// 导出函数供其他模块使用（如果需要）
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        fetchServerStatus,
        updateOnlinePlayers
    };
}