import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Actions } from 'react-native-router-flux';

import DialogBoxModal from '../../components/DialogBoxModal';
import IconWrapper from '../../components/IconWrapper';
import { color, normalize, fontSize, fontFamily, windowHeight, windowWidth } from '../../theme/baseTheme';

const styles = StyleSheet.create({
    buttons: {
        width: normalize(45),
        height: normalize(45),
        borderRadius: normalize(22.5),
        justifyContent: 'center',
        shadowOpacity: 0.4,
        elevation: 5
    },
    dialogText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.regular,
        color: color.black,
        marginVertical: normalize(5),
        marginLeft: normalize(10),
        marginBottom: normalize(20)
    },
    listItem: {
        flex: 1,
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: color.light_grey,
        borderRadius: normalize(2),
        justifyContent: 'space-between',
        alignItems: 'center',
        height: normalize(35)
    },
    listText: {
        fontSize: fontSize.small,
        fontFamily: fontFamily.regular,
        marginLeft: normalize(10)
    },
    openText: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.bold,
        color: color.blue,
        marginRight: normalize(10)
    }
});

export default class OpenFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            readOpen: false,
            fileList: null,
        };
    }

    readModalContent() {
        if (this.state.fileList && this.state.fileList.length !== 0) {
            return this.state.fileList.map((item, key) =>
                <View key={key} style={styles.listItem}>
                    <Text style={styles.listText}>{item}</Text>
                    <TouchableOpacity onPress={() => this.readFile(item)}>
                        <Text style={styles.openText}> Open </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else
            return <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.dialogText}> No items to display </Text>
            </View >;
    }

    readFile(filename) {
        var path = `${this.props.folder}/${filename}`;
        this.setState({ readOpen: false });

        RNFetchBlob.fs.readFile(path)
            .then((data) => {
                var rows = data.split('\n');
                var table = rows.map((item) => item.split(','));

                //ommit extra \n
                table = table.slice(0, table.length - 1);

                Actions.fileDetails({ filename: filename, guests: table });
            })
            .catch((err) => { alert(err) });
    }

    render() {
        return <View style={{ flex: 1 }}>
            <DialogBoxModal visible={this.state.readOpen}
                title={'Open Record'}
                content={this.readModalContent()}
                buttons={[
                    { text: 'Cancel', onPress: () => this.setState({ readOpen: false }) }
                ]}
                height={windowHeight() > windowWidth() ? 0.6 : 0.88}
                onBack={() => this.setState({ readOpen: false })}
                titleStyle={{ color: color.grey, alignSelf: 'center' }}
            />
            <IconWrapper
                onPress={() => {
                    RNFetchBlob.fs.ls(this.props.folder).then((files) => this.setState({ fileList: files }));
                    this.setState({ readOpen: true });
                }}
                name={'magnifying-glass'} type={'entypo'} color={color.white} size={25}
                disabled={!this.props.buttonAccess}
                style={[styles.buttons, { backgroundColor: color.dark_cyan }]} />
        </View>
    }
}
