// 设置和切换网站背景
console.log('Set background script loaded');

// 背景管理器对象
const bgManager = {
    currentBackground: null,
    backgrounds: [
        // 这里可以添加真实的背景图片路径
        // 'img/bg1.jpg',
        // 'img/bg2.jpg',
        // 'img/bg3.jpg'
    ],
    transitionSpeed: 1000, // 背景切换过渡时间（毫秒）
    autoChangeInterval: null,
    autoChangeDelay: 30000, // 自动切换延迟时间（毫秒）
    isAutoChanging: false
};

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化背景
    initBackground();
    
    // 监听主题变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateBackgroundOnThemeChange();
            }
        });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // 从本地存储加载背景设置
    loadBackgroundSettings();
});

// 初始化背景
function initBackground() {
    const darkbg = document.getElementById('darkbg');
    if (darkbg) {
        // 设置默认背景样式
        Object.assign(darkbg.style, {
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            transition: `background-color ${bgManager.transitionSpeed}ms ease`
        });
        
        // 由于我们没有实际的背景图片，使用渐变色作为背景
        setGradientBackground();
    }
}

// 设置渐变背景
function setGradientBackground() {
    const darkbg = document.getElementById('darkbg');
    if (!darkbg) return;
    
    // 检查是否是暗色主题
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    if (isDarkTheme) {
        // 暗色主题背景
        darkbg.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    } else {
        // 浅色主题背景
        darkbg.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #e0e5ec 100%)';
    }
}

// 切换到下一个背景
function nextBackground() {
    if (bgManager.backgrounds.length === 0) {
        // 如果没有背景图片，切换渐变背景的颜色变化
        changeGradientColors();
        return;
    }
    
    // 计算下一个背景索引
    const currentIndex = bgManager.backgrounds.indexOf(bgManager.currentBackground);
    const nextIndex = (currentIndex + 1) % bgManager.backgrounds.length;
    
    // 切换到下一个背景
    setBackground(bgManager.backgrounds[nextIndex]);
}

// 设置指定背景
function setBackground(background) {
    const darkbg = document.getElementById('darkbg');
    if (!darkbg) return;
    
    // 更新当前背景
    bgManager.currentBackground = background;
    
    // 应用背景图片
    darkbg.style.backgroundImage = `url('${background}')`;
    darkbg.style.backgroundSize = 'cover';
    darkbg.style.backgroundPosition = 'center';
    darkbg.style.backgroundAttachment = 'fixed';
    
    // 保存设置
    saveBackgroundSettings();
}

// 改变渐变背景颜色
function changeGradientColors() {
    const darkbg = document.getElementById('darkbg');
    if (!darkbg) return;
    
    // 检查是否是暗色主题
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    if (isDarkTheme) {
        // 暗色主题的几种渐变
        const darkGradients = [
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            'linear-gradient(135deg, #141e30 0%, #243b55 50%, #141e30 100%)',
            'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
        ];
        
        const randomGradient = darkGradients[Math.floor(Math.random() * darkGradients.length)];
        darkbg.style.background = randomGradient;
    } else {
        // 浅色主题的几种渐变
        const lightGradients = [
            'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #e0e5ec 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fbc2eb 100%)'
        ];
        
        const randomGradient = lightGradients[Math.floor(Math.random() * lightGradients.length)];
        darkbg.style.background = randomGradient;
    }
}

// 更新主题变化时的背景
function updateBackgroundOnThemeChange() {
    setGradientBackground();
}

// 开始自动切换背景
function startAutoBackgroundChange() {
    if (bgManager.isAutoChanging) return;
    
    bgManager.isAutoChanging = true;
    bgManager.autoChangeInterval = setInterval(nextBackground, bgManager.autoChangeDelay);
    
    // 保存设置
    saveBackgroundSettings();
    
    // 显示提示
    showTips('已开启自动切换背景');
}

// 停止自动切换背景
function stopAutoBackgroundChange() {
    if (!bgManager.isAutoChanging) return;
    
    bgManager.isAutoChanging = false;
    clearInterval(bgManager.autoChangeInterval);
    bgManager.autoChangeInterval = null;
    
    // 保存设置
    saveBackgroundSettings();
    
    // 显示提示
    showTips('已关闭自动切换背景');
}

// 切换自动背景切换状态
function toggleAutoBackgroundChange() {
    if (bgManager.isAutoChanging) {
        stopAutoBackgroundChange();
    } else {
        startAutoBackgroundChange();
    }
}

// 保存背景设置到本地存储
function saveBackgroundSettings() {
    try {
        localStorage.setItem('bgCurrent', bgManager.currentBackground || '');
        localStorage.setItem('bgAutoChange', bgManager.isAutoChanging.toString());
        localStorage.setItem('bgDelay', bgManager.autoChangeDelay.toString());
    } catch (e) {
        console.error('Failed to save background settings:', e);
    }
}

// 从本地存储加载背景设置
function loadBackgroundSettings() {
    try {
        const savedCurrent = localStorage.getItem('bgCurrent');
        const savedAutoChange = localStorage.getItem('bgAutoChange');
        const savedDelay = localStorage.getItem('bgDelay');
        
        if (savedCurrent && bgManager.backgrounds.includes(savedCurrent)) {
            setBackground(savedCurrent);
        }
        
        if (savedDelay) {
            bgManager.autoChangeDelay = parseInt(savedDelay);
        }
        
        if (savedAutoChange === 'true') {
            // 注意：我们不会自动启动自动切换，除非用户明确要求
            // 这是为了避免在用户未交互的情况下进行可能消耗资源的操作
        }
    } catch (e) {
        console.error('Failed to load background settings:', e);
    }
}

// 显示提示信息的辅助函数
function showTips(message) {
    const tips = document.querySelector('.tips');
    
    if (tips) {
        tips.textContent = message;
        tips.style.opacity = '1';
        
        // 3秒后自动隐藏
        setTimeout(function() {
            tips.style.opacity = '0';
        }, 3000);
    }
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        nextBackground,
        setBackground,
        toggleAutoBackgroundChange,
        startAutoBackgroundChange,
        stopAutoBackgroundChange
    };
}