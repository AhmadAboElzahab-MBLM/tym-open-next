/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: [
    './src/temp.pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'lg:pt-[0px]',
    'lg:pt-[130px]',
    'lg:pt-20',
    '!-bottom-[25%]',
    '-bottom-[25%], mb-[25%]',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1366px',
      '3xl': '1440px',
      '4xl': '1600px',
      '5xl': '1920px',
    },
    fontFamily: {
      sans: 'prometo, sans-serif',
      noto: 'noto-sans, sans-serif',
      'noto-kr': 'NotoSansKRRegular, sans-serif',
    },
    lineHeight: {
      1: '1',
      1.125: '1.125',
      1.25: '1.25',
      1.375: '1.375',
      1.42: '1.42857',
      1.5: '1.5',
      1.625: '1.625',
      1.75: '1.75',
      1.77: '1.77778',
      1.875: '1.875',
      2: '2',
    },
    extend: {
      boxShadow: {
        'top-only': '0 -3px 8px rgba(0, 0, 0, 0.24)',
      },
      aspectRatio: {
        '88/75': '88 / 75',
        '28/13': '28 / 13',
        '4/3': '4 / 3',
        '8/5': '8 / 5',
        '65/72': '65 / 72',
        '16/9': '16 / 9',
      },
      gap: {
        6.5: '1.625rem',
        12.5: '3.125rem',
        15: '3.75rem',
        22: '5.5rem',
        44: '11rem',
      },
      spacing: {
        7.5: '30px',
        10.5: '2.625rem',
        11: '2.75rem',
        12.5: '3.125rem',
        15: '3.75rem',
        18: '4.5rem',
        18.5: '74px',
        19: '4.75rem',
        20.5: '82px',
        22: '5.5rem',
        22.5: '5.625rem',
        25: '6.25rem',
        29: '7.25rem',
        30: '7.5rem',
        41.5: '166px',
        45: '11.25rem',
        50: '12.5rem',
        52: '13rem',
        56: '224px',
        62.5: '15.625rem',
        64: '256px',
        65: '16.25rem',
        '50vh': '50vh',
      },
      content: {
        bullet: "'\\2022'",
      },
      width: {
        25: '6.25rem',
        34: '8.5rem',
      },
      maxWidth: {
        40: '10rem',
        88: '22rem',
        92.5: '23.125rem',
        112: '28rem',
        128.5: '32.125rem',
        156: '39rem',
        208: '52rem',
        480: '120rem',
      },
      maxHeight: {
        12: '3rem',
        38: '9.5rem',
        45: '11.25rem',
        65: '16.25rem',
      },
      minHeight: {
        4: '1rem',
        52: '13rem',
      },
      keyframes: {
        move: {
          '0%': { left: 0 },
          '50%': { left: '8px' },
          '100%': { left: 0 },
        },
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      animation: {
        'move-arrow': 'move .8s ease-in-out infinite',
      },
      fontSize: {
        clamp12to15: 'clamp(0.75rem, 0.6975rem + 0.2vw, 0.9375rem)',
        clamp14to15: 'clamp(0.875rem, 0.8625rem + 0.0625vw, 0.9375rem)',
        clamp12to16: 'clamp(0.75rem, 0.662rem + 0.2817vw, 1rem)',
        clamp16to18: 'clamp(1rem, 0.975rem + 0.125vw, 1.125rem)',
        clamp12to18: 'clamp(0.75rem, 0.645rem + 0.4vw, 1.125rem)',
        clamp14to17: 'clamp(0.875rem, 0.8375rem + 0.1875vw, 1.0625rem)',
        clamp14to18: 'clamp(0.875rem, 0.825rem + 0.25vw, 1.125rem)',
        clamp16to21: 'clamp(1rem, 0.9375rem + 0.3125vw, 1.3125rem)',
        clamp16to24: 'clamp(0.875rem, 0.75rem + 0.625vw, 1.5rem)',
        clamp18to21: 'clamp(1.125rem, 1.0875rem + 0.1875vw, 1.3125rem)',
        clamp18to22: 'clamp(1.125rem, 1.075rem + 0.25vw, 1.375rem)',
        clamp18to28: 'clamp(1.125rem, 0.95rem + 0.6667vw, 1.75rem)',
        clamp20to28: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.75rem)',
        clamp24to48: 'clamp(1.5rem, 1.2rem + 1.5vw, 3rem)',
        clamp28to48: 'clamp(1.75rem, 1.2rem + 1.7vw, 3rem)',
        clamp32to48: 'clamp(2rem, 1.72rem + 1.0667vw, 3rem)',
        clamp32to58: 'clamp(2rem, 1.675rem + 1.625vw, 3.625rem)',
        clamp42to64: 'clamp(2.625rem, 2.35rem + 1.375vw, 4rem)',
        clamp42to62: 'clamp(2.625rem, 2.375rem + 1.25vw, 3.75rem)',
        clamp36to62: 'clamp(2.25rem, 1.925rem + 1.625vw, 3.875rem)',
        clamp32to100: 'clamp(2rem, 0.81rem + 4.5333vw, 6.25rem)',
        clamp48to100: 'clamp(3rem, 2.35rem + 3.25vw, 6.25rem)',
        clamp52to100: 'clamp(3.25rem, 2.65rem + 3vw, 6.25rem)',
      },
      colors: {
        primary: '#1A1A1A',
        'primary-0': '#1A1A1A00',
        'primary-25': '#1A1A1ABF',
        'primary-10': 'rgba(26, 26, 26, 0.40)',
        lava: '#C91820',
        JDGreen: '#377C2B',
        chiliPepper: '#C71619',
        porcelain: '#F2F2F2',
        mercury: '#E6E6E6',
        cherry: '#D10024',
        grey: '#CCCCCC',
        whiteBlur: '#ffffff80',
        platinum: '#E6E6E6',
        pastelGrey: '#D0D0D0',
        paprika: '#920019',
        granite: '#808080',
        lightGrey: '#D9D9D9',
        whiteShade50: '#ffffff80',
        dawn: '#A6A6A6',
        tymRed: '#EB0028',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'not-found':
          "url('https://tym-new.euwest01.umbraco.io/media/w2po13th/tym_404image_v2.jpg')",
      },
    },
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('p-child', '& > p');
      addVariant('span-child', '& > span');
      addVariant('p-span-child', '& > p > span');
      addVariant('p-a-child', '& > p > a');
      addVariant('swiper-slide', '& > .swiper-wrapper > .swiper-slide');
      addVariant('swiper-slide-thumb', '& > .swiper-wrapper > .swiper-slide-thumb-active');
      addVariant(
        'swiper-slide-thumb-active',
        '& > .swiper-wrapper > .swiper-slide-thumb-active > p',
      );
      addVariant('swiper-slide-active', '& .swiper-wrapper > .swiper-slide-active');
      addVariant(
        'swiper-slide-active-text',
        '& .swiper-wrapper > .swiper-slide-active > * .slider-text',
      );
      addVariant('swiper-wrapper', '& > .swiper-wrapper');
      addVariant('svg-child', '& > svg');
      addVariant('a-child', '& * > a');
      addVariant('h4-child', '& > h4');
      addVariant('h2-child', '& > h2');
      addVariant('h3-child', '& > h3');
      addVariant('svg-child-circle', '& > svg > circle');
      addVariant('svg-child-path', '& > svg > path');
      addVariant('ul-child', '& > ul');
      addVariant('li-child', '& > ul > li');
      addVariant('p-ul-child', '& > p > ul');
      addVariant('p-li-child', '& > p > ul > li');
      addVariant('li-p-child', '& > ul > li > p');
      addVariant('ol-child', '& > ol');
      addVariant('ol-li-child', '& > ol > li');
      addVariant('ol-li-inner-child', '& > ol > li > ol');
      addVariant('table', '& > table');
      addVariant('table-tr', '& > table > tbody > tr');
      addVariant('table-td', '& > table > tbody > tr > td');
      addVariant('table-td-strong', '& > table > tbody > tr > td > strong');
      addVariant('table-td-p-strong', '& > table > tbody > tr > td > p > strong');
      addVariant('table-td-ul', '& > table > tbody > tr > td > ul');
      addVariant('table-td-li', '& > table > tbody > tr > td > ul > li');
      addVariant('p-child-br', '& > p > br');
      addVariant('p-child-iframe', '& > p > iframe');
      addVariant('third-slider', '& > .third-slider');
    },
  ],
};
