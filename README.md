# qqwry-lite

> 轻量级纯真 IP 库工具

借(~~抄~~)鉴(~~袭~~) [lib-qqwry](https://github.com/cnwhy/lib-qqwry) 写的, lib-qqwry 其实非常好用，但默认带了数据库，而且添加了命令行版本感觉太臃肿了，而且没有 `d.ts`，所以用 ts 改了一版。

**PS: 目前功能没有完善，仅仅是 IP 查询完成，有空再加。**

## 安装

```sh
$ yarn add qqwry-lite
# 选择安装
$ yarn add qqwry-lite-data # 纯真 IP 库
```

其中 `qqwry-lite-data` 是 `qqwry.dat` 数据，版本号就是更新时间，如果发现模块没及时更新，你可以不安装，自己下载纯真 IP 库即可。


## 使用

默认使用 `qqwry-lite-data` 库，需要安装的。

```js
const { QQwry } = require('qqwry-lite');
const db = new QQwry();

console.log(db.searchIP('223.5.5.5')); // { ip: '223.5.5.5', country: '浙江省杭州市', area: '阿里巴巴阿里云AliDNS服务器' }
```

不安装 `qqwry-lite-data` 自己下载 `qqwry.dat` 数据。

```js
const fs = require('fs');
const { QQwry } = require('qqwry-lite');
const db = new QQwry(fs.join(__dirname, 'qqwry.dat')); // 自定义数据库

console.log(db.searchIP('223.5.5.5')); // { ip: '223.5.5.5', country: '浙江省杭州市', area: '阿里巴巴阿里云AliDNS服务器' }
```

## API

### `QQwry#searchIP(ip: string): { ip: string, country: string, area: string };`

> IP 查询
