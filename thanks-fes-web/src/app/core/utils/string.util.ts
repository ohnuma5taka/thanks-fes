const kanaMap = {
  ｶﾞ: 'ガ',
  ｷﾞ: 'ギ',
  ｸﾞ: 'グ',
  ｹﾞ: 'ゲ',
  ｺﾞ: 'ゴ',
  ｻﾞ: 'ザ',
  ｼﾞ: 'ジ',
  ｽﾞ: 'ズ',
  ｾﾞ: 'ゼ',
  ｿﾞ: 'ゾ',
  ﾀﾞ: 'ダ',
  ﾁﾞ: 'ヂ',
  ﾂﾞ: 'ヅ',
  ﾃﾞ: 'デ',
  ﾄﾞ: 'ド',
  ﾊﾞ: 'バ',
  ﾋﾞ: 'ビ',
  ﾌﾞ: 'ブ',
  ﾍﾞ: 'ベ',
  ﾎﾞ: 'ボ',
  ﾊﾟ: 'パ',
  ﾋﾟ: 'ピ',
  ﾌﾟ: 'プ',
  ﾍﾟ: 'ペ',
  ﾎﾟ: 'ポ',
  ｳﾞ: 'ヴ',
  ﾜﾞ: 'ヷ',
  ｦﾞ: 'ヺ',
  ｱ: 'ア',
  ｲ: 'イ',
  ｳ: 'ウ',
  ｴ: 'エ',
  ｵ: 'オ',
  ｶ: 'カ',
  ｷ: 'キ',
  ｸ: 'ク',
  ｹ: 'ケ',
  ｺ: 'コ',
  ｻ: 'サ',
  ｼ: 'シ',
  ｽ: 'ス',
  ｾ: 'セ',
  ｿ: 'ソ',
  ﾀ: 'タ',
  ﾁ: 'チ',
  ﾂ: 'ツ',
  ﾃ: 'テ',
  ﾄ: 'ト',
  ﾅ: 'ナ',
  ﾆ: 'ニ',
  ﾇ: 'ヌ',
  ﾈ: 'ネ',
  ﾉ: 'ノ',
  ﾊ: 'ハ',
  ﾋ: 'ヒ',
  ﾌ: 'フ',
  ﾍ: 'ヘ',
  ﾎ: 'ホ',
  ﾏ: 'マ',
  ﾐ: 'ミ',
  ﾑ: 'ム',
  ﾒ: 'メ',
  ﾓ: 'モ',
  ﾔ: 'ヤ',
  ﾕ: 'ユ',
  ﾖ: 'ヨ',
  ﾗ: 'ラ',
  ﾘ: 'リ',
  ﾙ: 'ル',
  ﾚ: 'レ',
  ﾛ: 'ロ',
  ﾜ: 'ワ',
  ｦ: 'ヲ',
  ﾝ: 'ン',
  ｧ: 'ァ',
  ｨ: 'ィ',
  ｩ: 'ゥ',
  ｪ: 'ェ',
  ｫ: 'ォ',
  ｯ: 'ッ',
  ｬ: 'ャ',
  ｭ: 'ュ',
  ｮ: 'ョ',
  '｡': '。',
  '､': '、',
  ｰ: 'ー',
  '｢': '「',
  '｣': '」',
  '･': '・',
};
const kanaRegex = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');

const replaceAll = (text: string, from: string, to: string) =>
  text.split(from).join(to);

const randomString = (length?: number) =>
  [...Array(4)]
    .map((_) => Math.random().toString(36).slice(2))
    .join('')
    .slice(0, length || 16);

const randomNumber = (length?: number) =>
  [...Array(length || 16)].map((_) => `${Math.random()}`[2]).join('');

const zeroPadding = (number: number, length: number) =>
  (Array(length).join('0') + number).slice(-length);

const toHalfWidth = (str: string) =>
  str.replace(/[\uFF01-\uFF5E]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

const fullWidthKana = (str: string) =>
  str
    .replace(kanaRegex, (s) => kanaMap[s])
    .replace(/ﾞ/g, '゛')
    .replace(/ﾟ/g, '゜');

const toEnum = <T>(str: string, Type: T) => Type[str as keyof typeof Type];

const toNumber = (str: string): number | null =>
  !!str ? +(str.search(/[0-9]+(\.[0-9]+)?/) || '') : null;

const toKebabCase = (str: string) =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()
  );
const toSnakeCase = (str: string) =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '_' : '') + $.toLowerCase()
  );
const toCamelCase = (str: string) =>
  str.replace(/[a-z]([\-_][a-z])/g, ($, ofs) => $[0] + ofs[1].toUpperCase());
const replaceNewLine = (text: string) => text.replace(/%L%F%/g, '\n');

const isNumber = (value: any) => typeof value === 'number' && isFinite(value);

export const stringUtil = {
  replaceAll,
  randomString,
  randomNumber,
  zeroPadding,
  toHalfWidth,
  fullWidthKana,
  toEnum,
  toNumber,
  toKebabCase,
  toSnakeCase,
  toCamelCase,
  replaceNewLine,
  isNumber,
};
