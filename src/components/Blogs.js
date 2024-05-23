import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list'
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AddToBlogLikes, CheckUserLike, DeleteFromBlogLikes, getAllBlogData, getBlogCommentCount, getReplyBlogCommentCount, updateNumLike } from '../services/BlogDataServices';
import { getUserData } from '../services/UserDataServices';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { useSelector } from 'react-redux';

const Blogs = () => {
    const navigation = useNavigation();

    const [blogData, setBlogData] = useState([]);

    useEffect(() => {
        const getBlogData = getAllBlogData((data) => {
            setBlogData(data);
        })
        return getBlogData
    }, [])

    return (
        <View className="mx-1 space-y-6">
            <View>
                <MasonryList
                    data={blogData}
                    keyExtractor={(item) => item.idblog}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, i }) => <Card item={item} index={i} navigation={navigation} />}
                    //refreshing={isLoadingNext}
                    //onRefresh={() => refetch({first: ITEM_CNT})}
                    onEndReachedThreshold={0.1}
                //onEndReached={() => loadNext(ITEM_CNT)}
                />
            </View>
        </View>
    );
};

const Card = ({ item, navigation }) => {

    const uid = useSelector(state => state.userData.uid);

    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [isLike, setIsLike] = useState(false);
    const [blogCommentCount, setBlogCommentCount] = useState(0);
    const [replyBlogCommentCount, setReplyBlogCommentCount] = useState(0);
    const formattedDate = moment(item.date_posted.toDate()).format('DD/MM/YYYY');

    const totalCount = blogCommentCount + replyBlogCommentCount;

    useEffect(() => {
        const CheckIsLike = CheckUserLike(uid, item.idblog, (data) => {
            setIsLike(data);
        });
        return CheckIsLike;
    }, [uid, item.idblog])

    useEffect(() => {
        const unsubscribe1 = getBlogCommentCount(item.idblog, (data) => {
            setBlogCommentCount(data);
        });

        const unsubscribe2 = getReplyBlogCommentCount(item.idblog, (data) => {
            setReplyBlogCommentCount(data)
        });

        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    }, [item.idblog]);

    useEffect(() => {
        const data = getUserData(item.id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.id_user])

    const handleLikePress = async () => {
        if (isLike) {
            await DeleteFromBlogLikes(item.idblog, uid);
            const updateData = item.num_like - 1;
            await updateNumLike(item.idblog, updateData);
        }
        else {
            const data = {
                id_blog: item.idblog,
                id_user: uid,
                date_like: firestore.Timestamp.now()
            }
            await AddToBlogLikes(data);
            const updateData = item.num_like + 1;
            await updateNumLike(item.idblog, updateData)
        }
        setIsLike(!isLike)
    }

    return (
        <View
            style={{
                backgroundColor: '#fff',
                width: '100%',
                borderColor: '#f64e32',
                borderWidth: 2,
                borderRadius: 20,
                overflow: 'hidden',
            }}
            className="flex justify-center mb-4 space-y-1">

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                className="mt-4 ml-4"
            >
                {
                    userImage != "" && (
                        <Image
                            source={{ uri: userImage }}
                            style={{
                                width: hp(6),
                                height: hp(6),
                                resizeMode: "cover",
                            }}
                            className="rounded-full"
                        />
                    )
                }

                <Text
                    className="font-semibold ml-2 text-neutral-600"
                    style={{ fontSize: hp(1.9) }}
                >
                    {userName}
                </Text>

                <Text
                    className="ml-4 text-neutral-600 mt-1"
                    style={{ fontSize: hp(1.5) }}
                >
                    {formattedDate}
                </Text>
            </View>

            <Text
                className="font-semibold text-neutral-900 pt-2 mx-4"
                style={{ fontSize: hp(2.5) }}
            >
                {item.title_blog}
            </Text>

            <Text
                className="text-neutral-600 mt-4 mx-4"
                style={{ fontSize: hp(1.8) }}
            >
                {item.blog_content}
            </Text>

            <Image
                source={{ uri: item.blog_image }}
                style={{
                    width: '92%',
                    height: hp(35),
                    borderRadius: 15,
                    resizeMode: 'cover'
                }}
                className="bg-black/5 mx-3.5"
            />

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }} className='mb-2'
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 40,
                        paddingTop: 20
                    }} className='mb-2 pl-2'
                    onPress={() => {
                        handleLikePress()
                    }}

                >
                    <MaterialCommunityIcons name={isLike ? 'thumb-up' : 'thumb-up-outline'} size={hp(3.5)} strokeWidth={4.5} color={isLike ? 'blue' : 'gray'} />
                    <Text
                        className="font-semibold text-neutral-900 ml-2"
                        style={{ fontSize: hp(2) }}
                    >
                        {item.num_like}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: 40,
                        paddingTop: 20
                    }} className='mb-2 pr-2'
                    onPress={() => {
                        /* handle comment button */
                        navigation.navigate('BlogComment', { item })
                    }}
                >
                    <MaterialCommunityIcons name='comment-processing-outline' size={hp(3.5)} strokeWidth={4.5} color={'gray'} />
                    <Text
                        className="font-semibold text-neutral-900 ml-2"
                        style={{ fontSize: hp(2) }}
                    >
                        {totalCount}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default Blogs