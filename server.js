// Node.js服务器 - 处理网易云音乐API
const express = require('express');
const cors = require('cors');
const request = require('request');
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 静态文件服务

// 日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()} - ${req.method} ${req.url}`);
    next();
});

// 网易云音乐API配置
const neteaseBaseURL = 'http://music.163.com/api';
const neteaseSearchURL = 'http://music.163.com/api/search/get';
const neteaseSongURL = 'http://music.163.com/api/song/enhance/player/url';
const neteasePlaylistURL = 'http://music.163.com/api/playlist/detail';
const neteaseAlbumURL = 'http://music.163.com/api/album';

// 模拟浏览器的请求头，避免被网易云API拒绝
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': 'http://music.163.com/',
    'Cookie': '_ntes_nnid=5a61a1d2cf08e820e42f6a370b6c144d,1624075597391; _ntes_nuid=5a61a1d2cf08e820e42f6a370b6c144d; NMTID=00O5mC2wQ1bOYlR1y224iI3FkGqL8gAAAGD8d2B9w; WNMCID=juxyqq.1624075598031.01.0; playerid=94583171'
};

// 搜索音乐接口
app.get('/api/search', (req, res) => {
    try {
        const { keywords, type = 1, limit = 30 } = req.query;
        
        if (!keywords) {
            return res.json({ code: 400, message: '缺少搜索关键词' });
        }

        const options = {
            url: `${neteaseSearchURL}?s=${encodeURIComponent(keywords)}&type=${type}&limit=${limit}`,
            headers: headers,
            json: true
        };

        request(options, (error, response, body) => {
            try {
                if (error) {
                    console.error('搜索请求失败:', error);
                    return res.json({ code: 500, message: '搜索失败', error: error.message });
                }
                
                if (response.statusCode !== 200) {
                    console.error(`搜索请求状态码异常: ${response.statusCode}`);
                    return res.json({ code: 500, message: '搜索失败', error: `HTTP ${response.statusCode}` });
                }
                
                if (!body || !body.result) {
                    return res.json({ code: 500, message: '搜索结果格式异常' });
                }
                
                // 格式化返回数据
                const result = {
                    result: {
                        songs: body.result.songs ? body.result.songs.map(song => ({
                            id: song.id,
                            name: song.name,
                            artists: song.artists.map(ar => ({ id: ar.id, name: ar.name })),
                            album: { id: song.album.id, name: song.album.name, picUrl: `https://p2.music.126.net/${song.album.pic_str || 'default'}/346777342.jpg` },
                            dt: song.duration,
                            al: {
                                id: song.album.id,
                                name: song.album.name,
                                picUrl: `https://p2.music.126.net/${song.album.pic_str || 'default'}/346777342.jpg`
                            },
                            ar: song.artists.map(ar => ({ id: ar.id, name: ar.name }))
                        })) : [],
                        playlists: body.result.playlists || [],
                        albums: body.result.albums || []
                    }
                };
                
                res.json(result);
            } catch (err) {
                console.error('搜索响应处理异常:', err);
                res.json({ code: 500, message: '搜索处理失败', error: err.message });
            }
        });
    } catch (err) {
        console.error('搜索接口异常:', err);
        res.json({ code: 500, message: '服务器内部错误', error: err.message });
    }
});

// 获取歌曲URL接口
app.get('/api/song/url', (req, res) => {
    try {
        const { id, br = 999000 } = req.query; // br=999000 表示最高音质
        
        if (!id) {
            return res.json({ code: 400, message: '缺少歌曲ID' });
        }

        const options = {
            url: `${neteaseSongURL}?id=${id}&br=${br}`,
            headers: headers,
            json: true
        };

        request(options, (error, response, body) => {
            try {
                if (error) {
                    console.error('获取歌曲URL失败:', error);
                    return res.json({ code: 500, message: '获取歌曲URL失败', error: error.message });
                }
                
                if (response.statusCode !== 200) {
                    console.error(`获取歌曲URL状态码异常: ${response.statusCode}`);
                    return res.json({ code: 500, message: '获取歌曲URL失败', error: `HTTP ${response.statusCode}` });
                }
                
                res.json({ data: body.data || [] });
            } catch (err) {
                console.error('歌曲URL响应处理异常:', err);
                res.json({ code: 500, message: '处理歌曲URL失败', error: err.message });
            }
        });
    } catch (err) {
        console.error('歌曲URL接口异常:', err);
        res.json({ code: 500, message: '服务器内部错误', error: err.message });
    }
});

