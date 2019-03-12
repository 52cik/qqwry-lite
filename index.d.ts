interface IPInfo {
  /** IP地址 */
  ip: string;
  /** 省市/局域网/网络类型 */
  country: string;
  /** 运营商/公司/组织/描述信息 */
  area: string;
}
export declare class QQwry {
  buffer: Buffer;
  ipBegin: number;
  ipEnd: number;
  /**
   * qqwry.dat 地址
   * @param path 路径
   */
  constructor(path: string);
  /**
   * 搜索IP信息
   * @param ip IP
   */
  searchIP(ip: string): IPInfo;
}
export default QQwry;
