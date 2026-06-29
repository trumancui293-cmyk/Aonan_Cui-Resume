#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"
REPO_NAME="Aonan_Cui-Resume"
GITHUB_USER="${GITHUB_USER:-trumancui293-cmyk}"

# 若默认 gh 配置目录不可写，改用项目内目录
if [ ! -d "${HOME}/.config/gh" ] && [ ! -w "${HOME}/.config" ] 2>/dev/null; then
  export GH_CONFIG_DIR="$(pwd)/.gh-config"
  mkdir -p "${GH_CONFIG_DIR}"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "请先安装 GitHub CLI：brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "请先登录 GitHub："
  echo "  GH_CONFIG_DIR=\"$(pwd)/.gh-config\" gh auth login"
  exit 1
fi

USERNAME="$(gh api user -q .login 2>/dev/null || echo "${GITHUB_USER}")"
REMOTE="https://github.com/${USERNAME}/${REPO_NAME}.git"
PAGES_URL="https://${USERNAME}.github.io/${REPO_NAME}/"

echo "GitHub 用户：${USERNAME}"
echo "目标仓库：${REPO_NAME}"
echo ""

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
  git branch -M main
fi

if ! git diff --cached --quiet 2>/dev/null || ! git diff --quiet 2>/dev/null || [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "Update Aonan Cui online resume site" || true
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "${REMOTE}"
else
  git remote add origin "${REMOTE}"
fi

if gh repo view "${USERNAME}/${REPO_NAME}" >/dev/null 2>&1; then
  echo "仓库已存在，正在推送..."
  git push -u origin main
else
  echo "正在创建仓库并推送..."
  gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push --description "Aonan Cui (崔奡楠) online resume portfolio"
fi

echo "正在开启 GitHub Pages..."
gh api "repos/${USERNAME}/${REPO_NAME}/pages" \
  -X POST \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/ >/dev/null 2>&1 || \
gh api "repos/${USERNAME}/${REPO_NAME}/pages" \
  -X PUT \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/ >/dev/null 2>&1 || true

echo ""
echo "=========================================="
echo "部署完成（Pages 约 1–2 分钟后生效）"
echo ""
echo "网页版 / 手机版（同一链接）："
echo "  Aonan_Cui_Resume · 崔奡楠在线简历"
echo "  ${PAGES_URL}"
echo "=========================================="
