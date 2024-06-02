import { View, Text, Pressable, TouchableOpacity, FlatList, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AddUserFoodHistory, CheckUserFoodHistory, getAllPosterFoodData, getPosterFoodCount } from '../services/FoodDataServices';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import moment from 'moment';
import { useSelector } from 'react-redux';

const AllPosterFood = ({ iduser }) => {

    const navigation = useNavigation();

    const [PosterFoodData, setPosterFoodData] = useState([]);
    const [filterdData, setFilterdData] = useState([]);
    const [PosterFoodCount, setPosterFoodCount] = useState(0);
    const [onPressSearch, setOnPressSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const getFoodData = getAllPosterFoodData(iduser, (data) => {
            setPosterFoodData(data);
            setFilterdData(data)
        });
        const getFoodCount = getPosterFoodCount(iduser, (data) => {
            setPosterFoodCount(data);
        });
        return () => {
            getFoodData();
            getFoodCount();
        };
    }, [iduser]);

    useEffect(() => {
        const filterData = () => {
            const newData = PosterFoodData.filter((item) => {
                const itemData = item.food_name ? item.food_name.toUpperCase() : ''.toUpperCase();
                const inputTextData = searchValue.toUpperCase();
                return itemData.includes(inputTextData);
            });
            setFilterdData(newData);
        };
        filterData();
    }, [PosterFoodData, searchValue])

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
                            onChangeText={(text) => setSearchValue(text)}
                            value={searchValue}
                        />
                        <TouchableOpacity
                            className="flex-1 items-center justify-center ml-1 h-12"
                            onPress={() => {
                                setOnPressSearch(!onPressSearch);
                                setSearchValue('');
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
                            <Icon source={"food"} size={24} color='#4A4A4A' /> {PosterFoodCount} Món
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
                data={filterdData}
                keyExtractor={(item) => item.idmonan}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                onEndReachedThreshold={0.1}
            />
        </View>
    );
}

const RecipeCard = ({ item, navigation }) => {

    const formattedDate = moment(item.date_posted.toDate()).format('DD/MM/YYYY');
    const [check, setCheck] = useState(false);
    const uid = useSelector(state => state.userData.uid);

    useEffect(() => {
        const Check = CheckUserFoodHistory(uid, item.idmonan, (data) => {
            setCheck(data);
        });
        return Check;
    }, [uid, item.idmonan])

    const AddFoodHistory = async () => {
        if (check) {
            navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })
        }
        else {
            const data = {
                id_user: uid,
                id_food: item.idmonan,
                date_seen: firestore.Timestamp.now()
            }
            await AddUserFoodHistory(data);
            navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })
        }
    }

    return (
        <Pressable onPress={() => AddFoodHistory()}>
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
                    <Text className="text-[#767676] mt-1 pl-2" numberOfLines={4}>
                        {item.ingredient}
                    </Text>
                    <Text className="text-[#767676] mt-5 pl-2" numberOfLines={1}>
                        Đăng ngày: {formattedDate}
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
