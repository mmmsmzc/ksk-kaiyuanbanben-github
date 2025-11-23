// 处理网站音乐播放功能 - 内置音乐版
console.log('Music script loaded');

// 音乐资源基础路径
const MUSIC_BASE_PATH = 'music/';

// 音乐播放器对象
let musicPlayer = {
    audio: null,
    isPlaying: false,
    volume: 0.3,
    currentSong: null,
    currentPlaylist: [],
    currentIndex: -1,
    playlists: [],
    showMusicPanel: false,
    isShuffle: false,
    repeatMode: 'none', // none, one, all
    searchHistory: [] // 初始化搜索历史为空数组
};

// 确保页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化音乐播放器
    initMusicPlayer();
    
    // 创建音乐面板
    createMusicPanel();
    
    // 绑定音乐控制按钮事件
    const musicBtn = document.querySelector('.music');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusicPanel);
    }
    
    // 从本地存储加载音乐设置
    loadMusicSettings();
    
    // 加载本地音乐配置
    loadLocalMusic();
});

// 加载本地音乐配置文件
function loadLocalMusic() {
    console.log('开始加载音乐配置...');
    fetch(MUSIC_BASE_PATH + 'music-list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载音乐配置文件');
            }
            return response.json();
        })
        .then(data => {
            console.log('音乐配置加载成功:', data);
            musicPlayer.playlists = data.playlists || [];
            
            // 如果有播放列表，默认加载第一个
            if (musicPlayer.playlists.length > 0) {
                musicPlayer.currentPlaylist = musicPlayer.playlists[0].songs || [];
                console.log('当前播放列表:', musicPlayer.currentPlaylist);
                // 确保DOM已加载完成再更新UI
                setTimeout(() => {
                    updatePlaylistUI();
                }, 100);
                showTips('音乐加载完成');
            } else {
                showTips('没有找到音乐文件，请检查配置');
            }
        })
        .catch(error => {
            console.error('加载音乐配置失败:', error);
            showTips('音乐配置加载失败');
        });
}

// 播放指定索引的音乐函数已在下方完整实现，此处省略

// 初始化音乐播放器
function initMusicPlayer() {
    // 创建音频元素
    musicPlayer.audio = document.createElement('audio');
    musicPlayer.audio.volume = musicPlayer.volume;
    
    // 添加事件监听器
    musicPlayer.audio.addEventListener('ended', function() {
        // 播放下一首
        playNext();
    });
    
    musicPlayer.audio.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        showTips('音乐加载失败');
    });
    
    musicPlayer.audio.addEventListener('canplay', function() {
        // 音乐可以播放了
        updateMusicInfo();
    });
    
    // 将音频元素添加到文档中
    document.body.appendChild(musicPlayer.audio);
}

