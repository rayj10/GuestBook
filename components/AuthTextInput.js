import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import { isEmpty } from '../utils/validate';
import { windowWidth, fontSize, fontFamily, normalize, color } from '../theme/baseTheme';
import IconWrapper from './IconWrapper';

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },

    inputContainer: {
        height: normalize(55),
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.bold,
        alignSelf: 'center'
    }
});

class AuthTextInput extends Component {
    state = {
        secureText: this.props.secureTextEntry
    }

    render() {
        const { showLabel, placeholder, autoFocus, onChangeText, label, secureTextEntry, value } = this.props;

        return (
            <View style={styles.container}>
                {
                    (showLabel) &&
                    <FormLabel>{label}</FormLabel>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <FormInput
                        autoCapitalize='none'
                        containerStyle={{ borderBottomWidth: 0 }}
                        underlineColorAndroid='#fff'
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        onChangeText={onChangeText}
                        secureTextEntry={this.state.secureText}
                        inputStyle={[styles.inputContainer, { width: windowWidth() - 40 }, secureTextEntry ? { width: windowWidth() - 90, alignSelf: 'flex-start' } : null]}
                        value={value} />
                    {
                        secureTextEntry && value !== '' ?
                            this.state.secureText ?
                                <IconWrapper name="visibility" size={20} color={color.light_grey} style={{ justifyContent: 'center' }} onPress={() => this.setState({ secureText: false })} />
                                :
                                <IconWrapper name="visibility-off" size={20} color={color.light_grey} style={{ justifyContent: 'center' }} onPress={() => this.setState({ secureText: true })} />
                            :
                            null
                    }
                </View>
                {
                    (!isEmpty(this.props.error)) &&
                    <FormValidationMessage>
                        {this.props.error}
                    </FormValidationMessage>
                }
            </View>
        );
    }
}

AuthTextInput.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChangeText: PropTypes.func.isRequired,
    secureTextEntry: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.string,
}

AuthTextInput.defaultProps = {
    autoFocus: false,
    secureTextEntry: false
}

export default AuthTextInput;
