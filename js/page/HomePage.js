/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import MyPage from './my/MyPage'
import Toast,{DURATION} from 'react-native-easy-toast'

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "tb_popular",
        }
    }

    componentDidMount(){
        this.listener=DeviceEventEmitter.addListener('showToast',(text)=>{
            this.toast.show(text,DURATION.LENGTH_SHORT);
        })
    }

    componentWillUnmount(){
        this.listener&&this.listener.remove();
    }

    renderTab(Component,selectTab,title,renderIcon){
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === selectTab}
                selectedTitleStyle={{color: '#2196F3'}}
                title={title}
                renderIcon={() => <Image style={styles.image} source={renderIcon}/>}
                renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196F3'}]}
                                                 source={renderIcon}/>}
                onPress={() => this.setState({selectedTab: selectTab})}>
                <Component {...this.props}/>
            </TabNavigator.Item>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this.renderTab(PopularPage,'tb_popular','最热',require('../../res/image/ic_polular.png'))}
                    {this.renderTab(TrendingPage,'tb_trending','趋势',require('../../res/image/ic_trending.png'))}
                    {this.renderTab(View,'tb_favorite','收藏',require('../../res/image/ic_favorite.png'))}
                    {this.renderTab(MyPage,'tb_my','我的',require('../../res/image/ic_my.png'))}
                </TabNavigator>
                <Toast ref={toast=>this.toast = toast}/>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: 'red',
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    image: {
        height: 22,
        width: 22,
    }
});
