import { ColorMode } from '@/app/core/models/color.model';

export const questionOptions: { colorMode: ColorMode; iconSrc: string }[] = [
  {
    colorMode: 'primary',
    iconSrc: '/assets/images/common/option-icon1.png',
  },
  {
    colorMode: 'alert',
    iconSrc: '/assets/images/common/option-icon2.png',
  },
  {
    colorMode: 'success',
    iconSrc: '/assets/images/common/option-icon3.png',
  },
  {
    colorMode: 'warn',
    iconSrc: '/assets/images/common/option-icon4.png',
  },
];
