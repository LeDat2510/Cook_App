import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, StyleSheet, Button, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ListPostedRecipes from '../components/ListPostedRecipes';
import ListPostedBlogs from '../components/ListPostedBlogs';
import { getUserData } from '../services/UserDataServices';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const tabs = [{ name: 'Công thức' }, { name: 'Blog' }];

const MyPostedScreen = () => {

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

  const [value, setValue] = React.useState(0);
  const renderContent = () => {
    if (value === 0) {
      return <ListPostedRecipes />;
    } else if (value === 1) {
      return <ListPostedBlogs />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
                userImage ? (
                  <Image
                    source={{ uri: userImage }}
                    style={{
                      width: hp(6),
                      height: hp(6),
                      resizeMode: "cover",
                    }}
                    className="rounded-full"
                  />
                ) : (
                  <Text>No image</Text>
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
              className="font-extrabold text-orange-500"
            >
              Danh sách bài đăng
            </Text>
          </View>


          <View style={styles.container}>
            {tabs.map((item, index) => {
              const isActive = index === value;
              const isFirst = index === 0;
              const isNotFirst = index !== 0;
              const isLast = index === tabs.length - 1;

              return (
                <View style={{ flex: 1, zIndex: isActive ? 1 : 0 }} key={item.name}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setValue(index);
                    }}>
                    <View
                      style={[
                        styles.item,
                        isActive && { borderColor: '#f64e32' },
                        isFirst && {
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                        },
                        isNotFirst && { marginLeft: -2 },
                        isLast && {
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                        },
                      ]}>
                      <Text style={[styles.text, isActive && { color: '#f64e32' }]}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            })}

          </View>
          <View>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}
              >
                {renderContent()}
              </ScrollView>
            </SafeAreaView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 12,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderColor: '#e5e7eb',
    borderWidth: 2,
    position: 'relative',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default MyPostedScreen