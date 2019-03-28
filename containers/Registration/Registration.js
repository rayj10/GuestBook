import React from 'react';
import { View, Keyboard, Alert, PermissionsAndroid, Platform, Dimensions, ImageBackground } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Actions } from 'react-native-router-flux';

import { normalize, color } from '../../theme/baseTheme';
import FormInput from '../../components/FormInput';
import IconWrapper from '../../components/IconWrapper';
import styles from './styles';
import AesCtr from '../../utils/AESCtr';

//initialize values to be passed as props to Form
const fields = [
    {
        key: 'name',
        label: "Name",
        placeholder: "Nama Lengkap",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "name"
    },
    {
        key: 'company',
        label: "Company",
        placeholder: "Perusahaan",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "company"
    },
    {
        key: 'mobile',
        label: "Mobile",
        placeholder: "Handphone",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "mobile"
    },
    {
        key: 'host',
        label: "Host",
        placeholder: "Bertemu Dengan",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "host"
    },
    {
        key: 'needs',
        label: "Needs",
        placeholder: "Keperluan",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "needs"
    },
];
const error = {
    name: "",
    company: "",
    phone: "",
    mobile: "",
    host: "",
    needs: ""
}

const headerString = 'Name,Company,Mobile,Host,Needs,Time\n';

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: error,
            folderCreated: false,
            updatedFields: null
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    orientationChange = () => this.forceUpdate();

    componentDidMount() {
        Dimensions.addEventListener('change', this.orientationChange);
        this.pathToFolder = this.props.folder;
        this.pathToWrite = `${this.pathToFolder}/${this.props.filename}`;
        this.mounted = true;

        //Check Permission - Check if folder exists - if not, create the folder
        if (Platform.OS === 'android') {
            if (Platform.Version >= 23) {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(
                    permission => {
                        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                            RNFetchBlob.fs.exists(this.pathToFolder).then(exists => {
                                if (!exists)
                                    RNFetchBlob.fs.mkdir(this.pathToFolder).then(() => this.setState({ folderCreated: true })).catch((err) => alert(err));
                                else if (this.mounted)
                                    this.setState({ folderCreated: true });
                            });
                        }
                        else {
                            Alert.alert("Permission denied", "Please allow access to device storage from settings to use this app");
                        }
                    }
                )
                    .catch(error => alert(error));
            }
            else {
                RNFetchBlob.fs.exists(this.pathToFolder).then(exists => {
                    if (!exists)
                        RNFetchBlob.fs.mkdir(this.pathToFolder).then(() => this.setState({ folderCreated: true })).catch((err) => alert(err));
                    else if (this.mounted)
                        this.setState({ folderCreated: true });
                });
            }
        }
        else {
            RNFetchBlob.fs.exists(this.pathToFolder).then(exists => {
                if (!exists)
                    RNFetchBlob.fs.mkdir(this.pathToFolder).then(() => this.setState({ folderCreated: true })).catch((err) => alert(err));
                else if (this.mounted)
                    this.setState({ folderCreated: true });
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //when the system has made sure that folder is created, create the daily files
        if (prevState.folderCreated !== this.state.folderCreated && this.state.folderCreated) {
            RNFetchBlob.fs.exists(this.pathToWrite).then(exists => {
                if (!exists)
                    RNFetchBlob.fs
                        .writeFile(this.pathToWrite, headerString, 'utf8')
                        .then(() => {
                            Alert.alert('File Created', `File ${this.props.filename} is ready to use`);
                        })
                        .catch(error => alert(error));
            });
        }

        if (this.props.scannedInfo && this.state.updatedFields === null) {
            let fieldWithVals = fields.map((obj, i) => { var newObj = Object.assign({}, obj); newObj.value = this.props.scannedInfo[i]; return newObj; });
            this.setState({ updatedFields: fieldWithVals });
        }
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.orientationChange);
        this.mounted = false;
    }

    /**
     * When Login button pressed, try registering user's device to system then send user to home page on succession
     * @param {Object} data: inputs from Form's fields
     * @param {Function} callback: Executed to stop activity indicator
     */
    onSubmit(data, callback) {
        this.setState({ error: error }); //clear out error messages
        Keyboard.dismiss(); //close keyboard

        var date = new Date();
        var month = date.getMonth() + 1, day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes();

        information = '';
        Object.keys(data).forEach(key => information = `${information}${data[key]},`);
        //Add timestamp and newline
        information = information + `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${date.getFullYear()} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}\n`;

        //encryption measure, only when it's new information, not from qr
        if (!this.state.updatedFields) {
            var key = `Y${day < 10 ? '0' + day : day}@${month < 10 ? '0' + month : month}R${date.getFullYear()}`;
            var encryption = `${AesCtr.encrypt(information, key, 256)}R10j/W${AesCtr.encrypt(key, 'gu3stB0ok', 128)}`;
        }

        if (Platform.OS === 'android') {
            if (Platform.Version >= 23) {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(
                    permission => {
                        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                            RNFetchBlob.fs.exists(this.pathToWrite).then(exists => {
                                if (!exists)
                                    RNFetchBlob.fs
                                        .writeFile(this.pathToWrite, headerString + information, 'utf8')
                                        .then(() => {
                                            callback();
                                            if (this.state.updatedFields) {
                                                Alert.alert('Welcome Back!', 'Your visitation record has been updated');
                                                //reset props and state
                                                Actions.refresh({ scannedInfo: null });
                                                this.setState({ updatedFields: null });
                                            }
                                            else
                                                Actions.qrGenerator({ content: encryption });
                                        })
                                        .catch(error => { alert(error); callback(); });
                                else
                                    RNFetchBlob.fs
                                        .appendFile(this.pathToWrite, information, 'utf8')
                                        .then(() => {
                                            callback();
                                            if (this.state.updatedFields) {
                                                Alert.alert('Welcome Back!', 'Your visitation record has been updated');
                                                //reset props and state
                                                Actions.refresh({ scannedInfo: null });
                                                this.setState({ updatedFields: null });
                                            }
                                            else
                                                Actions.qrGenerator({ content: encryption });
                                        })
                                        .catch(error => {
                                            alert(error);
                                            callback();
                                        });
                            });
                        }
                        else {
                            Alert.alert("Permission denied", "Please allow access to device storage from settings to use this app");
                            callback();
                        }
                    }
                )
                    .catch(error => {
                        alert(error);
                        callback();
                    });
            }
            else {
                RNFetchBlob.fs.exists(this.pathToWrite).then(exists => {
                    if (!exists)
                        RNFetchBlob.fs
                            .writeFile(this.pathToWrite, headerString + information, 'utf8')
                            .then(() => {
                                callback();
                                if (this.state.updatedFields) {
                                    Alert.alert('Welcome Back!', 'Your visitation record has been updated');
                                    //reset props and state
                                    Actions.refresh({ scannedInfo: null });
                                    this.setState({ updatedFields: null });
                                }
                                else
                                    Actions.qrGenerator({ content: encryption });
                            })
                            .catch(error => { alert(error); callback(); });
                    else
                        RNFetchBlob.fs
                            .appendFile(this.pathToWrite, information, 'utf8')
                            .then(() => {
                                callback();
                                if (this.state.updatedFields) {
                                    Alert.alert('Welcome Back!', 'Your visitation record has been updated');
                                    //reset props and state
                                    Actions.refresh({ scannedInfo: null });
                                    this.setState({ updatedFields: null });
                                }
                                else
                                    Actions.qrGenerator({ content: encryption });
                            })
                            .catch(error => {
                                alert(error);
                                callback();
                            });
                });
            }
        }
        else {
            RNFetchBlob.fs.exists(this.pathToWrite).then(exists => {
                if (!exists)
                    RNFetchBlob.fs
                        .writeFile(this.pathToWrite, headerString + information, 'utf8')
                        .then(() => {
                            callback();
                            if (this.state.updatedFields) {
                                Alert.alert('Welcome Back!', 'Your visitation record has been updated');
                                //reset props and state
                                Actions.refresh({ scannedInfo: null });
                                this.setState({ updatedFields: null });
                            }
                            else
                                Actions.qrGenerator({ content: encryption });
                        })
                        .catch(error => { alert(error); callback(); });
                else
                    RNFetchBlob.fs
                        .appendFile(this.pathToWrite, information, 'utf8')
                        .then(() => {
                            callback();
                            if (this.state.updatedFields) {
                                Alert.alert('Welcome Back!', 'Your visitation record has been updated');
                                //reset props and state
                                Actions.refresh({ scannedInfo: null });
                                this.setState({ updatedFields: null });
                            }
                            else
                                Actions.qrGenerator({ content: encryption });
                        })
                        .catch(error => {
                            alert(error);
                            callback();
                        });
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../assets/background.jpg')} style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'center' }}>
                    <FormInput fields={this.state.updatedFields ? this.state.updatedFields : fields}
                        showLabel={false}
                        onSubmit={this.onSubmit}
                        buttonTitle={this.state.updatedFields ? "Check In" : "Register"}
                        error={this.state.error} />
                    <IconWrapper
                        onPress={() => Actions.scanner()}
                        name={'qrcode-scan'} type={'material-community'} color={color.white} size={25}
                        style={styles.buttons} />
                </ImageBackground>
            </View>
        );
    }
}

export default Registration;
