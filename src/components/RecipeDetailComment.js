import { View, Text, Pressable, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getUserData } from '../services/UserDataServices';
import { getAllCommentFoodData, getCommentFoodDetailData, getPosterBlogCount, getPosterFoodCount } from '../services/FoodDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ClockIcon, FireIcon, Square3Stack3DIcon, UserIcon } from 'react-native-heroicons/outline';
import YoutubePlayer from 'react-native-youtube-iframe';
import url from 'url';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import { getAllCommentData } from '../services/BlogDataServices';
import moment from 'moment';

const RecipeDetailComment = ({ item, navigation }) => {

    const uid = useSelector(state => state.userData.uid);
    const [userImage, setUserImage] = useState('');
    const [commentData, setCommentData] = useState([]);

    useEffect(() => {
        const data = getUserData(uid, (userData) => {
            if (userData) {
                setUserImage(userData.user_image)
            }
        });
        return data;
    }, [uid])

    useEffect(() => {
        const fetchCommentData = getCommentFoodDetailData(item.idmonan, (data) => {
            setCommentData(data);
        })
        return fetchCommentData;
    }, [item.idmonan])

    return (
        <View className="flex-1 space-y-4">
            <Text style={{
                fontSize: hp(2.5),
            }}
                className="font-bold flex text-neutral-700"
            >
                Bình Luận
            </Text>
            <View style={{ bottom: 0, left: 0, right: 0, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                {
                    userImage && (
                        <Image
                            source={{ uri: userImage }}
                            style={{
                                width: hp(5),
                                height: hp(5),
                                resizeMode: "cover",
                                marginRight: 10,
                                borderRadius: hp(6) / 2
                            }}
                        />
                    )
                }
                <Pressable style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }} onPress={() => navigation.navigate("Comment", { item })}>
                    <TextInput                        
                        placeholder="Nhập bình luận..."
                        editable={false}
                    />
                </Pressable>
            </View>
            <View>
                <FlatList
                    data={commentData}
                    keyExtractor={(item) => item.idcomment}
                    scrollEnabled={false}
                    renderItem={({ item, i }) => <CommentCard item={item} index={i} navigation={navigation} />}
                    onEndReachedThreshold={0.1}
                />
                {
                    commentData != '' && (
                        <Button mode='contained' buttonColor='#ed8936' onPress={() => navigation.navigate('Comment', { item })}>Xem thêm</Button>
                    )
                }
            </View>
        </View>
    )
}

const CommentCard = ({ item }) => {

    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const formattedDate = moment(item.date_comment.toDate()).format('DD/MM/YYYY');

    useEffect(() => {
        const data = getUserData(item.id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.id_user])

    return (
        <View key={item.idcomment} style={{ marginTop: hp(1), borderWidth: 0.5, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 10}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                    userImage && (
                        <Image
                            source={{ uri: userImage }}
                            style={{
                                width: hp(5),
                                height: hp(5),
                                resizeMode: "cover",
                                marginRight: 10,
                                borderRadius: hp(6) / 2
                            }}
                        />
                    )
                }
                <View className='flex-row item-center mb-5 pt-2'>
                    <Text className="text-xl font-bold">{userName}</Text>
                    <Text className="text-base text-gray-500 mt-1 ml-2">{formattedDate}</Text>
                </View>
            </View>
            <View className="mt-1" style={{ marginLeft: wp(13) }}>
                <Text className="text-lg">{item.comment_content}</Text>
            </View>
        </View>
    )
}

export default RecipeDetailComment