import React, { useEffect, useState } from 'react';
import { getUserData } from '../services/UserDataServices';
import { Image, Text, View } from 'react-native';

const PosterDetail = ({ iduser }) => {

    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const data = getUserData(iduser, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image)
                setEmail(userData.email)
                setDescription(userData.description)
            }
        });
        return data;
    }, [iduser])

    return (
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
                {
                    userImage && (
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
                    )
                }
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
            {
                description && (
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '500',
                            lineHeight: 18,
                            color: '#778599',
                        }}>
                        {description}
                    </Text>
                )
            }
        </View>
    )
}

export default PosterDetail