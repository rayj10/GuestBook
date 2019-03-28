import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, normalize, windowHeight } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    paddingVertical: normalize(5),
  },

  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large,
    color: color.light_black,
    marginTop: normalize(2),
    marginBottom: normalize(5),
    marginHorizontal: normalize(7)
  },

  panel: {
    height: normalize(170),
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: color.grey,
    marginVertical: normalize(2),
    marginHorizontal: normalize(10),
    padding: normalize(10),
    backgroundColor: color.cloudy
  },

  panelText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.regular,
    color: color.light_black
  },

  backButtonContainer: {
    position: 'absolute',
    bottom: 0,
    height: normalize(60),
    width: normalize(60),
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderTopEndRadius: 10
  },

  backButton: {
    position: 'absolute',
    bottom: 0,
    height: normalize(55),
    width: normalize(55),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderTopEndRadius: 5
  },

});

export default styles;
