/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image,
    Text,
    View
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import Boy from './Boy';
import ListView from './ListView'

export default class Hello extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
        this.state = {
            selectedTab: "tb_popular",
            dataSource:ds.cloneWithRows(),
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_polular'}
                        selectedTitleStyle={{color: 'red'}}
                        title="最热"
                        renderIcon={() => <Image style={styles.image} source={require('./res/image/ic_polular.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                                         source={require('./res/image/ic_polular.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_polular'})}>
                        <View style={styles.page1}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        selectedTitleStyle={{color: 'yellow'}}
                        title="趋势"
                        renderIcon={() => <Image style={styles.image} source={require('./res/image/ic_trending.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                                         source={require('./res/image/ic_trending.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_trending'})}>
                        <View style={styles.page2}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favorite'}
                        selectedTitleStyle={{color: 'red'}}
                        title="收藏"
                        renderIcon={() => <Image style={styles.image} source={require('./res/image/ic_favorite.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                                         source={require('./res/image/ic_favorite.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_favorite'})}>
                        <View style={styles.page1}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_my'}
                        selectedTitleStyle={{color: 'yellow'}}
                        title="我的"
                        renderIcon={() => <Image style={styles.image} source={require('./res/image/ic_my.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                                         source={require('./res/image/ic_my.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_my'})}>
                        <View style={styles.page2}></View>
                    </TabNavigator.Item>
                </TabNavigator>*/}
                {/*<Navigator
                    initialRoute={{
                        component: Boy
                    }}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component navigator={navigator} {...route.params}/>
                    }}></Navigator>*/}

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

AppRegistry.registerComponent('Hello', () => Hello);
