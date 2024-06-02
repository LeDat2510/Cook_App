import React, { useRef } from 'react';
import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from '@react-navigation/native';
import LottieView from "lottie-react-native";

const Welcome = () => {
    const animation = useRef(null);
    const navigation = useNavigation();

  return (
    <View className="bg-orange-500 flex-1 justify-center items-center space-y-10 relative">
        <Image 
       source={require("../assets/images/background.png")}
       style={{
        position: "absolute",
        width: wp(100),
        height: hp(100),
        resizeMode: "cover",
       }}
        />
        <LottieView autoPlay ref={animation}
            style={{
                width: wp(70),
                height: hp(40),
            }}
            source={require("../assets/lottie/food-logo.json")}
        />

        <View className="flex items-center space-y-2">
            <Text 
            className="text-white font-extrabold tracking-widest"
            style={{
                fontSize: hp(5),
            }}
            >
                Cook App
            </Text>

            <Text className="text-white tracking-widest font-medium" style={{
                fontSize: hp(2.5),
            }}>
                Khám phá các món ăn mới
            </Text>
        </View>

        <View>
            <TouchableOpacity 
                style={{
                    backgroundColor: "#fff",
                    paddingVertical: hp(1.5),
                    paddingHorizontal: hp(5),
                    borderRadius: hp(1.5),
                }}
                onPress={() => {
                    navigation.navigate("Login");
                  }}
            >
                <Text
                    style={{
                        color: "#f64e32",
                        fontSize: hp(2.5),
                        fontWeight: "medium",
                    }}
                >
                    Truy cập ngay
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default Welcome;