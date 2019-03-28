import React, { Component } from 'react'
import { QRCode } from 'react-native-custom-qr-codes';
import { View, Text, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { windowWidth, normalize, color } from '../../theme/baseTheme';
import styles from './styles';

class QRGenerator extends Component {

    orientationChange = () => this.forceUpdate();

    componentDidMount() {
        Dimensions.addEventListener('change', this.orientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.orientationChange);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../assets/background.jpg')} style={styles.container}>
                    <ScrollView contentContainerStyle={{
                        alignItems: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <Text style={styles.titleText}>{'Registration Succesful!'}</Text>
                        <Text style={styles.informationText}>Please take a picture of the QR Code below for your next visit, it contains the information you just entered</Text>
                        <Text style={[styles.informationText, { fontStyle: 'italic', color: color.dark_blue, marginBottom: normalize(20) }]}>{'Simpan/Foto QR Code dibawah ini, QR Code dibawah berisi data diri yang baru saja anda daftarkan'}</Text>
                        <QRCode
                            content={this.props.content}
                            size={normalize(250)}
                            logo={require('../../assets/qrLogo.png')}
                            logoSize={normalize(65)}
                            ecl='Q'
                        />
                        <Button
                            raised
                            title={'Got It!'}
                            borderRadius={4}
                            containerViewStyle={[styles.containerView, { width: windowWidth() - 40 }]}
                            buttonStyle={styles.button}
                            textStyle={styles.buttonText}
                            onPress={() => Actions.pop()} />
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    };
}

export default QRGenerator;