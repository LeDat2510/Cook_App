import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import MansonryList from '@react-native-seoul/masonry-list'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import { getUserData } from '../services/UserDataServices'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AddToReplyBlogCommentLikes, CheckUserLikeReplyComment, DeleteFromReplyBlogCommentLikes, getAllReplyBlogComment, getReplyBlogCommentLikeCount } from '../services/BlogDataServices';
import { useSelector } from 'react-redux';
import { AddToReplyFoodCommentLikes, CheckUserLikeReplyCommentFood, DeleteFromReplyFoodCommentLikes, getAllReplyCommentFood, getReplyFoodCommentLikeCount } from '../services/FoodDataServices';
import { elementAt } from 'rxjs';

const ReplyComment = ({ idcomment, idblog, idfood }) => {

    const [replyCommentData, setReplyCommentData] = useState([]);

    if (idblog) {
        useEffect(() => {
            const fetchReplyCommentData = getAllReplyBlogComment(idcomment, (data) => {
                setReplyCommentData(data);
            })
            return fetchReplyCommentData;
        }, [idcomment])
    }
    else {
        useEffect(() => {
            const fetchReplyCommentData = getAllReplyCommentFood(idcomment, (data) => {
                setReplyCommentData(data);
            })
            return fetchReplyCommentData;
        }, [idcomment])
    }

    return (
        <View style={{ marginBottom: 10 }}>
            <View>
                <MansonryList
                    data={replyCommentData}
                    keyExtractor={(item) => item.idreply}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card item={item} />
                    )}
                    onEndReachedThreshold={0.1}
                />
            </View>
        </View>
    )
}

const Card = ({ item }) => {

    const uid = useSelector(state => state.userData.uid);
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');

    const [isLike, setIsLike] = useState(false);
    const [replyCommentLike, setreplyCommentLike] = useState(0);

    useEffect(() => {
        const data = getUserData(item.id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.id_user])

    console.log(item.id_food)

    if (item.id_blog) {
        useEffect(() => {
            const CheckIsLike = CheckUserLikeReplyComment(uid, item.idreply, (data) => {
                setIsLike(data);
            });
            return CheckIsLike;
        }, [uid, item.idreply])

        useEffect(() => {
            const commentBlogLikeCount = getReplyBlogCommentLikeCount(item.idreply, (data) => {
                setreplyCommentLike(data);
            })
            return commentBlogLikeCount;
        }, [item.idreply])
    }
    else {
        useEffect(() => {
            const CheckIsLike = CheckUserLikeReplyCommentFood(uid, item.idreply, (data) => {
                setIsLike(data);
            });
            return CheckIsLike;
        }, [uid, item.idreply])

        useEffect(() => {
            const commentLikeCount = getReplyFoodCommentLikeCount(item.idreply, (data) => {
                setreplyCommentLike(data);
            })
            return commentLikeCount;
        }, [item.idreply])
    }

    const handleLikePress = async () => {
        if (item.id_blog) 
        {
            if (isLike) 
            {
                await DeleteFromReplyBlogCommentLikes(item.idreply, uid);
            }
            else 
            {
                const data = {
                    id_reply: item.idreply,
                    id_user: uid,
                    id_blog: item.id_blog,
                    date_like: firestore.Timestamp.now()
                }
                await AddToReplyBlogCommentLikes(data);
            }
        }
        else
        {
            if (isLike) 
            {
                await DeleteFromReplyFoodCommentLikes(item.idreply, uid);
            }
            else 
            {
                const data = {
                    id_reply: item.idreply,
                    id_user: uid,
                    id_food: item.id_food,
                    date_like: firestore.Timestamp.now()
                }
                await AddToReplyFoodCommentLikes(data);
            }       
        }
        setIsLike(!isLike)
    }

    const formattedDate = moment(item.date_comment.toDate()).format('DD/MM/YYYY');

    return (
        <View className="px-2" style={{ flex: 1 }}>
            <View key={item.idreply} className="mt-5 p-2" style={{ marginLeft: wp(10) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    <MaterialCommunityIcons
                        name={isLike ? 'thumb-up' : 'thumb-up-outline'} color={isLike ? 'blue' : 'gray'} size={22} style={{ marginRight: wp(3) }} onPress={() => handleLikePress()}
                    />
                    <Text>{replyCommentLike}</Text>
                </View>
            </View>
        </View>
    )
}

export default ReplyComment