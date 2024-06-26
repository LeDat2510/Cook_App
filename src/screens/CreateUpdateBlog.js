import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Alert } from 'react-native';
import { AddBlog, deleteBlogDataInApproveBlog, deleteBlogDataInNotApproveBlog, updateBlogData } from '../services/BlogDataServices';
import { useSelector } from 'react-redux';

const CreateUpdateBlog = ({ route, navigation }) => {

    const { idblog, item } = route.params || {};
    const DefaultImageBlog = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultlogo%2Flogo.jpg?alt=media&token=8b4fb801-5f77-432b-a4a3-8454e920fddc'

    const uid = useSelector(state => state.userData.uid);
    const [titleBlog, setTitleBlog] = useState('');
    const [blogImage, setBlogImage] = useState('');
    const [blogContent, setBlogContent] = useState('');

    const uploadImageToFirebaseStorage = async (imagePath) => {
        const imageFileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
        const reference = storage().ref(`images/blogs/${imageFileName}`);

        await reference.putFile(imagePath);

        const imageUrl = await reference.getDownloadURL();
        return imageUrl;
    };

    const openImagePicker = async () => {
        try {
            const image = await ImageCropPicker.openPicker({
                mediaType: 'photo',
                cropping: true,
                includeBase64: false,
                includeExif: true,
            });

            const imagePath = image.path;
            const imageUrl = await uploadImageToFirebaseStorage(imagePath);
            setBlogImage(imageUrl);
            console.log(imageUrl);

        } catch (error) {
            console.log('ImagePicker Error: ', error);
        }
    };

    const SaveBlogData = async () => {
        if (!blogImage || !titleBlog || !blogContent) {
            Alert.alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const NewBlog = {
            id_user: uid,
            title_blog: titleBlog,
            blog_image: blogImage,
            blog_content: blogContent,
            date_posted: firestore.Timestamp.now(),
            status: 'Awaiting approval',
            num_like: 0,
            num_comment: 0
        }
        if (idblog) {
            await deleteBlogDataInApproveBlog(idblog)
            await deleteBlogDataInNotApproveBlog(idblog)
            await updateBlogData(idblog, NewBlog);
            console.log('Cập nhật blog thành công')
        }
        else {
            await AddBlog(NewBlog);
            console.log('Thêm blog thành công')
        }
        navigation.goBack();
    }

    if (idblog) {
        useEffect(() => {
            const fetchBlogData = async () => {
                setTitleBlog(item.title_blog);
                setBlogImage(item.blog_image);
                setBlogContent(item.blog_content);
            };
            fetchBlogData()
        }, [idblog])
    }

    return (
        <SafeAreaView className="bg-white flex-1">
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FFFFFF', paddingBottom: 10, paddingTop: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    className="p-2 rounded-full ml-2 bg-white"
                >
                    <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, marginLeft: 10, color: '#4A4A4A' }}>Thêm blog mới</Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <View className="px-4 justify-between flex space-y-4 pt-8" style={{ paddingTop: 30 }}>
                    <Text style={{
                        fontSize: hp(2),
                    }}
                        className="font-medium mr-1 flex-1 text-neutral-500"
                    >
                        Hình ảnh:
                    </Text>
                    <TouchableOpacity onPress={openImagePicker}>
                        {blogImage ? (
                            <Image source={{ uri: blogImage }} style={{ width: 100, height: 100 }} />
                        ) : (
                            <Image source={{ uri: DefaultImageBlog }} style={{ width: 100, height: 100 }} />
                        )}
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: hp(2),
                    }}
                        className="font-medium mr-1 flex-1 text-neutral-500"
                    >
                        Tiêu đề của blog :
                    </Text>
                    <TextInput
                        style={{
                            fontSize: hp(2),
                            borderWidth: 1,
                            borderColor: 'gray',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                        }}
                        placeholder="Nhập tiêu đề"
                        value={titleBlog}
                        onChangeText={text => setTitleBlog(text)}
                    />

                    <Text style={{
                        fontSize: hp(2),
                    }}
                        className="font-medium mr-1 flex-1 text-neutral-500"
                    >
                        Nội dung:
                    </Text>
                    <TextInput
                        style={{
                            fontSize: hp(2),
                            borderWidth: 1,
                            borderColor: 'gray',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            height: hp(50),
                        }}
                        placeholder="..."
                        value={blogContent}
                        onChangeText={text => setBlogContent(text)}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#f64e32',
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 10,
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            SaveBlogData();
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: hp(2) }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default CreateUpdateBlog;