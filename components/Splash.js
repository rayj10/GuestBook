import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

import { color, windowWidth, normalize } from "../theme/baseTheme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4bacc6'
    },

    image: {
        height: normalize(160),
        width: normalize(160),
        resizeMode: 'contain'
    },

    activityIndicatorContainer: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom: 60
    }
});

export default class extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/images/logo.png')} style={styles.image} />
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size='large' color={color.white}/>
                </View>
            </View>
        );
    }
}
