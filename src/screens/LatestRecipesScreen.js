import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import LatestRecipes from '../components/LatestRecipes';
import { getUserData } from '../services/UserDataServices';
import { useSelector } from 'react-redux';

const LatestRecipesScreen = () => {
  const navigation = useNavigation();
  const uid = useSelector(state => state.userData.uid);
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    const data = getUserData(uid, (userData) => {
      if (userData) {
        setUserImage(userData.user_image);
      }
    });
    return data;
  }, [uid])

  return (
    <View >
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
          }} className="space-y-6 pt-5"
        >

          {/* Avatar */}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View className="mx-4 flex-row justify-between items-center">
              <AdjustmentsHorizontalIcon size={hp(4)} color={"gray"} />
              {
                userImage && (
                  <Image
                    source={{ uri: userImage }}
                    style={{
                      width: hp(6),
                      height: hp(6),
                      resizeMode: "cover",
                    }}
                    className="rounded-full"
                  />
                )
              }
            </View>
          </TouchableOpacity>

          {/*Headlines */}
          <View className="mx-4 space-y-1 mb-2">

            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-extrabold text-[#f64e32]"
            >
              Công thức mới nhất
            </Text>
          </View>

          <View>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 50,
                }} className="space-y-6"
              >
                <LatestRecipes />
              </ScrollView>
            </SafeAreaView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default LatestRecipesScreen