import React, { useContext, useState, useEffect, useId } from 'react';
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';
import { HeartIcon } from 'react-native-heroicons/solid';
import { DeleteFromFavorite, getFoodDataFromFavorite, getUserData } from '../services/UserDataServices';
import { useSelector } from 'react-redux';
import moment from 'moment';

const FavoriteRecipes = () => {

    const uid = useSelector(state => state.userData.uid);
    const navigation = useNavigation();
    const [favoritedData, setFavoritedData] = useState([]);

    useEffect(() => {
        const unsubscribe = getFoodDataFromFavorite(uid, (data) => {
            setFavoritedData(data);
        });
        return unsubscribe;
    }, [uid]);

    return (
        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
            <View>
                <MasonryList
                    data={favoritedData}
                    keyExtractor={(item) => item.Id_food}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card item={item} navigation={navigation} />
                    )}
                    onEndReachedThreshold={0.1}
                />
            </View>
        </View>
    );
};

const Card = ({ item, navigation }) => {

    const uid = useSelector(state => state.userData.uid);
    const [userName, setUserName] = useState("");
    const formattedDate = moment(item.date_posted.toDate()).format('DD/MM/YYYY');

    useEffect(() => {
        const data = getUserData(item.user_id, (userData) => {
          if (userData) {
            setUserName(userData.user_name)
          }
        });
        return data;
      }, [item.user_id])
    
    const handleFavoritePress = async () => {
        await DeleteFromFavorite(item.Id_food, uid);
    }

    return (
        <Pressable
            style={{
                width: '100%',
                borderWidth: 2,
                borderColor: '#f64e32',
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
            }}
            onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.Id_food, item })}
        >
            
            {
                item.food_image && (
                    <Image
                        source={{ uri: item.food_image}}
                        style={{
                            width: '100%',
                            height: hp(25),
                            borderRadius: 15,
                        }}
                    />
                )
            }

            <Text style={{ fontSize: hp(1.9), fontWeight: 'bold', color: '#333', marginTop: 5 }}>
                {item.food_name.length > 20 ? item.food_name.slice(0, 20) + '...' : item.food_name}
            </Text>
            <Text style={{ fontSize: hp(1.9), color: '#666' }}>{userName}</Text>
            <Text style={{ fontSize: hp(1.9), color: '#666' }}>{formattedDate}</Text>

            <TouchableOpacity
                onPress={handleFavoritePress}
                style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'white',
                    borderRadius: 999,
                    padding: 5,
                }}
            >
                <HeartIcon
                    size={hp(4.5)}
                    strokeWidth={4.5}
                    color='red'
                />
            </TouchableOpacity>
        </Pressable>
    );
};

export default FavoriteRecipes;