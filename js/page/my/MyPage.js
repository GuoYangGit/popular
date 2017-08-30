/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'

export default class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title="我的"
                    style={{backgroundColor:'#6495ED'}}
                />
                <Text
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{
                                ...this.props,
                                flag:FLAG_LANGUAGE.flag_key
                            }
                        })
                    }}
                    style={styles.tips}>自定义标签</Text>
                <Text
                    onPress={()=>{
                        this.props.navigator.push({
                            component:SortKeyPage,
                            params:{
                                ...this.props,
                                flag:FLAG_LANGUAGE.flag_key
                            }
                        })
                    }}
                    style={styles.tips}>标签排序</Text>
                <Text
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{
                                ...this.props,
                                isRemoveKey:true,
                                flag:FLAG_LANGUAGE.flag_key
                            }
                        })
                    }}
                    style={styles.tips}>标签移除</Text>
                <Text
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{
                                ...this.props,
                                flag:FLAG_LANGUAGE.flag_language
                            }
                        })
                    }}
                    style={styles.tips}>自定义语言</Text>
                <Text
                    onPress={()=>{
                        this.props.navigator.push({
                            component:SortKeyPage,
                            params:{
                                ...this.props,
                                flag:FLAG_LANGUAGE.flag_language
                            }
                        })
                    }}
                    style={styles.tips}>语言排序</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    tips: {
        fontSize: 29,
    },
});
