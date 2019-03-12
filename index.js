'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var gbk_js = require('gbk.js');

const IP_RECORD_LENGTH = 7; // IP 记录数据长度
const REDIRECT_MODE_1 = 1;
const REDIRECT_MODE_2 = 2;
/**
 * IP转正数
 * @param ip
 */
function ip2int(ip) {
    const bytes = ip.split('.').map(n => parseInt(n, 10));
    let addr = bytes[3] & 0xff;
    addr |= (bytes[2] << 8) & 0xff00;
    addr |= (bytes[1] << 16) & 0xff0000;
    addr |= (bytes[0] << 24) & 0xff000000;
    return addr >>> 0;
}
/**
 * 取得 begin 和 end 中间的偏移 (用于2分法查询)
 * @param begin 其实位置
 * @param end 结束位置
 * @param recordLength 记录长度
 */
function getMiddleOffset(begin, end, recordLength) {
    const records = (((end - begin) / recordLength) >> 1) * recordLength + begin;
    return records ^ begin ? records : records + recordLength;
}
/**
 * 2分法查找指定的IP偏移
 * @param ip int 型 ip 值
 * @param qqwry QQwry 实例
 */
function locateIP(ip, qqwry) {
    let temp;
    let g = -1;
    let b = qqwry.ipBegin;
    let e = qqwry.ipEnd;
    for (; b < e;) {
        g = getMiddleOffset(b, e, IP_RECORD_LENGTH); //获取中间位置
        temp = qqwry.buffer.readUIntLE(g, 4);
        if (ip > temp) {
            b = g;
        }
        else if (ip < temp) {
            if (g === e) {
                g -= IP_RECORD_LENGTH;
                return g;
            }
            e = g;
        }
        else {
            return g;
        }
    }
    return g;
}
// 读取 buffer 字符串 (GBK数据)
function getStringByteArray(start = 0, buffer) {
    const maxSize = buffer.length;
    const toarr = [];
    for (let i = start; i < maxSize; i++) {
        const s = buffer[i];
        if (s === 0) {
            return toarr;
        }
        toarr.push(s);
    }
    return toarr;
}
// 读取 Area 数据
function ReadArea(offset, buffer) {
    var one = buffer.readUIntLE(offset, 1);
    if (one == REDIRECT_MODE_1 || one == REDIRECT_MODE_2) {
        var areaOffset = buffer.readUIntLE(offset + 1, 3);
        if (areaOffset == 0) {
            return '';
        }
        else {
            return gbk_js.decode(getStringByteArray(areaOffset, buffer));
        }
    }
    else {
        return gbk_js.decode(getStringByteArray(offset, buffer));
    }
}
/**
 * 获取 IP 地址对应区域
 * @param offset 偏移
 * @param buffer 数据库
 */
function setIPLocation(offset, buffer) {
    let ipwz = buffer.readUIntLE(offset + 4, 3) + 4;
    let lx = buffer.readUIntLE(ipwz, 1);
    let loc = { country: '', area: '' };
    let Gjbut = [];
    if (lx === REDIRECT_MODE_1) {
        //Country根据标识再判断
        ipwz = buffer.readUIntLE(ipwz + 1, 3); //读取国家偏移`
        lx = buffer.readUIntLE(ipwz, 1); //再次获取标识字节
        if (lx == REDIRECT_MODE_2) {
            //再次检查标识字节
            Gjbut = getStringByteArray(buffer.readUIntLE(ipwz + 1, 3), buffer);
            loc.country = gbk_js.decode(Gjbut);
            // loc.country = Gjbut.toString();
            ipwz = ipwz + 4;
        }
        else {
            Gjbut = getStringByteArray(ipwz, buffer);
            loc.country = gbk_js.decode(Gjbut);
            // loc.country = Gjbut.toString();
            ipwz += Gjbut.length + 1;
        }
        loc.area = ReadArea(ipwz, buffer);
    }
    else if (lx === REDIRECT_MODE_2) {
        //Country直接读取偏移处字符串
        Gjbut = getStringByteArray(buffer.readUIntLE(ipwz + 1, 3), buffer);
        loc.country = gbk_js.decode(Gjbut);
        // loc.country = Gjbut.toString();
        loc.area = ReadArea(ipwz + 4, buffer);
    }
    else {
        // Country 直接读取 Area 根据标志再判断
        Gjbut = getStringByteArray(ipwz, buffer);
        ipwz += Gjbut.length + 1;
        loc.country = gbk_js.decode(Gjbut);
        // loc.country = Gjbut.toString();
        loc.area = ReadArea(ipwz, buffer);
    }
    return loc;
}

class QQwry {
    /**
     * qqwry.dat 地址
     * @param path 路径
     */
    constructor(path) {
        path = path || require('qqwry-lite-data');
        this.buffer = fs.readFileSync(path); // 读取数据库
        this.ipBegin = this.buffer.readUIntLE(0, 4); // 0-4 字节存储 数据库 起始位置
        this.ipEnd = this.buffer.readUIntLE(4, 4); // 4-8 字节存储 数据库 结束位置
    }
    /**
     * 搜索IP信息
     * @param ip IP
     */
    searchIP(ip) {
        const ipInt = ip2int(ip);
        const offset = locateIP(ipInt, this); // 寻找 ip 偏移
        if (offset === -1) {
            return { ip, country: '', area: '' };
        }
        const { country, area } = setIPLocation(offset, this.buffer);
        return { ip, country, area };
    }
}

exports.QQwry = QQwry;
exports.default = QQwry;
