import { ColorMode } from '@/app/core/models/color.model';

export const questionOptions: { colorMode: ColorMode; iconSrc: string }[] = [
  {
    colorMode: 'primary',
    iconSrc: '/assets/images/option-icon1.png',
  },
  {
    colorMode: 'alert',
    iconSrc: '/assets/images/option-icon2.png',
  },
  {
    colorMode: 'success',
    iconSrc: '/assets/images/option-icon3.png',
  },
  {
    colorMode: 'warn',
    iconSrc: '/assets/images/option-icon4.png',
  },
];
