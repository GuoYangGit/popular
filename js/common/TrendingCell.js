import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';
import HTMLVIEW from 'react-native-htmlview'

export default class TrendingCell extends Component {

    constructor(props){
        super(props);
        this.state={
            isFavorite:this.props.projectModel.isFavorite,
            favoriteIcon:this.props.isFavorite?require('../../res/image/ic_star.png'):
                require('../../res/image/ic_unstar_transparent.png')
        }
    }

    componentWillReceiveProps(nextProps){
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState(isFavorite){
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/image/ic_star.png'):
                require('../../res/image/ic_unstar_transparent.png')
        })
    }

    onPressFavorite(){
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
    }

    render() {
        let item = this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;
        let description='<p>'+item.description+'</p>';
        let favoriteButton=<TouchableOpacity
            onPress={()=>this.onPressFavorite()}
        >
            <Image
                style={{width: 20, height: 20,tintColor:'#2196F3'}}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
        return(
        <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}>
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.fullName}</Text>
                <HTMLVIEW
                    value={description}
                    onLinkPress={(url)=>{}}
                    stylesheet={{
                        p:styles.description,
                        a:styles.description,
                    }}
                />
                <Text style={styles.description}>{item.meta}</Text>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={styles.description}>Build by:</Text>
                        {item.contributors.map((result,i,arr)=>{
                            return <Image
                                key={i}
                                style={{height: 22, width: 22,marginRight:5}}
                                source={{url: arr[i]}}
                            />
                        })}
                    </View>
                    {favoriteButton}
                </View>
            </View>
        </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderWidth:0.5,
        borderColor:'#dddddd',
        shadowColor:'gray',
        shadowOffset:{width:0.5,height:0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2
    },
    row:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
})