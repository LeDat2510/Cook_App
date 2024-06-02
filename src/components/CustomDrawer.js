import { View, Text, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { UserTotalRecipes, getUserData } from '../services/UserDataServices';
import { LogoutAction } from '../store/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { UserTotalBlog } from '../services/BlogDataServices';

const CustomDrawer = (props) => {

    const uid = useSelector(state => state.userData.uid)
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [totalBlog, setTotalBlog] = useState(0);
    const total = totalRecipes + totalBlog;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        const data = getUserData(uid, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [uid])

    useEffect(() => {
        const totalRecipes = UserTotalRecipes(uid, (data) => {
            setTotalRecipes(data)
        })
        const totalBlog = UserTotalBlog(uid, (data) => {
            setTotalBlog(data)
        })
        return () => {
            totalRecipes();
            totalBlog();
        }
    }, [uid])


    const handleLogOut = () => {
        dispatch(LogoutAction());
        Alert.alert("Đăng xuất thành công");
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#f64e32' }}>
                <ImageBackground source={require('../assets/images/background.png')} style={{ padding: 20 }}>
                    {
                        userImage ? (
                            <Image source={{ uri: userImage }}
                                style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
                        ) : (
                            <Text>No image</Text>
                        )
                    }
                    <Text style={{ color: '#fff', fontSize: 20 }} className="font-medium ml-3">
                        {userName}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#fff' }} className="font-medium ml-3 mr-2">
                            {total} bài đăng
                        </Text>
                        <Ionicons name='create-outline' size={14} color={'#fff'} />
                    </View>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>

            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="share-social-outline" size={22} />
                        <Text
                            style={{
                                fontSize: 15,
                                marginLeft: 5,
                            }}>
                            Share
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogOut} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit-outline" size={22} />
                        <Text
                            style={{
                                fontSize: 15,
                                marginLeft: 5,
                            }}>
                            Log out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default CustomDrawer;