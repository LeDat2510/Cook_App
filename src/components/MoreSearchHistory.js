import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MansonryList from '@react-native-seoul/masonry-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteSearchHistoryData, getAllSearchHistoryData } from '../services/UserDataServices';
import Entypo from 'react-native-vector-icons/Entypo';

const MoreSearchHistory = () => {
    const navigation = useNavigation();
    const [searchHistoryData, setsearchHistoryData] = useState([]);
    const uid = useSelector(state => state.userData.uid);

    useEffect(() => {
        const getSearchData = getAllSearchHistoryData(uid, (data) => {
            setsearchHistoryData(data);
        });
        return getSearchData;
    }, [uid]);

    return (
        <View className="flex-1 mx-4 pb-10">
            <View>
                <MansonryList
                    data={searchHistoryData}
                    keyExtractor={(item) => item.idsearch}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card item={item} navigation={navigation} />
                    )}
                    onEndReachedThreshold={0.1}
                />
            </View>
        </View>
    );
};

const Card = ({ item, index, navigation }) => {
    return (
        <View key={index} className="border-b border-gray-300 h-15">
            <View className="flex-row items-center justify-start">
                <View className="self-start py-6 px-1 pr-2">
                    <MaterialCommunityIcons name='clock' size={22} />
                </View>
                <View className="flex-grow flex-shrink max-w-full">
                    <TouchableOpacity onPress={() => navigation.navigate('SearchResult', { value: item.search_content })}>
                        <Text className="text-lg font-bold text-gray-800">{item.search_content}</Text>
                    </TouchableOpacity>
                </View>
                <View className="self-start py-6 px-1">
                    <Entypo name='cross' size={22} onPress={() => deleteSearchHistoryData(item.idsearch)} />
                </View>
            </View>
        </View>
    );
}

export default MoreSearchHistory;
