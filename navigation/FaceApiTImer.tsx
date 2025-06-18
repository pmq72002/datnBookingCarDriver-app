import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const FaceAPITimer = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    const interval = setInterval(() => {
      navigation.navigate('Face'); // tên màn hình trong Stack.Screen
    }, 30 * 60 * 1000); // 30 phút

    return () => clearInterval(interval); // cleanup khi component unmount
  }, []);

  return null;
};

export default FaceAPITimer;
