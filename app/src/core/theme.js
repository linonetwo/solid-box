import getTokens from '@kiwicom/orbit-components/lib/getTokens';

const customTokens = getTokens({
  palette: {
    product: {
      light: '#fdf0ff',
      lightHover: '#fbdfff',
      lightActive: '#f9ceff',
      normal: '#5b0068',
      normalHover: '#4c0057',
      normalActive: '#3d0046',
      dark: '#110013',
    },
  },
});

export default customTokens;
