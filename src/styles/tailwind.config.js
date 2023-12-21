const { plugin } = require('twrnc')

module.exports = {
  theme: {
    extend: {
      maxHeight: {
        0: '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
      },
      inset: {
        px: '1px',
        '1/2': '50%',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        bitcoin: '#F7931A',
        black: {
          1: '#2B1911',
          2: '#7D675E',
          3: '#9F8C82',
          4: '#BAADA7',
          100: '#2B1911',
          90: '#46332B',
          75: '#624D44',
          65: '#7D675E',
          50: '#9F8C82',
          25: '#BAADA7',
          10: '#EAE3DF',
          5: '#F4EEEB',
        },
        primary: {
          dark: {
            2: '#963600',
            1: '#C45104',
          },
          main: '#F56522',
          mild: {
            2: '#FFA171',
            1: '#FCCCB6',
          },
          'background-dark': '#FEEDE5',
          background: '#FFF9F6',
          'background-light': '#FFFCFA',
        },
        success: {
          dark: {
            2: '#246F00',
            1: '#4F910C',
          },
          main: '#65A519',
          mild: {
            2: '#AFDA73',
            1: '#DDEFC3',
          },
          'background-dark': '#F2F9E7',
          'background-main': '#FCFEF6',
          'background-light': '#FEFEFB',
          background: '#C9FFE5',
        },
        warning: {
          dark: {
            2: '#F19E12',
            1: '#F3B71A',
          },
          main: '#F5CE22',
          mild: {
            2: '#F9E96C',
            1: '#FDF6C0',
          },
          background: '#FDF6C0',
          backgroundDark: '#FEFCE5',
          backgroundMain: '#FFFEF5',
          backgroundLight: '#FFFEFA',
        },
        error: {
          dark: '#B01807',
          main: '#DF321F',
          light: '#FE5A48',
          mild: '#FFD1CA',
          background: '#FFE6E1',
        },
        info: {
          dark: '#005E89',
          main: '#037DB5',
          light: '#099DE2',
          mild: '#93D6F5',
          background: '#D7F2FE',
        },
        gradient: {
          yellow: '#FFA24C',
          orange: '#FF7A50',
          red: '#FF4D42',
        },
      },
      fontSize: {
        '6xl': '96px',
        '5xl': '60px',
        '4xl': '48px',
        '3xl': '34px',
        '2xl': '24px',
        xl: '20px',
        lg: '18px',
        base: '16px',
        sm: '15px',
        xs: '14px',
        '2xs': '13px',
        '3xs': '12px',
      },
      lineHeight: {
        '6xl': '112px',
        '5xl': '72px',
        '4xl': '56px',
        '3xl': '42px',
        '2xl': '32px',
        xl: '28px',
        lg: '26px',
        base: '24px',
        sm: '22px',
        xs: '20px',
      },
      letterSpacing: {
        superTightest: '-0.03em',
        tightest: '-0.016em',
        tighter: '-0.01em',
        tight: '0m',
        normal: '0.01em',
        wide: '0.028em',
        wider: '0.036em',
        widest: '0.1em',
      },
      minHeight: {
        10: '40px',
      },
      width: {
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
        '8/8': '100%',
      },
      padding: {
        sm: '8px',
        md: '16px',
      },
      margin: {
        sm: '8px',
        md: '16px',
      },
    },
    fontFamily: {
      baloo: ['Baloo2-Regular', 'sans-serif'],
      'baloo-medium': ['Baloo2-Medium', 'sans-serif'],
      'baloo-semibold': ['Baloo2-SemiBold', 'sans-serif'],
      'baloo-bold': ['Baloo2-Bold', 'sans-serif'],
      'courier-prime': ['CourierPrime-Regular', 'sans-serif'],
      'courier-prime-bold': ['CourierPrime-Bold', 'sans-serif'],
    },
    screens: {
      sm: '320px',
      md: '374px',
    },
  },
  variants: {},
  corePlugins: {},
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        h1: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 96,
          lineHeight: 112,
          letterSpacing: -1.536,
        },
        h2: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 60,
          lineHeight: 72,
          letterSpacing: -0.6,
        },
        h3: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 48,
          lineHeight: 72,
          letterSpacing: 0,
        },
        h4: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 34,
          lineHeight: 42,
          letterSpacing: 0.34,
        },
        h5: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 24,
          lineHeight: 32,
          letterSpacing: 0.24,
        },
        h6: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 20,
          lineHeight: 32,
          letterSpacing: 0.2,
        },
        h7: {
          fontFamily: 'Baloo2-Bold',
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 0.16,
        },
        'drawer-title': {
          fontFamily: 'Baloo2-Bold',
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        },
        'subtitle-0': {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 20,
          lineHeight: 28,
          letterSpacing: 0.2,
        },
        'subtitle-1': {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 16,
          lineHeight: 28,
          letterSpacing: 0.16,
        },
        'subtitle-2': {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 14,
          lineHeight: 22,
          letterSpacing: 0.14,
        },
        'body-l': {
          fontFamily: 'Baloo2-Regular',
          fontSize: 20,
          lineHeight: 28,
          letterSpacing: 0.2,
        },
        'body-m': {
          fontFamily: 'Baloo2-Regular',
          fontSize: 16,
          lineHeight: 24,
          letterSpacing: 0.16,
        },
        'body-s': {
          fontFamily: 'Baloo2-Regular',
          fontSize: 14,
          lineHeight: 20,
          letterSpacing: 0.14,
        },
        'button-large': {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 15,
          lineHeight: 26,
          letterSpacing: 0.54,
          textTransform: 'uppercase',
        },
        'button-medium': {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 14,
          lineHeight: 24,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        'button-small': {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 13,
          lineHeight: 22,
          letterSpacing: 0.47,
          textTransform: 'uppercase',
        },
        settings: {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 20,
          lineHeight: 32,
          letterSpacing: 0.2,
          textTransform: 'lowercase',
        },
        'input-label': {
          fontFamily: 'Baloo2-Bold',
          fontSize: 16,
          lineHeight: 20,
          letterSpacing: 0.16,
        },
        'input-text': {
          fontFamily: 'Baloo2-Regular',
          fontSize: 18,
          lineHeight: 29.25,
          letterSpacing: 0.18,
        },
        'input-title': {
          fontFamily: 'Baloo2-Bold',
          fontSize: 16,
          lineHeight: 23,
          letterSpacing: 0.16,
        },
        tooltip: {
          fontFamily: 'Baloo2-Medium',
          fontSize: 14,
          lineHeight: 20,
          letterSpacing: 0.14,
        },
        notification: {
          fontFamily: 'Baloo2-SemiBold',
          fontSize: 12,
          lineHeight: 22,
          letterSpacing: -0.36,
          textAlign: 'center',
        },
      })
    }),
  ],
}
