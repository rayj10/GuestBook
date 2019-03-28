import React, { Component } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { RNCamera } from 'react-native-camera';
import { normalize, windowHeight, windowWidth } from '../../theme/baseTheme';
import AesCtr from '../../utils/AESCtr';

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    preview: {
        flex: 1
    },
    layerTop: {
        flex: 1,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 2,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 1,
        backgroundColor: opacity
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
    torchButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: normalize(60),
        width: normalize(60),
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderTopStartRadius: 10
    },
    torchButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: normalize(55),
        width: normalize(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .3)',
        borderTopStartRadius: 5
    }
});


export default class Scanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cameraType: true
        }

        this.onBarcodeRead = this.onBarcodeRead.bind(this);
    }

    orientationChange = () => this.forceUpdate();

    componentDidMount() {
        Dimensions.addEventListener('change', this.orientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.orientationChange);
    }

    onBarcodeRead({ data }) {
        let cipherText = data.split('R10j/W');
        if (cipherText.length !== 2)
            Alert.alert('Invalid QR Code', 'Please make sure you have the correct qr code we provided');
        else {
            var key = AesCtr.decrypt(cipherText[1], 'gu3stB0ok', 128);
            var personalInfo = AesCtr.decrypt(cipherText[0], key, 256);

            personalInfo = personalInfo.split(',');
            Actions.registration({ scannedInfo: personalInfo });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={this.state.cameraType ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your phone\'s camera'}
                    onBarCodeRead={this.onBarcodeRead}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    captureAudio={false}
                >
                    <View style={styles.layerTop} />
                    <View style={[styles.layerCenter, windowHeight() < windowWidth() ? { flex: 5 } : null]}>
                        <View style={styles.layerLeft} />
                        <View style={[styles.focused, windowHeight() < windowWidth() ? { flex: 1.8 } : null]} />
                        <View style={styles.layerRight} />
                    </View>
                    <View style={styles.layerBottom} />
                </RNCamera>

                <View style={styles.backButtonContainer}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
                        <View style={styles.backButton}>
                            <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.torchButtonContainer}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ cameraType: !this.state.cameraType })}>
                        <View style={styles.torchButton}>
                            {
                                this.state.cameraType ?
                                    <Icon name='camera-rear-variant' type='material-community' size={40} color='white' />
                                    :
                                    <Icon name='camera-front-variant' type='material-community' size={40} color='white' />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
