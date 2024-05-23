import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getUserData } from '../services/UserDataServices';
import PosterFood from '../components/PosterFood';
import PosterBlog from '../components/PosterBlog';

const PosterDetailScreen = ({ route, navigation }) => {
    
    const { id_user } = route.params;
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [email, setEmail] = useState('');


    useEffect(() => {
        const data = getUserData(id_user, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image)
                setEmail(userData.email)
            }
        });
        return data;
    }, [id_user])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{
                    padding: 0,
                    flexGrow: 1,
                    flexShrink: 1,
                    flexBasis: 0,
                    backgroundColor: '#F8F6F2'
                }}>
                <StatusBar backgroundColor={'#FCFCFB'} barStyle={'dark-content'} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FCFCFB', paddingBottom: 10, paddingTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        className="p-2 rounded-full ml-2 bg-white flex-1"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, marginLeft: 10, color: '#424242', flex: 9 }}>Thông tin người đăng</Text>
                </View>

                <ScrollView>
                    <View
                        style={{
                            backgroundColor: '#FCFCFB',
                            paddingVertical: 20,
                            paddingHorizontal: 24,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}>
                            <View style={{ position: 'relative', }}>
                                <Image
                                    alt=""
                                    source={{
                                        uri: userImage,
                                    }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 9999,
                                    }} />
                            </View>

                            <View style={{
                                flexGrow: 1,
                                flexShrink: 1,
                                flexBasis: 0,
                                marginTop: 12,
                                paddingLeft: 16,
                            }}>
                                <Text
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 'bold',
                                        lineHeight: 32,
                                        color: '#4A4A4A',
                                        marginBottom: 6,
                                    }}>
                                    {userName}
                                </Text>

                                <Text
                                    style={{
                                        marginLeft: 2,
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: '#767676',
                                    }}>
                                    {email}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '500',
                                lineHeight: 18,
                                color: '#778599',
                            }}>
                            Skilled in user research, wireframing, prototyping, and collaborating with cross-functional teams.
                        </Text>

                    </View>
                    <View>
                        <ScrollView>
                            <PosterFood iduser={id_user} />
                            <PosterBlog iduser={id_user} />
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default PosterDetailScreen