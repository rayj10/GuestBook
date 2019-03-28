import React from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';

import { normalize, color } from '../theme/baseTheme';

const IconWrapper = (props) => {
    return (
        <View style={[props.style, props.disabled ? { backgroundColor: color.light_grey } : null]}>
            <TouchableOpacity
                onPress={props.onPress}
                disabled={props.disabled ? props.disabled : false}
                hitSlop={{ top: 15, left: 15, bottom: 15, right: 15 }}
            >
                <Icon name={props.name} type={props.type} color={props.color} size={normalize(props.size)} />
            </TouchableOpacity>
        </View>
    );
}

IconWrapper.propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    color: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

export default IconWrapper;