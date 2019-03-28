import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { FormInput } from 'react-native-elements';
import RNSmtpMailer from "react-native-smtp-mailer";
import RNFetchBlob from 'rn-fetch-blob';
import Modal from 'react-native-modal';

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
        fontFamily: fontFamily.regular,
        fontSize: fontSize.regular,
        color: color.black,
        marginVertical: normalize(5),
        marginLeft: normalize(10),
        marginBottom: normalize(20)
    },
    inputContainer: {
        marginVertical: normalize(10),
        textAlignVertical: 'top',
        fontFamily: fontFamily.bold
    },
    sendingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendingText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xLarge,
        color: color.white,
        marginVertical: normalize(20)
    }
});

export default class SendFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sendFileOpen: false,
            sending: false,
            emailList: null,
            email: '',
            filename: ''
        };
    }

    sendModalContent() {
        return <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.dialogText}>{`Please specify the recipient and file name to send`}</Text>
            <FormInput
                autoCapitalize='none'
                containerStyle={{ borderBottomWidth: 0.3 }}
                underlineColorAndroid='#fff'
                placeholder={'Email Address'}
                autoFocus={false}
                onChangeText={(newText) => this.setState({ email: newText })}
                secureTextEntry={false}
                inputStyle={[styles.inputContainer, { width: 0.5 * windowWidth() }]}
                value={this.state.email} />
            <FormInput
                autoCapitalize='none'
                containerStyle={{ borderBottomWidth: 0.3 }}
                underlineColorAndroid='#fff'
                placeholder={'File Name'}
                autoFocus={false}
                onChangeText={(newText) => this.setState({ filename: newText })}
                secureTextEntry={false}
                inputStyle={styles.inputContainer}
                value={this.state.filename} />
        </View>
    }

    sendFile() {
        this.setState({ sending: true });

        setTimeout(() => { //workaround for IOS so modal doesn't get stuck
            RNFetchBlob.fs.ls(this.props.folder).then((folderContents) => {
                let isValid = this.state.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || (this.state.email === '' && this.state.emailList && this.state.emailList.length > 0);
                let paths = [], names = [], types = [];

                //if email valid, check file names
                if (isValid) {
                    var files = this.state.filename.split(/\s*,\s*/);
                    if (this.state.filename !== 'ALL') { //ALL is the keyword to send everything in the folder
                        files.map((item) => {
                            if (folderContents.indexOf(`${item}.csv`) >= 0) {
                                paths.push(`${this.props.folder}/${item}.csv`);  // The absolute path of the file from which to read data.
                                types.push('csv');   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                                names.push(`${item}.csv`);   // Optional: Custom filename for attachment
                            }
                            else {
                                isValid = false;
                                return null;
                            }
                        })
                    }
                    else {
                        folderContents.map((item) => {
                            paths.push(`${this.props.folder}/${item}`);  // The absolute path of the file from which to read data.
                            types.push('csv');   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                            names.push(`${item}`);   // Optional: Custom filename for attachment
                        })
                    }
                    //if attachments could be located, build email
                    if (isValid && paths.length > 0) {
                        RNSmtpMailer.sendMail({
                            mailhost: "smtp.gmail.com",
                            port: "465",
                            ssl: true, //if ssl: false, TLS is enabled,**note:** in iOS TLS/SSL is determined automatically, so either true or false is the same
                            username: "cbn.mobileapps@gmail.com",
                            password: "Cbn1nt3rnal",
                            from: "cbn.mobileapps@gmail.com",
                            recipients: `${this.state.email + (this.state.emailList.length > 0 && this.state.email !== '' ? ',' : '')}${this.state.emailList.join(',')}`,
                            subject: "Guest Book: Your Requested Files has Arrived",
                            htmlBody: "Dear User,<br><br>Please find attached your csv files containing list of your registered guests<br><br>Regards,<br>Guest Book Team",
                            attachmentPaths: paths,
                            attachmentNames: names,
                            attachmentTypes: types
                        })
                            .then(success => {
                                this.setState({ sending: false });

                                setTimeout(() => {
                                    if (this.state.filename === 'ALL')
                                        Alert.alert('Email Sent', `Every GuestBook files on this device has been attached and emailed to ${this.state.email ? this.state.email : 'the default recipients'}`);
                                    else {
                                        var names = this.state.filename.split(/\s*,\s*/);
                                        var buildStr = (arr) => {
                                            if (arr.length === 1)
                                                return `${arr[0]}.csv`;
                                            if (arr.length === 2)
                                                return `${arr[0]}.csv and ${arr[1]}.csv`; 
                                            else
                                                return `${arr[0]}.csv, ${buildStr(arr.slice(1))}`;
                                        }
                                        names = buildStr(names);

                                        Alert.alert('Email Sent', `File ${names} has been attached and emailed to ${this.state.email ? this.state.email : 'the default recipients'}`);
                                    }
                                    this.setState({ email: '', filename: '' });
                                }, 1000);
                            })
                            .catch(err => { this.setState({ sending: false, email: '', filename: '' }); alert(err); });
                    }
                    else {
                        this.setState({ sending: false });
                        setTimeout(() => {
                            Alert.alert(`Invalid File Name`, 'One or more of your files could not be located');
                        }, 1000);
                    }
                }
                else {
                    this.setState({ sending: false });
                    setTimeout(() => {
                        Alert.alert(`Invalid Email Address`, 'Please try a different one');
                    }, 1000);
                }
            });
        }, 1200);
    }

    render() {
        return <View style={{ flex: 1 }}>
            <DialogBoxModal visible={this.state.sendFileOpen}
                title={'Send Record'}
                content={this.sendModalContent()}
                buttons={[
                    { text: 'Cancel', onPress: () => this.setState({ sendFileOpen: false }) },
                    { text: 'Send', onPress: () => { this.setState({ sendFileOpen: false }); this.sendFile(); } }
                ]}
                height={windowHeight() > windowWidth() ? 0.6 : 0.88}
                onBack={() => this.setState({ sendFileOpen: false })}
                titleStyle={{ color: color.grey, alignSelf: 'center' }}
            />
            <Modal isVisible={this.state.sending} hideModalContentWhileAnimating={true} animationIn="zoomInDown" animationOut="zoomOutUp" animationInTiming={200} animationOutTiming={200} >
                <View style={styles.sendingContainer}>
                    <Text style={styles.sendingText}>Sending...</Text>
                    <ActivityIndicator animating={true} size='large' />
                </View>
            </Modal>
            <IconWrapper
                onPress={() =>
                    AsyncStorage.getItem('recipients').then((emails) => {
                        var emailList = [];
                        if (emails)
                            emailList = JSON.parse(emails);
                        this.setState({ sendFileOpen: true, emailList });
                    }).catch((e) => alert(e))
                }
                name={'send'} type={null} color={color.white} size={25}
                disabled={!this.props.buttonAccess}
                style={[styles.buttons, { transform: [{ rotate: '310deg' }], backgroundColor: color.olive }]} />

        </View>
    }
}
