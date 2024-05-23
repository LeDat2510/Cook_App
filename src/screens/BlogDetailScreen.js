import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { HandThumbUpIcon, ChatBubbleLeftEllipsisIcon, ChevronLeftIcon } from 'react-native-heroicons/solid';
import { getUserData } from '../services/UserDataServices';

const BlogDetailScreen = ({ route }) => {

    const { idblog, item } = route.params;
    const navigation = useNavigation();
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData(item.id_user);
            if (data) {
                setUserName(data.user_name)
                setUserImage(data.user_image)
            }
        }
        fetchUserData();
    }, [item.id_user])

    return (
      <View 
      style={{
        backgroundColor:'#fff',
        width: '100%',
        borderColor: '#f64e32',
        borderWidth: 2,
        borderRadius: 20,
        overflow: 'hidden',
      }}
      className="flex justify-center mb-4 space-y-1">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(5), marginLeft: wp(2) }}>
            <ChevronLeftIcon size={hp(4.5)} strokeWidth={4.5} color={'#f64e32'} />
            
          </TouchableOpacity>
  
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
                        source={{uri: userImage}}
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
            {item.date_posted}
          </Text>
          
          </View>
  
          <Text
            className="font-semibold ml-2 text-neutral-900"
            style={{ fontSize: hp(2.5) }}
          >
            {item.title_blog}
          </Text>
  
          <Text
            className="text-neutral-600 ml-2 mr-1"
            style={{ fontSize: hp(1.8) }}
          >
            {item.blog_content}
          </Text>
  
          <Image
            source={{ uri: item.blog_image }}
            style={{
              width: '100%',
              height: hp(35),
              borderRadius: 15,
            }}
            className="bg-black/5"
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
                /* handle like button */
              }}
              
            >
              <HandThumbUpIcon size={hp(3.5)} strokeWidth={4.5} color= {'blue'}/>
              <Text
                className="font-semibold text-neutral-900"
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
                //navigation.navigate('BlogComments', { item })
              }}
            >
              <ChatBubbleLeftEllipsisIcon size={hp(3.5)} strokeWidth={4.5} color= {'gray'}/>
              <Text
                className="font-semibold text-neutral-900"
                style={{ fontSize: hp(2) }}
              >
                {item.num_comment}
              </Text>
            </TouchableOpacity>
          </View>
        
      </View>
    )
  }
  
  export default BlogDetailScreen;