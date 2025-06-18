import { Text, TouchableOpacity, View, Image } from "react-native"
import homeScreenStyle from "../styles/HomeScreenStyle";
import menuHomeScreenStyle from "../styles/MenuHomeScreenStyle";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
 import { useRoute } from "@react-navigation/native";
import defaultIPV4 from "../assets/ipv4/ipv4Address";
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
const MenuHomeScreen = (props: any) => {
       const {navigation} = props;
const route = useRoute();
  const { driver } = route.params as RouteParams;
    return(
      <View style = {menuHomeScreenStyle.headScreen}>
        <View style={{marginLeft: 15,flexDirection: "row",justifyContent:"space-between"}}>
      <TouchableOpacity
      style={{flex:1}}
       onPress={()=>navigation.goBack()}
      > 
      <Image 
        style={menuHomeScreenStyle.backBtnImg}
        source={require("../assets/png/back-button.png")}
        />
        </TouchableOpacity>
       
       <Text style={{fontSize: 20, fontWeight:'bold',flex:1}}>Tổng quan</Text>
        <View style={{flex:1}}></View>
        </View> 

        <TouchableOpacity style={menuHomeScreenStyle.driverPic}
        onPress={()=>navigation.navigate("DriverInfo",{driver})}
        >
            <Image
          style={{width: 60, height: 60, borderRadius: 30, 
    resizeMode: "cover",backgroundColor:"white", marginLeft: 15, marginRight: 15}}
         source={{ uri: `http://${defaultIPV4}:3000/uploads/${driver.imageUrl}` }}
          />
          <Text style={{fontSize: 16, fontWeight:'bold'}}>{driver.name}</Text>
         <View style={{flex:1}}></View>
         <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
          
       </TouchableOpacity>

      <View style={{width:"100%", marginTop: 15, marginLeft: 15, paddingRight: 10}}>
        <TouchableOpacity 
        onPress={()=>navigation.navigate("Wallet")}
        style={menuHomeScreenStyle.driverThings}>
          <Image
          style={{marginRight: 15, width: 20, height: 20}}
          source={require('../assets/png/wallet.png')}
          />
          <Text style={{fontSize: 16, fontWeight:"500"}}>Ví tài xế</Text>
          <View style={{ flex: 1 }} />
          <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
        </TouchableOpacity>
     <TouchableOpacity style={menuHomeScreenStyle.driverThings}
     onPress={() => navigation.navigate("IncomeStatistics")}
     >
      <Image
          style={{marginRight: 15, width: 20, height: 20}}
          source={require('../assets/png/handmoney.png')}
          />
          <Text style={{fontSize: 16, fontWeight:"500"}}>Thống kê thu nhập</Text>
          <View style={{ flex: 1 }} />
          <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={menuHomeScreenStyle.driverThings}>
          <Image
          style={{marginRight: 15, width: 20, height: 20}}
          source={require('../assets/png/effectAtive.png')}
          />
          <Text style={{fontSize: 16, fontWeight:"500"}}>Hiệu suất hoạt động</Text>
          <View style={{ flex: 1 }} />
          <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={menuHomeScreenStyle.driverThings}
        onPress={()=>navigation.navigate("RideHistory")}
        >
          <Image
          style={{marginRight: 15, width: 20, height: 20}}
          source={require('../assets/png/history.png')}
          />
          <Text style={{fontSize: 16, fontWeight:"500"}}>Lịch sử chuyến đi</Text>
          <View style={{ flex: 1 }} />
          <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={menuHomeScreenStyle.driverThings}
        onPress={()=>navigation.navigate("Notification")}
        >
          <Image
          style={{marginRight: 15, width: 20, height: 20}}
          source={require('../assets/png/bell.png')}
          />
          <Text style={{fontSize: 16, fontWeight:"500"}}>Thông báo</Text>
          <View style={{ flex: 1 }} />
          <MaterialIcons name="navigate-next" size={30}  style={menuHomeScreenStyle.nextIcon}/>
        </TouchableOpacity>
      </View>
      </View>
        
    )
}

export default MenuHomeScreen