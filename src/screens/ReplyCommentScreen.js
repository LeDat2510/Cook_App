import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore'
import { getUserData } from '../services/UserDataServices';
import moment from 'moment';
import { AddToCommentBlogLikes, CheckUserLikeComment, DeleteFromCommentBlogLikes, addCommentData, addReplyBlogCommentData, getAllCommentData, getAllReplyBlogComment, getCommentBlogLikeCount } from '../services/BlogDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ReplyComment from '../components/ReplyComment';
import AddReplyComment from '../components/AddReplyComment';
import { useSelector } from 'react-redux';
import { CheckUserLikeCommentFood, getCommentFoodLikeCount } from '../services/FoodDataServices';

const ReplyCommentScreen = ({ route }) => {

    const uid = useSelector(state => state.userData.uid);
    const { Comment } = route.params;
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [isLike, setIsLike] = useState(false);
    const [commentLike, setCommentLike] = useState(0);
    const [shouldFocusTextInput, setShouldFocusTextInput] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const data = getUserData(Comment.id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [Comment.id_user])

    if (Comment.id_blog) 
    {
        useEffect(() => {
            const CheckIsLike = CheckUserLikeComment(uid, Comment.idcomment, (data) => {
                setIsLike(data);
            });
            return CheckIsLike;
        }, [uid, Comment.idcomment])

        useEffect(() => {
            const commentBlogLikeCount = getCommentBlogLikeCount(Comment.idcomment, (data) => {
                setCommentLike(data);
            })
            return commentBlogLikeCount;
        }, [Comment.idcomment])
    }
    else
    {
        useEffect(() => {
            const CheckIsLike = CheckUserLikeCommentFood(uid, Comment.idcomment, (data) => {
                setIsLike(data);
            });
            return CheckIsLike;
        }, [uid, Comment.idcomment])

        useEffect(() => {
            const commentLikeCount = getCommentFoodLikeCount(Comment.idcomment, (data) => {
                setCommentLike(data);
            })
            return commentLikeCount;
        }, [Comment.idcomment])
    }

    const handleLikePress = async () => {
        if (Comment.id_blog) 
        {
            if (isLike) 
            {
                await DeleteFromCommentBlogLikes(Comment.idcomment, uid);
            }
            else 
            {
                const data = {
                    id_comment: Comment.idcomment,
                    id_user: uid,
                    date_like: firestore.Timestamp.now()
                }
                await AddToCommentBlogLikes(data);
            }
        }
        else 
        {
            if (isLike) 
            {
                await DeleteFromCommentFoodLikes(Comment.idcomment, uid);
            }
            else 
            {
                const data = {
                    id_comment: Comment.idcomment,
                    id_user: uid,
                    date_like: firestore.Timestamp.now()
                }
                await AddToCommentFoodLikes(data);
            }
        }
        setIsLike(!isLike)
    }

    const formattedDate = moment(Comment.date_comment.toDate()).format('DD/MM/YYYY');

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FFFFFF', paddingBottom: 10, paddingTop: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    className="p-2 rounded-full ml-2 bg-white"
                >
                    <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, marginLeft: 10, color: '#4A4A4A', flex: 1 }}>Trả lời</Text>
            </View>
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >          
                <View style={{ paddingHorizontal: 4, flex: 1 }}>
                    <View style={{ borderWidth: 0.5, borderColor: '#f2f2f2', borderRadius: 5, padding: 10, backgroundColor: '#f2f2f2' }}>
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userName}</Text>
                                <Text style={{ fontSize: 16, color: 'gray', marginTop: hp(0.5), marginLeft: 10 }}>{formattedDate}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: hp(0.5), marginLeft: 52 }}>
                            <Text style={{ fontSize: 18 }}>{Comment.comment_content}</Text>
                        </View>
                        <View style={{ marginTop: 20, marginLeft: 52, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={isLike ? 'thumb-up' : 'thumb-up-outline'} size={22} style={{ marginRight: 10 }} color={isLike ? 'blue' : 'gray'} onPress={() => handleLikePress()} />
                            <Text style={{ marginRight: 30 }}>{commentLike}</Text>
                            <MaterialCommunityIcons name='comment-outline' size={22} onPress={() => {
                                setShouldFocusTextInput(true);
                            }} />
                        </View>
                    </View>

                    <View>
                        <ReplyComment idcomment={Comment.idcomment} idblog={Comment.id_blog} idfood={Comment.id_food}/>
                    </View>

                </View>
            </ScrollView>

            <View>
                <AddReplyComment idcomment={Comment.idcomment} idblog={Comment.id_blog} idfood={Comment.id_food} shouldFocusTextInput={shouldFocusTextInput} setShouldFocusTextInput={setShouldFocusTextInput} />
            </View>
        </KeyboardAvoidingView>
    );
}

export default ReplyCommentScreen
