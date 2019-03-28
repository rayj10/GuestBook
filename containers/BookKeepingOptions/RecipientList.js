import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { FormInput, FormValidationMessage } from 'react-native-elements';

import DialogBoxModal from '../../components/DialogBoxModal';
import IconWrapper from '../../components/IconWrapper';
import { color, normalize, fontSize, fontFamily, windowWidth, windowHeight } from '../../theme/baseTheme';

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
    listContainer: {
        marginTop: normalize(10),
        borderColor: color.grey,
        borderWidth: 0.2
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
    deleteText: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.bold,
        color: color.red,
        marginRight: normalize(10)
    },
    inputContainer: {
        marginVertical: normalize(10),
        textAlignVertical: 'top',
        fontFamily: fontFamily.bold
    },
    addText: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.bold,
        color: color.light_blue
    }
});

export default class RecipientList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipientOpen: false,
            emailList: null,
            newEmail: ''
        };
    }

    manageRecipientModalContent() {
        var emails = null;
        if (this.state.emailList && this.state.emailList.length > 0) {
            emails = this.state.emailList.map((item, key) =>
                <View key={key} style={styles.listItem}>
                    <Text style={styles.listText}>{item}</Text>
                    <TouchableOpacity onPress={() => this.deleteEmail(item)}>
                        <Text style={styles.deleteText}> Remove </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else
            emails = <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.dialogText}> No default recipient to be displayed </Text>
            </View >;

        return <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={[styles.listContainer, { height: 0.25 * windowHeight() }]}>
                <ScrollView>
                    {emails}
                </ScrollView>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginVertical: normalize(10) }}>
                <View>
                    <FormInput
                        autoCapitalize='none'
                        containerStyle={{ borderBottomWidth: 0.3 }}
                        underlineColorAndroid='#fff'
                        placeholder={'Email Address'}
                        autoFocus={false}
                        onChangeText={(newText) => this.setState({ newEmail: newText })}
                        secureTextEntry={false}
                        inputStyle={[styles.inputContainer, { width: 0.6 * windowWidth() }]}
                        value={this.state.newEmail} />
                    {
                        this.state.newEmail === null &&
                        <FormValidationMessage>
                            Invalid Email Address
                        </FormValidationMessage>
                    }
                </View>
                <TouchableOpacity onPress={() => this.addEmail()} style={{ marginVertical: normalize(10), justifyContent: 'center' }}>
                    <Text style={styles.addText}> Add </Text>
                </TouchableOpacity>
            </View>
        </View>

    }

    addEmail() {
        var emails = this.state.emailList;
        if (!this.state.newEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
            this.setState({ newEmail: null });
        else {
            emails.push(this.state.newEmail);
            this.setState({ emailList: emails, newEmail: '' });
        }
    }

    deleteEmail(email) {
        var emails = this.state.emailList;
        var idx = emails.indexOf(email);
        emails.splice(idx, 1);
        this.setState({ emailList: emails });
    }

    updateStorage() {
        //asyncstorage save emails, encode json
        AsyncStorage.setItem('recipients', JSON.stringify(this.state.emailList)).catch((e) => alert(e));
        this.setState({ recipientOpen: false, newEmail: '', emailList: null });
    }

    render() {
        return <View style={{ flex: 1 }}>
            <DialogBoxModal visible={this.state.recipientOpen}
                title={'Default Recipients'}
                content={this.manageRecipientModalContent()}
                buttons={[
                    { text: 'Save', onPress: this.updateStorage.bind(this) }
                ]}
                height={windowHeight() > windowWidth() ? 0.6 : 0.88}
                onBack={this.updateStorage.bind(this)}
                titleStyle={{ color: color.grey, alignSelf: 'center' }}
            />
            <IconWrapper
                onPress={() => {
                    //asyncstorage get emails, decode json
                    AsyncStorage.getItem('recipients').then((emails) => {
                        var emailList = [];
                        if (emails)
                            emailList = JSON.parse(emails);
                        this.setState({ recipientOpen: true, emailList });
                    }).catch((e) => alert(e));
                }}
                name={'address-book-o'} type={'font-awesome'} color={color.white} size={25}
                disabled={!this.props.buttonAccess}
                style={[styles.buttons, { backgroundColor: color.dark_blue }]} />
        </View>
    }
}
