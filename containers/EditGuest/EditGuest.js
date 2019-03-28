import React from 'react';
import { View, Keyboard, Alert, PermissionsAndroid, Platform, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Actions } from 'react-native-router-flux';

import { color } from '../../theme/baseTheme';
import FormInput from '../../components/FormInput';

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
        key: 'appointment',
        label: "Appointment",
        placeholder: "Bertemu Dengan",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "appointment"
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
    appointment: "",
    needs: ""
}

class EditGuest extends React.Component {
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

        let fieldWithVals = null;
        fieldWithVals = fields.map((obj, i) => { var newObj = Object.assign({}, obj); newObj.value = this.props.guests[this.props.guestIndex][i]; return newObj; });
        this.setState({ updatedFields: fieldWithVals });
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.orientationChange);
    }

    /**
     * When Login button pressed, try registering user's device to system then send user to home page on succession
     * @param {Object} data: inputs from Form's fields
     * @param {Function} callback: Executed to stop activity indicator
     */
    onSubmit(data, callback) {
        this.setState({ error: error }); //clear out error messages
        Keyboard.dismiss(); //close keyboard

        let table = this.props.guests //entire table in selected csv

        //replace edited row in table with newly saved row of data, guestIndex is the row position edited
        Object.keys(data).forEach((key, idx) => {
            table[this.props.guestIndex][idx] = data[key];
        });

        information = '';

        //for each row in guest table, rewrite it as string and put \n between each row
        table.forEach(row => {
            row.forEach(val => information = `${information}${val},`);
            information = information.slice(0, information.length - 1) + '\n'; //remove last comma and add newline
        });

        if (Platform.OS === 'android') {
            if (Platform.Version >= 23) {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(
                    permission => {
                        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                            RNFetchBlob.fs
                                .writeFile(this.pathToWrite, information, 'utf8')
                                .then(() => {
                                    Alert.alert('Information Updated', 'Guest\'s information has been updated successfully');
                                    Actions.registration();
                                })
                                .catch(error => {
                                    alert(error);
                                    callback();
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
                RNFetchBlob.fs
                    .writeFile(this.pathToWrite, information, 'utf8')
                    .then(() => {
                        Alert.alert('Information Updated', 'Guest\'s information has been updated successfully');
                        Actions.registration();
                    })
                    .catch(error => {
                        alert(error);
                        callback();
                    });
            }
        }
        else {
            RNFetchBlob.fs
                .writeFile(this.pathToWrite, information, 'utf8')
                .then(() => {
                    Alert.alert('Information Updated', 'Guest\'s information has been updated successfully');
                    Actions.registration();
                })
                .catch(error => {
                    alert(error);
                    callback();
                });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../assets/background.jpg')} style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'center' }}>
                    {
                        this.state.updatedFields ?
                            <FormInput fields={this.state.updatedFields}
                                showLabel={false}
                                onSubmit={this.onSubmit}
                                buttonTitle={"Update Information"}
                                error={this.state.error} />
                            :
                            <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator animating={true} size='large' />
                            </View>
                    }
                </ImageBackground>
            </View>
        );
    }
}

export default EditGuest;
