// 自动设置CSS样式
console.log('Auto set CSS script loaded');

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化时设置CSS
    setInitialStyles();
    
    // 监听窗口大小变化
    window.addEventListener('resize', debounce(function() {
        updateResponsiveStyles();
    }, 250));
    
    // 监听主题变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateStylesOnThemeChange();
            }
        });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // 初始化tips样式
    initTipsStyles();
});

// 设置初始样式
function setInitialStyles() {
    // 设置tips样式
    const tips = document.querySelector('.tips');
    if (tips) {
        Object.assign(tips.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
        });
    }
    
    // 更新响应式样式
    updateResponsiveStyles();
}

// 更新响应式样式
function updateResponsiveStyles() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 调整容器高度
    const bj = document.querySelector('.bj');
    if (bj) {
        bj.style.minHeight = windowHeight + 'px';
    }
    
    // 调整盒子大小
    const boxes = document.querySelectorAll('.box1, .box2, .box3');
    boxes.forEach(box => {
        if (windowWidth <= 900) {
            box.style.width = '90%';
        } else {
            box.style.width = '800px';
        }
    });
    
    // 调整字体大小
    const titleBar = document.querySelector('.title_bar');
    if (titleBar) {
        const logo = titleBar.querySelector('.logo');
        const timeShow = document.getElementById('timeshow');
        
        if (windowWidth <= 600) {
            titleBar.style.height = '70px';
            if (logo) logo.style.fontSize = '20px';
            if (timeShow) timeShow.style.fontSize = '16px';
        } else {
            titleBar.style.height = '80px';
            if (logo) logo.style.fontSize = '30px';
            if (timeShow) timeShow.style.fontSize = '20px';
        }
    }
    
    // 调整按钮大小
    const buttons3 = document.querySelectorAll('.button3');
    if (windowWidth <= 600) {
        buttons3.forEach(btn => {
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.marginLeft = '10px';
        });
    } else {
        buttons3.forEach(btn => {
            btn.style.width = '60px';
            btn.style.height = '60px';
            btn.style.marginLeft = '20px';
        });
    }
    
    // 调整视频播放器大小
    const bilibili = document.getElementById('bilibili');
    if (bilibili) {
        if (windowWidth <= 600) {
            bilibili.style.height = '250px';
        } else {
            bilibili.style.height = '400px';
        }
    }
    
    // 调整弹窗布局
    const fwqcx = document.getElementById('fwqcx');
    if (fwqcx) {
        if (windowWidth <= 600) {
            fwqcx.style.flexDirection = 'column';
            fwqcx.style.gap = '20px';
        } else {
            fwqcx.style.flexDirection = 'row';
            fwqcx.style.gap = '30px';
        }
    }
}

// 更新主题变化时的样式
function updateStylesOnThemeChange() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // 更新图标颜色
    const icons = document.querySelectorAll('svg.icon path');
    icons.forEach(path => {
        path.setAttribute('fill', isDarkTheme ? '#e0e0e0' : '#515151');
    });
    
    // 更新响应式样式（确保主题切换后布局正确）
    updateResponsiveStyles();
}

// 初始化tips样式
function initTipsStyles() {
    let tips = document.querySelector('.tips');
    
    if (!tips) {
        // 如果没有tips元素，创建一个
        tips = document.createElement('div');
        tips.className = 'tips';
        document.body.appendChild(tips);
    }
    
    Object.assign(tips.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        zIndex: '1000',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        fontSize: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 简洁模式样式调整
function updateConciseModeStyles() {
    const isConcise = document.body.classList.contains('concise-mode');
    
    // 简洁模式下隐藏某些元素
    const elementsToHideInConcise = document.querySelectorAll('.box1_1, .music, .concise');
    
    elementsToHideInConcise.forEach(element => {
        if (isConcise) {
            element.style.display = 'none';
        } else {
            element.style.display = '';
        }
    });
    
    // 调整盒子间距
    const boxes = document.querySelectorAll('.box1, .box2, .box3');
    if (isConcise) {
        boxes.forEach(box => {
            box.style.marginBottom = '15px';
        });
    } else {
        boxes.forEach(box => {
            box.style.marginBottom = '30px';
        });
    }
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        setInitialStyles,
        updateResponsiveStyles,
        updateConciseModeStyles
    };
}