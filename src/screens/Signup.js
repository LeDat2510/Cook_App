import auth from '@react-native-firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';


const Signup = ({navigation}) => {
 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const DefaultImage = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultuserimage%2Flogo_user.jpg?alt=media&token=408dfb1f-5c32-4ab0-9bce-8d79790078e5';
    const DefaultImageLogo = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultlogo%2Flogo.jpg?alt=media&token=8b4fb801-5f77-432b-a4a3-8454e920fddc'

    const DangKyBangEmail = () => {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then( response => {
          const { user } = response;
          const userID = user.uid;

          const userref = firestore().collection('Users').doc(userID);

          userref.set({
            user_name: username,
            email: email,
            user_image: DefaultImage,
            date_created: firestore.Timestamp.now(),
            description: '',
            role: false
          })
          console.log('User account created & signed in!');
          Alert.alert('Đăng ký thành công')
          navigation.navigate("Login")
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
          console.error(error);
        });
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Image
              resizeMode="contain"
              source={{uri: DefaultImageLogo }} 
              style={styles.logoImg} />
  
            <View style={styles.form}>
              <Text style={styles.title}>Tạo tài khoản mới</Text>

              <TextInput
                placeholder="Tên"
                placeholderTextColor="#A5A5AE"
                onChangeText={(Text) => setUsername(Text)}
                value={username}
                style={styles.input} />
  
              <TextInput
                placeholder="Địa chỉ email"
                placeholderTextColor="#A5A5AE"
                onChangeText={(Text) => setEmail(Text)}
                value={email}
                style={styles.input} />
  
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#A5A5AE"
                onChangeText={(Text) => setPassword(Text)}
                value={password}
                style={styles.input} />
  
              <TouchableOpacity
                onPress={() => {
                  DangKyBangEmail();
                }}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Đăng ký ngay</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login")
                }}>
                <Text style={styles.formFooter}>
                  Bạn đã có tài khoản ?
                  <Text style={{ color: '#FE724E' }}> Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  logoImg: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 29,
    fontWeight: '700',
    color: '#242424',
    textAlign: 'center',
    marginBottom: 12,
  },
 
  input: {
    height: 44,
    backgroundColor: '#EFF1F5',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginBottom: 12,
  },
  /** Form */
  form: {
    paddingHorizontal: 16,
  },
  formFooter: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '500',
    color: '#454545',
    textAlign: 'center',
  },
  formSpacer: {
    marginTop: 72,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSpacerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#454545',
    lineHeight: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    zIndex: 9,
  },
  formSpacerDivider: {
    borderBottomWidth: 2,
    borderColor: '#eff1f5',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
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
    backgroundColor: '#FE724E',
    borderColor: '#FE724E',
    marginTop: 24,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginHorizontal: -6,
  },
  btnFacebook: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#355288',
    borderColor: '#355288',
  },
  btnFacebookText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#3367D6',
    borderColor: '#3367D6',
  },
  btnGoogleText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Signup;
  