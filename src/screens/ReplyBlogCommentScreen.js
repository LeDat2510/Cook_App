import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore'
import { getUserData } from '../services/UserDataServices';
import moment from 'moment';
import { AddToCommentBlogLikes, CheckUserLikeComment, DeleteFromCommentBlogLikes, addCommentData, addReplyBlogCommentData, getAllCommentData, getAllReplyBlogComment, getCommentBlogLikeCount } from '../services/BlogDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ReplyComment from '../components/ReplyComment';
import AddReplyComment from '../components/AddReplyComment';
import { useSelector } from 'react-redux';

const ReplyBlogCommentScreen = ({ route }) => {

    const uid = useSelector(state => state.userData.uid);
    const { blogComment } = route.params;
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [isLike, setIsLike] = useState(false);
    const [commentBlogLike, setCommentBlogLike] = useState(0);
    const [shouldFocusTextInput, setShouldFocusTextInput] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const data = getUserData(blogComment.id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [blogComment.id_user])

    useEffect(() => {
        const CheckIsLike = CheckUserLikeComment(uid, blogComment.idcomment, (data) => {
            setIsLike(data);
        });
        return CheckIsLike;
    }, [uid, blogComment.idcomment])

    useEffect(() => {
        const commentBlogLikeCount = getCommentBlogLikeCount(blogComment.idcomment, (data) => {
            setCommentBlogLike(data);
        })
        return commentBlogLikeCount;
    }, [blogComment.idcomment])

    const handleLikePress = async () => {
        if (isLike) {
            await DeleteFromCommentBlogLikes(blogComment.idcomment, uid);
        }
        else {
            const data = {
                id_comment: blogComment.idcomment,
                id_user: uid,
                date_like: firestore.Timestamp.now()
            }
            await AddToCommentBlogLikes(data);
        }
        setIsLike(!isLike)
    }
    
    const formattedDate = moment(blogComment.date_comment.toDate()).format('DD/MM/YYYY');

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2), marginLeft: wp(2) }}>
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#f64e32'} />
                    <Text style={{ fontSize: 28, marginLeft: 80, color: '#f64e32' }}>Trả lời</Text>
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 4, flex: 1 }}>
                    <View style={{ marginTop: hp(2), borderWidth: 0.5, borderColor: '#f2f2f2', borderRadius: 5, padding: 10, backgroundColor: '#f2f2f2' }}>
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
                            <Text style={{ fontSize: 18 }}>{blogComment.comment_content}</Text>
                        </View>
                        <View style={{ marginTop: 20, marginLeft: 52, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={isLike ? 'thumb-up' : 'thumb-up-outline'} size={22} style={{ marginRight: 10 }} color={isLike ? 'blue' : 'gray'} onPress={() => handleLikePress()} />
                            <Text style={{ marginRight: 30 }}>{commentBlogLike}</Text>
                            <MaterialCommunityIcons name='comment-outline' size={22} onPress={() => {
                                setShouldFocusTextInput(true);
                            }} />
                        </View>
                    </View>

                    <View>
                        <ReplyComment idcomment={blogComment.idcomment} />
                    </View>

                </View>
            </ScrollView>

            <View>
                <AddReplyComment idcomment={blogComment.idcomment} idblog={blogComment.id_blog} shouldFocusTextInput={shouldFocusTextInput} setShouldFocusTextInput={setShouldFocusTextInput} />
            </View>
        </KeyboardAvoidingView>
    );
}

export default ReplyBlogCommentScreen
