import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Modal, FlatList, Alert, ScrollView, ActivityIndicator, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_KEY } from '@env'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import defaultColor from '../assets/btn/btnColor';
import axios from 'axios';
import { getDistance } from 'geolib'
import HomeScreenStyle from '../styles/HomeScreenStyle';
import homeScreenStyle from '../styles/HomeScreenStyle';
 import { useRoute } from "@react-navigation/native";
import io from 'socket.io-client';
const screenHeight = Dimensions.get('window').height;
import defaultIPV4 from '../assets/ipv4/ipv4Address';
import { Linking } from 'react-native';


const socket = io(`http://${defaultIPV4}:3000`,
  {
  transports: ['websocket'],
}
);


const locationImg = require('../assets/png/driverPosition.png')
//---------------------------------------------------------details ride----------------------------------------------------------------------
interface DetailsRideProps{
  visible: boolean,
  onClose: () => void,
  selectedRide: any
}

const DetailsRideModal = ({visible, onClose, selectedRide}:DetailsRideProps) => {
  if(!selectedRide) return null
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
    <View style={homeScreenStyle.modalDetailsRideOverlay}>
      <View style={homeScreenStyle.modalDetailsRideContainer}>
        <ScrollView >

          <View style = {homeScreenStyle.headScreen}>
      <TouchableOpacity 
      style={{flex: 0.5, paddingLeft: 15}}
       onPress={()=>onClose()}
      > 
      <Image 
        style={homeScreenStyle.backBtnImg}
        source={require("../assets/png/back-button.png")}
        />
        </TouchableOpacity>
        <View style={{flex:1, width: 200}}>
        <Text style={{fontSize:18, fontWeight:'bold',}}>Chi tiết chuyến đi</Text>

        </View>

        <View style={{flex:0.5}}>

        </View>

        </View> 

        <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'white', paddingTop: 20, paddingBottom:20}}>
          <View style={homeScreenStyle.distanceAndTime}>
            <View style={{paddingLeft: 15}}>
              <Text style={{color: 'white', fontSize: 13}}>Khoảng cách</Text>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14, paddingTop: 8}}>{selectedRide.distance}</Text>
            </View>
            
            <View style={{flex: 1}}>

            </View>
        </View>

        </View>

        <View style={{flexDirection:'row', width: '100%', height: 40, alignItems:'center'}}>
          <Text style={{fontSize:14, fontWeight:'bold', paddingLeft: 15}}> ĐIỂM ĐÓN KHÁCH</Text>
          <View style={{flex: 1}}></View>
          <TouchableOpacity>
            <Text style={{fontSize:14, color:'red', paddingRight: 15}}>Hủy chuyến</Text>
          </TouchableOpacity>
        </View>
        

          <View style={homeScreenStyle.myLocation}>
            <Image source={require('../assets/png/myLocateRide.png')} style={{height: 40, width: 40}} />
                    <Text
                        style = {homeScreenStyle.myLocationInput}
                    >
                      {selectedRide.clientOriginName} 
                    </Text>
          </View>
          <View style={{height: 70,paddingLeft: 15, marginTop: 3, marginBottom: 3, backgroundColor:'white', width:'100%', justifyContent:'center'}}>
            <Text style={{fontSize: 14, color:'#535353'}}>Hành khách</Text>
          <Text style={{fontSize: 16, fontWeight:'bold'}}>{selectedRide.name}</Text>
          </View>
          <View style={homeScreenStyle.callAndText}>
          <TouchableOpacity
          style={{width: '49%', height: 40, flexDirection:'row', justifyContent:'center',alignItems:'center' }}>
           <View 
           style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../assets/png/texting .png')}
            />
            </View>
              <Text style={{fontFamily: 'sans-serif', color:defaultColor, paddingLeft: 10, fontWeight:'bold'}}>Nhắn tin</Text>
          </TouchableOpacity>
          <View style={{width: '2%', height: 40,borderEndColor:'#D1D1D1',borderEndWidth:0.5}}>

          </View>
          <TouchableOpacity
           style={{width: '49%', height: 40,flexDirection:'row', justifyContent:'center',alignItems:'center'}}
           onPress={() => {
          const phoneNumber = `tel:${selectedRide?.mobile}`; // driver.phone là số điện thoại, ví dụ: '0987654321'
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
  >
            <View 
           style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{width:25, height:25, resizeMode: 'contain'}}
              source={require('../assets/png/phone-receiver-silhouette.png')}
            />
            </View>
            <Text style={{fontFamily: 'sans-serif',color:defaultColor, paddingLeft: 10,fontWeight:'bold'}}>Gọi điện</Text>
          </TouchableOpacity>
          </View>
        
        <View style={{ width: '100%', height: 40,justifyContent:'center'}}>
          <Text style={{fontSize:14, fontWeight:'bold', paddingLeft: 15}}> ĐIỂM TRẢ KHÁCH</Text>
        </View>

        <View style={homeScreenStyle.myLocation}>
            <Image source={require('../assets/png/map-pin.png')} style={{height: 40, width: 40}} />
                    <Text
                        style = {homeScreenStyle.myLocationInput}
                    >
                      {selectedRide.clientDestinationName} 
                    </Text>
          </View>

          <View style={{height: 70,paddingLeft: 15, marginTop: 3, marginBottom: 3, backgroundColor:'white', width:'100%', justifyContent:'center'}}>
            <Text style={{fontSize: 14, color:'#535353'}}>Hành khách</Text>
          <Text style={{fontSize: 16, fontWeight:'bold'}}>{selectedRide.name}</Text>
          </View>

          <View style={homeScreenStyle.callAndText}>
          <TouchableOpacity
          style={{width: '49%', height: 40, flexDirection:'row', justifyContent:'center',alignItems:'center' }}>
           <View 
           style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../assets/png/texting .png')}
            />
            </View>
              <Text style={{fontFamily: 'sans-serif', color:defaultColor, paddingLeft: 10, fontWeight:'bold'}}>Nhắn tin</Text>
          </TouchableOpacity>
          <View style={{width: '2%', height: 40,borderEndColor:'#D1D1D1',borderEndWidth:0.5}}>

          </View>
          <TouchableOpacity
           style={{width: '49%', height: 40,flexDirection:'row', justifyContent:'center',alignItems:'center'}}
           onPress={() => {
          const phoneNumber = `tel:${selectedRide?.mobile}`; 
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
           >
            <View 
           style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{width:25, height:25, resizeMode: 'contain'}}
              source={require('../assets/png/phone-receiver-silhouette.png')}
            />
            </View>
            <Text style={{fontFamily: 'sans-serif',color:defaultColor, paddingLeft: 10,fontWeight:'bold'}}>Gọi điện</Text>
          </TouchableOpacity>
          
        </View>
        
        <View style={{paddingLeft: 15, marginTop: 10, marginBottom: 10}}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}> CƯỚC PHÍ CHUYẾN ĐI</Text>
        </View>
        <View style={{height: 140}}>
          <View 
          style={{flexDirection:'row',justifyContent:'space-between',
           alignItems:'center',backgroundColor:'white', height:45, paddingLeft: 15, paddingRight: 15}}>
            <Text style={{fontSize:16, fontWeight: 'bold'}}>Nhận thanh toán</Text>
            <View 
            style={{height: 25, width: 75,backgroundColor:'#CAC6C3', justifyContent:'center', alignItems:'center',
             borderRadius: 5,}}>
              <Text>Tiền mặt</Text>
            </View>
            
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',
           alignItems:'center',backgroundColor:'white', height:45, marginTop: 4, paddingLeft: 15, paddingRight: 15}}>
            <Text style={{fontSize:16}} >Cước phí</Text>
            <Text>{selectedRide.price}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',
           alignItems:'center',backgroundColor:'white', height:45, paddingLeft: 15, paddingRight: 15}}>
            <Text style={{fontSize:16}}>Nhận thanh toán</Text>
            <Text>{selectedRide.price}</Text>
          </View>
        </View>
        <View style={{paddingLeft: 15, marginTop: 10, marginBottom: 10}}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}> DỊCH VỤ</Text>
        </View>
        <View style={{height: 10, backgroundColor:'white'}}>

          </View>
        <View style={{paddingLeft: 15, height: 100, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity
          style={{flexDirection: 'row', alignItems:'center'}}
          >
            <Image
            style={{height: 30, width: 30}}
            source={require('../assets/png/support.png')}
            />
            <Text style={{paddingLeft: 15,fontSize: 16,fontWeight:'bold', color:defaultColor}}> Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
          
          
        </View>
        <View style={{height: 20, backgroundColor:'white'}}>

          </View>
        </ScrollView>

        </View>
        </View>
  </Modal>
  )
}

