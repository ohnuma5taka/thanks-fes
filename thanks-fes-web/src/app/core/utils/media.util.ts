export type Device = 'desktop' | 'tablet' | 'iphone' | 'android';
type DeviceProp<T> = { md: T; sm: T; xs: T };
const deviceType: Device = navigator.userAgent.includes('iPhone')
  ? 'iphone'
  : navigator.userAgent.includes('Android')
  ? 'android'
  : 'desktop';

const isSp = deviceType === 'iphone' || deviceType === 'android';
const isIphone = deviceType === 'iphone';
const isAndroid = deviceType === 'android';
const style = (prop: DeviceProp<string | number>, otherStyle?: string) =>
  [deviceType === 'desktop' ? prop.md : prop.xs, otherStyle || '']
    .filter((x) => x)
    .join(' ');
const fontSize = (prop: DeviceProp<number>) => `font-size: ${style(prop)}px;`;
const maxWidth = (prop: DeviceProp<string>) => `max-width: ${style(prop)};`;

const userAgent = window.navigator.userAgent.toLowerCase();
const browser = [
  { key: 'msie', browser: 'ie' },
  { key: 'trident', browser: 'ie' },
  { key: 'edge', browser: 'edge' },
  { key: 'chrome', browser: 'chrome' },
  { key: 'safari', browser: 'safari' },
  { key: 'firefox', browser: 'firefox' },
  { key: 'opera', browser: 'opera' },
  { key: '', browser: '' },
].find((x) => userAgent.includes(x.key)).browser;

export const mediaUtil = {
  isSp,
  isIphone,
  isAndroid,
  style,
  fontSize,
  maxWidth,
  browser,
};
