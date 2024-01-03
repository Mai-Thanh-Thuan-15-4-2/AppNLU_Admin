
export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  primary: '#0D1282',
  dangerous: '#D71313',
  warning: '#F0DE36',
  success: "#4BB543",
  backgroundColor: '#F5EFE7',
  borderColor: "#0E2954",
  vip: "#F4CE14",
};


export const buttonStyles = {
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,

  },

};
export const loadPage = {
  loadingContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#bec4c2',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -75 }],
    width: 150,
    height: 150,
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.8,
  },

};
