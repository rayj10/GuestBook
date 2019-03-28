import React from 'react';
import { CheckBox } from 'react-native-elements';
import { View } from 'react-native';

import { color, normalize } from '../theme/baseTheme';

class CheckBoxWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false
        }
    }

    componentDidUpdate() {
        if (this.props.current === '' && this.state.checked !== (this.props.current === this.props.title)) {
            this.setState({ checked: this.props.current === this.props.title });
        }
    }
    
    render() {
        return (
            <View style={this.props.style} >
                <CheckBox
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    containerStyle={{ flex: 0.6, margin: 0, borderWidth: 0, backgroundColor: color.background }}
                    size={normalize(18)}
                    title={this.props.title}
                    checked={this.props.current ? this.props.current === this.props.title : this.state.checked}
                    onPress={() => {
                        this.setState({ checked: !this.state.checked });
                        this.props.onCheck()
                    }}
                />
            </View>
        );
    }
}

export default CheckBoxWrapper;
