import { Text, TouchableOpacity, View, Image } from "react-native"
import menuHomeScreenStyle from "../../styles/MenuHomeScreenStyle";
import defaultColor from "../../assets/btn/btnColor";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRoute } from "@react-navigation/native";
import defaultIPV4 from "../../assets/ipv4/ipv4Address";
type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  imageUrl: string;
};

type RouteParams = {
  driver: Driver;
};
const DriverInfo=(props: any) => {
    const {navigation} = props;
    const route = useRoute();
      const { driver } = route.params as RouteParams;
    return(
        <View style={{backgroundColor:"white", height: "100%", width: "100%"}}>
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
       
       <Text style={{fontSize: 20, fontWeight:'bold',flex:1}}>Tài khoản</Text>
        <View style={{flex:0.7}}></View>
        </View> 
        <View style={{justifyContent:"center",alignItems:"center",width:"100%", marginTop: 20}}>
<Image
          style={{width: 80, height: 80, borderRadius: 40, 
    resizeMode: "cover",backgroundColor:"white", marginBottom: 15}}
          source={{ uri: `http://${defaultIPV4}:3000/uploads/${driver.imageUrl}` }}
          />
          <Text style={{fontSize: 18, fontWeight:'bold'}}>{driver.name}</Text>
        </View>

           <View style={{marginTop: 20}}>
            <Text style={{marginLeft: 15,marginBottom: 10}}>Số điện thoại</Text>
            <View style={{
                height: 50, backgroundColor:"#E3DEDB", width: '92%', alignSelf:"center", 
                justifyContent:"center", borderRadius: 15
                }}>
                <Text style={{paddingLeft: 15, fontSize: 16}}>{driver.phone}</Text>
            </View>
            
            </View>
            <View style={{marginTop: 20}}>
            <Text style={{marginLeft: 15,marginBottom: 10}}>Xe</Text>
            <View style={{
                height: 50, backgroundColor:"#E3DEDB", width: '92%', alignSelf:"center", 
                justifyContent:"center", borderRadius: 15
                }}>
                <Text style={{paddingLeft: 15, fontSize: 16}}>{driver.vehicleType}</Text>
            </View>
            <View style={{marginTop: 20}}>
            <Text style={{marginLeft: 15,marginBottom: 10}}>Biển số xe</Text>
            <View style={{
                height: 50, backgroundColor:"#E3DEDB", width: '92%', alignSelf:"center", 
                justifyContent:"center", borderRadius: 15
                }}>
                <Text style={{paddingLeft: 15, fontSize: 16}}>{driver.licensePlate}</Text>
            </View>
            
            </View>
            <View>
                <TouchableOpacity 
                onPress={()=> navigation.navigate('Login')}
                style={{height: "90%",width: "100%",justifyContent: "center",alignItems: "center"}}>
                   
         <Text style={{fontSize: 18,fontWeight: "bold"}}>Đăng xuất</Text>
                </TouchableOpacity>

                    
                    
            </View>
            </View>
        </View>
       
        </View> 

    )
}

export default DriverInfo