import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import menuHomeScreenStyle from '../../styles/MenuHomeScreenStyle';

export default function NotificationScreen(props: any) {
  const {navigation} = props;
  return (
    <View style = {menuHomeScreenStyle.headScreen}>
        <View style={{marginLeft: 15,flexDirection: "row",justifyContent:"space-between"}}>
      <TouchableOpacity
      style={{flex:1}}
       onPress={()=>navigation.goBack()}
      > 
      <Image 
        style={menuHomeScreenStyle.backBtnImg}
        source={require("../../assets/png/back-button.png")}
        />
        </TouchableOpacity>
       
       <Text style={{fontSize: 20, fontWeight:'bold',flex:1}}>Thông báo</Text>
        <View style={{flex:1}}></View>
        </View> 
        <Text style={{ 
          fontSize: 16, fontWeight: '500', color: '#888', marginTop: 30, marginLeft: 100 }}>Không có thông báo mới</Text>
        </View>
  );
}
