<?php
// 设置响应头
header('Content-Type: application/json');

// 简单的登录状态验证
// 在实际生产环境中，应该使用session或更安全的验证方式
$headers = getallheaders();
$authToken = isset($headers['Auth-Token']) ? $headers['Auth-Token'] : '';

// 这里使用简单的token验证，实际环境中应该更复杂
if ($authToken !== 'kskfwq_admin_token') {
    echo json_encode(['success' => false, 'message' => '未授权访问']);
    exit;
}

// 检查是否是POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => '只允许POST请求']);
    exit;
}

// 检查是否有文件上传
if (!isset($_FILES['logo'])) {
    echo json_encode(['success' => false, 'message' => '没有文件上传']);
    exit;
}

// 获取文件信息
$file = $_FILES['logo'];
$uploadDir = 'img/';
$uploadFile = $uploadDir . 'logo.png';

// 检查文件类型
$fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if ($fileType !== 'png') {
    echo json_encode(['success' => false, 'message' => '只允许PNG格式的图片']);
    exit;
}

// 检查文件大小（限制为2MB）
if ($file['size'] > 2 * 1024 * 1024) {
    echo json_encode(['success' => false, 'message' => '文件大小不能超过2MB']);
    exit;
}

// 确保上传目录存在
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 移动上传的文件
if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
    echo json_encode(['success' => true, 'message' => 'Logo更新成功']);
} else {
    echo json_encode(['success' => false, 'message' => '文件上传失败，请检查权限']);
}