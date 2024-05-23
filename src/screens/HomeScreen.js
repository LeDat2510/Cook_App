import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Categories from '../components/Categories';
import Recipes from '../components/Recipes';
import { getUserData } from '../services/UserDataServices';
import { Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerActions } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {

  const uid = useSelector(state => state.userData.uid);
  const [userImage, setUserImage] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  useEffect(() => {
    const data = getUserData(uid, (userData) => {
      if (userData) {
        setUserImage(userData.user_image);
      }
    });
    return data;
  }, [uid])


  const handleSearch = () => {
    navigation.navigate('Search');
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FCFCFB' }}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
          }} className="space-y-6 pt-5"
        >

          {/* Avatar */}
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <View className="mx-4 flex-row justify-between items-center">
              <AdjustmentsHorizontalIcon size={hp(4)} color={"gray"} />
              {
                userImage != '' && (
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
            <View>
              <Text
                style={{
                  fontSize: hp(3.5),
                }}
                className="font-bold text-neutral-800"
              >
                Học nấu ăn
              </Text>
            </View>
            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-extrabold text-neutral-800"
            >
              cùng <Text className="text-orange-500">CookApp</Text>
            </Text>
          </View>

          {/*Search Bar */}
          <View className="mx-4 flex-row items-center border rounded-xl border-black p-[6px]">
            <View className="bg-white rounded-full p-2">
              <TouchableOpacity onPress={handleSearch}>
                <MagnifyingGlassIcon
                  size={hp(2.5)}
                  color={"gray"}
                  strokeWidth={3}
                />
              </TouchableOpacity>
            </View>
            <Pressable style={{flex: 1, marginLeft: 5, marginTop: 5, marginBottom: 5, paddingTop: 5, paddingBottom: 5}} onPress={handleSearch}>
              <Text
                style={{
                  fontSize: hp(1.7),
                }}
                className="flex-1 text-base mb-1 tracking-widest"
                editable={false}
              >
                Tìm kiếm món ăn bạn cần
              </Text>
            </Pressable>
          </View>

          <View >
            <ScrollView showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 50,
              }} className="space-y-6"
            >
              <View>
                <Categories onCategoryChange={handleCategoryChange} />
              </View>

              <View>
                <Recipes categoryId={selectedCategoryId} />
              </View>
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen
