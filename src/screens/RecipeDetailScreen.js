import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Pressable, TextInput } from 'react-native';
import { ChevronLeftIcon, ClockIcon, FireIcon, Square3Stack3DIcon, UserIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';
import url from 'url';
import { AddToFavorite, CheckUserFavorite, DeleteFromFavorite, getUserData } from '../services/UserDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore'
import { getSaveCount, updateSaveCount } from '../services/FoodDataServices';
import { useSelector } from 'react-redux';

const RecipeDetailScreen = ({ route }) => {

    const { idmonan, item } = route.params;
    const uid = useSelector(state => state.userData.uid);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigation = useNavigation();
    //const [userImage, setUserImage] = useState('');
    const [posterUserName, setPosterUserName] = useState('');
    const [posterUserImage, setPosterUserImage] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const data = getUserData(item.user_id, (userData) => {
            if (userData) {
                setPosterUserName(userData.user_name)
                setPosterUserImage(userData.user_image)
            }
        });
        return data;
    }, [item.user_id])

    /*
    useEffect(() => {
        const data = getUserData(uid, (userData) => {
            if (userData) {
                setUserImage(userData.user_image)
            }
        });
        return data;
    }, [uid])*/

    useEffect(() => {
        const CheckIsFavorite = CheckUserFavorite(uid, idmonan, (data) => {
            setIsFavorite(data);
        });

        return CheckIsFavorite;
    }, [uid, idmonan])

    useEffect(() => {
        const totalSave = getSaveCount(idmonan, (data) => {
            setTotal(data);
        })
        return totalSave;
    }, [idmonan])

    const getVideoIdFromLinkytb = (linkytb) => {
        const videoUrl = url.parse(linkytb, true);
        const videoId = videoUrl.query.v;
        return videoId;
    }

    const handleFavoritePress = async () => {
        if (isFavorite) {
            await DeleteFromFavorite(idmonan, uid);
            const updateData = total - 1;
            await updateSaveCount(idmonan, updateData);
        }
        else {
            const data = {
                id_user: uid,
                id_food: idmonan,
                date_add: firestore.Timestamp.now()
            }
            await AddToFavorite(data)
            const updateData = total + 1;
            await updateSaveCount(idmonan, updateData);
        }
        setIsFavorite(!isFavorite)
    }

    return (
        <ScrollView
            className="bg-white flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >

            {/*Recipe Image*/}
            <View className="flex-row justify-center">
                <Image
                    source={{ uri: item.food_image }}
                    style={{
                        width: wp(100),
                        height: hp(50),
                        resizeMode: 'cover',
                    }}
                />
            </View>


            <View className="w-full absolute flex-row justify-between items-center pt-5">
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-white"
                >
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#f64e32'} />
                </TouchableOpacity>

                {/* Heart Button */}
                <TouchableOpacity
                    onPress={handleFavoritePress}
                    className="p-2 rounded-full mr-5 bg-white"
                >
                    <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavorite ? 'red' : 'gray'} />
                </TouchableOpacity>
            </View>

            <View className="px-4 justify-between flex-1 space-y-4 pt-3">
                {/* Meal Description */}
                <View className="space-y-2">

                    {/*Name of food */}
                    <Text style={{
                        fontSize: hp(3),
                    }}
                        className="font-bold flex-1 text-neutral-700"
                    >
                        {item.food_name}
                    </Text>

                    <Pressable style={styles.card} onPress={() => navigation.navigate("PosterDetail", { id_user: item.user_id })}>
                        <Image
                            alt=""
                            resizeMode="cover"
                            style={styles.cardImg}
                            source={{ uri: posterUserImage }} />

                        <View>
                            <Text style={styles.cardTitle}>{posterUserName}</Text>

                            <View style={styles.cardStats}>
                                <View style={styles.cardStatsItem}>
                                    <MaterialCommunityIcons color="#636a73" name="food" />

                                    <Text style={styles.cardStatsItemText}>
                                        400 Bài đăng
                                    </Text>
                                </View>

                                <View style={styles.cardStatsItem}>
                                    <MaterialCommunityIcons color="#636a73" name="card-text" />

                                    <Text style={styles.cardStatsItemText}>400 Bài blog</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>

                    {/* misc */}
                    <View className="flex-row justify-between">

                        {/*Time to cook */}
                        <View className="flex rounded-full bg-orange-500 p-2">
                            <View
                                style={{
                                    height: hp(6.5),
                                    width: hp(6.5)
                                }}
                                className="bg-white rounded-full flex items-center justify-center"
                            >
                                <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                            </View>

                            <View className="flex items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2), color: 'white' }} className="font-bold text-neutral-700">
                                    {item.time_to_cook}
                                </Text>
                                <Text style={{ fontSize: hp(1.3), color: 'white' }} className="font-bold text-neutral-700">
                                    Phút
                                </Text>
                            </View>
                        </View>

                        {/*khẩu phần ăn */}
                        <View className="flex rounded-full bg-orange-500 p-2">
                            <View
                                style={{
                                    height: hp(6.5),
                                    width: hp(6.5)
                                }}
                                className="bg-white rounded-full flex items-center justify-center"
                            >
                                <UserIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                            </View>

                            <View className="flex items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2), color: 'white' }} className="font-bold text-neutral-700">
                                    {item.size}
                                </Text>
                                <Text style={{ fontSize: hp(1.3), color: 'white' }} className="font-bold text-neutral-700">
                                    Khẩu phần
                                </Text>
                            </View>
                        </View>

                        {/*Calo */}
                        <View className="flex rounded-full bg-orange-500 p-2">
                            <View
                                style={{
                                    height: hp(6.5),
                                    width: hp(6.5)
                                }}
                                className="bg-white rounded-full flex items-center justify-center"
                            >
                                <FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                            </View>

                            <View className="flex items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2), color: 'white' }} className="font-bold text-neutral-700">
                                    {item.calories}
                                </Text>
                                <Text style={{ fontSize: hp(1.3), color: 'white' }} className="font-bold text-neutral-700">
                                    Cal
                                </Text>
                            </View>
                        </View>

                        {/*Levels */}
                        <View className="flex rounded-full bg-orange-500 p-2">
                            <View
                                style={{
                                    height: hp(6.5),
                                    width: hp(6.5)
                                }}
                                className="bg-white rounded-full flex-1 items-center justify-center"
                            >
                                <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                            </View>

                            <View className="flex-1 items-center py-2 space-y-1">
                                <Text style={{ fontSize: hp(2), color: 'white' }} className="font-bold text-neutral-700">
                                    {item.difficulty}
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/*Nguyên liệu- ingredients */}
                    <View className="space-y-4">
                        <Text style={{
                            fontSize: hp(2.5),
                        }}
                            className="font-bold flex-1 text-neutral-700"
                        >
                            Nguyên liệu
                        </Text>

                        <View className="space-y-2 ml-3">
                            {item.ingredient.split(/[,]+/).map((ingredient, index) => (
                                <View className="flex-row space-x-4" key={index}>
                                    <View
                                        style={{ height: hp(1.5), width: hp(1.5) }}
                                        className="bg-orange-500 rounded-full p-2"
                                    />
                                    <View className="flex-row space-x-2" >
                                        <Text
                                            style={{
                                                fontSize: hp(1.9),
                                            }}
                                            className="font-extrabold text-neutral-700">
                                            {ingredient}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/*Hướng dẫn- instruction */}
                    <View className="space-y-4">
                        <Text style={{
                            fontSize: hp(2.5),
                        }}
                            className="font-bold flex-1 text-neutral-700"
                        >
                            Hướng dẫn
                        </Text>

                        <Text style={{
                            fontSize: hp(1.9),
                        }}
                            className="text-neutral-800"
                        >
                            {item.tutorial}
                        </Text>
                    </View>

                    {/*Recipe video */}
                    <View className="space-y-4">
                        <Text style={{
                            fontSize: hp(2.5),
                        }}
                            className="font-bold flex-1 text-neutral-700"
                        >
                            Video hướng dẫn
                        </Text>

                        <View>
                            {
                                item.youtube_link ? (
                                    <YoutubePlayer
                                        videoId={getVideoIdFromLinkytb(item.youtube_link)}
                                        height={hp(30)}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView >
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    /** Card */
    card: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cardImg: {
        width: 50,
        height: 50,
        borderRadius: 9999,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    cardStats: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardStatsItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    cardStatsItemText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#636a73',
        marginLeft: 2,
    },
});

export default RecipeDetailScreen;