// 获取歌单详情接口
app.get('/api/playlist/detail', (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.json({ code: 400, message: '缺少歌单ID' });
        }

        const options = {
            url: `${neteasePlaylistURL}?id=${id}`,
            headers: headers,
            json: true
        };

        request(options, (error, response, body) => {
            try {
                if (error) {
                    console.error('获取歌单详情失败:', error);
                    return res.json({ code: 500, message: '获取歌单详情失败', error: error.message });
                }
                
                if (response.statusCode !== 200) {
                    console.error(`获取歌单详情状态码异常: ${response.statusCode}`);
                    return res.json({ code: 500, message: '获取歌单详情失败', error: `HTTP ${response.statusCode}` });
                }
                
                if (!body || !body.playlist) {
                    return res.json({ code: 500, message: '歌单详情格式异常' });
                }
                
                // 格式化返回数据
                const result = {
                    playlist: {
                        tracks: body.playlist.tracks ? body.playlist.tracks.map(song => ({
                            id: song.id,
                            name: song.name,
                            ar: song.artists.map(ar => ({ id: ar.id, name: ar.name })),
                            al: {
                                id: song.album.id,
                                name: song.album.name,
                                picUrl: `https://p2.music.126.net/${song.album.pic_str || 'default'}/346777342.jpg`
                            },
                            dt: song.duration
                        })) : []
                    }
                };
                
                res.json(result);
            } catch (err) {
                console.error('歌单详情响应处理异常:', err);
                res.json({ code: 500, message: '处理歌单详情失败', error: err.message });
            }
        });
    } catch (err) {
        console.error('歌单详情接口异常:', err);
        res.json({ code: 500, message: '服务器内部错误', error: err.message });
    }
});

// 获取专辑详情接口
app.get('/api/album', (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.json({ code: 400, message: '缺少专辑ID' });
        }

        const options = {
            url: `${neteaseAlbumURL}?id=${id}`,
            headers: headers,
            json: true
        };

        request(options, (error, response, body) => {
            try {
                if (error) {
                    console.error('获取专辑详情失败:', error);
                    return res.json({ code: 500, message: '获取专辑详情失败', error: error.message });
                }
                
                if (response.statusCode !== 200) {
                    console.error(`获取专辑详情状态码异常: ${response.statusCode}`);
                    return res.json({ code: 500, message: '获取专辑详情失败', error: `HTTP ${response.statusCode}` });
                }
                
                if (!body || !body.album) {
                    return res.json({ code: 500, message: '专辑详情格式异常' });
                }
                
                // 格式化返回数据
                const result = {
                    album: {
                        name: body.album.name,
                        picUrl: `https://p2.music.126.net/${body.album.pic_str || 'default'}/346777342.jpg`
                    },
                    songs: body.songs ? body.songs.map(song => ({
                        id: song.id,
                        name: song.name,
                        ar: song.artists.map(ar => ({ id: ar.id, name: ar.name })),
                        dt: song.duration
                    })) : []
                };
                
                res.json(result);
            } catch (err) {
                console.error('专辑详情响应处理异常:', err);
                res.json({ code: 500, message: '处理专辑详情失败', error: err.message });
            }
        });
    } catch (err) {
        console.error('专辑详情接口异常:', err);
        res.json({ code: 500, message: '服务器内部错误', error: err.message });
    }
});

// 创建package.json内容
function createPackageJson() {
    const fs = require('fs');
    const packageJson = {
        "name": "netease-music-api",
        "version": "1.0.0",
        "description": "网易云音乐API代理服务",
        "main": "server.js",
        "scripts": {
            "start": "node server.js",
            "dev": "nodemon server.js"
        },
        "dependencies": {
            "express": "^4.17.1",
            "cors": "^2.8.5",
            "request": "^2.88.2"
        },
        "devDependencies": {
            "nodemon": "^2.0.12"
        }
    };
    
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('package.json 创建成功');
}

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', error: err.message });
});

// 专门为loading.html添加路由
app.get('/loading.html', (req, res) => {
    res.sendFile(__dirname + '/loading.html');
});

// 404处理
app.use((req, res) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({ code: 404, message: '接口不存在' });
    } else {
        res.status(404).sendFile(__dirname + '/index.html');
    }
});

// 启动服务器
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`服务器启动成功！`);
    console.log(`运行地址: http://localhost:${PORT}`);
    console.log(`====================================`);
    console.log('API接口：');
    console.log('- GET /api/search?keywords=关键词&type=类型');
    console.log('- GET /api/song/url?id=歌曲ID');
    console.log('- GET /api/playlist/detail?id=歌单ID');
    console.log('- GET /api/album?id=专辑ID');
    console.log(`====================================`);
}).on('error', (err) => {
    console.error('服务器启动失败:', err);
    process.exit(1);
});

// 优雅退出处理
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n正在关闭服务器...');
    process.exit(0);
});

// 检查是否存在package.json，如果不存在则创建
const fs = require('fs');
if (!fs.existsSync('./package.json')) {
    createPackageJson();
}