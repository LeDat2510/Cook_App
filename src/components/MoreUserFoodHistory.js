import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MansonryList from '@react-native-seoul/masonry-list'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { deleteSearchHistoryData, deleteUserFoodHistoryData, getAllSearchHistoryData, getSearchHistoryData } from '../services/UserDataServices';
import Entypo from 'react-native-vector-icons/Entypo'
import { getAllFoodDataInUserFoodHistory } from '../services/FoodDataServices';
import { getUserData } from '../services/UserDataServices';
import { IconButton } from 'react-native-paper';


const MoreUserFoodHistory = () => {

    const navigation = useNavigation();

    const [FoodDataInUserFoodHistory, setFoodDataInUserFoodHistory] = useState([]);

    const uid = useSelector(state => state.userData.uid);

    useEffect(() => {
        const getFoodData = getAllFoodDataInUserFoodHistory(uid, (data) => {
            setFoodDataInUserFoodHistory(data);
        });
        return getFoodData;
    }, [uid]);

    return (
        <View className="mx-5 mt-3">
            <View>
                <MansonryList
                    data={FoodDataInUserFoodHistory}
                    keyExtractor={(item) => item.idmonan}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                    //refreshing={isLoadingNext}
                    //onRefresh={() => refetch({first: ITEM_CNT})}
                    onEndReachedThreshold={0.1}
                //onEndReached={() => loadNext(ITEM_CNT)}
                />
            </View>
        </View>
    );
};

const RecipeCard = ({ item, index, navigation }) => {

    const uid = useSelector(state => state.userData.uid);

    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        const data = getUserData(item.user_id, (userData) => {
            if (userData) {
                setUserName(userData.user_name)
                setUserImage(userData.user_image);
            }
        });
        return data;
    }, [item.user_id])

    let isEven = index % 2 == 0;
    return (
        <Pressable onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })}>
            <View style={styles.item}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{
                            uri: item.food_image
                        }}
                        style={[styles.itemPhoto, { flex: 1 }]}>
                    </Image>
                    <View style={styles.iconButtonContainer}>
                        <IconButton
                            icon="close"
                            size={24}
                            color="white"
                            onPress={() => deleteUserFoodHistoryData(item.idmonan, uid)}
                        />
                    </View>
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemText} numberOfLines={2}>{item.food_name}</Text>
                </View>
                <View style={styles.userInfoContainer}>
                    <Image
                        source={{
                            uri: userImage
                        }}
                        style={styles.userImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: '#1d1d1d',
        flex: 1,
        fontWeight: 'bold',
    },
    item: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 4,
    },
    iconButtonContainer: {
        position: 'absolute',
        right: 5,
        top: 5,
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemPhoto: {
        borderRadius: 10,
        width: '100%',
        height: 150,
    },
    itemTextContainer: {
        maxWidth: 150
    },
    itemText: {
        color: 'black',
        marginTop: 5,
        paddingLeft: 10,
    },
    userInfoContainer: {
        flexDirection: 'row',
        paddingBottom: 10
    },
    userImage: {
        width: 25,
        height: 25,
        borderRadius: 9999,
        marginTop: 5,
        marginLeft: 10,
    },
    userName: {
        color: 'black',
        marginTop: 5,
        paddingLeft: 10,
        alignSelf: 'center',
        flex: 1
    },
    loadMoreButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flex: 1
    },
    loadMoreText: {
        color: '#949391'
    }
})

export default MoreUserFoodHistory