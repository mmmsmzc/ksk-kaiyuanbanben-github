// 处理页面时间显示和更新
console.log('Time script loaded');

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化时间显示
    updateTime();
    
    // 每秒更新一次时间
    setInterval(updateTime, 1000);
});

// 更新时间显示
function updateTime() {
    // 获取当前时间
    const now = new Date();
    
    // 格式化时间字符串
    const timeString = formatTime(now);
    
    // 更新页面上的时间显示
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    // 可以在这里添加日期显示
    updateDate();
}

// 格式化时间为HH:MM:SS格式
function formatTime(date) {
    // 添加参数类型检查
    if (!date || typeof date.getHours !== 'function') {
        console.warn('formatTime: 无效的日期对象', date);
        // 对于时间戳或数字，尝试转换为Date对象
        if (typeof date === 'number') {
            date = new Date(date);
            // 如果转换后仍然无效，返回默认值
            if (isNaN(date.getTime())) {
                return '00:00:00';
            }
        } else {
            // 非数字且不是Date对象，返回默认值
            return '00:00:00';
        }
    }
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}

// 更新日期显示（如果需要）
function updateDate() {
    const now = new Date();
    const dateString = formatDate(now);
    
    // 如果页面上有日期元素，更新它
    const dateElement = document.getElementById('date');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// 格式化日期为YYYY-MM-DD格式
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// 获取星期几
function getWeekday(date) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
}

// 获取完整的日期和时间字符串
function getFullDateTime() {
    const now = new Date();
    return `${formatDate(now)} ${formatTime(now)} ${getWeekday(now)}`;
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        updateTime,
        formatTime,
        formatDate,
        getWeekday,
        getFullDateTime
    };
}