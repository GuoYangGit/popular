import React from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

export default class ViewUtils {
    static getLeftButton(callback) {
        return <TouchableOpacity
            style={{padding: 8}}
            onPress={callback}>
            <Image
            style={{width:26,height:26,tintColor:'white'}}
            source={require('../../res/image/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }

    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#FFFFFF',}}>{title}</Text>
            </View>
        </TouchableOpacity>
    }
}