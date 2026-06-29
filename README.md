# Aonan_Cui-Resume

崔奡楠（Aonan Cui）个人在线简历 · 中国传媒大学广告学 · AIGC内容、影视制作

## 在线访问

部署到 GitHub Pages 后，电脑与手机使用同一链接（页面自适应）：

- **网页版 / 手机版**：`https://<你的GitHub用户名>.github.io/Aonan_Cui-Resume/`

简历中可写：

> 崔奡楠在线简历（Aonan_Cui_Resume）  
> https://\<你的GitHub用户名\>.github.io/Aonan_Cui-Resume/

## 本地预览

```bash
./start.sh
```

浏览器打开 http://127.0.0.1:8080

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，名称 **`Aonan_Cui-Resume`**，Public，不要勾选 README
2. 在本目录执行（将 `<你的GitHub用户名>` 替换为实际用户名）：

```bash
git init
git add .
git commit -m "Publish Aonan Cui resume site"
git branch -M main
git remote add origin https://github.com/<你的GitHub用户名>/Aonan_Cui-Resume.git
git push -u origin main
```

3. 仓库 **Settings → Pages → Build and deployment → Source** 选 **Deploy from a branch**
4. Branch 选 **main**，文件夹选 **/ (root)**，保存
5. 约 1–2 分钟后访问：`https://<你的GitHub用户名>.github.io/Aonan_Cui-Resume/`
