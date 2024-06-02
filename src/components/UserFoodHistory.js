import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { getFoodDataApprove, getFoodDataInUserFoodHistory } from '../services/FoodDataServices';
import { FlatList } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { getUserData } from '../services/UserDataServices';

const UserFoodHistory = () => {
    const navigation = useNavigation();
    const [FoodDataInUserFoodHistory, setFoodDataInUserFoodHistory] = useState([]);
    const uid = useSelector(state => state.userData.uid);

    useEffect(() => {
        const getFoodData = getFoodDataInUserFoodHistory(uid, (data) => {
            setFoodDataInUserFoodHistory(data);
        });
        return getFoodData;
    }, [uid]);

    return (
        <View className="mx-4 mt-3 mb-9">
            <Text className="text-xl text-gray-800 font-bold mb-4">
                Món đã xem gần đây
            </Text>
            <View>
                <FlatList
                    data={FoodDataInUserFoodHistory}
                    keyExtractor={(item) => item.idmonan}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                    onEndReachedThreshold={0.1}
                    style={{ height: hp(25) }}
                />
                <View className="my-2 items-center">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MoreUserFoodHistory')}
                        className="px-2 py-0.5"
                    >
                        <Text className="text-gray-500">Xem thêm<MaterialCommunityIcons name='chevron-down' size={14} /></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const RecipeCard = ({ item, navigation }) => {
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        const data = getUserData(item.user_id, (userData) => {
            if (userData) {
                setUserName(userData.user_name);
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.user_id]);

    return (
        <Pressable onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })}>
            <View
                className="mr-3 rounded-lg"
                style={{
                    backgroundColor: '#ffffff',
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
                <Image
                    source={{ uri: item.food_image }}
                    className="rounded-lg h-36"
                    style={{ width: wp(40)}}
                    resizeMode="cover"
                />
                <View className="max-w-36">
                    <Text className="text-black mt-1 pl-2" numberOfLines={2}>{item.food_name}</Text>
                </View>
                <View className="flex-row pb-2">
                    {
                        userImage && (
                            <Image
                                source={{ uri: userImage }}
                                className="w-6 h-6 rounded-full mt-1 ml-2"
                                resizeMode="cover"
                            />
                        )
                    }
                    <Text className="text-black mt-1 pl-2 self-center flex-1" numberOfLines={1}>{userName}</Text>
                </View>
            </View>
        </Pressable>
    );
};

export default UserFoodHistory;
