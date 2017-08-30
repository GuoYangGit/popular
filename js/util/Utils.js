
export default class Utils{

    static checkFavorite(item,items){
        for(var i=0,len=items.length;i<len;i++){
            let id =item.id?item.id:item.fullName;
            if (id.toString()===items[i]){
                return true;
            }
        }
        return false;
    }
}