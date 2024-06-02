import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../services/UserDataServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';
import { AddToBlogLikes, CheckUserLike, DeleteFromBlogLikes, getBlogCommentCount, getBlogLikeCount, getReplyBlogCommentCount, updateNumLike } from '../services/BlogDataServices';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const BlogDetailScreen = ({ route }) => {

  const { item } = route.params;
  const navigation = useNavigation();
  const uid = useSelector(state => state.userData.uid);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("")
  const [isLike, setIsLike] = useState(false);
  const [blogCommentCount, setBlogCommentCount] = useState(0);
  const [replyBlogCommentCount, setReplyBlogCommentCount] = useState(0);
  const [blogLikeCount, setBlogLikeCount] = useState(0);
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

      const blogLikeCount = getBlogLikeCount(item.idblog, (data) => {
          setBlogLikeCount(data)
      })

      return () => {
          unsubscribe1();
          unsubscribe2();
          blogLikeCount();
      };
  }, [item.idblog]);


  useEffect(() => {
    const fetchUserData = getUserData(item.id_user, (data) => {
      setUserName(data.user_name)
      setUserImage(data.user_image)
    });
    return fetchUserData;
  }, [item.id_user])

  const handleLikePress = async () => {
    if (isLike) {
        await DeleteFromBlogLikes(item.idblog, uid);
    }
    else {
        const data = {
            id_blog: item.idblog,
            id_user: uid,
            date_like: firestore.Timestamp.now()
        }
        await AddToBlogLikes(data);
    }
    setIsLike(!isLike)
}

  return (
    <View className="flex-1" style={{ backgroundColor: '#F8F6F2' }}>
      <ScrollView>
        <SafeAreaView>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FCFCFB', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, paddingBottom: 10, paddingTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="p-2 rounded-full ml-2"
            >
              <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
            </TouchableOpacity>
            <Text style={{fontSize: 20, marginLeft: 10, color: '#424242', width: wp(80)}} numberOfLines={1}>{item.title_blog}</Text>
          </View>
          <View className='mx-2'>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10
              }}
              className="mx-1"
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
                className="ml-4 text-neutral-600"
                style={{ fontSize: hp(1.5) }}
              >
                {formattedDate}
              </Text>

            </View>

            <Text
              className="text-neutral-600 ml-2 mr-1 mb-2 mt-5"
              style={{ fontSize: hp(1.8) }}
            >
              {item.blog_content}
            </Text>

            <Image
              source={{ uri: item.blog_image }}
              style={{
                width: '94%',
                height: hp(35),
                borderRadius: 15,
                resizeMode: 'cover'
              }}
              className="bg-black/5 mx-2"
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
                  {blogLikeCount}
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
                  navigation.navigate('Comment', { item })
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
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

export default BlogDetailScreen;