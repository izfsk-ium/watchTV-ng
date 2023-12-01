# watchTV-ng

基于 [watchTV](https://github.com/cornradio/watchTV), 使用 Svelte + Typescript + Vite 重构。

## Demo

访问[这里](https://izfsk.top/~izfsk/watchTV.html)查看示例。

![Demo](./misc/demo.jpeg)

## 实现进度

- [x] 项目基础框架
- [x] 分页加载图标的功能
- [x] 右键菜单的功能
- [ ] 手机端适配宽度支持
- [x] json 文件加载功能
- [x] json 配置切换功能
- [x] json 配置存储功能（通过 LocalStorage）
- [x] 点击 emoji 切换网站
- [x] 自动同步 emoji 和网站图标、网站名称
- [ ] 创作与分享 json 的 mini 社区（计划用 github）

## 构建

```sh
./node_modules/.bin/ts-interface-builder src/types.ts  # 如果修改过 interface
yarn run build
```
