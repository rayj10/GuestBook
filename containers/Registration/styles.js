import { StyleSheet } from 'react-native';
import { normalize, color } from '../../theme/baseTheme';

const styles = StyleSheet.create({
    buttons: {
        position: 'absolute',
        top: normalize(10),
        left: normalize(10),
        width: normalize(45),
        height: normalize(45),
        borderRadius: normalize(22.5),
        justifyContent: 'center',
        shadowOpacity: 0.4,
        elevation: 5,
        backgroundColor: color.jade
    },
});

export default styles;