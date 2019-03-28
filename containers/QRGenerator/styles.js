import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, normalize, windowHeight } from '../../theme/baseTheme';

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },

    containerView: {
        marginVertical: normalize(24),
    },

    button: {
        backgroundColor: color.blue,
        height: normalize(55)
    },

    buttonText: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.medium
    },
    
    titleText: {
        fontSize: fontSize.xLarge,
        fontFamily: fontFamily.bold,
        color: color.black,
        marginTop: normalize(15),
        marginBottom: normalize(25)
    },

    informationText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.regular,
        color: color.black,
        marginVertical: normalize(5),
        marginHorizontal: normalize(20)
    }
});

export default styles;