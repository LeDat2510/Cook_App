import { View, Text, Pressable, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getUserData } from '../services/UserDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ClockIcon, FireIcon, Square3Stack3DIcon, UserIcon } from 'react-native-heroicons/outline';
import YoutubePlayer from 'react-native-youtube-iframe';
import url from 'url';
import { getPosterFoodCount } from '../services/FoodDataServices';
import { getPosterBlogCount } from '../services/BlogDataServices';

const RecipeDetail = ({ item, navigation }) => {

    const [posterUserName, setPosterUserName] = useState('');
    const [posterUserImage, setPosterUserImage] = useState('');
    const [posterFoodCount, setPosterFoodCount] = useState(0);
    const [posterBlogCount, setPosterBlogCount] = useState(0);

    useEffect(() => {
        const data = getUserData(item.user_id, (userData) => {
            if (userData) {
                setPosterUserName(userData.user_name);
                setPosterUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.user_id]);

    useEffect(() => {
        const posterFoodCount = getPosterFoodCount(item.user_id, (data) => {
            setPosterFoodCount(data);
        });
        const posterBlogCount = getPosterBlogCount(item.user_id, (data) => {
            setPosterBlogCount(data);
        });
        return () => {
            posterFoodCount();
            posterBlogCount();
        };
    }, [item.user_id]);

    const getVideoIdFromLinkytb = (linkytb) => {
        const videoUrl = url.parse(linkytb, true);
        const videoId = videoUrl.query.v;
        return videoId;
    };

    return (
        <View className="space-y-2">
            <Text style={{ fontSize: hp(3) }} className="font-bold flex text-neutral-700" numberOfLines={2}>
                {item.food_name}
            </Text>

            <Pressable style={styles.card} onPress={() => navigation.navigate("PosterDetail", { id_user: item.user_id })}>
                {posterUserImage && (
                    <Image alt="" resizeMode="cover" style={styles.cardImg} source={{ uri: posterUserImage }} />
                )}
                <View>
                    <Text style={styles.cardTitle}>{posterUserName}</Text>
                    <View style={styles.cardStats}>
                        <View style={styles.cardStatsItem}>
                            <MaterialCommunityIcons color="#636a73" name="food" />
                            <Text style={styles.cardStatsItemText}>{posterFoodCount} Bài đăng</Text>
                        </View>
                        <View style={styles.cardStatsItem}>
                            <MaterialCommunityIcons color="#636a73" name="card-text" />
                            <Text style={styles.cardStatsItemText}>{posterBlogCount} Bài blog</Text>
                        </View>
                    </View>
                </View>
            </Pressable>

            <View className="flex-row justify-between">
                <View className="flex rounded-full bg-orange-500 p-2">
                    <View style={{ height: hp(6.5), width: hp(6.5) }} className="bg-white rounded-full flex items-center justify-center">
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
                <View className="flex rounded-full bg-orange-500 p-2">
                    <View style={{ height: hp(6.5), width: hp(6.5) }} className="bg-white rounded-full flex items-center justify-center">
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
                <View className="flex rounded-full bg-orange-500 p-2">
                    <View style={{ height: hp(6.5), width: hp(6.5) }} className="bg-white rounded-full flex items-center justify-center">
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
                <View className="flex rounded-full bg-orange-500 p-2">
                    <View style={{ height: hp(6.5), width: hp(6.5) }} className="bg-white rounded-full flex-1 items-center justify-center">
                        <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                    </View>
                    <View className="flex-1 items-center py-2 space-y-1">
                        <Text style={{ fontSize: hp(2), color: 'white' }} className="font-bold text-neutral-700">
                            {item.difficulty}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="space-y-4">
                <Text style={{ fontSize: hp(2.5) }} className="font-bold flex text-neutral-700">
                    Nguyên liệu
                </Text>
                <View className="space-y-2 ml-3">
                    {item.ingredient.split(/[,]+/).map((ingredient, index) => (
                        <View className="flex-row space-x-4" key={index}>
                            <View style={{ height: hp(1.5), width: hp(1.5) }} className="bg-orange-500 rounded-full p-2" />
                            <View className="flex-row space-x-2">
                                <Text style={{ fontSize: hp(1.9) }} className="font-extrabold text-neutral-700">
                                    {ingredient}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View className="space-y-4">
                <Text style={{ fontSize: hp(2.5) }} className="font-bold flex text-neutral-700">
                    Hướng dẫn
                </Text>
                <Text style={{ fontSize: hp(1.9) }} className="text-neutral-800">
                    {item.tutorial}
                </Text>
            </View>
            <View className="space-y-4">
                <Text style={{ fontSize: hp(2.5) }} className="font-bold flex text-neutral-700">
                    Video hướng dẫn
                </Text>
                <View>
                    {item.youtube_link ? (
                        <YoutubePlayer videoId={getVideoIdFromLinkytb(item.youtube_link)} height={hp(28)} />
                    ) : (
                        <></>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default RecipeDetail;
