#!/usr/bin/env node

// Script tối ưu cho thiết bị Android RAM thấp
const { spawn } = require('child_process');

console.log('🚀 Khởi động Vina AI cho thiết bị Android RAM thấp...');

// Thiết lập môi trường tối ưu
process.env.NODE_OPTIONS = '--max-old-space-size=1024'; // Giới hạn RAM
process.env.NEXT_TELEMETRY_DISABLED = '1'; // Tắt telemetry
process.env.NODE_ENV = 'development';

// Khởi động Next.js với cấu hình tối ưu
const nextProcess = spawn('npx', ['next', 'dev', '--port', '3000', '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  env: process.env
});

nextProcess.on('error', (err) => {
  console.error('❌ Lỗi khởi động:', err);
});

nextProcess.on('exit', (code) => {
  console.log(`🔄 Ứng dụng đã dừng với code: ${code}`);
});

// Xử lý tín hiệu để dừng ứng dụng
process.on('SIGINT', () => {
  console.log('\n📱 Đang dừng ứng dụng...');
  nextProcess.kill('SIGINT');
});

console.log(`
📱 Vina AI đang chạy tại:
   Local:   http://localhost:3000
   Network: http://0.0.0.0:3000

💡 Mẹo cho Android RAM 2GB:
   - Đóng các app khác để tăng RAM
   - Sử dụng Chrome Lite nếu có thể
   - Nếu lag, restart lại script này
`);