# qqwry-lite

> 轻量级纯真 IP 库工具

**声明：本模块~~借~~(抄)~~鉴~~(袭) [lib-qqwry](https://github.com/cnwhy/lib-qqwry) :satisfied:**
> `lib-qqwry` 模块非常好用，但默认带了IP库，最近还添加了命令行版本感觉太臃肿，而且没有 `d.ts`，所以才造的轮子，用 ts 改了一版。

**PS: 目前功能没有完善，仅仅是IP查询完成，有空再加。**

## 安装

```sh
$ yarn add qqwry-lite
# 选择安装
$ yarn add qqwry-lite-data # 纯真IP数据
```

其中 `qqwry-lite-data` 是 `qqwry.dat` 数据，模块版本号就是更新时间，如果发现模块没及时更新，你可以不安装，自己下载纯真IP数据即可。


## 使用

默认使用 `qqwry-lite-data` 库，需要安装的。

```js
const { QQwry } = require('qqwry-lite');
const db = new QQwry();

console.log(db.searchIP('223.5.5.5')); // { ip: '223.5.5.5', addr: '浙江省杭州市', info: '阿里巴巴阿里云AliDNS服务器' }
```

不安装 `qqwry-lite-data` 自己下载 `qqwry.dat` 数据。

```js
const fs = require('fs');
const { QQwry } = require('qqwry-lite');
const db = new QQwry(fs.join(__dirname, 'qqwry.dat')); // 自定义IP数据

console.log(db.searchIP('1.2.8.9')); // { ip: '1.2.8.9', addr: '中国', info: '网络信息中心' }
```

## API

### `QQwry#searchIP(ip: string): { ip: string, country: string, area: string };`

> IP 查询


## IP信息例子

```js
import QQwry from 'qqwry-lite';
const db = new QQwry(); // 自定义IP数据

console.log([
  db.searchIP('1.0.0.0'),
  db.searchIP('1.2.8.9'),
  db.searchIP('255.255.255.255'),
  db.searchIP('247.255.255.255'),
  db.searchIP('233.5.5.5'),
  db.searchIP('125.120.148.18'),
  db.searchIP('218.108.89.26'),
  db.searchIP('45.127.128.22'),
]);

// [ { ip: '1.0.0.0', addr: '美国', info: '亚太互联网络信息中心(CloudFlare节点)' },
//   { ip: '1.2.8.9', addr: '中国', info: '网络信息中心' },
//   { ip: '255.255.255.255', addr: '纯真网络', info: '2019年3月10日IP数据' },
//   { ip: '247.255.255.255', addr: 'IANA保留地址', info: '' },
//   { ip: '233.5.5.5', addr: 'IANA保留地址', info: '用于多点传送' },
//   { ip: '125.120.148.18', addr: '浙江省杭州市西湖区', info: '电信' },
//   { ip: '218.108.89.26', addr: '浙江省杭州市', info: '华数宽带' },
//   { ip: '45.127.128.22', addr: '浙江省杭州市', info: '网易云' } ]
```
