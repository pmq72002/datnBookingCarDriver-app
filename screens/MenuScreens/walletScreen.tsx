import { Text, TouchableOpacity, View, Image } from "react-native"
import menuHomeScreenStyle from "../../styles/MenuHomeScreenStyle";
import defaultColor from "../../assets/btn/btnColor";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const WalletScreen = (props: any) =>{
           const {navigation} = props;
    return(
        <View style={{backgroundColor:"#E1E1E1", height: "100%", width: "100%"}}>
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
       
       <Text style={{fontSize: 20, fontWeight:'bold',flex:1}}>Ví tài xế</Text>
        <View style={{flex:1}}></View>
        </View> 
        <View style=
        {{
            height: 120, backgroundColor:"white", width: "90%", alignSelf:"center", alignItems:"center", marginTop: 10,
            borderRadius: 10
            }}>
            <Text style={{fontSize:15,fontWeight: "300", marginTop: 20}}>Số dư</Text>
            <Text style={{fontSize: 30,fontWeight:'bold',marginTop: 8}}> 300.000đ</Text>
        </View>
        <View style={{backgroundColor:"white",height: 210, width:"90%",alignSelf:'center', marginTop:20,borderRadius: 15}}>
            <TouchableOpacity 
            style={{
                flexDirection:"row",width: "100%",alignItems:'center', paddingLeft: 15,justifyContent:"space-between",
                borderBottomColor:"grey", borderBottomWidth:0.5, height: 70
            }}>
                <View style={{flexDirection: 'row',alignItems:'center'}}>
                    <Image
                source={require('../../assets/png/credit-card.png')}
                style={{width: 35, height: 35, marginRight: 20}}
                />
                <Text style={{fontSize: 18, fontWeight: '700'}}>Nạp tiền</Text>
                </View>
                
                <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
            </TouchableOpacity>
            <TouchableOpacity 
            style={{
                flexDirection:"row",width: "100%",alignItems:'center', paddingLeft: 15,justifyContent:"space-between",
                borderBottomColor:"grey", borderBottomWidth:0.5, height: 70
            }}>
                <View style={{flexDirection: 'row',alignItems:'center'}}>
                    <Image
                source={require('../../assets/png/cash-withdrawal.png')}
                style={{width: 35, height: 35, marginRight: 20}}
                />
                <Text style={{fontSize: 18, fontWeight: '700'}}>Rút tiền</Text>
                </View>
                
                <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
            </TouchableOpacity>
            <TouchableOpacity 
            style={{
                flexDirection:"row",width: "100%",alignItems:'center', paddingLeft: 15,justifyContent:"space-between",
                 height: 70
            }}>
                <View style={{flexDirection: 'row',alignItems:'center'}}>
                    <Image
                source={require('../../assets/png/cardHistory.png')}
                style={{width: 35, height: 35, marginRight: 20}}
                />
                <Text style={{fontSize: 18, fontWeight: '700'}}>Lịch sử giao dịch</Text>
                </View>
                
                <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
            </TouchableOpacity>
        </View>
        </View> 
</View>
    )
}

export default WalletScreen