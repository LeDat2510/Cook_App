import { View, Text, Pressable, TouchableOpacity, FlatList, Image, TextInput, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPosterFoodData } from '../services/FoodDataServices';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon, IconButton } from 'react-native-paper';
import { getUserData } from '../services/UserDataServices';
import { ScrollView } from 'react-native-gesture-handler';
import MansonryList from '@react-native-seoul/masonry-list'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const AllPosterBlog = ({ iduser }) => {

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
                            placeholder='Tìm blog'
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
                            <Icon source={"card-text"} size={24} color='#4A4A4A' /> 420 blog
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
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 10,
                }} className="space-y-1 pt-3"
            >
                <View>
                    <SafeAreaView>
                        <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 240,
                            }} className="space-y-6"
                        >
                            <MansonryList
                                data={PosterFoodData}
                                keyExtractor={(item) => item.idmonan}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, i }) => <BlogCard item={item} index={i} navigation={navigation} />}
                                //refreshing={isLoadingNext}
                                //onRefresh={() => refetch({first: ITEM_CNT})}
                                onEndReachedThreshold={0.1}
                            //onEndReached={() => loadNext(ITEM_CNT)}
                            />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ScrollView>
        </View>
    );
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
            <View className="m-3 rounded-lg">
                <View className="flex-row">
                    <Image
                        source={{
                            uri: item.food_image
                        }}
                        className="rounded-lg w-full h-40 flex-1">
                    </Image>
                </View>
                <View className="max-w-xs">
                    <Text className="text-black mt-1 pl-2" numberOfLines={1}>{item.food_name}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default AllPosterBlog
