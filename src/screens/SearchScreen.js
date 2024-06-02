import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AddSearchHistory, CheckSearchContent, searchFoodByName, updateSearchContent } from '../services/UserDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import SearchHistory from '../components/SearchHistory';
import firebase from '@react-native-firebase/firestore'
import UserFoodHistory from '../components/UserFoodHistory';

const SearchScreen = () => {

  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [check, setCheck] = useState(false);
  const uid = useSelector(state => state.userData.uid);

  const textInputRef = useRef(null);

  useEffect(() => {
    textInputRef.current.focus();
  }, []);

  useEffect(() => {
    const checkSearchContent = CheckSearchContent(uid, inputText, (data) => {
      setCheck(data);
    })
    return checkSearchContent;
  }, [inputText, uid])

  const handleValueSearch = async () => {
    if (check) {
      await updateSearchContent(inputText, uid)
    }
    else {
      const data = {
        id_user: uid,
        search_content: inputText,
        date_search: firebase.Timestamp.now()
      }
      await AddSearchHistory(data);
    }
    navigation.navigate('SearchResult', { value: inputText })
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#F8F6F2' }}>
      <SafeAreaView>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FCFCFB', paddingBottom: 10, paddingTop: 10 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="p-2 rounded-full ml-2 bg-white"
          >
            <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8, borderWidth: 1, borderRadius: 10, borderColor: 'black', marginRight: 20, backgroundColor: '#EFEBE9' }}>
            <View style={{ borderRadius: 20, padding: 4 }}>
              <TouchableOpacity onPress={handleValueSearch}>
                <MagnifyingGlassIcon
                  size={hp(2.5)}
                  color={"gray"}
                  strokeWidth={3}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              ref={textInputRef}
              placeholder='Tìm kiếm món ăn bạn cần'
              placeholderTextColor={"gray"}
              style={{
                flex: 1,
                fontSize: 15,
                marginLeft: 4,
              }}
              className="text-base mb-1 pl-1"
              value={inputText}
              onChangeText={setInputText}
              returnKeyType='search'
              onSubmitEditing={handleValueSearch}
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
          }} className="space-y-6 pt-5"
        >
          <View>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}
                className="space-y-6"
              >
                <SearchHistory />
              </ScrollView>
            </SafeAreaView>
          </View>

          <View>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 50,
                }} className="space-y-6"
              >
                <UserFoodHistory />
              </ScrollView>
            </SafeAreaView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default SearchScreen;