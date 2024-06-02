import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';
import { getSearchHistoryData, deleteSearchHistoryData } from '../services/UserDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';

const SearchHistory = () => {
    const navigation = useNavigation();
    const [searchHistoryData, setSearchHistoryData] = useState([]);
    const uid = useSelector(state => state.userData.uid);

    useEffect(() => {
        const getSearchData = getSearchHistoryData(uid, (data) => {
            setSearchHistoryData(data);
        });
        return getSearchData;
    }, [uid]);

    return (
        <View className="mx-4 mt-3 flex-1">
            <Text className="text-xl text-neutral-800 font-bold mb-4">
                Lịch sử tìm kiếm
            </Text>
            {
                searchHistoryData && (
                    <View>
                        <MasonryList
                            data={searchHistoryData}
                            keyExtractor={(item) => item.idsearch}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Card item={item} navigation={navigation} />
                            )}
                            onEndReachedThreshold={0.1}
                        />
                        <View className="mt-5 items-center flex-1">
                            <TouchableOpacity
                                onPress={() => navigation.navigate('MoreSearchHistory')}
                                className="px-2 py-1"
                            >
                                <Text className="text-gray-500">Xem thêm<MaterialCommunityIcons name='chevron-down' size={14} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View>
    );
};

const Card = ({ item, index, navigation }) => {
    return (
        <View key={index} className="border-b border-gray-300">
            <View className="h-16 flex-row items-center">
                <View className="ml-2 pr-2">
                    <MaterialCommunityIcons name='clock' size={22} />
                </View>
                <View className="flex-grow">
                    <TouchableOpacity onPress={() => navigation.navigate('SearchResult', { value: item.search_content })}>
                        <Text className="text-lg font-semibold text-gray-800">{item.search_content}</Text>
                    </TouchableOpacity>
                </View>
                <View className="p-4">
                    <Entypo name='cross' size={22} onPress={() => deleteSearchHistoryData(item.idsearch)} />
                </View>
            </View>
        </View>
    );
};

export default SearchHistory;
