import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import io from "socket.io-client";
import { RouteProp, useRoute } from "@react-navigation/native";
import defaultIPV4 from "../assets/ipv4/ipv4Address";

const socket = io(`http://${defaultIPV4}:3000`, {
  transports: ["websocket"],
});

type IMessage = {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
};

type ChatBoxScreenRouteProp = RouteProp<{
  ChatBoxScreen: {
    currentUserId: string;
    receiverId: string;
    rideId: string;
    currentUserName: string;
    
  };
}, "ChatBoxScreen">;

const ChatBoxScreen = (props: any) => {
   const {navigation} = props;
   
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const route = useRoute<ChatBoxScreenRouteProp>();
  const { currentUserId, receiverId, rideId, currentUserName } = route.params;
  const formatMessage = (msg: any): IMessage => {
  let createdAt = new Date(msg.timestamp);
  if (isNaN(createdAt.getTime())) {
    createdAt = new Date(); // fallback nếu timestamp lỗi
  }

  let senderName = "Không rõ";
  if (msg.senderId === currentUserId) {
    senderName = currentUserName;
  } else if (msg.senderId === receiverId) {
    senderName = "Hành khách";
  }

  return {
    _id: msg._id || Math.random().toString(),
    text: msg.message,
    createdAt,
    user: {
      _id: msg.senderId,
      name: senderName,
    },
  };
};

  useEffect(() => {
    socket.emit("join", currentUserId);

    socket.on("chatMessage", (msg: any) => {
        console.log("Received message on driver app:", msg);
      if (msg.rideId === rideId) {
        setMessages((prev) => [formatMessage(msg), ...prev]);
      }
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [rideId, currentUserId]);

  const onSend = useCallback(() => {
    if (!inputText.trim()) return;

    const msgToSend = {
      senderId: currentUserId,
      receiverId,
      rideId,
      message: inputText,
      timestamp: new Date(),
      senderName: currentUserName,
    };

    socket.emit("chatMessage", msgToSend);
    setMessages((prev) => [formatMessage(msgToSend), ...prev]);
    setInputText("");
  }, [inputText]);

  const renderItem = ({ item }: { item: IMessage }) => {
    const isCurrentUser = item.user._id === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.sender}>{item.user.name}</Text>
        <Text style={styles.message}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.createdAt.toLocaleTimeString()}
        </Text>
      </View>
    );
  };
useEffect(() => {
    if (!rideId) return;
  const fetchMessages = async () => {
    const res = await fetch(`http://${defaultIPV4}:3000/messages/${rideId}`);
    const data = await res.json();
    const formatted = data.map(formatMessage);
    setMessages(formatted);
  };
  fetchMessages();
}, [rideId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
        <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
         paddingLeft: 15,
            marginTop: 50,
      }}
    >
<Image 
        style={{height:30, width:30}}
        source={require("../assets/png/back-button.png")}
        />

    </TouchableOpacity>

      <FlatList
        inverted
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhắn cho khách hàng"
          style={styles.input}
        />
        <TouchableOpacity onPress={onSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBoxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#eee",
  },
  sendButton: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  sendText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  messageContainer: {
    maxWidth: "75%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  sender: {
    fontSize: 12,
    color: "#555",
  },
  message: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 5,
    alignSelf: "flex-end",
  },
});