//---------------------------------------------------------details delivery----------------------------------------------------------------------
interface DetailsDeliveryProps{
  visible: boolean,
  onClose: () => void,
  selectedRide: any
}

const DetailsDeliveryModal = ({visible, onClose, selectedRide}:DetailsDeliveryProps) => {
  if(!selectedRide) return null
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
    <View style={homeScreenStyle.modalDetailsRideOverlay}>
      <View style={homeScreenStyle.modalDetailsRideContainer}>
        <ScrollView >

          <View style = {homeScreenStyle.headScreen}>
      <TouchableOpacity 
      style={{flex: 0.5, paddingLeft: 15}}
       onPress={()=>onClose()}
      > 
      <Image 
        style={homeScreenStyle.backBtnImg}
        source={require("../assets/png/back-button.png")}
        />
        </TouchableOpacity>
        <View style={{flex:1, width: 200}}>
        <Text style={{fontSize:18, fontWeight:'bold',}}>Chi tiết chuyến đi</Text>

        </View>

        <View style={{flex:0.5}}>

        </View>

        </View> 

        <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'white', paddingTop: 20, paddingBottom:20}}>
          <View style={homeScreenStyle.distanceAndTime}>
            <View style={{paddingLeft: 15}}>
              <Text style={{color: 'white', fontSize: 13}}>Khoảng cách</Text>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14, paddingTop: 8}}>{selectedRide.distance}</Text>
            </View>
            
            <View style={{flex: 1}}>

            </View>
        </View>

        </View>

        <View style={{flexDirection:'row', width: '100%', height: 40, alignItems:'center'}}>
          <Text style={{fontSize:14, fontWeight:'bold', paddingLeft: 15}}> ĐIỂM LẤY HÀNG</Text>
          <View style={{flex: 1}}></View>
          <TouchableOpacity>
            <Text style={{fontSize:14, color:'red', paddingRight: 15}}>Hủy chuyến</Text>
          </TouchableOpacity>
        </View>
        

          <View style={homeScreenStyle.myLocation}>
            <Image source={require('../assets/png/myLocateRide.png')} style={{height: 40, width: 40}} />
                    <Text
                        style = {homeScreenStyle.myLocationInput}
                    >
                      {selectedRide.clientOriginName} 
                    </Text>
          </View>
          <View style={{height: 70,paddingLeft: 15, marginTop: 3, marginBottom: 3, backgroundColor:'white', width:'100%', justifyContent:'center'}}>
            <Text style={{fontSize: 14, color:'#535353'}}>Người gửi</Text>
          <Text style={{fontSize: 16, fontWeight:'bold'}}>{selectedRide.senderName}</Text>
          </View>
          <View style={homeScreenStyle.callAndText}>
          <TouchableOpacity
          style={{width: '49%', height: 40, flexDirection:'row', justifyContent:'center',alignItems:'center' }}>
           <View 
           style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../assets/png/texting .png')}
            />
            </View>
              <Text style={{fontFamily: 'sans-serif', color:defaultColor, paddingLeft: 10, fontWeight:'bold'}}>Nhắn tin</Text>
          </TouchableOpacity>
          <View style={{width: '2%', height: 40,borderEndColor:'#D1D1D1',borderEndWidth:0.5}}>

          </View>
          <TouchableOpacity
           style={{width: '49%', height: 40,flexDirection:'row', justifyContent:'center',alignItems:'center'}}
           onPress={() => {
          const phoneNumber = `tel:${selectedRide?.senderMobile}`;
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
           >
            <View 
           style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{width:25, height:25, resizeMode: 'contain'}}
              source={require('../assets/png/phone-receiver-silhouette.png')}
            />
            </View>
            <Text style={{fontFamily: 'sans-serif',color:defaultColor, paddingLeft: 10,fontWeight:'bold'}}>Gọi điện</Text>
          </TouchableOpacity>
          </View>
        
        <View style={{ width: '100%', height: 40,justifyContent:'center'}}>
          <Text style={{fontSize:14, fontWeight:'bold', paddingLeft: 15}}> ĐIỂM TRẢ HÀNG</Text>
        </View>

        <View style={homeScreenStyle.myLocation}>
            <Image source={require('../assets/png/map-pin.png')} style={{height: 40, width: 40}} />
                    <Text
                        style = {homeScreenStyle.myLocationInput}
                    >
                      {selectedRide.clientDestinationName} 
                    </Text>
          </View>

          <View style={{height: 70,paddingLeft: 15, marginTop: 3, marginBottom: 3, backgroundColor:'white', width:'100%', justifyContent:'center'}}>
            <Text style={{fontSize: 14, color:'#535353'}}>Người nhận</Text>
          <Text style={{fontSize: 16, fontWeight:'bold'}}>{selectedRide.receiverName}</Text>
          </View>

          <View style={homeScreenStyle.callAndText}>
          <TouchableOpacity
          style={{width: '49%', height: 40, flexDirection:'row', justifyContent:'center',alignItems:'center' }}>
           <View 
           style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../assets/png/texting .png')}
            />
            </View>
              <Text style={{fontFamily: 'sans-serif', color:defaultColor, paddingLeft: 10, fontWeight:'bold'}}>Nhắn tin</Text>
          </TouchableOpacity>
          <View style={{width: '2%', height: 40,borderEndColor:'#D1D1D1',borderEndWidth:0.5}}>

          </View>
          <TouchableOpacity
           style={{width: '49%', height: 40,flexDirection:'row', justifyContent:'center',alignItems:'center'}}
           onPress={() => {
          const phoneNumber = `tel:${selectedRide?.receiverMobile}`; 
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
           >
            <View 
           style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{width:25, height:25, resizeMode: 'contain'}}
              source={require('../assets/png/phone-receiver-silhouette.png')}
            />
            </View>
            <Text style={{fontFamily: 'sans-serif',color:defaultColor, paddingLeft: 10,fontWeight:'bold'}}>Gọi điện</Text>
          </TouchableOpacity>
          
        </View>
        
        <View style={{paddingLeft: 15, marginTop: 10, marginBottom: 10}}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}> CƯỚC PHÍ CHUYẾN ĐI</Text>
        </View>
        <View style={{height: 140}}>
          <View 
          style={{flexDirection:'row',justifyContent:'space-between',
           alignItems:'center',backgroundColor:'white', height:45, paddingLeft: 15, paddingRight: 15}}>
            <Text style={{fontSize:16, fontWeight: 'bold'}}>Nhận thanh toán</Text>
            <View 
            style={{height: 25, width: 75,backgroundColor:'#CAC6C3', justifyContent:'center', alignItems:'center',
             borderRadius: 5,}}>
              <Text>Tiền mặt</Text>
            </View>
            
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',
           alignItems:'center',backgroundColor:'white', height:45, marginTop: 4, paddingLeft: 15, paddingRight: 15}}>
            <Text style={{fontSize:16}} >Cước phí</Text>
            <Text>{selectedRide.price}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',
           alignItems:'center',backgroundColor:'white', height:45, paddingLeft: 15, paddingRight: 15}}>
            <Text style={{fontSize:16}}>Nhận thanh toán</Text>
            <Text>{selectedRide.price}</Text>
          </View>
        </View>
        <View style={{paddingLeft: 15, marginTop: 10, marginBottom: 10}}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}> DỊCH VỤ</Text>
        </View>
        <View style={{height: 10, backgroundColor:'white'}}>

          </View>
        <View style={{paddingLeft: 15, height: 100, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity
          style={{flexDirection: 'row', alignItems:'center'}}
          >
            <Image
            style={{height: 30, width: 30}}
            source={require('../assets/png/support.png')}
            />
            <Text style={{paddingLeft: 15,fontSize: 16,fontWeight:'bold', color:defaultColor}}> Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
          
          
        </View>
        <View style={{height: 20, backgroundColor:'white'}}>

          </View>
        </ScrollView>

        </View>
        </View>
  </Modal>
  )
}

