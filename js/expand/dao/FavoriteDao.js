import React from 'react';
import {
    AsyncStorage,
} from 'react-native';
const FAVORITE_KEY_PREFIX='favorite_';

export default class FavoriteDao {
    constructor(flag) {
        this.flag = flag;
        this.favoritekey = FAVORITE_KEY_PREFIX+flag;
    }

    saveFavoriteItem(key,value,callback){
        AsyncStorage.setItem(key,value,(error,result)=>{
            if (!error){
                this.updateFavoriteKeys(key,true);
            }else {

            }
        })
    }

    removeFavoriteItem(key){
        AsyncStorage.removeItem(key,(error,result)=>{
            if (!error){
                this.updateFavoriteKeys(key,false);
            }
        })
    }

    getFavoriteKeys(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.favoritekey,(error,result)=>{
                if (!error){
                    try {
                        resolve(JSON.parse(result));
                    }catch (e){
                        reject(e);
                    }
                }else {
                    reject(error);
                }
            })
        })
    }

    updateFavoriteKeys(key,isAdd){
        AsyncStorage.getItem(this.favoritekey,(error,result)=>{
            if (!error){
                var favoriteKeys=[];
                if (result){
                    favoriteKeys=JSON.parse(result);
                }
                var index=favoriteKeys.indexOf(key);
                if (isAdd){
                    if (index===-1)favoriteKeys.push(key);
                }else {
                    if (index!==-1)favoriteKeys.splice(index,1);
                }
                AsyncStorage.setItem(this.favoritekey,JSON.stringify(favoriteKeys));
            }
        });

    }
}