// 创建音乐面板
function createMusicPanel() {
    // 创建音乐面板容器
    const musicPanel = document.createElement('div');
    musicPanel.id = 'musicPanel';
    musicPanel.className = 'music-panel';
    
    // 设置面板样式
    musicPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        max-height: 500px;
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        z-index: 999;
        overflow: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform: translateY(100%);
        opacity: 0;
        display: none;
    `;
    
    // 面板内容
    musicPanel.innerHTML = `
        <div class="music-header" style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px; color: #333;">内置音乐播放器</h3>
            <button class="music-close" style="background: none; border: none; cursor: pointer; font-size: 20px; color: #999;">×</button>
        </div>
        
        <div class="music-search" style="padding: 15px; border-bottom: 1px solid #eee;">
            <div style="display: flex; gap: 10px;">
                <input type="text" id="musicSearchInput" placeholder="搜索歌曲或歌手" 
                       style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; outline: none;">
                <button id="musicSearchBtn" style="padding: 8px 16px; background-color: #3498db; color: white; border: none; border-radius: 20px; cursor: pointer;">搜索</button>
            </div>
        </div>
        
        <div class="music-info" style="padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
            <img id="musicCover" src="img/logo.png" alt="专辑封面" style="width: 180px; height: 180px; border-radius: 10px; margin-bottom: 15px;">
            <h4 id="musicTitle" style="margin: 0 0 10px 0; font-size: 16px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">未播放</h4>
            <p id="musicArtist" style="margin: 0; font-size: 14px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">--</p>
        </div>
        
        <div class="music-progress" style="padding: 15px; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #999;">
                <span id="currentTime">00:00</span>
                <span id="totalTime">00:00</span>
            </div>
            <div class="progress-bar" style="width: 100%; height: 4px; background-color: #eee; border-radius: 2px; cursor: pointer;">
                <div class="progress" style="width: 0; height: 100%; background-color: #3498db; border-radius: 2px;"></div>
            </div>
        </div>
        
        <div class="music-controls" style="padding: 15px; display: flex; justify-content: center; align-items: center; gap: 20px; border-bottom: 1px solid #eee;">
            <button id="playPrevious" class="music-btn" title="上一首">
                <svg width="24" height="24" viewBox="0 0 1024 1024" fill="#333">
                    <path d="M768 480L256 224v576l512-288z m-668.8 64a48 48 0 0 0 0 96h149.76l-42.56 42.56a48 48 0 0 0 67.84 67.84l140.8-140.8a48 48 0 0 0 0-67.84L274.24 329.6a48 48 0 0 0-67.84 67.84L248.96 480H99.2z"></path>
                </svg>
            </button>
            <button id="playToggle" class="music-btn play-btn" title="播放/暂停">
                <svg id="playIcon" width="32" height="32" viewBox="0 0 1024 1024" fill="#333">
                    <path d="M256 144v736l512-368z"></path>
                </svg>
                <svg id="pauseIcon" width="32" height="32" viewBox="0 0 1024 1024" fill="#333" style="display: none;">
                    <path d="M384 144v736h128V144H384zm256 0v736h128V144H640z"></path>
                </svg>
            </button>
            <button id="playNext" class="music-btn" title="下一首">
                <svg width="24" height="24" viewBox="0 0 1024 1024" fill="#333">
                    <path d="M256 480l512-256v512zM255.2 544a48 48 0 0 0 0-96H105.44l42.56-42.56a48 48 0 0 0-67.84-67.84L32 329.6a48 48 0 0 0 0 67.84l140.8 140.8a48 48 0 0 0 67.84-67.84L248.96 544H255.2z"></path>
                </svg>
            </button>
        </div>
        
        <div class="music-volume" style="padding: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #eee;">
            <svg width="20" height="20" viewBox="0 0 1024 1024" fill="#333">
                <path d="M768 448q-14 0-23.5-9.5t-9.5-23.5v-96q0-14 9.5-23.5t23.5-9.5s23.5 9.5 23.5 23.5v96q0 14-9.5 23.5t-23.5 9.5zM832 448q-14 0-23.5-9.5t-9.5-23.5v-96q0-14 9.5-23.5t23.5-9.5s23.5 9.5 23.5 23.5v96q0 14-9.5 23.5t-23.5 9.5zM912 480L624 292v436zM601.6 179.2l-140.8 80q-44.8-35.2-96-35.2-83.2 0-140.8 57.6t-57.6 140.8 57.6 140.8 140.8 57.6q51.2 0 96-35.2l140.8 80q-54.4 41.6-121.6 41.6-118.4 0-204.8-86.4t-86.4-204.8 86.4-204.8 204.8-86.4q67.2 0 121.6 41.6z"></path>
            </svg>
            <div class="volume-bar" style="flex: 1; height: 4px; background-color: #eee; border-radius: 2px; cursor: pointer;">
                <div class="volume" style="width: 30%; height: 100%; background-color: #3498db; border-radius: 2px;"></div>
            </div>
        </div>
        
        <div class="music-content" style="max-height: 200px; overflow-y: auto; padding: 10px;">
            <div id="playlistContainer" style="display: block;">
                <h5 style="margin: 10px 0; font-size: 14px; color: #666;">播放列表</h5>
                <ul id="playlistList" style="list-style: none; padding: 0; margin: 0;"></ul>
            </div>
            <div id="searchResults" style="display: none;">
                <h5 style="margin: 10px 0; font-size: 14px; color: #666;">搜索结果</h5>
                <ul id="resultsList" style="list-style: none; padding: 0; margin: 0;"></ul>
            </div>
        </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(musicPanel);
    
    // 绑定面板事件
    bindMusicPanelEvents();
}

