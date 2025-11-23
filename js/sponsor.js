// 处理赞助商列表展示功能
console.log('Sponsor script loaded');

// 赞助商数据管理器
const sponsorManager = {
    sponsors: [],
    isLoading: false,
    error: null
};

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化赞助商列表
    initSponsors();
});

// 初始化赞助商列表
function initSponsors() {
    // 加载赞助商数据
    loadSponsors();
}

// 加载赞助商数据
function loadSponsors() {
    sponsorManager.isLoading = true;
    sponsorManager.error = null;
    
    // 模拟API请求延迟
    setTimeout(() => {
        try {
            // 使用模拟数据
            const mockSponsors = generateMockSponsors();
            sponsorManager.sponsors = mockSponsors;
            
            // 更新UI显示赞助商列表
            updateSponsorList();
        } catch (err) {
            sponsorManager.error = '加载赞助商数据失败';
            console.error('Failed to load sponsors:', err);
            updateSponsorList();
        } finally {
            sponsorManager.isLoading = false;
        }
    }, 1000);
}

// 生成模拟赞助商数据
function generateMockSponsors() {
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    const amounts = [100, 200, 50, 150, 300, 80, 500, 120];
    const sponsors = [];
    
    // 随机生成5-8个赞助商
    const count = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < count; i++) {
        const nameIndex = Math.floor(Math.random() * names.length);
        const amountIndex = Math.floor(Math.random() * amounts.length);
        
        sponsors.push({
            id: i + 1,
            name: names[nameIndex],
            amount: amounts[amountIndex],
            date: generateRandomDate()
        });
    }
    
    // 按赞助金额降序排序
    sponsors.sort((a, b) => b.amount - a.amount);
    
    return sponsors;
}

// 生成随机日期（最近3个月内）
function generateRandomDate() {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    const randomTime = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime());
    const randomDate = new Date(randomTime);
    
    // 格式化为YYYY-MM-DD
    return randomDate.toISOString().split('T')[0];
}

// 更新赞助商列表UI
function updateSponsorList() {
    const dataList = document.getElementById('dataList');
    if (!dataList) return;
    
    // 清空现有列表
    dataList.innerHTML = '';
    
    if (sponsorManager.isLoading) {
        // 显示加载状态
        const loadingItem = document.createElement('li');
        loadingItem.textContent = '加载中...';
        dataList.appendChild(loadingItem);
    } else if (sponsorManager.error) {
        // 显示错误信息
        const errorItem = document.createElement('li');
        errorItem.textContent = sponsorManager.error;
        errorItem.style.color = 'red';
        dataList.appendChild(errorItem);
    } else if (sponsorManager.sponsors.length === 0) {
        // 显示空状态
        const emptyItem = document.createElement('li');
        emptyItem.textContent = '暂无赞助商';
        dataList.appendChild(emptyItem);
    } else {
        // 显示赞助商列表
        sponsorManager.sponsors.forEach(sponsor => {
            const listItem = document.createElement('li');
            
            // 设置样式，突出显示大额赞助
            let nameStyle = 'color: gold;';
            let amountStyle = 'color: red;';
            
            if (sponsor.amount >= 300) {
                nameStyle += ' font-weight: bold; font-size: 1.2em;';
                amountStyle += ' font-weight: bold; font-size: 1.2em;';
            } else if (sponsor.amount >= 100) {
                nameStyle += ' font-weight: bold;';
                amountStyle += ' font-weight: bold;';
            }
            
            listItem.innerHTML = `
                <span style="${nameStyle}">${sponsor.name} </span>
                <span style="${amountStyle}">${sponsor.amount} </span>RMB
                <span style="color: #999; font-size: 0.8em; margin-left: 10px;">(${sponsor.date})</span>
            `;
            
            dataList.appendChild(listItem);
        });
    }
}

// 添加新赞助商（用于管理员功能）
function addSponsor(name, amount) {
    if (!name || !amount || isNaN(amount) || amount <= 0) {
        console.error('Invalid sponsor data');
        return false;
    }
    
    const newSponsor = {
        id: Date.now(), // 使用时间戳作为临时ID
        name: name,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0]
    };
    
    sponsorManager.sponsors.unshift(newSponsor);
    
    // 重新排序
    sponsorManager.sponsors.sort((a, b) => b.amount - a.amount);
    
    // 更新UI
    updateSponsorList();
    
    return true;
}

// 刷新赞助商列表
function refreshSponsors() {
    loadSponsors();
}

// 获取赞助商统计信息
function getSponsorStats() {
    const totalAmount = sponsorManager.sponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0);
    const sponsorCount = sponsorManager.sponsors.length;
    const averageAmount = sponsorCount > 0 ? totalAmount / sponsorCount : 0;
    const maxAmount = sponsorCount > 0 ? Math.max(...sponsorManager.sponsors.map(s => s.amount)) : 0;
    
    return {
        totalAmount: totalAmount,
        sponsorCount: sponsorCount,
        averageAmount: averageAmount,
        maxAmount: maxAmount
    };
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        loadSponsors,
        addSponsor,
        refreshSponsors,
        getSponsorStats
    };
}