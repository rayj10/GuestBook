import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { FormInput, FormValidationMessage } from 'react-native-elements';
import { connect } from 'react-redux';

import DialogBoxModal from './DialogBoxModal';
import IconWrapper from './IconWrapper';
import { color, normalize, fontSize, fontFamily, windowWidth, windowHeight } from '../theme/baseTheme';

export const mapStateToProps = state => ({
  adminOptions: state.miscReducer.adminOptions
});

/**
 * Hides components under password protected animated view
 * TODO: 
 * To make it customizeable, floatingButton need to come from props, 
 * container animatedContainer size = window and animatedContainer position = -window
 */

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    width: normalize(45),
    height: normalize(45),
    borderRadius: normalize(22.5),
    backgroundColor: color.light_blue,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowOpacity: 0.4,
    elevation: 5
  },
  animatedContainer: {
    position: 'absolute',
    top: normalize(65),
    right: normalize(-45),
    backgroundColor: 'transparent',
    width: normalize(45)
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
  }
});

class ProtectedView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passOpen: false,
      password: '',
      adminAccess: false,
      isPortrait: windowHeight() > windowWidth(),
      animationValue: new Animated.Value(0), //This is the initial position of the subview
    };
  }

  orientationChange = () => this.forceUpdate();

  componentDidMount() {
    Dimensions.addEventListener('change', this.orientationChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.orientationChange);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.adminAccess !== this.state.adminAccess) {
      var toValue = normalize(0);

      if (this.state.adminAccess) {
        toValue = normalize(-55);
      }

      Animated.spring(this.state.animationValue, {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }

  passModalContent() {
    return <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={styles.dialogText}>{`Please enter password below to unlock administrator\'s options`}</Text>
      <FormInput
        autoCapitalize='none'
        containerStyle={{ borderBottomWidth: 0.3 }}
        underlineColorAndroid='#fff'
        placeholder={'Password'}
        autoFocus={true}
        onChangeText={(newText) => this.setState({ password: newText })}
        secureTextEntry={true}
        inputStyle={[styles.inputContainer, { width: 0.5 * windowWidth() }]}
        value={this.state.password} />
      {
        this.state.password === null &&
        <FormValidationMessage>
          Invalid password
          </FormValidationMessage>
      }
    </View>
  }

  render() {
    //width = windowWidth() would block the entire view and touchables on IOS
    return (
      <View style={{ position: 'absolute', width: 0, right:0, height: windowHeight() }}>
        <DialogBoxModal visible={this.state.passOpen}
          title={'Password Required'}
          content={this.passModalContent()}
          buttons={[
            { text: 'Cancel', onPress: () => this.setState({ passOpen: false }) },
            {
              text: 'Unlock', onPress: () =>  //validate password
                this.state.password !== this.props.password ?
                  this.setState({ password: null })
                  :
                  this.setState({ password: '', adminAccess: true, passOpen: false })
            }
          ]}
          height={windowHeight() > windowWidth() ? 0.6 : 0.88}
          onBack={() => this.setState({ passOpen: false })}
          titleStyle={{ color: color.grey, alignSelf: 'center' }}
        />
        <View display={this.props.adminOptions ? 'flex' : 'none'} >
          <IconWrapper
            onPress={() => this.state.adminAccess ? this.setState({ adminAccess: false }) : this.setState({ passOpen: true })}
            name={this.state.adminAccess ? 'unlock-alt' : 'lock'} type={'font-awesome'} color={color.white} size={25}
            style={styles.floatingButton} />
          < Animated.View style={[
            styles.animatedContainer, { height: windowHeight() },
            { transform: [{ translateX: this.state.animationValue }] },
          ]}>
            {this.props.protectedContents(this.state.adminAccess)}
          </Animated.View>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps, null)(ProtectedView);