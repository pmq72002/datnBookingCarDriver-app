import { Text, TextInput, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import loginStyles from "../styles/loginStyle"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import defaultIPV4 from '../assets/ipv4/ipv4Address';
import defaultColor from "../assets/btn/btnColor"
import { useDriver } from "../context/DriverContext"

const LogInScreen = (props: any) => {
  const { navigation } = props;
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { setDriver } = useDriver();

const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ số điện thoại và mật khẩu.");
      return;
    }

    try {
      const response = await axios.post(`http://${defaultIPV4}:3000/login-driver`, {
        phone,
        password
      });

      const driver = response.data.driver;
      Alert.alert("Thành công", "Đăng nhập thành công!");

      // Chuyển đến trang chính của tài xế
       setDriver(driver);
      navigation.navigate("Home", { driver });

    } catch (error: any) {
      if (error.response && error.response.data.message) {
        Alert.alert("Lỗi", error.response.data.message);
      } else {
        Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
      }
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, marginTop: 20 }} keyboardShouldPersistTaps="always">
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Đăng nhập</Text>

      <Text>Số điện thoại:</Text>
      <TextInput
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        value={phone}
        onChangeText={setPhone}
      />

      <Text>Mật khẩu:</Text>
      <TextInput
        placeholder="Nhập mật khẩu"
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: defaultColor,
          padding: 12,
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Đăng nhập</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LogInScreen
