import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserData, updateUserData } from '../services/UserDataServices'
import * as ImageCropPicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import { useSelector } from 'react-redux'

const UserDetail = ({navigation}) => {
    const uid = useSelector(state => state.userData.uid);
    const [userimage, setUserimage] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');


    const openImagePicker = () =>{
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        includeBase64: false,
        includeExif: true,
      })
        .then(async (image) => {
          const source = image.path;
          const ImageUrl = await uploadImageToFirebaseStorage(source)
          setUserimage(ImageUrl);
        })
          .catch((error) => {
          console.log('ImagePicker Error: ', error);
        });
      };
    
    const uploadImageToFirebaseStorage = async (imagePath) => {
      const imageFileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
      const reference = storage().ref(`images/users/${imageFileName}`);

      await reference.putFile(imagePath);

      const imageUrl = await reference.getDownloadURL();
      return imageUrl;
    };  
   
    const handleUpdateUserData = async() => {
        const newData = {
            displayName: username,
            email: email,
            photo: userimage,
        };
        await updateUserData(uid, newData);
        navigation.navigate("HOME")
    }

    useEffect(() => {
        const fetchUserData = async() => {
            const data = await getUserData(uid);
            if(data)
            {
                setUserimage(data.photo);
                setUsername(data.displayName);
                setEmail(data.email);
            }
        };
        fetchUserData()
    }, [uid])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("HOME")}>
                <Text>UserDetail</Text>
            </TouchableOpacity>
                <View style={styles.form}>
                    <TouchableOpacity onPress={openImagePicker}>
                    {userimage ? (
                        <Image source={{ uri: userimage }} style={{ width: 100, height: 100 }} />
                     ) : (
                        <Text> No Image Selected</Text>
                     )}
                    </TouchableOpacity>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Tên người dùng: </Text>
                        <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        value={username} 
                        onChangeText={Text => setUsername(Text)}
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}/>
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Email: </Text>
                        <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        value={email} 
                        onChangeText={Text => setEmail(Text)}
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}/>
                    </View>

                    <View style={styles.formAction}>
                        <TouchableOpacity
                        onPress={() => {
                            handleUpdateUserData();
                        }}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>Lưu thông tin</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
        </View>   
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      padding: 24,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    title: {
      fontSize: 27,
      fontWeight: '700',
      color: '#1d1d1d',
      marginBottom: 6,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: '#929292',
      textAlign: 'center',
    },
    /** Header */
    header: {
      marginVertical: 36,
    },
    headerImg: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginBottom: 20,
    },
    /** Form */
    form: {
      marginBottom: 24,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    formAction: {
      marginVertical: 24,
    },
    formFooter: {
      fontSize: 17,
      fontWeight: '600',
      color: '#222',
      textAlign: 'center',
      letterSpacing: 0.15,
    },
    /** Input */
    input: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 17,
      fontWeight: '600',
      color: '#222',
      marginBottom: 8,
    },
    inputControl: {
      height: 44,
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: '500',
      color: '#222',
    },
    /** Button */
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      backgroundColor: '#075eec',
      borderColor: '#075eec',
    },
    btnText: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      color: '#fff',
    },
  });

export default UserDetail