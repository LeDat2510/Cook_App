import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import Recipes from '../components/Recipes';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { AddSearchHistory, searchFoodByName } from '../services/UserDataServices';
import RecipesSearch from '../components/RecipesSearch';
import { getFoodDataApprove } from '../services/FoodDataServices';
import { Appbar } from 'react-native-paper';
import firebase from '@react-native-firebase/firestore'
import { useSelector } from 'react-redux';

const SearchResultScreen = ({ route }) => {

    const navigation = useNavigation();
    const { value } = route.params;
    const [inputText, setInputText] = useState(value);
    const [pressSearch, setPressSearch] = useState(false);
    const uid = useSelector(state => state.userData.uid);

    const handleOnSubmitEditing = async (text) => {
        setInputText(text);
        setPressSearch(true);
        const data = {
            id_user: uid,
            search_content: inputText,
            date_search: firebase.Timestamp.now()
          }
        await AddSearchHistory(data);
    };

    const resetPress = () => {
        setPressSearch(false)
    }

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 50,
                    }} className="space-y-6 pt-5"
                >

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FFFFFF', paddingBottom: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                            className="p-2 rounded-full ml-2 bg-white"
                        >
                            <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#f64e32'} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, borderWidth: 1, borderRadius: 10, borderColor: 'black', flex: 1, marginRight: 20 }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 4 }}>
                                <TouchableOpacity onPress={handleOnSubmitEditing}>
                                    <MagnifyingGlassIcon
                                        size={hp(2.5)}
                                        color={"gray"}
                                        strokeWidth={3}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TextInput
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
                                onSubmitEditing={() => handleOnSubmitEditing(inputText)}
                            />
                        </View>
                    </View>

                    {/*Recipes */}
                    <View>
                        <RecipesSearch SearchValue={inputText} pressSearch={pressSearch} resetPress={resetPress} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default SearchResultScreen