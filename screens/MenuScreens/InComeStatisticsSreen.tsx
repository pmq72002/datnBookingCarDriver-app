import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView,Image } from 'react-native';
import defaultIPV4 from '../../assets/ipv4/ipv4Address';
import menuHomeScreenStyle from '../../styles/MenuHomeScreenStyle';

type Ride = {
  completedAt: string;
  price: string;
};

type IncomeStats = {
  _id: string; // Ngày: "2025-06-13"
  totalIncome: number;
  rides: Ride[];
};

const IncomeStatisticsScreen = (props: any) => {
    const {navigation} = props;
  const [stats, setStats] = useState<IncomeStats[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://${defaultIPV4}:3000/ride-history/income-stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Lỗi lấy thống kê:", err));
  }, []);

  const toggleExpand = (dayId: string) => {
    setExpandedDay(prev => (prev === dayId ? null : dayId));
  };

  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <View style={{flexDirection: "row", marginTop: 50, marginBottom: 20}}>
      <TouchableOpacity
       onPress={()=>navigation.goBack()}
      > 
      <Image 
        style={menuHomeScreenStyle.backBtnImg}
        source={require("../../assets/png/back-button.png")}
        />
        </TouchableOpacity>
       
       <Text style={{fontSize: 20, fontWeight:'bold', marginLeft:75}}>Thống kê thu nhập</Text>
        
        </View> 

      {stats.map((item) => (
        <View
          key={item._id}
          style={{
            marginBottom: 15,
            backgroundColor: '#e0e0e0',
            padding: 12,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity onPress={() => toggleExpand(item._id)}>
            <Text style={{ fontSize: 18 }}>Ngày: {item._id}</Text>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              Tổng thu nhập: {item.totalIncome.toLocaleString()} VND
            </Text>
          </TouchableOpacity>

          {expandedDay === item._id && (
            <View style={{ marginTop: 5, paddingLeft: 5 }}>
                <View style={{borderBottomColor:'grey',borderBottomWidth:0.5,borderTopColor:'grey',borderTopWidth:0.5,alignItems:"center", justifyContent:"center",marginBottom:10}}>
                    <Text style={{ fontSize: 16 }}>Chi tiết thu nhập</Text>
                </View>
                
              {item.rides.map((ride, index) => (
                <Text key={index} style={{ fontSize: 16, marginBottom: 10 }}>
                  Hoàn thành: {formatTime(ride.completedAt)} - 💵 {ride.price}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default IncomeStatisticsScreen;
