import { View, Text, Pressable, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPosterFoodData } from '../services/FoodDataServices';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'react-native-paper';
import { getUserData } from '../services/UserDataServices';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PosterFood = ({ iduser }) => {
    const navigation = useNavigation();
    const [PosterFoodData, setPosterFoodData] = useState([]);
    const uid = useSelector(state => state.userData.uid);

    useEffect(() => {
        const getFoodData = getPosterFoodData(iduser, (data) => {
            setPosterFoodData(data);
        });
        return getFoodData;
    }, [iduser]);

    return (
        <View className="bg-[#FCFCFB] mt-2 py-5 mb-2">
            <View className="flex-row items-center justify-between px-6 py-2">
                <Text className="text-lg font-semibold text-gray-800">
                    <Icon source={"food"} size={22} color='#4A4A4A' /> 420 Món
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('AllPosterFood', { iduser: iduser })}>
                    <MaterialCommunityIcons name='magnify' size={22} />
                </TouchableOpacity>
            </View>

            <FlatList
                contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 22, height: hp(28)  }}
                data={PosterFoodData}
                keyExtractor={(item) => item.idmonan}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                onEndReachedThreshold={0.1}
            />
            <Button mode="contained" textColor='#4A4A4A' buttonColor='#EFEBE9' onPress={() => navigation.navigate('AllPosterFood', { iduser: iduser })} className="mx-5 rounded-lg">
                Xem tất cả các món
            </Button>
        </View>
    );
};

const RecipeCard = ({ item, index, navigation }) => {
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
                className="mr-3 rounded-lg bg-white shadow-md"
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
                    className="rounded-lg w-40 h-36"
                    resizeMode="cover"
                />
                <View className="max-w-36">
                    <Text className="text-black mt-1 pl-2" numberOfLines={2}>{item.food_name}</Text>
                </View>
                <View className="flex-row pb-2">
                    <Image
                        source={{ uri: userImage }}
                        className="w-6 h-6 rounded-full mt-1 ml-2"
                        resizeMode="cover"
                    />
                    <Text className="text-black mt-1 pl-2 self-center flex-1" numberOfLines={1}>{userName}</Text>
                </View>
            </View>
        </Pressable>
    );
};

export default PosterFood;
