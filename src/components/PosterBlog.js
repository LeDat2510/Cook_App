import { View, Text, Pressable, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPosterFoodData } from '../services/FoodDataServices';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'react-native-paper';
import { getUserData } from '../services/UserDataServices';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const PosterBlog = ({ iduser }) => {
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
                    <Icon source={"card-text"} size={24} color='#4A4A4A' /> 420 blog
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AllPosterBlog', { iduser: iduser })}>
                    <MaterialCommunityIcons name='magnify' size={22} />
                </TouchableOpacity>
            </View>


            <FlatList
                contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 22, height: hp(24) }}
                data={PosterFoodData}
                keyExtractor={(item) => item.idmonan}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, i }) => <BlogCard item={item} index={i} navigation={navigation} />}
                //refreshing={isLoadingNext}
                //onRefresh={() => refetch({first: ITEM_CNT})}
                onEndReachedThreshold={0.1}
            //onEndReached={() => loadNext(ITEM_CNT)}
            />
            <Button mode="contained" textColor='#4A4A4A' buttonColor='#EFEBE9' onPress={() => navigation.navigate('AllPosterBlog', { iduser: iduser })} style={{ marginHorizontal: 22, borderRadius: 10 }}>
                Xem tất cả các blog
            </Button>
        </View>
    )
}

const BlogCard = ({ item, index, navigation }) => {

    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        const data = getUserData(item.user_id, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.user_id])

    return (
        <Pressable onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })}>
            <View
                className="flex-row items-center mr-2 bg-white rounded-lg"
                style={{
                    shadowColor: '#000000',
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    elevation: 4,
                    padding: 10,
                }}
            >
                <View style={{
                    flex: 1,
                    maxWidth: 200,
                    paddingRight: 10
                }}>
                    <View className="flex-row pb-2">
                        <Image
                            source={{
                                uri: userImage
                            }}
                            className="w-6 h-6 rounded-full ml-2 mt-1"
                            resizeMode="cover"
                        />
                        <Text className="text-black ml-2 mt-1" numberOfLines={1}>{userName}</Text>
                    </View>
                    <Text className="text-2xl text-black font-bold mt-2 ml-2" numberOfLines={1}>{item.food_name}</Text>
                    <Text className="text-black mt-2 pd-2 ml-2 " numberOfLines={3}>item.food_name.length20?item.food_name.slice(0,20)+"...": item.food_name</Text>
                </View>
                <Image
                    source={{
                        uri: item.food_image
                    }}
                    className='rounded-lg w-36 h-36 mx-2 my-2'
                    resizeMode='cover'
                />
            </View>
        </Pressable>
    )
}

export default PosterBlog