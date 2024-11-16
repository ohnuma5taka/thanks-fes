import moment from 'moment';
import 'moment/locale/ja';

export type DateFormat =
  | 'YYYY/MM/DD'
  | 'YYYY/MM/DD HH:mm:ss'
  | 'YYYY/MM/DD HH:mm:ss.SSS'
  | 'YYYY/MM/DD（ddd）'
  | 'YYYY/MM/DD（ddd）HH:mm:ss'
  | 'MM/DD（ddd）'
  | 'MM/DD（ddd）HH:mm'
  | 'MM/DD HH:mm'
  | 'HH:mm';

export enum DayEnum {
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
}

moment.updateLocale('ja', {
  weekdays: [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
});

const _moment = (date?: string) => {
  if (!date) return moment();
  if (!date.includes('.')) {
    return moment(new Date(date).toISOString());
  }
  const [_date, ms] = date.split('.');
  return moment(new Date(_date).toISOString()).add(ms, 'milliseconds');
};
const now = (format?: string) =>
  _moment().format(format || 'YYYY/MM/DD HH:mm:ss.SSS');
const today = () => _moment().format('YYYY/MM/DD');
const isToday = (date: string) =>
  _moment(date).format('YYYY/MM/DD') === today();
const isSameDate = (date1: string, date2: string) =>
  _moment(date1).format('YYYY/MM/DD') === _moment(date2).format('YYYY/MM/DD');
const secondToTime = (second: number) =>
  moment.utc(second * 1000).format('HH:mm');
const addSecond = (date: string, second: number, format?: DateFormat) =>
  _moment(date)
    .add(second, 'seconds')
    .format(format || 'YYYY/MM/DD HH:mm:ss.SSS');
const diff = (from: string, to: string, unit?: moment.unitOfTime.Diff) =>
  _moment(to).diff(_moment(from), unit || 'milliseconds') / 1000;
const format = (date: string, format: DateFormat) =>
  _moment(date).format(format);

export const momentUtil = {
  now,
  today,
  isToday,
  isSameDate,
  secondToTime,
  addSecond,
  diff,
  format,
};
