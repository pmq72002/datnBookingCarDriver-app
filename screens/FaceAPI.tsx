import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import defaultIPV4 from '../assets/ipv4/ipv4Address';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useNavigation } from '@react-navigation/native';
import { useDriver } from '../context/DriverContext';
export default function FaceAPI(props: any) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
const { driver: contextDriver } = useDriver();
const driver = contextDriver
   const demoImage = driver?.imageUrl
    ? { uri: `http://${defaultIPV4}:3000/uploads/${driver.imageUrl}` }
    : null;

const getBase64FromAsset = async (assetModule: any) => {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync(); // Đảm bảo đã tải ảnh về local
  
  if (!asset.localUri) throw new Error('Asset localUri is null');
    const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: 'base64' });
  return base64;
};
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };



  // Hàm chụp ảnh và gửi lên Face++ API
  const captureAndDetectFace = async () => {
  if (!cameraRef.current) {
    Alert.alert('Camera not ready');
    return;
  }
  try {
    const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.1 });

console.log('Base64 length:', photo.base64.length); // debug size base64

    const response = await fetch(`http://${defaultIPV4}:3000/face-detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64: photo.base64 }),
    });

    const result = await response.json();
    Alert.alert('Face++ Result', JSON.stringify(result));
  } catch (error) {
    Alert.alert('Error', (error as Error).message);
  }
};


const {navigation} = props;

const compareFaces = async (base64Known: string, base64New: string) => {
  try {
    const response = await fetch(`http://${defaultIPV4}:3000/face-compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64_1: base64Known,
        imageBase64_2: base64New,
      }),
    });

    const result = await response.json();

    if (result.confidence !== undefined) {
      const isMatch = result.confidence > 80;
      Alert.alert(
        'Kết quả xác nhận ',
        `Trùng khớp: ${result.confidence.toFixed(2)}%\n` +
        (isMatch ? 'Hoàn thành' : 'Không hoàn thành')
      );

      if (isMatch) {
        navigation.goBack(); // 👉 quay lại màn hình trước
      }
    } else {
      Alert.alert(
        'Kết quả xác nhận ',
        `Bạn không khớp với tài xế của tài khoản này`
      );
    }
  } catch (error) {
    Alert.alert('Error', (error as Error).message);
  }
};

const captureAndCompareFace = async () => {
  if (!cameraRef.current) {
    Alert.alert('Camera not ready');
    return;
  }
  try {
    const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.1  });
  console.log('Base64 length pic:', photo.base64.length);
    const base64Known = await getBase64FromAsset(demoImage); 
console.log('Base64 default length:', base64Known.length);
    await compareFaces(base64Known, photo.base64);
  } catch (error) {
    Alert.alert('Error', (error as Error).message);
  }
};


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={captureAndDetectFace}>
            <Text style={styles.text}>Capture & Detect</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={captureAndCompareFace}>
  <Text style={styles.text}>Chụp ảnh nhận diện</Text>
</TouchableOpacity>


        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
