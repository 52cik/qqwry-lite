import { readFileSync } from 'fs';
import { ip2int, locateIP, setIPLocation } from './utils';

interface IPInfo {
  /** IP地址 */
  ip: string;
  /** 地址信息: 省市/局域网/网络类型 */
  country: string;
  /** 描述信息: 运营商/公司/组织/描述信息 */
  area: string;
}

export class QQwry {
  public buffer: Buffer;
  public ipBegin: number;
  public ipEnd: number;

  /**
   * qqwry.dat 地址
   * @param path 路径
   */
  constructor(path?: string) {
    path = path || (require('qqwry-lite-data') as string);
    this.buffer = readFileSync(path); // 读取数据库
    this.ipBegin = this.buffer.readUIntLE(0, 4); // 0-4 字节存储 数据库 起始位置
    this.ipEnd = this.buffer.readUIntLE(4, 4); // 4-8 字节存储 数据库 结束位置
  }

  /**
   * 搜索IP信息
   * @param ip IP
   */
  searchIP(ip: string): IPInfo {
    const ipInt = ip2int(ip);
    const offset = locateIP(ipInt, this); // 寻找 ip 偏移

    if (offset === -1) {
      return { ip, country: '', area: '' };
    }

    const { country, area } = setIPLocation(offset, this.buffer);
    return { ip, country, area };
  }
}

export default QQwry;
