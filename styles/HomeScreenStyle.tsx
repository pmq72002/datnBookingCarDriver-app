import { Dimensions, StyleSheet } from "react-native";
import defaultColor from "../assets/btn/btnColor";
const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const homeScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 50
       
      },
  
      showLocation:{
        position: "absolute",
        right: 0,
        bottom: 240,
        borderRadius: 200/2,
        backgroundColor: "white",
         
        transform: [{ translateX: -15 }],
        width: 40,  
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      
      },
      headMenuBtnImg:{
         height: 40,
        width: 40, 
      },
      currentLocationBtnImg:{
        height: 22,
        width: 22,    
      },
      map: {
        width: '100%',
      },

    headMenu:{
         position: "absolute",
        left: 15,
        top: 15,
        borderRadius: 200/2,
        zIndex: 10
    },
    openDrive:{
    height: 50,
    width: '50%',
    backgroundColor: '#333333',
    bottom: 240,
    position: 'absolute',
    justifyContent:'center',
    left: '50%',
    transform: [{ translateX: -width * 0.25 }],
    borderRadius: 60,
    },
    onOffBtnImg:{
      height: 20,
      width: 20, 

    },
  statusDrive:{
    height: 48,
    width: '90%',
    backgroundColor: 'white',
    bottom: 180,
    position: 'absolute',
    justifyContent:'center',
    left: '50%',
    transform: [{ translateX: -width * 0.45 }],
    borderRadius: 15,
    
  },
  bottomMenu:{
    height: 140,
    width: '90%',
    backgroundColor: 'white',
    bottom: 25,
    position: 'absolute',
    alignItems: 'center',
    justifyContent:'center',
    left: '50%',
    transform: [{ translateX: -width * 0.45 }],
    borderRadius: 15

  },
  redDotBtnImg:{
    height: 25,
    width: 25,
  },

 modalListDriveOverlay: {
      flex: 1, 
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      position: 'absolute', 
      width: '100%',
      height: screenHeight * 0.6,
      top: 0,
      pointerEvents: 'box-none'
    },
modalContainer: {
      width: '100%',
      backgroundColor: 'white',
      padding: 20,
      flex:1,
    },
   scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 20, 
      width: '100%',
    },
    modalOnDriveOverlay:{
      flex: 0.5,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      position: 'absolute', 
      width: '100%',
      height: screenHeight*0.45,
      bottom: 0,
      marginBottom: 0, 
      borderTopEndRadius: 10,
      borderTopStartRadius:10,
    },
    modalOnDriveContainer:{
    width: '100%',
    backgroundColor: '#F1F1F1',
    borderTopEndRadius: 10,
    borderTopStartRadius:10,
    flex:1,
    
    },
    rideHeader:{
      backgroundColor: 'white',
      width:'100%',
      height: 80,
      flexDirection:'row',
      alignItems:'center'
    },
    clientLocation:{
      width: '100%',
      height: 70,
      backgroundColor: 'white',
      marginTop: 4
    },
    myLocation:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"center",
        borderRadius:10,
        width: '100%',
        backgroundColor: 'white', 
        paddingLeft: 10,
        height: 80
      },
       icon:{
        marginRight: 10,
      },
      myLocationInput:{
        flex: 1,
        height: 50,
        fontSize: 18,
        fontWeight:'bold',
        textAlignVertical:"center",
        alignItems:"center",
      },
      callAndText:{
      backgroundColor:'white',
      width:'100%',
      height: 60,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems:'center'
    },
    arriveClientLocationBtn: {
      backgroundColor: defaultColor,  
      padding: 10,
      borderRadius: 10,
      width: "90%",  
      alignItems:'center',
      justifyContent:'center',
      height: 60,
    },
    detailsRide:{
      backgroundColor:'white',
      paddingLeft: 15,
      marginTop: 4
      
    },
    modalDetailsRideOverlay:{
      flex: 1, 
      justifyContent:'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      position: 'absolute', 
      width: '100%',
      height: '100%',
      bottom: 0,
      top: 0,
      
    },
    modalDetailsRideContainer:{
    width: '100%',
    backgroundColor: '#F1F1F1',
    flex:1,
    },
    headScreen:{
      paddingTop: 20,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    height: 50,
    width: '100%',
    backgroundColor:'white'
      },
      backBtnImg:{
        height:30,
        width: 30,
        
      },
      distanceAndTime:{
        backgroundColor:'#242424',
        height: 80,
        width: '90%',
        justifyContent: 'space-evenly',
        alignItems:'center',
        borderRadius: 15,
        flexDirection:'row',
      },
      locationRide:{
        backgroundColor:'white',
        width: '100%',
        height: 150
      },
       itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
    borderTopWidth: 1,
  },
  acceptButton: {
    marginTop: 10,
    backgroundColor: defaultColor,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 10,
  },
  })

export default homeScreenStyle