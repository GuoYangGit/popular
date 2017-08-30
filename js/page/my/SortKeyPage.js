/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Alert,
    View
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'
import ViewUtils from '../../util/ViewUtils'

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.dataArrray = [];
        this.sortResultArray = [];
        this.originalCheckedArray = [];
        this.state = {
            checkedArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.getCheckedItems(result);
            })
            .catch(error => {

            })
    }

    getCheckedItems(dataArray) {
        this.dataArrray = dataArray;
        let checkedArray = [];
        for (let i = 0, len = dataArray.length; i < len; i++) {
            let data = dataArray[i];
            if (data.checked) checkedArray.push(data);
        }
        this.setState({
            checkedArray: checkedArray,
        });
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    onBack() {
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
            return;
        }
        Alert.alert(
            '提示',
            '要保存修改么？',
            [
                {
                    text: '不保存', onPress: () => {
                    this.props.navigator.pop();
                }, style: 'cancel'
                },
                {
                    text: '保存', onPress: () => {
                    this.onSave(true)
                }
                },
            ]
        )
    }

    onSave(isChecked) {
        if (!isChecked && ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
            return;
        }
        this.getSortResult();
        this.languageDao.save(this.sortResultArray);
        this.props.navigator.pop();
    }

    getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArrray);
        for (let i = 0, len = this.originalCheckedArray.length; i < len; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArrray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    render() {
        let title = this.props.flag === FLAG_LANGUAGE.flag_key ? '标签排序' : '语言排序';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    style={{backgroundColor: '#6495ED'}}
                    leftButton={ViewUtils.getLeftButton(() => {
                        this.onBack();
                    })}
                    rightButton={ViewUtils.getRightButton(('保存'), () => {
                        this.onSave();
                    })}
                />
                <SortableListView
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={(e) => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={row => <SortCell data={row}/>}
                />
            </View>
        );
    }
};

class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image
                        style={styles.image}
                        source={require('./img/ic_sort.png')}/>
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    tips: {
        fontSize: 29,
    },
    item: {
        padding: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        tintColor: '#2196F3',
        width: 16,
        height: 16,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        color: 'white',
    },
});
