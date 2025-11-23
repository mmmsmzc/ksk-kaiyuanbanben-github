// 处理网站中的点击事件
console.log('Click event script loaded');

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 加入游戏按钮点击事件
    const joinGameBtn = document.querySelector('.button1.jiaruyouxi');
    if (joinGameBtn) {
        joinGameBtn.addEventListener('click', function() {
            // 尝试打开Minecraft游戏
            window.location.href = 'minecraft://?addExternalServer=看啥看Java版|x33.minekuai.com:35175';
            // 显示提示
            showTips('正在打开Minecraft游戏...');
        });
    }
    
    // IP复制功能
    const ipElement = document.getElementById('showip');
    if (ipElement) {
        ipElement.addEventListener('click', function() {
            // 提取IP地址
            const ip = 'x33.minekuai.com:35175';
            
            // 使用Clipboard API复制文本
            navigator.clipboard.writeText(ip).then(function() {
                showTips('IP地址已复制到剪贴板！');
            }).catch(function(err) {
                console.error('复制失败:', err);
                showTips('复制失败，请手动复制');
            });
        });
    }
    
    // 主题切换功能
    const themeSet = document.querySelector('.themeset');
    const themeOptions = document.querySelectorAll('.theme div');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('t0')) {
                // 自动切换
                autoTheme();
                localStorage.setItem('theme', 'auto');
                showTips('已设置为自动切换主题');
            } else if (this.classList.contains('t1')) {
                // 浅色主题
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                showTips('已切换到浅色主题');
            } else if (this.classList.contains('t2')) {
                // 暗色主题
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                showTips('已切换到暗色主题');
            }
        });
    });
    
    // 简洁模式切换
    const conciseBtn = document.querySelector('.concise');
    if (conciseBtn) {
        // 更新简洁模式图标
        function updateConciseIcon(isConcise) {
            const svg = conciseBtn.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path) {
                    // 改变图标颜色以表示当前状态
                    path.setAttribute('fill', isConcise ? '#3498db' : '#272636');
                }
            }
        }
        
        conciseBtn.addEventListener('click', function() {
            document.body.classList.toggle('concise-mode');
            const isConcise = document.body.classList.contains('concise-mode');
            localStorage.setItem('concise-mode', isConcise);
            updateConciseIcon(isConcise);
            showTips(isConcise ? '已切换到简洁模式' : '已关闭简洁模式');
        });
        
        // 初始化简洁模式图标
        const isConcise = localStorage.getItem('concise-mode') === 'true';
        updateConciseIcon(isConcise);
    }
    
    // 音乐控制
    const musicBtn = document.querySelector('.music');
    if (musicBtn) {
        musicBtn.addEventListener('click', function() {
            toggleMusic();
        });
    }
    
    // 聊天按钮
    const chatBtn = document.querySelector('.button2.liaotian');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            showPopup();
            // 显示聊天界面
            const popup = document.querySelector('.popup');
            if (popup) {
                popup.querySelectorAll('div').forEach(div => {
                    div.style.display = 'none';
                });
                const useiframeDiv = popup.querySelector('.useiframe');
                if (useiframeDiv) {
                    useiframeDiv.style.display = 'block';
                }
            }
        });
    }
    
    // 下载按钮
    const downloadBtn = document.querySelector('.button2.download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            showPopup();
            // 显示下载选项
            const popup = document.querySelector('.popup');
            if (popup) {
                popup.querySelectorAll('div').forEach(div => {
                    div.style.display = 'none';
                });
                
                // 创建下载内容区域（如果不存在）
                let downloadDiv = popup.querySelector('.download-content');
                if (!downloadDiv) {
                    downloadDiv = document.createElement('div');
                    downloadDiv.className = 'download-content';
                    downloadDiv.style.padding = '20px';
                    downloadDiv.innerHTML = `
                        <h2 style="text-align: center;">资源下载</h2>
                        <div style="margin-top: 20px;">
                            <h3>Minecraft 客户端</h3>
                            <p>推荐使用官方启动器或HMCL启动器</p>
                            <a href="https://www.minecraft.net/zh-hans/download" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">官方启动器</a>
                            <a href="https://hmcl.huangyuhui.net/" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 10px 10px;">HMCL启动器</a>
                        </div>
                        <div style="margin-top: 30px;">
                            <h3>服务器材质包</h3>
                            <p>可选下载，增强游戏体验</p>
                            <button id="download-resourcepack" style="padding: 10px 20px; background-color: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">下载材质包</button>
                        </div>
                    `;
                    popup.appendChild(downloadDiv);
                    
                    // 添加材质包下载事件
                    document.getElementById('download-resourcepack').addEventListener('click', function() {
                        showTips('材质包下载中...');
                        // 这里只是模拟下载，实际项目中可以添加真实的下载链接
                    });
                }
                downloadDiv.style.display = 'block';
            }
        });
    }
    
    // 频道按钮
    const channelBtn = document.querySelector('.button2.pindao');
    if (channelBtn) {
        channelBtn.addEventListener('click', function() {
            // 跳转到视频网站
            window.open('https://space.bilibili.com/', '_blank');
        });
    }
    
    // 反馈按钮
    const feedbackBtn = document.querySelector('.button2.fankui');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function() {
            showPopup();
            // 显示反馈表单
            const popup = document.querySelector('.popup');
            if (popup) {
                popup.querySelectorAll('div').forEach(div => {
                    div.style.display = 'none';
                });
                
                // 创建反馈表单（如果不存在）
                let feedbackDiv = popup.querySelector('.feedback-form');
                if (!feedbackDiv) {
                    feedbackDiv = document.createElement('div');
                    feedbackDiv.className = 'feedback-form';
                    feedbackDiv.style.padding = '20px';
                    feedbackDiv.innerHTML = `
                        <h2 style="text-align: center;">问题反馈</h2>
                        <form id="feedback-form" style="margin-top: 20px;">
                            <div style="margin-bottom: 15px;">
                                <label for="feedback-type" style="display: block; margin-bottom: 5px;">反馈类型：</label>
                                <select id="feedback-type" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                                    <option value="bug">bug反馈</option>
                                    <option value="suggestion">建议</option>
                                    <option value="question">问题咨询</option>
                                    <option value="other">其他</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label for="feedback-content" style="display: block; margin-bottom: 5px;">反馈内容：</label>
                                <textarea id="feedback-content" rows="5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;"></textarea>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label for="feedback-contact" style="display: block; margin-bottom: 5px;">联系方式（选填）：</label>
                                <input type="text" id="feedback-contact" placeholder="QQ或邮箱" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            </div>
                            <button type="submit" style="width: 100%; padding: 12px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">提交反馈</button>
                        </form>
                    `;
                    popup.appendChild(feedbackDiv);
                    
                    // 添加表单提交事件
                    document.getElementById('feedback-form').addEventListener('submit', function(e) {
                        e.preventDefault();
                        const content = document.getElementById('feedback-content').value;
                        if (!content.trim()) {
                            showTips('请填写反馈内容！');
                            return;
                        }
                        showTips('反馈提交成功，感谢您的宝贵意见！');
                        document.getElementById('feedback-form').reset();
                    });
                }
                feedbackDiv.style.display = 'block';
            }
        });
    }
    
    // 赞助按钮
    const sponsorBtn = document.querySelector('.button2.zangzhu');
    if (sponsorBtn) {
        sponsorBtn.addEventListener('click', function() {
            showPopup();
            // 显示赞助商页面
            const popup = document.querySelector('.popup');
            if (popup) {
                popup.querySelectorAll('div').forEach(div => {
                    div.style.display = 'none';
                });
                const zzbDiv = popup.querySelector('.zzb');
                if (zzbDiv) {
                    zzbDiv.style.display = 'block';
                }
            }
        });
    }
    
    // QQ群按钮
    const qqGroupBtn = document.querySelector('.button2.qqqun');
    if (qqGroupBtn) {
        qqGroupBtn.addEventListener('click', function() {
            showTips('QQ群号：请联系管理员获取');
        });
    }
    
    // 协管按钮
    const adminBtn = document.querySelector('.button2.xieguan');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            // 跳转到管理员页面
            window.location.href = 'admin.html';
        });
    }
    
    // 关闭弹窗按钮
    const closePopupBtn = document.querySelector('.popup .icon');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            hidePopup();
        });
    }
    
    // 创建三个主要内容区域：默认首页、服务器信息页面和社区活动页面
    let currentPage = 0; // 0: 默认首页, 1: 服务器信息页面, 2: 社区活动页面
    
    // 恢复为原始的页面切换逻辑
    function switchToPage(pageIndex) {
        console.log('尝试切换到页面:', pageIndex);
        
        // 获取内容区域
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        // 确保页面索引有效
        if (pageIndex < 0) pageIndex = 0;
        if (pageIndex > 2) pageIndex = 2;
        
        currentPage = pageIndex;
        
        // 显示对应的页面内容
        const pages = [
            document.querySelector('.home-content'),
            document.querySelector('.server-info-content'),
            document.querySelector('.community-content')
        ];
        
        // 隐藏所有页面
        pages.forEach(page => {
            if (page) page.style.display = 'none';
        });
        
        // 显示选中的页面
        if (pages[pageIndex]) {
            pages[pageIndex].style.display = 'block';
        }
        
        // 显示提示信息
        if (pageIndex === 0) {
            showTips('已返回首页');
        } else if (pageIndex === 1) {
            showTips('已切换到服务器信息');
        } else if (pageIndex === 2) {
            showTips('已切换到社区活动');
        }
    }
    
    // 为页面添加返回首页按钮
    function addBackHomeButtons() {
        // 为服务器信息页面添加返回首页按钮
        const serverInfoContent = document.querySelector('.server-info-content');
        if (serverInfoContent) {
            // 检查是否已存在返回按钮
            if (!serverInfoContent.querySelector('.back-home-btn')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'back-home-btn';
                backBtn.textContent = '返回首页';
                backBtn.style.cssText = `
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                    margin: 20px auto;
                    display: block;
                `;
                
                // 添加悬停效果
                backBtn.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#45a049';
                });
                backBtn.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '#4CAF50';
                });
                
                // 添加点击事件
                backBtn.addEventListener('click', function() {
                    switchToPage(0);
                });
                
                serverInfoContent.appendChild(backBtn);
            }
        }
        
        // 为社区活动页面添加返回首页按钮
        const communityContent = document.querySelector('.community-content');
        if (communityContent) {
            // 检查是否已存在返回按钮
            if (!communityContent.querySelector('.back-home-btn')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'back-home-btn';
                backBtn.textContent = '返回首页';
                backBtn.style.cssText = `
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                    margin: 20px auto;
                    display: block;
                `;
                
                // 添加悬停效果
                backBtn.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#45a049';
                });
                backBtn.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '#4CAF50';
                });
                
                // 添加点击事件
                backBtn.addEventListener('click', function() {
                    switchToPage(0);
                });
                
                communityContent.appendChild(backBtn);
            }
        }
    }
    
    // 设置返回首页按钮
    function setupBackButtons() {
        // 先添加返回按钮
        addBackHomeButtons();
        
        // 绑定事件
        const backButtons = document.querySelectorAll('.back-home-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                switchToPage(0);
            });
        });
    }
    
    // 在页面导航上添加信息按钮和活动按钮
    function addNavButtons() {
        // 获取导航容器
        const navContainer = document.querySelector('.nav-container') || document.querySelector('.navigation') || document.querySelector('nav');
        
        if (!navContainer) {
            console.log('未找到导航容器');
            return;
        }
        
        // 创建信息按钮
        const infoButton = document.createElement('button');
        infoButton.className = 'nav-button server-info-btn';
        infoButton.innerText = '服务器信息';
        infoButton.style.margin = '0 5px';
        infoButton.style.padding = '8px 16px';
        infoButton.style.backgroundColor = '#4CAF50';
        infoButton.style.color = 'white';
        infoButton.style.border = 'none';
        infoButton.style.borderRadius = '4px';
        infoButton.style.cursor = 'pointer';
        infoButton.style.fontSize = '14px';
        
        // 创建活动按钮
        const eventButton = document.createElement('button');
        eventButton.className = 'nav-button community-btn';
        eventButton.innerText = '社区活动';
        eventButton.style.margin = '0 5px';
        eventButton.style.padding = '8px 16px';
        eventButton.style.backgroundColor = '#2196F3';
        eventButton.style.color = 'white';
        eventButton.style.border = 'none';
        eventButton.style.borderRadius = '4px';
        eventButton.style.cursor = 'pointer';
        eventButton.style.fontSize = '14px';
        
        // 添加悬停效果
        [infoButton, eventButton].forEach(button => {
            button.addEventListener('mouseover', function() {
                this.style.opacity = '0.8';
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'all 0.3s ease';
            });
            
            button.addEventListener('mouseout', function() {
                this.style.opacity = '1';
                this.style.transform = 'translateY(0)';
            });
        });
        
        // 添加点击事件
        infoButton.addEventListener('click', function() {
            switchToPage(1); // 切换到服务器信息页面
        });
        
        eventButton.addEventListener('click', function() {
            switchToPage(2); // 切换到社区活动页面
        });
        
        // 添加到导航容器
        navContainer.appendChild(infoButton);
        navContainer.appendChild(eventButton);
    }
    
    // 设置页面导航按钮
    function setupNavButtons() {
        // 首先添加新的导航按钮
        addNavButtons();
        
        // 为所有导航按钮添加事件监听
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                // 特殊处理服务器信息和社区活动按钮
                if (button.classList.contains('server-info-btn')) {
                    switchToPage(1);
                } else if (button.classList.contains('community-btn')) {
                    switchToPage(2);
                } else {
                    switchToPage(index);
                }
            });
        });
        
        // 保留原有的导航按钮功能
        const serverInfoBtn = document.querySelector('.server-info-btn');
        const communityBtn = document.querySelector('.community-btn');
        
        if (serverInfoBtn) {
            serverInfoBtn.addEventListener('click', function() {
                switchToPage(1);
            });
        }
        
        if (communityBtn) {
            communityBtn.addEventListener('click', function() {
                switchToPage(2);
            });
        }
    }
    
    // 左右滑动按钮
    const leftBtn = document.querySelector('.qyz');
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化导航按钮
        setupNavButtons();
        
        // 初始化返回按钮
        setupBackButtons();
        
        // 默认显示首页
        const homeContent = document.querySelector('.home-content');
        if (homeContent) {
            homeContent.style.display = 'block';
        }
        
        // 隐藏其他页面
        const serverInfoContent = document.querySelector('.server-info-content');
        const communityContent = document.querySelector('.community-content');
        if (serverInfoContent) serverInfoContent.style.display = 'none';
        if (communityContent) communityContent.style.display = 'none';
    })
    
    // 下载按钮图标
    const downloadIcon = document.querySelector('.xz');
    if (downloadIcon) {
        downloadIcon.addEventListener('click', function() {
            // 触发下载按钮的点击事件
            const downloadBtn = document.querySelector('.button2.download');
            if (downloadBtn) {
                downloadBtn.click();
            } else {
                showTips('请使用下方的下载按钮');
            }
        });
    }
    
    // 初始化主题设置
    initTheme();
});

