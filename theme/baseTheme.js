/**
 * Declare our font sizes, colors, font family, etc for the app to refer to
 */
import { Dimensions } from 'react-native';
import { moderateScale as normalize } from 'react-native-size-matters'; //adjusts sizes based on device

const color = {
    black: "#3B3031",
    light_black: "#252930",
    main: "rgb(99,139,250)",
    white: "#fcfcfc",
    underlayColor: "#ddd",
    red: "#fc5e55",
    green: "#0B6623",
    light_grey: "#bbbdc0",
    grey: "#4b5970",
    light_blue: "#0083e7",
    blue: "#0061ac",
    dark_blue: "#004071",
    background: "#f7f7f7",
    cyan: "#77ddaa",
    dark_cyan: "#008B8B",
    olive: "#708238",
    jade: "#00AB6B",
    cloudy: "#fcfcfc32"
}

const fontSize = {
    small: normalize(13),
    regular: normalize(15),
    large: normalize(22),
    xLarge: normalize(26)
}

const fontFamily = {
    extrabold: "Roboto-Black",
    bold: "Roboto-Bold",
    boldItalic: 'Roboto-BoldItalic',
    medium: "Roboto-Medium",
    regular: "Roboto-Regular",
    light: "Roboto-Light"
}

const windowWidth = () => Dimensions.get('window').width;
const windowHeight = () => Dimensions.get('window').height;

export {
    color,
    fontSize,
    fontFamily,
    windowWidth,
    windowHeight,
    normalize
}
