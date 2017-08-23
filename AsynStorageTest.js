import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TextInput
} from 'react-native';
import NavigationBar from './js/common/NavigationBar'
import Toast,{DURATION} from 'react-native-easy-toast'
const KEY='text';

export default class AsynStorageTest extends Component {
    constructor(props) {
        super(props);
    }

    onSave(){
        AsyncStorage.setItem(KEY,this.text,(error)=>{
            if(!error){
                this.toast.show('保存成功');
            }else {
                this.toast.show('保存失败');
            }
        })
    }

    onRemove(){
        AsyncStorage.removeItem(KEY,(error)=>{
            if (!error){
                this.toast.show('移除成功')
            }else {
                this.toast.show('移除成功')
            }
        })
    }

    onFetch(){
        AsyncStorage.getItem(KEY,(error,result)=>{
            if (!error){
                if (result !== ''){
                    this.toast.show('取出内容为：'+result);
                }else {
                    this.toast.show('取出内容为null');
                }
            }else {
                this.toast.show('取出内容失败');
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title="AsynStorage"
                />
                <TextInput
                    style={{borderWidth:1,height:40,margin:10}}
                    onChangeText={text=>this.text=text}
                />
                <View style={{flexDirection:'row'}}>
                <Text style={styles.tips}
                    onPress={()=>this.onSave()}
                >保存</Text>
                <Text style={styles.tips}
                    onPress={()=>this.onRemove()}
                >移除</Text>
                <Text style={styles.tips}
                    onPress={()=>this.onFetch()}
                >取出</Text>
                </View>
                <Toast ref={toast=>this.toast=toast}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29,
        margin:5,
    }
})