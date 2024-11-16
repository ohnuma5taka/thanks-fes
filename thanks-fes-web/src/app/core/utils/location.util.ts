import { jsonUtil } from '@/app/core/utils/json.util';

const fullPath = () => location.hash.replace('#', '').split('?')[0];
const trailingPath = () => fullPath().split('/').slice(-1)[0];
const urlQuery = () =>
  jsonUtil.toCamelCase(
    location.hash.includes('?')
      ? Object.fromEntries(
          new URLSearchParams(
            decodeURI(location.hash).replace('/#', '').split('?')[1]
          )
        )
      : {}
  ) as {};

export const locationUtil = {
  fullPath,
  trailingPath,
  urlQuery,
};
