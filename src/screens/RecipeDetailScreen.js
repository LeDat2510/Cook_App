import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AddToFavorite, CheckUserFavorite, DeleteFromFavorite, getUserData } from '../services/UserDataServices';
import firestore from '@react-native-firebase/firestore'
import { useSelector } from 'react-redux';
import RecipeDetail from '../components/RecipeDetail';
import RecipeDetailComment from '../components/RecipeDetailComment';

const RecipeDetailScreen = ({ route }) => {

    const { idmonan, item } = route.params;
    const uid = useSelector(state => state.userData.uid);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const CheckIsFavorite = CheckUserFavorite(uid, idmonan, (data) => {
            setIsFavorite(data);
        });

        return CheckIsFavorite;
    }, [uid, idmonan])

    const handleFavoritePress = async () => {
        if (isFavorite) {
            await DeleteFromFavorite(idmonan, uid);
        }
        else {
            const data = {
                id_user: uid,
                id_food: idmonan,
                date_add: firestore.Timestamp.now()
            }
            await AddToFavorite(data)
        }
        setIsFavorite(!isFavorite)
    }

    return (
        <ScrollView
            className="bg-white flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >

            <View className="flex-row justify-center">
                <Image
                    source={{ uri: item.food_image }}
                    style={{
                        width: wp(100),
                        height: hp(50),
                        resizeMode: 'cover',
                    }}
                />
            </View>


            <View className="w-full absolute flex-row justify-between items-center pt-5">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-white"
                >
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#f64e32'} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleFavoritePress}
                    className="p-2 rounded-full mr-5 bg-white"
                >
                    <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavorite ? 'red' : 'gray'} />
                </TouchableOpacity>
            </View>

            <View className="px-4 justify-between flex-1 space-y-4 pt-3">
                <RecipeDetail item={item} navigation={navigation} />
                <RecipeDetailComment item={item} navigation={navigation} />   
            </View>
        </ScrollView >
    );
};

export default RecipeDetailScreen;