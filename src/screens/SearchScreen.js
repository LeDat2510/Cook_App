import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AddSearchHistory, searchFoodByName } from '../services/UserDataServices';
import { getFoodDataApprove } from '../services/FoodDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';
import SearchHistory from '../components/SearchHistory';
import firebase from '@react-native-firebase/firestore'
import UserFoodHistory from '../components/UserFoodHistory';

const SearchScreen = () => {

  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const uid = useSelector(state => state.userData.uid);

  const textInputRef = useRef(null);

  useEffect(() => {
    textInputRef.current.focus();
  }, []);

  const handleValueSearch = async () => {
    const data = {
      id_user: uid,
      search_content: inputText,
      date_search: firebase.Timestamp.now()
    }
    await AddSearchHistory(data);
    navigation.navigate('SearchResult', { value: inputText })
  }

  return (
    <View className="flex-1" style={{backgroundColor: '#F8F6F2'}}>
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

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginLeft: 20,
  },
  /** Header */
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTop: {
    marginHorizontal: -6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  /** Card */
  card: {
    height: 66,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: '#DFDFE0',
    marginLeft: 16,
    marginRight: 16,
  },
  cardImg: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardBody: {
    maxWidth: '100%',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  cardContent: {
    fontSize: 15,
    fontWeight: '500',
    color: '#737987',
    lineHeight: 20,
    marginTop: 4,
  },
  cardIconFirst: {
    alignSelf: 'flex-start',
    paddingVertical: 22,
    paddingHorizontal: 4,
    paddingRight: 10
  },
  cardIcon: {
    alignSelf: 'flex-start',
    paddingVertical: 22,
    paddingHorizontal: 4,
  },
});

export default SearchScreen;