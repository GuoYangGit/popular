import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    View,
    Alert,
    RefreshControl,
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabview, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao ,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetailPage from './RepositoryDetailPage'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state={
            languages:[]
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then((result) => {
                this.setState({
                    languages: result
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        let content=this.state.languages.length>0?
            <ScrollableTabview
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                {this.state.languages.map((result,i,arr)=>{
                    let lan = arr[i];
                    return lan.checked?<PopularTab key={i} tabLabel={lan.name}{...this.props}>Java</PopularTab>:null
                })}
            </ScrollableTabview>:null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='最热'
                    statusBar={{
                        backgroundColor:'#2196F3'
                    }}
                />
                {content}
            </View>
        )
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            result: '',
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
            isLoading:false,
            favoriteKeys:[]
        }
    }

    componentDidMount() {
        this.onLoad();
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    getFavoriteKeys(){
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if (keys){
                    this.setState({
                        favoriteKeys:keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(e=>{
                this.flushFavoriteState();
            });
    }

    flushFavoriteState(){
        let projectModel=[];
        let items=this.items;
        for (var i=0,len=items.length;i<len;i++){
            projectModel.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)));
        }
        this.setState({
            isLoading:false,
            dataSource:this.getDataSource(projectModel)
        })
    }

    onLoad() {
        this.setState({
            isLoading:true,
        });
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.dataRepository
            .fetchRepository(url)
            .then(result => {
                this.items=result&&result.items?result.items:result?result:[];
                this.getFavoriteKeys();
                if (result&&result.update_date&&!this.dataRepository.checkData(result.update_date)){
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items=>{
                if (!items|| items.length === 0)return;
                this.items = items;
                this.getFavoriteKeys();
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error),
                    isLoading:false
                })
            })
    }

    onFavorite(item,isFavorite){
        if (isFavorite){
            favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
        }else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    renderRow(projectModel){
        return <RepositoryCell
            onSelect={()=>this.onSelectRepository(projectModel.item)}
            key={projectModel.item.id}
            projectModel={projectModel}
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
        />
    }

    onSelectRepository(projectModel){
        this.props.navigator.push({
            title:projectModel.full_name,
            component:RepositoryDetailPage,
            params:{
                projectModel:projectModel,
                ...this.props,
            }
        })
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data)=>this.renderRow(data)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={()=>this.onLoad()}
                            colors={['#2196F3']}
                            tintColor={'#2196F3'}
                            title="Loading..."
                            titleColor={'#2196F3'}
                        />
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    }
})