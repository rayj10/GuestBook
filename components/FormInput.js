/*
  Creates a Form component that accepts an array of fields and
  creates the TextInput for each field, renders a button and also
  in charge of validating the data and extracting the data to be
  passed to the API
*/

import React from 'react';
import PropTypes from 'prop-types'
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';

import { validate, isEmpty } from '../utils/validate';
import AuthTextInput from './AuthTextInput';
import CheckBoxWrapper from './CheckBoxWrapper';
import { color, windowWidth, normalize, fontSize, fontFamily, windowHeight } from '../theme/baseTheme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const styles = StyleSheet.create({
    image: {
        height: normalize(150),
        alignSelf: 'center',
        resizeMode: 'contain'
    },

    activityIndicatorContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: normalize(24),
        paddingBottom: normalize(54),
    },

    containerView: {
        marginTop: normalize(24),
        marginBottom: normalize(34),
    },

    button: {
        backgroundColor: color.blue,
        height: normalize(55)
    },

    buttonText: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.medium
    }
});

class FormInput extends React.Component {
    constructor(props) {
        super(props);

        const { fields, error } = props;

        this.state = this.createState(fields, error);

        //bind functions
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidUpdate() {
        let { fields, error } = this.props;
        let updated = false;

        //if any of the values is different not because of any typing, change updated to true, if it's not already true
        if (!this.typing)
            fields.forEach(obj => obj.value !== this.state[obj.key].value && !updated ? updated = true : null);

        if (updated) {
            this.setState(this.createState(fields, error));
        }
    }

    /**
     * Iterate the fields and create state based on that
     * @param {Object} fields: Input from textboxes
     * @param {Object} error: Error messages 
     */
    createState(fields, error) {
        const state = {};
        fields.forEach((field) => {
            let { key, type, value } = field;
            state[key] = { type: type, value: value };
        })

        state["error"] = error;
        state["submitted"] = false;

        return state;
    }

    /**
     * Validates input fields and determine whether to show error or log user in
     */
    onSubmit() {
        this.setState({ submitted: true }); //shows activity indicator
        this.typing = false;

        const data = this.state;
        const result = validate(data);
        if (!result.success) {
            this.setState({ error: result.error });
            this.setState({ submitted: false });     //terminate activity indicator
        }
        else
            this.props.onSubmit(this.extractData(data), () => this.setState({ submitted: false }));
    }

    /**
     * Extract validated data from textboxes form it into Object of login credentials
     * @param {Object} data: Textbox input 
     */
    extractData(data) {
        const retData = {};

        Object.keys(data).forEach(function (key) {
            if (key !== "error" && key !== "submitted") {
                let { value } = data[key];
                retData[key] = value;

            }
        });

        //empty all inputs
        this.props.fields.forEach((field) => {
            let { key, type, value } = field;
            this.state[key] = { type: type, value: value };
        })
        this.state["error"] = this.props.error;

        return retData;
    }

    /**
     * Update textbox input display using state
     * @param {String} key: Textbox name 
     * @param {String} text: Textbox content 
     */
    onChange(key, text) {
        this.typing = true;
        const state = this.state;
        state[key]['value'] = text;
        this.setState(state);
    }

    render() {
        const { fields, showLabel, buttonTitle } = this.props;

        return (
            <KeyboardAwareScrollView contentContainerStyle={{ marginVertical: 20 }}>
                <Image source={require('../assets/guestbook.png')} style={[styles.image, { width: windowWidth() - 20 }]} />
                {
                    fields.map((data, idx) => {
                        let { key, label, placeholder, autoFocus, secureTextEntry } = data;
                        if (this.state[key].type === 'picker') {
                            return (
                                <View key={key} style={{ marginVertical: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {placeholder.map((item, index) => <CheckBoxWrapper key={index} style={{ flex: 1, padding: 0 }} title={item} current={this.state[key].value} onCheck={() => this.onChange(key, item)} />)}
                                    </View>
                                    {(!isEmpty(this.state.error[key])) &&
                                        <FormValidationMessage>
                                            {this.state.error[key]}
                                        </FormValidationMessage>}
                                </View>)
                        }
                        else
                            return (
                                <AuthTextInput key={key}
                                    label={label}
                                    showLabel={showLabel}
                                    placeholder={placeholder}
                                    autoFocus={autoFocus}
                                    onChangeText={(text) => this.onChange(key, text)}
                                    secureTextEntry={secureTextEntry}
                                    value={this.state[key]['value']}
                                    error={this.state.error[key]} />
                            )
                    })
                }
                {
                    this.state.submitted ?
                        <View style={styles.activityIndicatorContainer}>
                            <ActivityIndicator animating={this.state.isSubmitted} size='large' />
                        </View>
                        :
                        <Button
                            raised
                            title={buttonTitle}
                            borderRadius={4}
                            containerViewStyle={[styles.containerView, { width: windowWidth() - 40 }]}
                            buttonStyle={styles.button}
                            textStyle={styles.buttonText}
                            onPress={this.onSubmit} />
                }
            </KeyboardAwareScrollView>
        );
    }
}

FormInput.propTypes = {
    fields: PropTypes.array,
    showLabel: PropTypes.bool,
    buttonTitle: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.object
}

export default FormInput;
