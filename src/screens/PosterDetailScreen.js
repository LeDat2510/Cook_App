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
import PosterDetail from '../components/PosterDetail';

const PosterDetailScreen = ({ route, navigation }) => {
    
    const { id_user } = route.params;
    
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
                    <PosterDetail iduser={id_user}/>
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