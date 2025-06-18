import { Dimensions, StyleSheet } from "react-native";
import defaultColor from "../assets/btn/btnColor";
const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const menuHomeScreenStyle = StyleSheet.create({
headScreen:{
    position: "absolute",
    zIndex: 1,
    top: 70,
    width:"100%"
      },
      backBtnImg:{
        height:30,
        width: 30,
        
      },
      driverPic:{
        marginTop: 30,
        backgroundColor:'#C0BCB9',
        height: 80,
        width: '90%',
        borderRadius: 15,
        flexDirection:'row',
        alignItems:"center",
        alignSelf:"center"
      },
      driverThings:{
        flexDirection:"row",
        height: 50,
        width:"100%",
        alignItems:'center'
      },
       nextIcon:{
        color: "grey",
        paddingRight: 10
        
    },
})
export default menuHomeScreenStyle