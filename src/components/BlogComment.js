import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import MansonryList from '@react-native-seoul/masonry-list'
import { AddToCommentBlogLikes, CheckUserLikeComment, DeleteFromCommentBlogLikes, getAllCommentData, getCommentBlogLikeCount, getReplyCommentCount } from '../services/BlogDataServices'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import { getUserData } from '../services/UserDataServices'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';

const BlogComment = ({ idblog }) => {
    const [commentData, setCommentData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCommentData = getAllCommentData(idblog, (data) => {
            setCommentData(data);
        })
        return fetchCommentData;
    }, [idblog])

    return (
        <View className="mb-2">
            <View>
                <MansonryList
                    data={commentData}
                    keyExtractor={(item) => item.idcomment}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card item={item} navigation={navigation} />
                    )}
                    onEndReachedThreshold={0.1}
                />
            </View>
        </View>
    )
}

const Card = ({ item, navigation }) => {
    const uid = useSelector(state => state.userData.uid);
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');

    const [isLike, setIsLike] = useState(false);
    const [replyCount, setReplyCount] = useState(0);
    const [commentBlogLike, setCommentBlogLike] = useState(0);

    useEffect(() => {
        const data = getUserData(item.id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.id_user])

    useEffect(() => {
        const CheckIsLike = CheckUserLikeComment(uid, item.idcomment, (data) => {
            setIsLike(data);
        });
        return CheckIsLike;
    }, [uid, item.idcomment])

    useEffect(() => {
        const getReplyCount = getReplyCommentCount(item.idcomment, (data) => {
            setReplyCount(data);
        })
        return getReplyCount;
    }, [item.idcomment])

    useEffect(() => {
        const commentBlogLikeCount = getCommentBlogLikeCount(item.idcomment, (data) => {
            setCommentBlogLike(data);
        })
        return commentBlogLikeCount;
    }, [item.idcomment])

    const handleLikePress = async () => {
        if (isLike) {
            await DeleteFromCommentBlogLikes(item.idcomment, uid);
        }
        else {
            const data = {
                id_comment: item.idcomment,
                id_user: uid,
                date_like: firestore.Timestamp.now()
            }
            await AddToCommentBlogLikes(data);
        }
        setIsLike(!isLike)
    }

    const formattedDate = moment(item.date_comment.toDate()).format('DD/MM/YYYY');

    return (
        <View className="px-2" style={{ flex: 1 }}>
            <View key={item.idcomment} className="mt-5 rounded-md p-2">
                <View className="flex-row items-center">
                    {
                        userImage != "" && (
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
                    <View className='flex-row item-center mb-5 mt-2'>
                        <Text className="text-xl font-bold">{userName}</Text>
                        <Text className="text-base text-gray-500 mt-1 ml-2">{formattedDate}</Text>
                    </View>
                </View>
                <View className="mt-1" style={{ marginLeft: wp(13) }}>
                    <Text className="text-lg">{item.comment_content}</Text>
                </View>
                <View className="mt-5 flex-row items-center" style={{ marginLeft: wp(13) }}>
                    <MaterialCommunityIcons name={isLike ? 'thumb-up' : 'thumb-up-outline'} size={22} style={{ marginRight: wp(3) }} color={isLike ? 'blue' : 'gray'} onPress={() => handleLikePress()} />
                    <Text className="mr-8">{commentBlogLike}</Text>
                    <MaterialCommunityIcons name='comment-outline' size={22} onPress={() => navigation.navigate('ReplyBlog', { blogComment: item })} />
                </View>
                {
                    replyCount != 0 && (
                        <TouchableOpacity className="mt-5 bg-white" style={{ marginLeft: wp(13) }} onPress={() => navigation.navigate('ReplyBlog', { blogComment: item })}>
                            <Text className="text-[#349eeb]">Xem thêm {replyCount} phản hồi</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    )
}

export default BlogComment
