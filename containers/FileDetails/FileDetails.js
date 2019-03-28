import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';

import styles from './styles';
import { normalize, fontSize, fontFamily } from '../../theme/baseTheme';

export default class FileDetails extends Component {
    constructor(props) {
        super(props);
    }

    renderFileContents() {
        let panels = [];

        this.props.guests.length > 1 ?
            this.props.guests.map((row, index) => {
                //skipping header
                if (index !== 0)
                    panels.push(
                        <TouchableOpacity key={index} style={{ flex: 1 }} onPress={() => Actions.editGuest({ filename: this.props.filename, guestIndex: index, guests: this.props.guests })}>
                            <View style={styles.panel}>
                                {this.props.guests[0].map((header, idx) => {
                                    return <View key={idx} style={{ flexDirection: 'row' }}>
                                        <Text style={styles.panelText}>{header}</Text>
                                        <Text style={[styles.panelText, { fontFamily: fontFamily.bold, flex: 2 }]}>{row[idx]}</Text>
                                    </View>
                                })}
                            </View>
                        </TouchableOpacity>
                    );
            })
            :
            panels.push(<View key={'nodata'} style={{ alignItems: 'center', marginVertical: normalize(15) }}>
                <Text style={[styles.panelText, { fontSize: fontSize.regular + 2 }]}> No Guest Information Available </Text>
            </View>);

        return panels;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../assets/background.jpg')} style={styles.innerContainer}>
                    <Text style={styles.title}>List of Your Registered Guests</Text>
                    <ScrollView>
                        {this.renderFileContents()}
                    </ScrollView>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.registration()}>
                            <View style={styles.backButton}>
                                <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}