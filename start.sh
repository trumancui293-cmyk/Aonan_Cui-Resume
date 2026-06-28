#!/bin/bash
cd "$(dirname "$0")"
PORT=8080

# 若 8080 被占用，尝试 8081
if lsof -i :$PORT >/dev/null 2>&1; then
  PORT=8081
fi

echo "正在启动个人主页..."
echo "请在浏览器打开: http://127.0.0.1:$PORT"
echo "按 Ctrl+C 可停止服务器"
echo ""

open "http://127.0.0.1:$PORT" 2>/dev/null || true
python3 -m http.server $PORT
