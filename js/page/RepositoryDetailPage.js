/**
 * RepositoryDetail
 * @flow
 **/
'use strict'
import React, {Component} from 'react'
import {
    StyleSheet,
    WebView,
    Image,
    TouchableOpacity,
    View,
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import FavoriteDao from '../expand/dao/FavoriteDao'


const TRENDING_URL = 'https://github.com/';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url = this.props.projectModel.html_url ? this.props.projectModel.html_url
            : TRENDING_URL + this.props.projectModel.fullName;
        let title = this.props.projectModel.full_name ? this.props.projectModel.full_name
            : this.props.projectModel.fullName;
        this.favoriteDao=new FavoriteDao(this.flag);
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.isFavorite ? require('../../res/image/ic_star_navbar.png') :
                require('../../res/image/ic_unstar_navbar.png')
        }
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
        })
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/image/ic_star_navbar.png') :
                require('../../res/image/ic_unstar_navbar.png')
        })
    }


    onRightButtonClick(){
        var projectModel=this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite=!projectModel.isFavorite);
        var key=projectModel.fullName?projectModel.fullName.toString():projectModel.id.toString();
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    getRightButton(){
        return <TouchableOpacity
            onPress={()=>this.onRightButtonClick()}
        >
            <Image
                source={this.state.favoriteIcon}
                style={{width:20,height:20,marginRight:10}}
            />
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#2196F3'}}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                    rightButton={this.getRightButton()}
                />
                <WebView
                    ref={WebView => this.webView = WebView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    tips: {
        fontSize: 29
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    input: {
        height: 40,
        flex: 1,
        borderWidth: 1,
        margin: 2,
    }
})
