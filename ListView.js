import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';
import NavigationBar from './NavigationBar'

export default class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <View style={styles.constructor}>
                <NavigationBar
                    title={'Girl'}
                />
            </View>
        )
    }
};

const styles = StyleSheet.create({
    constructor: {
        flex: 1,
        backgroundColor:'white'
    },
    text: {
        fontSize: 22
    }

});