// 显示弹窗
function showPopup() {
    const masking = document.querySelector('.masking');
    const popup = document.querySelector('.popup');
    
    if (masking && popup) {
        masking.style.display = 'flex';
        
        // 默认显示服务器查询
        popup.querySelectorAll('div').forEach(div => {
            div.style.display = 'none';
        });
        
        const fwqcxDiv = document.getElementById('fwqcx');
        if (fwqcxDiv) {
            fwqcxDiv.style.display = 'flex';
        }
    }
}

// 隐藏弹窗
function hidePopup() {
    const masking = document.querySelector('.masking');
    if (masking) {
        masking.style.display = 'none';
    }
}

// 显示提示信息
function showTips(message) {
    const tips = document.querySelector('.tips');
    
    if (tips) {
        tips.textContent = message;
        tips.style.opacity = '1';
        
        // 3秒后自动隐藏
        setTimeout(function() {
            tips.style.opacity = '0';
        }, 3000);
    } else {
        // 如果没有tips元素，创建一个
        const newTips = document.createElement('div');
        newTips.className = 'tips';
        newTips.textContent = message;
        newTips.style.position = 'fixed';
        newTips.style.top = '50%';
        newTips.style.left = '50%';
        newTips.style.transform = 'translate(-50%, -50%)';
        newTips.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        newTips.style.color = 'white';
        newTips.style.padding = '10px 20px';
        newTips.style.borderRadius = '5px';
        newTips.style.zIndex = '1000';
        newTips.style.opacity = '1';
        newTips.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(newTips);
        
        // 3秒后自动隐藏并移除
        setTimeout(function() {
            newTips.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(newTips);
            }, 300);
        }, 3000);
    }
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        if (savedTheme === 'auto') {
            autoTheme();
        } else if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    } else {
        // 默认自动主题
        autoTheme();
    }
    
    // 初始化简洁模式
    const savedConcise = localStorage.getItem('concise-mode');
    if (savedConcise === 'true') {
        document.body.classList.add('concise-mode');
        // 更新简洁模式图标
        const conciseBtn = document.querySelector('.concise');
        if (conciseBtn) {
            const svg = conciseBtn.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path) {
                    path.setAttribute('fill', '#3498db');
                }
            }
        }
    }
}

// 自动切换主题
function autoTheme() {
    const hour = new Date().getHours();
    // 晚上8点到早上6点使用暗色主题
    if (hour >= 20 || hour < 6) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// 切换音乐播放状态
function toggleMusic() {
    // 音乐功能的模拟实现
    const isPlaying = document.body.classList.toggle('music-playing');
    
    if (isPlaying) {
        showTips('音乐播放中');
    } else {
        showTips('音乐已暂停');
    }
}