//---------------------------------------------------------accept drive----------------------------------------------------------------------
interface AcceptDriveProps{
  visible: boolean,
  onClose: () => void,
  seeDetails: ()=> void,
  selectedRide: any,
  cancelRide: () => void,
  navigation: any;
}



const AcceptDriveModal = ({visible, onClose,seeDetails, selectedRide,cancelRide, navigation}:AcceptDriveProps) => {
  if(!selectedRide||!visible) return null
  const [message, setMessage] = useState<string>('');
  const [rideStep, setRideStep] = useState("arriving");


  const updateRideStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`http://${defaultIPV4}:3000/${selectedRide._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ Ride status updated:', data.ride.status);
        setRideStep(newStatus);
      } else {
        console.error('❌ Failed to update status:', data.error);
      }
    } catch (err) {
      console.error('🚨 Network error:', err);
    }
  };
  
const saveRideToHistory = async () => {
  try {
    const response = await fetch(`http://${defaultIPV4}:3000/save-history`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rideId: selectedRide._id, 
        price: selectedRide.price,
        originName: selectedRide.clientOriginName,
        destinationName: selectedRide.clientDestinationName,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Ride saved to history");
    } else {
      console.error("❌ Save failed:", data.message);
    }
  } catch (err) {
    console.error("❌ Network error:", err);
  }
};

 useEffect(() => {
  if (!visible) return;

  const handleMessage = (msg: string) => {
    console.log('Nhận message từ server:', msg);
    setMessage(msg);
    cancelRide(); 
    socket.off('receiveCancel', handleMessage);
  };

  socket.on('receiveCancel', handleMessage);

  return () => {
    socket.off('receiveCancel', handleMessage);
  };
}, [visible]);



