import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import { color, fontFamily, fontSize, windowWidth, windowHeight, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    dialogBox: {
        backgroundColor: color.white,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: 0
    },
    bodyContainer: {
        flex: 0,
        justifyContent: 'center',
        padding: 8
    },
    titleTextStyle: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.bold,
        marginVertical: 10,
    },
    textStyle: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.regular,
        marginBottom: 5,
    },
    inputContainer: {
        flex: 1.6,
        marginHorizontal: 5,
        marginVertical: 5
    },
    buttonContainer: {
        flex: 0,
        borderTopWidth: 0.5,
        borderColor: color.light_grey,
    },
    innerButtonContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        borderWidth: 0.5,
        borderColor: color.light_grey
    },
    buttonText: {
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.medium,
        color: color.light_blue
    }
});

const DialogBoxModal = (props) => {
    let { buttons, onBack } = props;
    let h, boxHeight, bodyHeight, buttonHeight;
    let portrait = windowHeight() > windowWidth();

    if (props.height)
        h = props.height;
    else {
        if (typeof props.content === 'string')
            h = 0.067 * props.content.split("\n").length;
        else
            h = 0.067 * props.content.length;
    }

    h = h > 0.25 ? h : portrait ? 0.25 : 0.4;
    boxHeight = h * windowHeight();
    buttonHeight = (buttons.length < 3 ? h > 0.25 ? 0.16 : 0.25 : 0.18) * boxHeight;
    buttonHeight = buttonHeight > normalize(45) ? normalize(45) : buttonHeight; //setting max height for button container
    buttonHeight = buttons.length === 3 ? buttonHeight * 2 : buttonHeight; //if there needs to be 2 layers of buttons, double the container size
    bodyHeight = boxHeight - buttonHeight;

    //TODO: conditions on line this+6 needs revision for buttons = 3
    return (
        <Modal isVisible={props.visible} hideModalContentWhileAnimating={true} animationIn="zoomInDown" animationOut="zoomOutUp" animationInTiming={200} animationOutTiming={200} onBackButtonPress={onBack} onBackdropPress={onBack} >
            <View style={[styles.dialogBox, { width: (portrait ? 0.88 : 0.5) * windowWidth(), height: boxHeight }]} >
                <View style={[styles.bodyContainer, { height: bodyHeight }]}>
                    <Text style={[styles.titleTextStyle, props.titleStyle]}> {props.title} </Text>
                    <View style={styles.inputContainer}>
                        <ScrollView showVerticalScrollIndicator={false}>
                            {props.content}
                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.buttonContainer, { height: buttonHeight }]}>
                    {
                        buttons.length > 1 ?
                            <View style={styles.innerButtonContainer}>
                                <TouchableOpacity onPress={buttons[0].onPress} style={{ flex: 1 }}>
                                    <View style={[styles.button, buttons.length === 2 ? { borderBottomLeftRadius: 8 } : null]}>
                                        <Text style={styles.buttonText}>{buttons[0].text}</Text>
                                    </View>
                                </TouchableOpacity>
                                {
                                    buttons.length > 2 ?
                                        <TouchableOpacity onPress={buttons[1].onPress} style={{ flex: 1 }}>
                                            <View style={[styles.button, { borderBottomRightRadius: 8 }]}>
                                                <Text style={styles.buttonText}>{buttons[1].text}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={buttons[buttons.length - 1].onPress} style={{ flex: 1 }}>
                                            <View style={[styles.button, { borderBottomRightRadius: 8 }]}>
                                                <Text style={styles.buttonText}>{buttons[buttons.length - 1].text}</Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View> : null
                    }
                    {
                        buttons.length !== 2 ?
                            <TouchableOpacity onPress={buttons[buttons.length - 1].onPress} style={{ flex: 1 }}>
                                <View style={[styles.button, { borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }]}>
                                    <Text style={styles.buttonText}>{buttons[buttons.length - 1].text}</Text>
                                </View>
                            </TouchableOpacity> : null
                    }
                </View>
            </View>
        </Modal >
    )
}

DialogBoxModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.any.isRequired,
    buttons: PropTypes.array.isRequired
}

export default DialogBoxModal;