// 绑定音乐面板事件
function bindMusicPanelEvents() {
    console.log('开始绑定音乐面板事件');
    // 获取DOM元素
    const panel = document.getElementById('musicPanel');
    const closeBtn = document.querySelector('.music-close');
    const searchBtn = document.getElementById('musicSearchBtn');
    const searchInput = document.getElementById('musicSearchInput');
    const playToggle = document.getElementById('playToggle');
    const playPreviousBtn = document.getElementById('playPrevious');
    const playNextBtn = document.getElementById('playNext');
    const progressBar = document.querySelector('.progress-bar');
    const volumeBar = document.querySelector('.volume-bar');
    
    // 关闭面板
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMusicPanel);
    }
    
    // 搜索
    if (searchBtn && searchInput) {
        console.log('绑定搜索按钮事件');
        searchBtn.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            console.log('搜索按钮点击，关键词:', keyword);
            if (keyword) {
                searchMusic(keyword);
            }
        });
        
        // 回车搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('回车触发搜索');
                const keyword = this.value.trim();
                if (keyword) {
                    searchMusic(keyword);
                }
            }
        });
    }
    
    // 播放/暂停
    if (playToggle) {
        playToggle.addEventListener('click', togglePlay);
    }
    
    // 上一首 - 修复递归调用问题
    if (playPreviousBtn) {
        playPreviousBtn.addEventListener('click', function() {
            if (typeof playPrevious === 'function') {
                playPrevious();
            }
        });
    }
    
    // 下一首 - 修复递归调用问题
    if (playNextBtn) {
        playNextBtn.addEventListener('click', function() {
            if (typeof playNext === 'function') {
                playNext();
            }
        });
    }
    
    // 进度条点击
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (musicPlayer.audio) {
                musicPlayer.audio.currentTime = pos * musicPlayer.audio.duration;
            }
        });
    }
    
    // 音量调节
    if (volumeBar) {
        volumeBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (typeof setVolume === 'function') {
                setVolume(pos);
            }
        });
    }
    
    // 音频时间更新
    if (musicPlayer.audio) {
        musicPlayer.audio.addEventListener('timeupdate', function() {
            if (typeof updateProgress === 'function') {
                updateProgress();
            }
        });
    }
}

// 切换音乐面板显示
function toggleMusicPanel() {
    const panel = document.getElementById('musicPanel');
    const isVisible = panel.style.display === 'block';
    
    if (isVisible) {
        // 隐藏面板
        panel.style.transform = 'translateY(100%)';
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
        musicPlayer.showMusicPanel = false;
    } else {
        // 显示面板
        panel.style.display = 'block';
        setTimeout(() => {
            panel.style.transform = 'translateY(0)';
            panel.style.opacity = '1';
        }, 10);
        musicPlayer.showMusicPanel = true;
    }
    
    // 保存面板状态
    localStorage.setItem('musicPanelVisible', musicPlayer.showMusicPanel);
}

