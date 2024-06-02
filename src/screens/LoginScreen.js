import auth, { firebase } from '@react-native-firebase/auth';
import { useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useContext, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Alert, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { LoginAction } from '../store/UserAction';
import { store } from '../store/store';

const Login = ( {navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const DefaultImage = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultuserimage%2Flogo_user.jpg?alt=media&token=408dfb1f-5c32-4ab0-9bce-8d79790078e5';
  const DefaultImageLogo = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultlogo%2Flogo.jpg?alt=media&token=8b4fb801-5f77-432b-a4a3-8454e920fddc'

  const DangNhap = () => {
    auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      store.dispatch(LoginAction(uid));
      console.log("User signed in sucessfully")
      Alert.alert('Đăng nhập thành công')
      navigation.navigate("HomeLogin");
    }).catch(error => {
      console.log(error)
    })
  }

  const checkUserIsExists = async (uid) => {
    const userRef = firestore().collection('Users').doc(uid);
    const snapshot = await userRef.get();
    return snapshot.exists;
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '656713590988-j9o7r6n6m1qcbk9f01aof3ifqgo2oco1.apps.googleusercontent.com',
    });
  },[])
  
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken, user } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);

    const userID = user.id;
    const UserExist = await checkUserIsExists(userID);

    if(UserExist)
    {
      store.dispatch(LoginAction(userID));
      console.log('User account signed in!');
      Alert.alert('Đăng nhập bằng google thành công');
      navigation.navigate("HomeLogin");
    }
    else
    {
      const userref = firestore().collection('Users').doc(userID);
      userref.set({
        user_name: user.name,
        email: user.email,
        user_image: user.photo,
        date_created: firestore.Timestamp.now(),  
        description: '',      
        role: false
      })
      console.log('User account created & signed in!');
      Alert.alert('Đăng nhập bằng google thành công');
      store.dispatch(LoginAction(userID));
      navigation.navigate("HomeLogin");
    }  
  }


  async function onFacebookButtonPress() {

    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    const userCredential = auth().signInWithCredential(facebookCredential);

    const UserExist = await checkUserIsExists((await userCredential).user.uid)

    if(UserExist)
    {
      store.dispatch(LoginAction((await userCredential).user.uid));
      console.log('User account signed in!');
      Alert.alert('Đăng nhập bằng Facebook thành công');
      navigation.navigate("DrawerStack", { screen: "Home" });
    }
    else
    {     
      const {displayName, email} = (await userCredential).user;
      if(email)
      {
        const graphApiUrl = `https://graph.facebook.com/v15.0/me?fields=picture.type(large)&access_token=${data.accessToken}`;
        const response = await fetch(graphApiUrl);
        const userData = await response.json();
        const { picture } = userData;
  
        if(picture.data.url)
        {
          const photo = picture.data.url;
          firestore().collection('Users').doc((await userCredential).user.uid).set({
            user_name: displayName,
            email,
            user_image: photo,
            date_created: firestore.Timestamp.now(), 
            description: '',          
            role: false
          });
  
          store.dispatch(LoginAction((await userCredential).user.uid));
          console.log('User account created & signed in!');
          Alert.alert('Đăng nhập bằng Facebook thành công');
          navigation.navigate("HomeLogin");
        }
        else
        {
          const photo = DefaultImage;
          firestore().collection('Users').doc((await userCredential).user.uid).set({
            user_name: displayName,
            email,
            user_image: photo,
            date_created: firestore.Timestamp.now(),            
            role: false
          });
          store.dispatch(LoginAction((await userCredential).user.uid));
          console.log('User account created & signed in!');
          Alert.alert('Đăng nhập bằng Facebook thành công');
          navigation.navigate("HomeLogin");
        }
      }
      else
      {
        console.log('User Facebook không có Email !');
        Alert.alert('Lỗi !! Người dùng Facebook không có Email. Vui lòng xử lý lại sau');
      }
    }     
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt=""
            resizeMode="contain"
            style={styles.headerImg}
            source={{uri: DefaultImageLogo}} />

          <Text style={styles.title}>
            <Text style={{ color: '#f64e32' }}>CookApp</Text>
          </Text>

          <Text style={styles.subtitle}>
             Kiến thức - Trải nghiệm - Kinh nghiệm 
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Địa chỉ Email</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email} 
              onChangeText={Text => setEmail(Text)}
              placeholder="thaicong123@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}/>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>

            <TextInput
              autoCorrect={false}
              value={password} 
              onChangeText={Text => setPassword(Text)}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}/>
          </View>
        
          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => {
                DangNhap()
              }}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Đăng nhập</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp")
            }}
            style={{ marginTop: 'auto' }}>
            <Text style={styles.formFooter}>
              Bạn không có tài khoản? ---{'> '}
              <Text style={{ textDecorationLine: 'underline' }}>Đăng kí đê ! </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.formSpacer}>
                <Text style={styles.formSpacerText}>Hoặc bạn có thể đăng nhập với</Text>
  
                <View style={styles.formSpacerDivider} />

                  
              <View style={styles.btnGroup}>
                <TouchableOpacity
                  onPress={() => {
                    onFacebookButtonPress();
                  }}
                  style={{ flex: 1, paddingHorizontal: 6 }}>
                  <View style={styles.btnFacebook}>
                    <MaterialCommunityIcons
                      color="#fff"
                      name="facebook"
                      size={18}
                      style={{ marginRight: 12 }} />
  
                    <Text style={styles.btnFacebookText}>Facebook</Text>
                  </View>
                </TouchableOpacity>
  
                <TouchableOpacity
                  onPress={() => {
                    onGoogleButtonPress();
                  }}
                  style={{ flex: 1, paddingHorizontal: 6 }}>
                  <View style={styles.btnGoogle}>
                    <MaterialCommunityIcons
                      color="#fff"
                      name="google"
                      size={18}
                      style={{ marginRight: 12 }} />
                    <Text style={styles.btnGoogleText}>Google</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    backgroundColor: '#EFF1F5',
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
    backgroundColor: '#f64e32',
    borderColor: '#f64e32',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: '#f64e32',
    borderColor: '#f64e32',
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
    backgroundColor: '#f64e32',
    borderColor: '#f64e32',
  },
  btnGoogleText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Login;