return(
  <TouchableWithoutFeedback onPress={onClose}>
      <View style={HomeScreenStyle.modalOnDriveOverlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
      <View style={homeScreenStyle.modalOnDriveContainer}>
        <ScrollView 
      contentContainerStyle={homeScreenStyle.scrollViewContent}
      showsVerticalScrollIndicator={false}>
        <View style={homeScreenStyle.rideHeader}>
          <View style={{paddingLeft: 15}}>
            <Text style={{fontSize: 14, color:'#535353'}}>Hành khách</Text>
          <Text style={{fontSize: 16, fontWeight:'bold'}}>{selectedRide.name}</Text>
          </View>
          <View style={{flex:1}}>

          </View>
          <TouchableOpacity
           onPress={() => {
            let lat, lng;
                      
              if (rideStep === 'arriving' || rideStep === 'arrived') {
                lat = parseFloat(selectedRide?.clientLatitude);
                lng = parseFloat(selectedRide?.clientLongitude);
              }

              if (rideStep === 'pickedUp') {
                lat = parseFloat(selectedRide?.clientDestinationLatitude);
                lng = parseFloat(selectedRide?.clientDestinationLongitude);
              }

              if (lat && lng) {
              const url = Platform.select({
                ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
                android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
              });

              if (url) {
                console.log(url)
                Linking.openURL(url);
              } else {
                console.warn('Platform not supported or URL undefined');
              }
            } else {
              alert('Không tìm thấy địa điểm');
            }
          }}
           
           style={{alignItems:'center', justifyContent:'center', paddingRight:15}}>
            <View 
           style={{width:30, height:30,backgroundColor:defaultColor,borderRadius: 200/2,justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{ width: 17, height: 17,resizeMode: 'contain'}}
              source={require('../assets/png/send.png')}
            />
            </View>
            <Text style={{fontSize:11, color:'#535353'}}>Điều hướng</Text>
          </TouchableOpacity>
        </View>
        <View style={homeScreenStyle.clientLocation}>
          
          <View style={homeScreenStyle.myLocation}>
              <Image 
              source={
               rideStep === "pickedUp"
              ? require('../assets/png/map-pin.png')
              : require('../assets/png/myLocateRide.png')
  }
                  style={{height: 40, width: 40}} />
            
            
                    <Text
                        style = {homeScreenStyle.myLocationInput}
                    >
                     {rideStep === "pickedUp"
                    ? selectedRide.clientDestinationName
                    : selectedRide.clientOriginName}
                </Text>
          </View>
                  

          <View style={{flexDirection:'row'}}>
            <View style={{ marginRight: 0,marginLeft:15, width: 60, height: 25, justifyContent:'center'}}>
            <Text style={{fontSize: 14, fontWeight:"bold"}}>{selectedRide.price}</Text>
            </View>
            <View style={{ marginRight: 10, backgroundColor:'#F5F5F5', width: 60, height: 25, justifyContent:'center'}}>
              <Text style={{fontSize: 14}}>Tiền mặt, {message}</Text>
            </View>
            <View style={{ backgroundColor:'#F5F5F5', width: 60, height: 25, justifyContent:'center'}}>
            
            <Text style={{fontSize: 14}}>Giảm giá</Text>
            </View>
          </View>
</View>

          <View style={homeScreenStyle.callAndText}>
          <TouchableOpacity
          onPress={() => {
          console.log("Navigating to ChatBox with rideId:", selectedRide.rideId);
            navigation.navigate("ChatBox",{
            currentUserId: "111",
            currentUserName: "Tài xế",
            receiverId: "222",
            rideId: selectedRide.rideId,
            fromScreen: 'AcceptDriveModal'
             
          })}}
          style={{width: '49%', height: 40, flexDirection:'row', justifyContent:'center',alignItems:'center' }}>
           <View 
           style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../assets/png/texting .png')}
            />
            </View>
              <Text style={{fontFamily: 'sans-serif', color:defaultColor, paddingLeft: 10, fontWeight:'bold'}}>Nhắn tin</Text>
          </TouchableOpacity>
          <View style={{width: '2%', height: 40,borderEndColor:'#D1D1D1',borderEndWidth:0.5}}>

          </View>
          <TouchableOpacity
           style={{width: '49%', height: 40,flexDirection:'row', justifyContent:'center',alignItems:'center'}}
           onPress={() => {
          const phoneNumber = `tel:${selectedRide?.mobile}`; // driver.phone là số điện thoại, ví dụ: '0987654321'
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
           >
            <View 
           style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{width:25, height:25, resizeMode: 'contain'}}
              source={require('../assets/png/phone-receiver-silhouette.png')}
            />
            </View>
            <Text style={{fontFamily: 'sans-serif',color:defaultColor, paddingLeft: 10,fontWeight:'bold'}}>Gọi điện</Text>
          </TouchableOpacity>
          
        </View>

      <View style={homeScreenStyle.detailsRide}>
        <TouchableOpacity
        style={{flexDirection:'row', alignItems: 'center'}}
        onPress={()=>seeDetails()}
      >
        <Text style={{fontSize: 15, fontWeight:'bold'}}>Chi tiết chuyến đi</Text>
        <View style={{flex:1}}>

        </View>
        <Image 
        style={{height: 40, width: 40}}
        source={require('../assets/png/arrow-right.png')}
        />
      </TouchableOpacity>
      </View>

        <View style={{backgroundColor:"white", width:"100%", marginTop: 5, alignItems:"center", flex:1,justifyContent:'center'}}>
  <TouchableOpacity style={homeScreenStyle.arriveClientLocationBtn}
   onPress={() => {
    if (rideStep === "arriving") {
      updateRideStatus("arrived");
    } else if (rideStep === "arrived") {
      updateRideStatus("pickedUp");
    }else if (rideStep === "pickedUp") {
      updateRideStatus("completed");
      saveRideToHistory();
      CompleteRide()
      onClose()
       Alert.alert("✅ Chúc mừng bạn đã hoàn thành chuyến đi an toàn");
    }
  }}
>
  <Text style={{ fontSize: 24, fontWeight: '500', color: 'white' }}>
    {rideStep === "arriving"
      ? "Đã đến điểm đón"
      : rideStep === "arrived"
      ? "Đã đón khách"
      : rideStep === "pickedUp"
      ? "Hoàn thành"
      : "Hoàn thành"}
  </Text>
</TouchableOpacity>
</View>
      
      </ScrollView>
        
      </View>
      
      </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
)
}
//---------------------------------------------------------accept delivery-------------------------------------------------------------------

interface AcceptDeliveryProps{
  visible: boolean,
  onClose: () => void,
  seeDetails: ()=> void,
  selectedRide: any,
  cancelRide: () => void,
  navigation: any;
}

const AcceptDeliveryModal = ({visible, onClose,seeDetails, selectedRide,cancelRide, navigation}:AcceptDeliveryProps) => {
  if(!selectedRide||!visible) return null
  const [message, setMessage] = useState<string>('');
  const [rideStep, setRideStep] = useState("arriving");
  const updateRideStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`http://${defaultIPV4}:3000/${selectedRide._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ Ride status updated:', data.ride.status);
        setRideStep(newStatus);
      } else {
        console.error('❌ Failed to update status:', data.error);
      }
    } catch (err) {
      console.error('🚨 Network error:', err);
    }
  };
  const updateDeliveryStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`http://${defaultIPV4}:3000/${selectedRide._id}/deliStatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ Ride status updated:', data.ride.status);
        setRideStep(newStatus);
      } else {
        console.error('❌ Failed to update status:', data.error);
      }
    } catch (err) {
      console.error('🚨 Network error:', err);
    }
  };


const saveDeliveryToHistory = async () => {
  try {
    const response = await fetch(`http://${defaultIPV4}:3000/save-Delihistory`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rideId: selectedRide._id, 
        price: selectedRide.price,
        originName: selectedRide.clientOriginName,
        destinationName: selectedRide.clientDestinationName,
        type:"Giao hàng"
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Delivery saved to history");
    } else {
      console.error("❌ Save failed:", data.message);
    }
  } catch (err) {
    console.error("❌ Network error:", err);
  }
};

 useEffect(() => {
  if (!visible) return;

  const handleMessage = (msg: string) => {
    console.log('Nhận message từ server:', msg);
    setMessage(msg);
    cancelRide(); 
    socket.off('receiveCancel', handleMessage);
  };

  socket.on('receiveCancel', handleMessage);

  return () => {
    socket.off('receiveCancel', handleMessage);
  };
}, [visible]);


