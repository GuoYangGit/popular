import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    Text,
    Image,
    TouchableOpacity,
    View,
    RefreshControl,
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabview, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetailPage from './RepositoryDetailPage'
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'

var timeSpanTextArrays = [
    new TimeSpan('今 天', 'since-daily'),
    new TimeSpan('本 周', 'since-weekly'),
    new TimeSpan('本 月', 'since-monthly'),
];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
const API_URL = 'https://github.com/trending/';

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArrays[0]
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

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height,}
            })
        })
    }

    renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    ref='button'
                    onPress={() => this.showPopover()}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: 'white',
                                fontWeight: '400'
                            }}
                        >趋势 {this.state.timeSpan.showText}</Text>
                        <Image
                            style={{width: 12, height: 12, marginLeft: 5}}
                            source={require('../../res/image/ic_spinner_triangle.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    closePopover() {
        this.setState({
            isVisible: false
        })
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan: timeSpan,
            isVisible: false
        })
    }

    render() {
        let content = this.state.languages.length > 0 ?
            <ScrollableTabview
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                {this.state.languages.map((result, i, arr) => {
                    let lan = arr[i];
                    return lan.checked ?
                        <TrendingTab key={i} tabLabel={lan.name}
                                     timeSpan={this.state.timeSpan} {...this.props}>Java</TrendingTab> : null
                })}
            </ScrollableTabview> : null;
        let timeSpanView =
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={() => this.closePopover()}
                contentStyle={{backgroundColor: '#343434', opacity: 0.8}}
            >
                {timeSpanTextArrays.map((result, i, arr) => {
                    return <TouchableOpacity
                        key={i}
                        underlayColor='transparent'
                        onPress={() => this.onSelectTimeSpan(arr[i])}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                color: 'white',
                                fontWeight: '400',
                                padding: 4
                            }}
                        >{arr[i].showText}</Text>
                    </TouchableOpacity>
                })}
            </Popover>
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView={this.renderTitleView()}
                    title='趋势'
                    statusBar={{
                        backgroundColor: '#2196F3'
                    }}
                />
                {content}
                {timeSpanView}
            </View>
        )
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
        }
    }

    componentDidMount() {
        this.onLoad(this.props.timeSpan, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.onLoad(nextProps.timeSpan)
        }
    }

    getFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText;
    }

    onRefresh() {
        this.onLoad(this.props.timeSpan);
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    flushFavoriteState() {
        let projectModel = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModel.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
        }
        this.setState({
            isLoading: false,
            dataSource: this.getDataSource(projectModel)
        })
    }

    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.setState({
                        favoriteKeys: keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(e => {
                this.flushFavoriteState();
            });
    }

    onLoad(timeSpan, isRefresh) {
        this.setState({
            isLoading: true,
        });
        let url = this.getFetchUrl(timeSpan, this.props.tabLabel);
        dataRepository
            .fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items || isRefresh && result && result.update_date && !dataRepository.checkData(result.update_date)) {
                    return dataRepository.fetchNetRepository(url);
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this.items = items;
                this.getFavoriteKeys();
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    result: JSON.stringify(error)
                })
            })
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.fullName.toString());
        }
    }

    renderRow(projectModel) {
        return <TrendingCell
            onSelect={() => this.onSelectRepository(projectModel.item)}
            key={projectModel.item.fullName}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />
    }

    onSelectRepository(projectModel) {
        this.props.navigator.push({
            title: projectModel.fullName,
            component: RepositoryDetailPage,
            params: {
                projectModel: projectModel,
                ...this.props,
            }
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow(data)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.onRefresh()}
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