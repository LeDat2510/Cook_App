import { View, Text, Pressable, TouchableOpacity, FlatList, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPosterFoodData } from '../services/FoodDataServices';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'react-native-paper';
import { getUserData } from '../services/UserDataServices';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const AllPosterFood = ({ iduser }) => {
    
    const navigation = useNavigation();

    const [PosterFoodData, setPosterFoodData] = useState([]);

    const [onPressSearch, setOnPressSearch] = useState(false);

    useEffect(() => {
        const getFoodData = getPosterFoodData(iduser, (data) => {
            setPosterFoodData(data);
        });
        return getFoodData;
    }, [iduser]);

    return (
        <View className="bg-[#F8F6F2] py-5 mb-8">
            {
                onPressSearch == true ? (
                    <View className="flex-row items-center justify-between px-5 py-2">
                        <TextInput
                            placeholder='Tìm món'
                            placeholderTextColor={"gray"}
                            className="text-base ml-1 bg-[#FCFCFB] rounded-lg border border-black pl-5 py-2"
                            style={{
                                flex: 6,
                            }}
                            onChangeText={() => { }}
                        />
                        <TouchableOpacity
                            className="flex-1 items-center justify-center ml-1 h-12"
                            onPress={() => {
                                setOnPressSearch(!onPressSearch);
                            }}>
                            <View>
                                <Text>
                                    Hủy
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between px-5 py-2">
                        <Text className="text-lg font-semibold text-[#4A4A4A]">
                            <Icon source={"food"} size={24} color='#4A4A4A' /> 420 Món
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setOnPressSearch(!onPressSearch);
                            }}>
                            <Icon source={"magnify"} size={22} />
                        </TouchableOpacity>
                    </View>
                )
            }

            <FlatList
                contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 22, paddingBottom: 250 }}
                data={PosterFoodData}
                keyExtractor={(item) => item.idmonan}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                //refreshing={isLoadingNext}
                //onRefresh={() => refetch({first: ITEM_cnt})}
                onEndReachedThreshold={0.1}
            //onEndReached={() => loadNext(ITEM_cnt)}
            />
        </View>
    );
}

const RecipeCard = ({ item, index, navigation }) => {

    return (
        <Pressable onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })}>
            <View
                className="flex-row flex-1 rounded-lg bg-[#FCFCFB] mb-4"
                style={{
                    shadowColor: '#000000',
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    elevation: 4,
                }}
            >
                <View className="flex-1 max-w-[220px] pr-2 p-2">
                    <Text className="text-lg font-bold text-[#4A4A4A] mt-1 pl-2" numberOfLines={2}>{item.food_name}</Text>
                    <Text className="text-[#767676] mt-1 pl-2" numberOfLines={3}>
                        item.food_name.length 20 ? item.food_name.slice(0, 20) + "..." : item.food_name
                    </Text>
                </View>
                <Image
                    source={{
                        uri: item.food_image
                    }}
                    className="rounded-lg w-[150px] h-[150px]"
                    resizeMode='cover'
                />
            </View>
        </Pressable>
    )
}

export default AllPosterFood