// 切换播放状态
function togglePlay() {
    if (musicPlayer.isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
    
    // 保存播放状态
    saveMusicSettings();
}

// 播放音乐
function playMusic() {
    if (!musicPlayer.currentSong && musicPlayer.currentPlaylist.length > 0) {
        // 如果没有当前歌曲但有播放列表，播放第一首
        playSongByIndex(0);
        return;
    }
    
    if (musicPlayer.audio) {
        musicPlayer.audio.play().then(() => {
            musicPlayer.isPlaying = true;
            updatePlayButton();
            updateMusicButton();
        }).catch(error => {
            console.error('播放失败:', error);
            showTips('播放失败，请稍后重试');
        });
    }
}

// 暂停音乐
function pauseMusic() {
    if (musicPlayer.audio) {
        musicPlayer.audio.pause();
        musicPlayer.isPlaying = false;
        updatePlayButton();
        updateMusicButton();
    }
}

// 播放指定索引的歌曲
function playSongByIndex(index) {
    if (index >= 0 && index < musicPlayer.currentPlaylist.length) {
        musicPlayer.currentIndex = index;
        const song = musicPlayer.currentPlaylist[index];
        
        // 使用本地文件，对文件名进行URL编码以支持中文字符
        musicPlayer.currentSong = song;
        musicPlayer.audio.src = MUSIC_BASE_PATH + encodeURIComponent(song.file);
        musicPlayer.audio.load();
        musicPlayer.audio.play().then(() => {
            musicPlayer.isPlaying = true;
            updatePlayButton();
            updateMusicButton();
            updateMusicInfo();
            updatePlaylistUI();
            showTips(`正在播放: ${song.name} - ${song.artist}`);
        }).catch(error => {
            console.error('播放失败:', error);
            showTips('播放失败，请检查文件路径');
        });
    }
}

// 播放上一首
function playPrevious() {
    if (musicPlayer.currentPlaylist.length === 0) return;
    
    let index = musicPlayer.currentIndex - 1;
    if (index < 0) {
        index = musicPlayer.currentPlaylist.length - 1;
    }
    playSongByIndex(index);
}

// 播放下一首
function playNext() {
    if (musicPlayer.currentPlaylist.length === 0) return;
    
    let index = musicPlayer.currentIndex + 1;
    if (index >= musicPlayer.currentPlaylist.length) {
        index = 0;
    }
    playSongByIndex(index);
}

// 搜索音乐
function searchMusic(keyword) {
    console.log('执行搜索:', keyword);
    showTips('搜索中...');
    
    // 检查播放列表是否存在
    if (!musicPlayer.currentPlaylist || musicPlayer.currentPlaylist.length === 0) {
        showTips('播放列表为空，无法搜索');
        return;
    }
    
    // 在本地播放列表中搜索
    const results = musicPlayer.currentPlaylist.filter(song => 
        (song.name && song.name.toLowerCase().includes(keyword.toLowerCase())) ||
        (song.artist && song.artist.toLowerCase().includes(keyword.toLowerCase())) ||
        (song.album && song.album.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    // 更新搜索结果UI
    showSearchResults(results);
    
    if (results.length > 0) {
        showTips(`找到 ${results.length} 首歌曲`);
    } else {
        showTips('未找到相关歌曲');
    }
}

// 由于使用本地音乐，这些API函数不再需要
// function getSongUrl(songId) { ... }
// function getPlaylistDetail(playlistId) { ... }
// function getAlbumDetail(albumId) { ... }

// 显示搜索结果
function showSearchResults(results) {
    console.log('显示搜索结果:', results);
    // 添加DOM元素存在性检查
    const resultsList = document.getElementById('resultsList');
    const searchResultsDiv = document.getElementById('searchResults');
    const playlistContainer = document.getElementById('playlistContainer');
    
    // 检查必要DOM元素是否存在
    if (!resultsList || !searchResultsDiv || !playlistContainer) {
        console.error('搜索结果UI元素未找到');
        return;
    }
    
    resultsList.innerHTML = '';
    searchResultsDiv.style.display = 'block';
    playlistContainer.style.display = 'none';
    
    if (!results || results.length === 0) {
        resultsList.innerHTML = '<li style="padding: 10px; color: #999; text-align: center;">未找到相关歌曲</li>';
        return;
    }
    
    results.forEach((song, index) => {
        const li = document.createElement('li');
        li.style.cssText = `
            padding: 10px;
            margin-bottom: 5px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s ease;
        `;
        li.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        li.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // 点击播放歌曲
        li.addEventListener('click', function() {
            // 设置当前歌曲并播放
            musicPlayer.currentSong = song;
            musicPlayer.currentIndex = musicPlayer.currentPlaylist.findIndex(s => s.name === song.name && s.artist === song.artist);
            musicPlayer.audio.src = MUSIC_BASE_PATH + encodeURIComponent(song.file);
            musicPlayer.audio.load();
            musicPlayer.audio.play().then(() => {
                musicPlayer.isPlaying = true;
                updatePlayButton();
                updateMusicButton();
                updateMusicInfo();
                showTips(`正在播放: ${song.name} - ${song.artist}`);
            }).catch(error => {
                console.error('播放失败:', error);
                showTips('播放失败，请稍后重试');
            });
        });
        
        // 双击添加到播放列表
        li.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            musicPlayer.currentPlaylist.push(song);
            updatePlaylistUI();
            showTips(`已添加到播放列表: ${song.name}`);
        });
        
        // 获取封面图片路径，如果没有封面则使用默认封面
        const coverPath = song.cover ? `music/covers/${encodeURIComponent(song.cover)}` : 'img/logo.png';
        
        li.innerHTML = `
            <div style="width: 40px; height: 40px; margin-right: 10px; border-radius: 4px; overflow: hidden;">
                <img src="${coverPath}" style="width: 100%; height: 100%; object-fit: cover;" alt="${song.name}">
            </div>
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 14px; color: #333; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${song.name}</div>
                <div style="font-size: 12px; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${song.artist} - ${song.album}</div>
            </div>
            <div style="font-size: 12px; color: #999; margin-left: 10px;">${formatTime(song.duration)}</div>
        `;
        
        resultsList.appendChild(li);
        

    });
}
// 显示歌单结果
function showPlaylistResults(playlists) {
    const resultsList = document.getElementById('resultsList');
    const searchResultsDiv = document.getElementById('searchResults');
    const playlistContainer = document.getElementById('playlistContainer');
    
    resultsList.innerHTML = '';
    searchResultsDiv.style.display = 'block';
    playlistContainer.style.display = 'none';
    
    playlists.forEach(playlist => {
        const li = document.createElement('li');
        li.style.cssText = `
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background-color 0.2s ease;
        `;
        li.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        li.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // 点击加载歌单
        li.addEventListener('click', function() {
            showTips('正在加载歌单...');
            getPlaylistDetail(playlist.id).then(songs => {
                if (songs.length > 0) {
                    musicPlayer.currentPlaylist = songs;
                    playSongByIndex(0);
                    updatePlaylistUI();
                    showTips(`已加载歌单: ${playlist.name} (${songs.length}首)`);
                } else {
                    showTips('歌单加载失败');
                }
            });
        });
        
        li.innerHTML = `
            <img src="${playlist.coverImgUrl || 'img/logo.png'}" alt="歌单封面" style="width: 50px; height: 50px; border-radius: 5px;">
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 14px; color: #333; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${playlist.name}</div>
                <div style="font-size: 12px; color: #999;">${playlist.trackCount}首歌曲 · ${playlist.playCount}次播放</div>
            </div>
        `;
        
        resultsList.appendChild(li);
    });
}

// 显示专辑结果
function showAlbumResults(albums) {
    const resultsList = document.getElementById('resultsList');
    const searchResultsDiv = document.getElementById('searchResults');
    const playlistContainer = document.getElementById('playlistContainer');
    
    resultsList.innerHTML = '';
    searchResultsDiv.style.display = 'block';
    playlistContainer.style.display = 'none';
    
    albums.forEach(album => {
        const li = document.createElement('li');
        li.style.cssText = `
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background-color 0.2s ease;
        `;
        li.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        li.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // 点击加载专辑
        li.addEventListener('click', function() {
            showTips('正在加载专辑...');
            getAlbumDetail(album.id).then(songs => {
                if (songs.length > 0) {
                    musicPlayer.currentPlaylist = songs;
                    playSongByIndex(0);
                    updatePlaylistUI();
                    showTips(`已加载专辑: ${album.name} (${songs.length}首)`);
                } else {
                    showTips('专辑加载失败');
                }
            });
        });
        
        li.innerHTML = `
            <img src="${album.picUrl || 'img/logo.png'}" alt="专辑封面" style="width: 50px; height: 50px; border-radius: 5px;">
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 14px; color: #333; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${album.name}</div>
                <div style="font-size: 12px; color: #999;">${album.artist.name}</div>
            </div>
        `;
        
        resultsList.appendChild(li);
    });
}

// 更新播放列表UI
function updatePlaylistUI() {
    // 添加DOM元素存在性检查
    const playlistList = document.getElementById('playlistList');
    const searchResultsDiv = document.getElementById('searchResults');
    const playlistContainer = document.getElementById('playlistContainer');
    
    // 检查必要DOM元素是否存在
    if (!playlistList || !searchResultsDiv || !playlistContainer) {
        console.error('播放列表UI元素未找到');
        return;
    }
    
    playlistList.innerHTML = '';
    searchResultsDiv.style.display = 'none';
    playlistContainer.style.display = 'block';
    
    // 检查播放列表是否为空
    if (!musicPlayer.currentPlaylist || musicPlayer.currentPlaylist.length === 0) {
        playlistList.innerHTML = '<li style="padding: 10px; color: #999; text-align: center;">播放列表为空</li>';
        return;
    }
    
    musicPlayer.currentPlaylist.forEach((song, index) => {
        const li = document.createElement('li');
        li.style.cssText = `
            padding: 10px;
            margin-bottom: 5px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background-color 0.2s ease;
            ${index === musicPlayer.currentIndex ? 'background-color: #e3f2fd;' : ''}
        `;
        li.addEventListener('mouseenter', function() {
            if (index !== musicPlayer.currentIndex) {
                this.style.backgroundColor = '#f5f5f5';
            }
        });
        li.addEventListener('mouseleave', function() {
            if (index !== musicPlayer.currentIndex) {
                this.style.backgroundColor = '';
            }
        });
        
        // 点击播放歌曲
        li.addEventListener('click', function() {
            playSongByIndex(index);
        });
        
        li.innerHTML = `
            <div style="width: 20px; text-align: center; font-size: 12px; color: ${index === musicPlayer.currentIndex ? '#3498db' : '#999'};">
                ${index === musicPlayer.currentIndex ? 
                    '<svg width="16" height="16" viewBox="0 0 1024 1024" fill="#3498db"><path d="M256 144v736l512-368z"></path></svg>' : 
                    (index + 1)}
            </div>
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 14px; color: #333; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${song.name}</div>
                <div style="font-size: 12px; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${song.artist || '未知艺术家'}</div>
            </div>
            <div style="font-size: 12px; color: #999;">${formatTime(song.duration)}</div>
        `;
        
        playlistList.appendChild(li);
    });
}

// 更新播放按钮
function updatePlayButton() {
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    if (musicPlayer.isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// 更新顶部音乐按钮
function updateMusicButton() {
    const musicBtn = document.querySelector('.music');
    if (musicBtn) {
        if (musicPlayer.isPlaying) {
            musicBtn.style.backgroundColor = '#e74c3c';
        } else {
            musicBtn.style.backgroundColor = '';
        }
    }
    
    // 更新body类名
    if (musicPlayer.isPlaying) {
        document.body.classList.add('music-playing');
    } else {
        document.body.classList.remove('music-playing');
    }
}

// 更新音乐信息
function updateMusicInfo() {
    if (!musicPlayer.currentSong) return;
    
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    const musicCover = document.getElementById('musicCover');
    
    if (musicTitle) musicTitle.textContent = musicPlayer.currentSong.name;
    if (musicArtist) musicArtist.textContent = musicPlayer.currentSong.artist + ' - ' + musicPlayer.currentSong.album;
    if (musicCover) {
        musicCover.src = MUSIC_BASE_PATH + 'covers/' + encodeURIComponent(musicPlayer.currentSong.cover || 'default.jpg');
    }
    
    // 更新总时长
    const totalTime = document.getElementById('totalTime');
    if (totalTime && musicPlayer.currentSong.duration) {
        totalTime.textContent = formatTime(musicPlayer.currentSong.duration);
    }
}

// 更新进度条
function updateProgress() {
    const progress = document.querySelector('.progress');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    
    if (musicPlayer.audio && !isNaN(musicPlayer.audio.duration)) {
        const percentage = (musicPlayer.audio.currentTime / musicPlayer.audio.duration) * 100;
        progress.style.width = percentage + '%';
        
        if (currentTime) {
            currentTime.textContent = formatTime(musicPlayer.audio.currentTime * 1000);
        }
        
        if (totalTime && !musicPlayer.currentSong) {
            totalTime.textContent = formatTime(musicPlayer.audio.duration * 1000);
        }
    }
}

// 格式化时间
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 设置音量
function setVolume(volume) {
    // 确保音量在0-1之间
    musicPlayer.volume = Math.max(0, Math.min(1, volume));
    musicPlayer.audio.volume = musicPlayer.volume;
    
    // 更新音量滑块
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.value = musicPlayer.volume * 100;
    }
    
    // 更新音量图标
    updateVolumeIcon();
    
    // 保存音量设置
    saveMusicSettings();
    
    // 显示提示
    showTips('音量已设置为 ' + Math.round(musicPlayer.volume * 100) + '%');
}

// 增加音量
function increaseVolume() {
    setVolume(musicPlayer.volume + 0.1);
}

// 减少音量
function decreaseVolume() {
    setVolume(musicPlayer.volume - 0.1);
}

// 更新音量图标
function updateVolumeIcon() {
    const volumeIcon = document.querySelector('.music-volume svg');
    if (!volumeIcon) return;
    
    if (musicPlayer.volume === 0) {
        volumeIcon.innerHTML = '<path d="M256 896V128l-96 64v640z"></path>';
    } else if (musicPlayer.volume < 0.5) {
        volumeIcon.innerHTML = '<path d="M256 896V128l-96 64v640zM469.333 384a160 160 0 0 1 0 256c-15.04 0-29.76-2.24-44.16-6.4L512 736v-384l86.827 38.4a160 160 0 0 1 0 256"></path>';
    } else {
        volumeIcon.innerHTML = '<path d="M256 896V128l-96 64v640zM469.333 384a160 160 0 0 1 0 256c-15.04 0-29.76-2.24-44.16-6.4L512 736v-384l86.827 38.4a160 160 0 0 1 0 256zM736 448a96 96 0 0 1 0 128c-6.72 0-13.44-0.64-20.16-1.92l77.227 43.52a192 192 0 0 0 0-189.12l-77.227 43.52A95.872 95.872 0 0 1 736 448z"></path>';
    }
}

// 切换静音
function toggleMute() {
    if (musicPlayer.volume === 0) {
        // 恢复之前的音量
        setVolume(musicPlayer.lastVolume || 0.3);
    } else {
        // 保存当前音量并静音
        musicPlayer.lastVolume = musicPlayer.volume;
        setVolume(0);
    }
}

// 设置进度条
function setProgress(percentage) {
    if (musicPlayer.audio && !isNaN(musicPlayer.audio.duration)) {
        const newTime = (percentage / 100) * musicPlayer.audio.duration;
        musicPlayer.audio.currentTime = newTime;
        updateProgress();
    }
}

// 保存音乐设置到本地存储
function saveMusicSettings() {
    try {
        const settings = {
            volume: musicPlayer.volume,
            lastVolume: musicPlayer.lastVolume,
            showMusicPanel: musicPlayer.showMusicPanel,
            searchHistory: musicPlayer.searchHistory.slice(-10) // 只保存最近10条搜索记录
        };
        
        localStorage.setItem('musicSettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save music settings:', e);
    }
}

// 从本地存储加载音乐设置
function loadMusicSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('musicSettings'));
        if (settings) {
            // 恢复音量设置
            if (typeof settings.volume === 'number') {
                musicPlayer.volume = settings.volume;
                musicPlayer.audio.volume = musicPlayer.volume;
            }
            
            // 恢复最后音量（用于静音功能）
            if (typeof settings.lastVolume === 'number') {
                musicPlayer.lastVolume = settings.lastVolume;
            }
            
            // 恢复搜索历史
            if (Array.isArray(settings.searchHistory)) {
                musicPlayer.searchHistory = settings.searchHistory;
            }
            
            // 恢复面板显示状态
            if (typeof settings.showMusicPanel === 'boolean') {
                musicPlayer.showMusicPanel = settings.showMusicPanel;
                if (musicPlayer.showMusicPanel) {
                    const panel = document.getElementById('musicPanel');
                    if (panel) {
                        panel.style.display = 'block';
                        panel.style.transform = 'translateY(0)';
                        panel.style.opacity = '1';
                    }
                }
            }
        } else {
            // 旧版设置兼容
            const savedVolume = localStorage.getItem('musicVolume');
            if (savedVolume !== null) {
                musicPlayer.volume = parseFloat(savedVolume);
                musicPlayer.audio.volume = musicPlayer.volume;
            }
        }
    } catch (e) {
        console.error('Failed to load music settings:', e);
    }
}

// 模拟音乐播放状态变化
function simulateMusicPlayback() {
    if (!musicPlayer.isPlaying) return;
    
    // 这里可以添加一些模拟的音乐可视化效果
    // 例如，创建一些动画元素来表示音乐播放
    
    // 每隔一段时间更新一次，模拟音乐正在播放
    setTimeout(function() {
        if (musicPlayer.isPlaying) {
            simulateMusicPlayback();
        }
    }, 1000);
}

// 显示提示信息的辅助函数（与clickevent.js中的函数相同）
function showTips(message) {
    // 查找或创建提示元素
    let tips = document.querySelector('.tips');
    
    if (!tips) {
        tips = document.createElement('div');
        tips.className = 'tips';
        tips.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            pointer-events: none;
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(tips);
    }
    
    tips.textContent = message;
    tips.style.opacity = '1';
    
    // 3秒后自动隐藏
    setTimeout(function() {
        tips.style.opacity = '0';
    }, 3000);
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        playMusic,
        pauseMusic,
        togglePlay,
        setVolume,
        increaseVolume,
        decreaseVolume
    };
}