return(
  <TouchableWithoutFeedback onPress={onClose}>
      <View style={HomeScreenStyle.modalOnDriveOverlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
      <View style={homeScreenStyle.modalOnDriveContainer}>
        <ScrollView 
      contentContainerStyle={homeScreenStyle.scrollViewContent}
      showsVerticalScrollIndicator={false}>
        <View style={homeScreenStyle.rideHeader}>
          <View style={{paddingLeft: 15}}>
            <Text style={{fontSize: 20, fontWeight:"300"}}>Đơn hàng</Text>
          <Text style={{fontSize: 14, fontWeight:'bold',paddingLeft:3,paddingTop:10}}>Người gửi: {selectedRide.senderName}</Text>
          </View>
          <View style={{flex:1}}>

          </View>
          <TouchableOpacity
           style={{alignItems:'center', justifyContent:'center', paddingRight:15}}
            onPress={() => {
              console.log('selectedRideDeli', rideStep)
            let lat, lng;
                      
              if (rideStep === 'arriving' || rideStep === 'arrived') {
                lat = parseFloat(selectedRide?.senderLatitude);
                lng = parseFloat(selectedRide?.senderLongitude);
              }

              if (rideStep === 'pickedUpGoods') {
                lat = parseFloat(selectedRide?.receiverLatitude);
                lng = parseFloat(selectedRide?.receiverLongitude);
              }

              if (lat && lng) {
              const url = Platform.select({
                ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
                android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
              });

              if (url) {
                console.log(url)
                Linking.openURL(url);
              } else {
                console.warn('Platform not supported or URL undefined');
              }
            } else {
              alert('Không tìm thấy địa điểm');
            }
          }}
           >
            <View 
           style={{width:30, height:30,backgroundColor:defaultColor,borderRadius: 200/2,justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{ width: 17, height: 17,resizeMode: 'contain'}}
              source={require('../assets/png/send.png')}
            />
            </View>
            <Text style={{fontSize:11, color:'#535353'}}>Điều hướng</Text>
          </TouchableOpacity>
          
        </View>
        <View style={{backgroundColor:"white", marginLeft:4,height: 30}}>
          <View style={{flexDirection:'row'}}>
            <View style={{ marginRight: 0,marginLeft:15, width: 60, height: 25, justifyContent:'center'}}>
            <Text style={{fontSize: 14, fontWeight:"bold"}}>{selectedRide.price}</Text>
            </View>
            <View style={{ marginRight: 10, backgroundColor:'#F5F5F5', width: 60, height: 25, justifyContent:'center'}}>
              <Text style={{fontSize: 14}}>Tiền mặt</Text>
            </View>
          </View>
        </View>
        <View style={homeScreenStyle.clientLocation}>
          
          <View style={homeScreenStyle.myLocation}>
              <Image 
              source={
               rideStep === "pickedUpGoods"
              ? require('../assets/png/map-pin.png')
              : require('../assets/png/myLocateRide.png')
  }
                  style={{height: 40, width: 40}} />
            
            
                    <Text
                        style = {homeScreenStyle.myLocationInput}
                    >
                     {rideStep === "pickedUpGoods"
                    ? selectedRide.clientDestinationName
                    : selectedRide.clientOriginName}
                </Text>
          </View>
                  

          
      </View>

          <View style={homeScreenStyle.callAndText}>
          <TouchableOpacity
          onPress={() => {
          console.log("Navigating to ChatBox with rideId:", selectedRide.rideId);
            navigation.navigate("ChatBox",{
            currentUserId: "111",
            currentUserName: "Tài xế",
            receiverId: "222",
            rideId: selectedRide.rideId,
            fromScreen: 'AcceptDriveModal'
             
          })}}
          style={{width: '49%', height: 40, flexDirection:'row', justifyContent:'center',alignItems:'center' }}>
           <View 
           style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../assets/png/texting .png')}
            />
            </View>
              <Text style={{fontFamily: 'sans-serif', color:defaultColor, paddingLeft: 10, fontWeight:'bold'}}>Nhắn tin</Text>
          </TouchableOpacity>
          <View style={{width: '2%', height: 40,borderEndColor:'#D1D1D1',borderEndWidth:0.5}}>

          </View>
          <TouchableOpacity
           style={{width: '49%', height: 40,flexDirection:'row', justifyContent:'center',alignItems:'center'}}
           onPress={() => {
            const phoneNumber =
            rideStep === "pickedUpGoods"
              ? `tel:${selectedRide.receiverMobile}` // Giao hàng => gọi người nhận
              : `tel:${selectedRide.senderMobile}`;
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
           >
            <View 
           style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{width:25, height:25, resizeMode: 'contain'}}
              source={require('../assets/png/phone-receiver-silhouette.png')}
            />
            </View>
            <Text style={{fontFamily: 'sans-serif',color:defaultColor, paddingLeft: 10,fontWeight:'bold'}}>Gọi điện</Text>
          </TouchableOpacity>
          
        </View>
    
      <View style={homeScreenStyle.detailsRide}>
        <TouchableOpacity
        style={{flexDirection:'row', alignItems: 'center'}}
        onPress={()=>seeDetails()}
      >
        <Text style={{fontSize: 15, fontWeight:'bold'}}>Chi tiết đơn hàng</Text>
        <View style={{flex:1}}>

        </View>
        <Image 
        style={{height: 40, width: 40}}
        source={require('../assets/png/arrow-right.png')}
        />
      </TouchableOpacity>
      </View>

        <View style={{backgroundColor:"white", width:"100%", marginTop: 5, alignItems:"center", flex:1,justifyContent:'center'}}>
  <TouchableOpacity style={homeScreenStyle.arriveClientLocationBtn}
   onPress={() => {
    if (rideStep === "arriving") {
      updateDeliveryStatus("arrived");
    } else if (rideStep === "arrived") {
      updateDeliveryStatus("pickedUpGoods");
    }else if (rideStep === "pickedUpGoods") {
      updateDeliveryStatus("completed");
      saveDeliveryToHistory();
      CompleteDelivery()
      onClose()
       Alert.alert("✅ Chúc mừng bạn đã hoàn thành chuyến đi an toàn");
    }
  }}
>
  <Text style={{ fontSize: 24, fontWeight: '500', color: 'white' }}>
    {rideStep === "arriving"
      ? "Đã đến điểm lấy hàng"
      : rideStep === "arrived"
      ? "Đã lấy hàng"
      : rideStep === "pickedUpGoods"
      ? "Hoàn thành"
      : "Hoàn thành"}
  </Text>
</TouchableOpacity>
</View>
      
      </ScrollView>
        
      </View>
      
      </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
)
}

//---------------------------------------------------------list drives----------------------------------------------------------------------
interface ListDrivesProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (item: any) => void;
  onAcceptDelivery: (item: any) => void;
  ride: any[];
  delivery: any[],
  currentTab: 'ride' | 'delivery';
  setCurrentTab: (tab: 'ride' | 'delivery') => void;
}

const ListDrivesModal = ({
  visible,
  onClose,
  onAccept,
  onAcceptDelivery,
  ride,
  delivery,
  currentTab,
  setCurrentTab
}: ListDrivesProps) => {
  if (!visible) return null;
const renderRideItem = ({ item }: { item: any }) => (
  <View style={{
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
    borderTopWidth: 1
  }}>
    <Text>Khách: {item.name}</Text>
    <Text>Điểm đón: {item.clientOriginName}</Text>
    <Text>Điểm đến: {item.clientDestinationName}</Text>
    {item.distance && <Text>Khoảng cách: {item.distance}</Text>}
    <Text>Giá: {item.price}</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
      <TouchableOpacity
        onPress={() => onAccept(item)}
        style={{
          marginTop: 10,
          backgroundColor: defaultColor,
          width: 100,
          justifyContent: 'center',
          alignItems: 'center',
          height: 30,
          borderRadius: 10
        }}>
        <Text>Nhận chuyến</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const renderDeliveryItem = ({ item }: { item: any }) => (
  <View style={{
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
    borderTopWidth: 1
  }}>
    <Text>Người gửi: {item.senderName}</Text>
    <Text>Người nhận: {item.receiverName}</Text>
    <Text>Điểm lấy hàng: {item.clientOriginName}</Text>
    <Text>Giao đến: {item.clientDestinationName}</Text>
    <Text>Khoảng cách: {item.distance}</Text>
    <Text>Giá: {item.price}</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
      <TouchableOpacity
        onPress={() => onAcceptDelivery(item)}
        style={{
          marginTop: 10,
          backgroundColor: defaultColor,
          width: 100,
          justifyContent: 'center',
          alignItems: 'center',
          height: 30,
          borderRadius: 10
        }}>
        <Text>Nhận đơn</Text>
      </TouchableOpacity>
    </View>
  </View>
);
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={HomeScreenStyle.modalListDriveOverlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={HomeScreenStyle.modalContainer}>
            {/* Header */}
            <View style={{ justifyContent: "center", alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Danh sách {currentTab === 'ride' ? 'chuyến đi' : 'đơn hàng'}</Text>
            </View>

            {/* Tab switch */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => setCurrentTab('ride')}
                style={{
                  backgroundColor: currentTab === 'ride' ? defaultColor : '#ccc',
                  padding: 10,
                  borderRadius: 5,
                  marginRight: 5
                }}
              >
                <Text style={{ color: 'white' }}>Chuyến đi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentTab('delivery')}
                style={{
                  backgroundColor: currentTab === 'delivery' ? defaultColor : '#ccc',
                  padding: 10,
                  borderRadius: 5
                }}
              >
                <Text style={{ color: 'white' }}>Đơn hàng</Text>
              </TouchableOpacity>
            </View>

            {/* Danh sách */}
            <FlatList
  data={currentTab === 'ride' ? ride : delivery}
  keyExtractor={(item) => item.rideId?.toString() || item._id}
  renderItem={currentTab === 'ride' ? renderRideItem : renderDeliveryItem}
  contentContainerStyle={homeScreenStyle.scrollViewContent}
  showsVerticalScrollIndicator={false}
  
/>


          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
    
  );
};
const CompleteRide = () => {
  console.log('Gửi COMPLETE');
  socket.emit('sendComplete', 'Complete từ App Driver');
  
};

const CompleteDelivery = () => {
  console.log('Gửi COMPLETE DELIVERY');
  socket.emit('sendCompleteDelivery', 'Complete delivery từ App Driver');
  
};


const AcceptDelivery = (item: any,driver: Driver,driverLocation: { latitude: number, longitude: number }) => {
  
  console.log('Gửi message');
  socket.emit('sendDelivery', 'AcceptDelivery từ App Driver!');
  
const rideId = item.rideId;
  const driverInfo = {
    id: driver.id,                   
    name: driver.name,
    phone: driver.phone,
    vehicleType: driver.vehicleType,
    licensePlate: driver.licensePlate,
    imageUrl: driver.imageUrl,
    latitude: driverLocation.latitude,    
    longitude: driverLocation.longitude 
  };
console.log("🧾 Toàn bộ item đơn hàng:", item);
  socket.emit('acceptDelivery', {
    rideId, // Mã chuyến đi hoặc ride request ID
    driverInfo
  });
};




const AcceptRide = (item: any,driver: Driver, driverLocation: { latitude: number, longitude: number }) => {
  console.log('Gửi message');
  socket.emit('sendMessage', 'AcceptRide từ App Driver!');
  const rideId = item.rideId;
  const driverInfo = {
    id: driver.id,                   
    name: driver.name,
    phone: driver.phone,
    vehicleType: driver.vehicleType,
    licensePlate: driver.licensePlate,
    imageUrl: driver.imageUrl,
    latitude: driverLocation.latitude,    
    longitude: driverLocation.longitude 
  };
console.log("🧾 Toàn bộ item chuyến đi:", item);
  socket.emit('acceptRide', {
    rideId, // Mã chuyến đi hoặc ride request ID
    driverInfo
  });
};
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

//-----------------------------------------------------------main screen-----------------------------------------------------------------------
const MapCarScreen =  (props: any) => {
   const {navigation} = props;
   const [currentTab, setCurrentTab] = useState<'ride' | 'delivery'>('ride');
 const route = useRoute();
  const { driver } = route.params as RouteParams;


   const [ride, setRide] = useState<any>(null);
   const [delivery, setDelivery] = useState<any>(null);

    const [isListDriveModalVisible, setIsListDriveModalVisible] = React.useState(false);
    const [isAcceptRideModalVisible, setIsAcceptDriveModalVisible] = React.useState(false);
    const [isAcceptDeliveryModalVisible, setIsAcceptDeliveryModalVisible] = React.useState(false);

    const [isDetailsRideModalVisible, setIsDetailsRideModalVisible] = React.useState(false);
     const [isDetailsDeliveryModalVisible, setIsDetailsDeliveryModalVisible] = React.useState(false);
//------------------------------------------------------------Kmeans-----------------------------------------------------------------------------
const [points, setPoints] = useState<ClusterPoint[]>([]);
const [loading, setLoading] = useState(true);
//Kmeans
interface ClusterPoint {
  area: string;
  population: number;
  trafficDensity: number;
  latitude: number;
  longitude: number;
}

interface Cluster {
  clusterNumber: number;
  label: string;
  points: ClusterPoint[];
}


  const fetchClustering = async () => {
    try{
        setLoading(true)
       const response = await axios.get(`http://${defaultIPV4}:3000/clustering`)
      
        const clusters: Cluster[] = response.data;

        // Lọc ra cụm có label === "Nhiều"
        const highCluster = clusters.find((c: Cluster) => c.label === "Nhiều");
            setPoints(highCluster?.points || []);
      }
      catch (error) {
      console.error('Lỗi khi lấy dữ liệu clustering:', error);
    } finally {
      setLoading(false);
    }
   
  }
  const reloadKmeans = async () => {
  try {
      setLoading(true);
      await axios.post(`http://${defaultIPV4}:3000/recluster`);
      await fetchClustering();
      setCooldown(30);
    } catch (error) {
      console.error('Lỗi khi recluster:', error);
      setLoading(false);
    }
}
  const [cooldown, setCooldown] = useState(0);
useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);


const [selectedRide, setSelectedRide] = useState(null);

const [originClient, setOriginClient] = useState({
  latitude: 0,
  longitude: 0,
});

const [destinationClient, setDestinationClient] = useState({
  latitude: 0,
  longitude: 0,
});




  const handleAcceptRide = (item: any) => {
    setSelectedRide(item);
    setOriginClient({
      latitude: parseFloat(item.clientLatitude),
      longitude: parseFloat(item.clientLongitude)
    })
    setDestinationClient({
      latitude: parseFloat(item.clientDestinationLatitude),
      longitude: parseFloat(item.clientDestinationLongitude)
    })
  setIsAcceptDriveModalVisible(true)
  setIsListDriveModalVisible(!isListDriveModalVisible) 
}

  const handleAcceptDelivery = (item: any) => {
    setSelectedRide(item);
    setOriginClient({
      latitude: parseFloat(item.senderLatitude),
      longitude: parseFloat(item.senderLongitude)
    })
    setDestinationClient({
      latitude: parseFloat(item.receiverLatitude),
      longitude: parseFloat(item.receiverLongitude)
    })
  setIsAcceptDeliveryModalVisible(true)
  setIsListDriveModalVisible(!isListDriveModalVisible) 
}

const handleCancelRide = useCallback(() => {
  Alert.alert('Hủy chuyến', 'Chuyến đi của bạn đã bị hủy');
  setIsAcceptDriveModalVisible(false);
  setIsListDriveModalVisible(true);
  setOriginClient({ latitude: 0, longitude: 0 });
  setDestinationClient({ latitude: 0, longitude: 0 });

}, []);
const handleCancelDelivery = useCallback(() => {
  Alert.alert('Hủy đơn', 'Đơn hàng của bạn đã bị hủy');
  setIsAcceptDeliveryModalVisible(false);
  setIsListDriveModalVisible(true);
  setOriginClient({ latitude: 0, longitude: 0 });
  setDestinationClient({ latitude: 0, longitude: 0 });

}, []);
const HandleDetailsClose =()=> {
  setIsDetailsRideModalVisible(false),
  setIsAcceptDriveModalVisible(true)
}
const HandleDetailsDeliveryClose =()=> {
  setIsDetailsDeliveryModalVisible(false),
  setIsAcceptDeliveryModalVisible(true)
}
const HandleDetailsRide = ()=>{
  setIsDetailsRideModalVisible(true)
  setIsAcceptDriveModalVisible(false)
}
const HandleDetailsDelivery = ()=>{
  setIsDetailsDeliveryModalVisible(true)
  setIsAcceptDriveModalVisible(false)
}

  //------------------------------------------------------------fetchRide------------------------------------------------------------------
  const fetchLatestRide = async () => {
  try {
    const response = await axios.get(`http://${defaultIPV4}:3000/request-ride`);
    if (response.data) {
      setRide(response.data);
      console.log('Danh sách chuyến');
    } else {
      setRide(null);
      // Không có chuyến mới
    }
  } catch (error) {
    console.error('Lỗi lấy chuyến:', error);
  }
};




const getListRide = async () => {
  try {
    if (currentTab === 'ride') {
      const response = await axios.get(`http://${defaultIPV4}:3000/request-ride`);
      setRide(response.data || []);
    } else {
      const response = await axios.get(`http://${defaultIPV4}:3000/request-delivery`);
      setDelivery(response.data || []);
    }
  } catch (error) {
    console.error('Lỗi lấy dữ liệu:', error);
    if (currentTab === 'ride') {
      setRide([]);
    } else {
      setDelivery([]);
    }
  }
};


useEffect(() => {
  getListRide();
}, [currentTab]);


const handleAcceptRideClose=() => {
  setIsAcceptDriveModalVisible(!isAcceptRideModalVisible)
  setIsListDriveModalVisible(!isListDriveModalVisible)
}
const handleAcceptDeliveryClose=() => {
  setIsAcceptDeliveryModalVisible(false)
  setIsListDriveModalVisible(!isListDriveModalVisible)
}
const handleListClose = () => {
  setIsListDriveModalVisible(false)
}
const handleOpenDrive = () => {
  setIsListDriveModalVisible(!isListDriveModalVisible)
  setIsOnline(!isOnline)
  getListRide()
}
  // -----------------------------------------------------------map and location-----------------------------------------------------------
  const mapRef = useRef<MapView | null>(null);
  const [origin, setOrigin] = React.useState({
    latitude: 0,
    longitude: 0,
  });

  const [destination, setDestination] = React.useState({
    latitude: 0,
    longitude: 0,
  });

  const [originName, setOriginName] = React.useState('')
  const [destinationName, setDestinationName] = React.useState('')
  const [distance, setDistance] = React.useState(0);
  const [isOnline, setIsOnline] = React.useState(false);
useEffect(() => {
  let interval: NodeJS.Timeout;

  if (!isOnline) {
    setRide(null);
    return;
  }

  getListRide(); 

  interval = setInterval(() => {
    getListRide(); 
  }, 1000);

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isOnline, currentTab]); 


  // --------------------------------------------------------current location--------------------------------------------------------

  async function getLocationPermission() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied', 'App cần quyền truy cập vị trí để hoạt động');
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const current = { latitude, longitude };
  setOrigin(current);

  const geocode = await Location.reverseGeocodeAsync(current);
  if (geocode.length > 0) {
    const locationName = geocode[0].city || geocode[0].street || 'Vị trí không xác định';
    setOriginName(locationName);
  }
}

async function currentLocation ( ) {
    mapRef.current?.animateToRegion(
      {
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
    )
  }
  React.useEffect(() => {
  (async () => {
    await getLocationPermission();
  })();
}, []);
  React.useEffect(()=>{
    
},[origin])

  
  async function moveToLocation (latitude: number | undefined , longitude: number| undefined ) {
    mapRef.current?.animateToRegion(
      {
        latitude: latitude ?? 0, 
        longitude: longitude ?? 0,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },2000,
    )
  }

  
const distanceString = `${Math.round(distance * 10) / 10} Km`;


//--------------------------------------------------------Region zoom--------------------------------------------------------

const getRegion = (origin: any,destination: any) => {
  const latitudes = [originClient.latitude, destinationClient.latitude];
  const longitudes = [originClient.longitude, destinationClient.longitude];

  // Get the center point
  const latitude = (Math.max(...latitudes) + Math.min(...latitudes)) / 2;
  const longitude = (Math.max(...longitudes) + Math.min(...longitudes)) / 2;

  // Get the deltas to fit both points within the view
  const latitudeDelta = Math.abs(Math.max(...latitudes) - Math.min(...latitudes)) * 1.9;
  const longitudeDelta = Math.abs(Math.max(...longitudes) - Math.min(...longitudes)) * 1.9;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};
const handleUpdateRegion = () => {
  const region = getRegion(originClient, destinationClient); // Calculate the region that fits both points
  if (mapRef.current) {
    mapRef.current.animateToRegion(region, 500); // Animate to the new region over 1 second
  }
};
useEffect(() => {
  if (destinationClient.latitude !== 0 && destinationClient.longitude !== 0) {
    handleUpdateRegion(); // Call after the destination has been updated
  }else if (origin.latitude !== 0 && origin.longitude !== 0) {
      currentLocation();
  }
}, [destinationClient, originClient, origin]);

  return (
    
    <View style={HomeScreenStyle.container}>

  {origin && origin.latitude !== 0 ? (
    <>
      <MapView
        ref={mapRef}
        style={[HomeScreenStyle.map,
          {height: isAcceptRideModalVisible?screenHeight*0.55:screenHeight}
        ]}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
        >
          <Image
            source={locationImg}
            style={{ width: 25, height: 25 }}
          />
        </Marker>

    {originClient && originClient.latitude !== 0 && !ListDrivesModal  && (
    <Marker
      coordinate={originClient}
      title="Điểm đón"
    >
      <Image
        source={require('../assets/png/pin.png')}
        style={{ width: 40, height: 40 }}
      />
    </Marker>
  )}

        {/* Marker điểm đến */}
      {destinationClient && destinationClient.latitude !== 0 && !ListDrivesModal&& (
    <Marker
    coordinate={destinationClient}
    >
      <Image
          source={require('../assets/png/map-pin.png')}
          style={{width: 45, height: 45}}
          />
      
        </Marker>
        
      )}

                                                 {/* Kmeans marker */}

  {points.map((point, index) => (
  <Circle
    key={index}
    center={{ latitude: point.latitude, longitude: point.longitude }}
    radius={900} // bán kính tính bằng mét
    strokeWidth={1}
    strokeColor="rgba(230, 39, 39, 0.2)"
    fillColor="rgba(230, 39, 39, 0.2)" 
  />
  ))}
  {originClient && originClient.latitude !== 0 && !ListDrivesModal  && (
  <MapViewDirections
          origin={originClient}
          destination={destinationClient}
          apikey={GOOGLE_MAP_KEY}
          
          strokeColor={defaultColor}  // Set the color of the route line
          strokeWidth={5}  // Set the width of the line for directions
          onError={(errorMessage) => {
            console.log("Error in Directions API:", errorMessage);
          }}
        />
       ) }
      </MapView>

<View style={[HomeScreenStyle.showLocation,
        {bottom: 290}
      ]}>
        <TouchableOpacity onPress={reloadKmeans}
        style={{alignItems:'center', justifyContent:'center'}}
        >
          <Image
            style={HomeScreenStyle.currentLocationBtnImg}
            source={require("../assets/png/reload.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={[HomeScreenStyle.showLocation,
        {bottom: isAcceptRideModalVisible||isAcceptDeliveryModalVisible?430: 240}
      ]}>
        <TouchableOpacity onPress={currentLocation}
        style={{alignItems:'center', justifyContent:'center'}}
        >
          <Image
            style={HomeScreenStyle.currentLocationBtnImg}
            source={require("../assets/png/crosshair.png")}
          />
        </TouchableOpacity>
      </View>
        <View style={HomeScreenStyle.headMenu}>
        <TouchableOpacity onPress={()=>navigation.navigate("Menu", { driver })}>
          <Image
            style={HomeScreenStyle.headMenuBtnImg}
            source={require("../assets/png/menu-bar.png")}
          />
        </TouchableOpacity>
      </View>


<View style = {[HomeScreenStyle.openDrive,
  {backgroundColor: isOnline? defaultColor: '#333333'}
]}>
          <TouchableOpacity 
          onPress={() => handleOpenDrive()}
          style= {{flexDirection:'row', alignItems:'center', justifyContent:'center'}}
          >
            <Image
            style={HomeScreenStyle.onOffBtnImg}
            source={require("../assets/png/on-off-button.png")}
          />
          <Text 
          style={{fontSize:18, fontWeight:'bold', paddingLeft: 15, color:'#F4F4F4'}}
          >{isOnline ? 'Tắt nhận chuyến' : 'Mở nhận chuyến'}</Text>
        </TouchableOpacity>
    </View>

    <View style = {HomeScreenStyle.statusDrive}>
          <View 
          
          style= {{flexDirection:'row', alignItems:'center', paddingLeft: 10}}
          >
            <Image
            style={HomeScreenStyle.redDotBtnImg}
            source={
              isOnline
      ? require("../assets/png/greendot.png")
      : require("../assets/png/reddot.png")
            }
          />
          <Text 
          style={{fontSize:17, fontWeight:'bold', paddingLeft: 10}}
          >{isOnline ? 'Đang hoạt động' : 'Đang ngoại tuyến'}</Text>
        </View>
    </View>
        <View style = {HomeScreenStyle.bottomMenu}>
          <Text style={{fontSize: 18, fontWeight:"bold"}}></Text>
        </View>


    </>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={defaultColor} />
      <Text>Đang lấy vị trí hiện tại...</Text>
    </View>
  )}


    <ListDrivesModal
      visible={isListDriveModalVisible}
      onClose={handleListClose}
      onAccept={(item) => {
        AcceptRide(item,driver, origin);
        handleAcceptRide(item);
      }}
      onAcceptDelivery={(item) => {
        console.log("🚚 driverDeli truyền vào AcceptDelivery:", driver);
        AcceptDelivery(item,driver, origin);
        handleAcceptDelivery(item);
      }}
       ride={ride}
       delivery={delivery}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    />

    <AcceptDriveModal
      visible={isAcceptRideModalVisible}
      onClose={handleAcceptRideClose}
      seeDetails={HandleDetailsRide}
      selectedRide={selectedRide}
      cancelRide={handleCancelRide}
      navigation={navigation}
    />
    <AcceptDeliveryModal
      visible={isAcceptDeliveryModalVisible}
      onClose={handleAcceptDeliveryClose}
      seeDetails={HandleDetailsDelivery}
      selectedRide={selectedRide}
      cancelRide={handleCancelDelivery}
      navigation={navigation}
    />
    <DetailsRideModal
    visible={isDetailsRideModalVisible}
    onClose={HandleDetailsClose}
    selectedRide={selectedRide}
    />

    <DetailsDeliveryModal
    visible={isDetailsDeliveryModalVisible}
    onClose={HandleDetailsDeliveryClose}
    selectedRide={selectedRide}
    />
    </View>
    
  );
};



export default MapCarScreen;
