import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Blogs from '../components/Blogs';
import { getUserData } from '../services/UserDataServices';
import { useSelector } from 'react-redux';

const BlogScreen = () => {
  const navigation = useNavigation();

  const [userImage, setUserImage] = useState('');
  const uid = useSelector(state => state.userData.uid);

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

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View className="mx-4 flex-row justify-between items-center">
              <AdjustmentsHorizontalIcon size={hp(4)} color={"gray"} />
              {
                userImage != "" && (
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

          <View className="mx-4 space-y-1 mb-2">

            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-extrabold text-[#f64e32]"
            >
              Blog
            </Text>
          </View>
          <View>
            <ScrollView showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 50,
              }} className="space-y-6"
            >
              <Blogs />
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BlogScreen