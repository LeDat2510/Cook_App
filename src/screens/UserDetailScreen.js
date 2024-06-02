import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserData, updateUserData } from '../services/UserDataServices'
import * as ImageCropPicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import { useSelector } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native'

const UserDetailScreen = ({ navigation }) => {

  const uid = useSelector(state => state.userData.uid);
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [userNewName, setUserNewName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const openImagePicker = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      includeBase64: false,
      includeExif: true,
    })
      .then(async (image) => {
        const source = image.path;
        const ImageUrl = await uploadImageToFirebaseStorage(source)
        setUserImage(ImageUrl);
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

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = () => {
        getUserData(uid, (data) => {
          if (data) {
            setUserImage(data.user_image);
            setUserName(data.user_name);
            setUserNewName(data.user_name)
            setEmail(data.email);
            setDescription(data.description);
          }
        });
      };
      fetchUserData();
      return () => { };
    }, [uid])
  );

  const handleUpdateUserData = async () => {
    if (userNewName == '') {
      Alert.alert('Vui lòng nhập tên người dùng')
    }
    else {
      const newData = {
        user_name: userNewName,
        email: email,
        user_image: userImage,
        description: description
      };
      await updateUserData(uid, newData);
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F6F2' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FFFFFF', paddingBottom: 10, paddingTop: 10 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className="p-2 rounded-full ml-2 bg-white"
        >
          <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginLeft: 10, color: '#4A4A4A' }}>Thông tin người dùng</Text>
      </View>
      <View style={{
        padding: 24,
        flexGrow: 1,
      }}>
        <View style={{ marginBottom: 24, flexGrow: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            {
              userImage && (
                <TouchableOpacity onPress={openImagePicker}>
                  <Image source={{ uri: userImage }} style={{ width: 80, height: 80, borderRadius: 9999 }} />
                </TouchableOpacity>
              )
            }
            <View style={{
              flexGrow: 1,
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
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Tên người dùng: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={userNewName}
              onChangeText={Text => setUserNewName(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email: </Text>
            <TextInput
              editable={false}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={Text => setEmail(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Mô tả bản thân: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={description}
              onChangeText={Text => setDescription(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={{marginVertical: 24}}>
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
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#f64e32',
    borderColor: '#f64e32',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

export default UserDetailScreen