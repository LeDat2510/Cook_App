import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list'
import { useNavigation } from '@react-navigation/native';
import { AddUserFoodHistory, CheckUserFoodHistory, getFoodDataApprove } from '../services/FoodDataServices';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const LatestRecipes = () => {

  const navigation = useNavigation();

  const [latestFoodData, setLatestFoodData] = useState([]);

  useEffect(() => {
    const getFoodData = getFoodDataApprove((data) => {
      setLatestFoodData(data);
    });
    return getFoodData;
  }, []);

  return (
    <View className="mx-4 mt-3">
      <Text style={{
        fontSize: hp(3),
      }}
        className="font-semibold text-neutral-600 mb-4"
      >
        LatestRecipes
      </Text>

      <View>
        <MasonryList
          data={latestFoodData}
          keyExtractor={(item) => item.idmonan}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
          onEndReachedThreshold={0.1}
        />
      </View>
    </View>
  );
};

const RecipeCard = ({ item, index, navigation }) => {
  let isEven = index % 2 == 0;

  const uid = useSelector(state => state.userData.uid);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const Check = CheckUserFoodHistory(uid, item.idmonan, (data) => {
      setCheck(data);
    });
    return Check;
  }, [uid, item.idmonan])

  const AddFoodHistory = async () => {
    if (check) {
      navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })
    }
    else {
      const data = {
        id_user: uid,
        id_food: item.idmonan,
        date_seen: firestore.Timestamp.now()
      }
      await AddUserFoodHistory(data);
      navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })
    }
  }

  return (
    <View>
      <Pressable
        style={{
          width: '100%',
          paddingLeft: isEven ? 0 : 8,
          paddingRight: isEven ? 8 : 0,
        }}

        className="flex justify-center mb-4 space-y-1"

        onPress={() => AddFoodHistory()}>

        {
          item.food_image && (
            <Image
              source={{ uri: item.food_image }}
              style={{
                width: "100%",
                height: index % 3 == 0 ? hp(25) : hp(35),
                borderRadius: 35,
              }}
              className="bg-black/5"
            />
          )
        }

        <Text
          style={{ fontSize: hp(1.9) }}
          className="font-semibold ml-2 text-neutral-600"
        >
          {
            item.food_name.length > 20 ? item.food_name.slice(0, 20) + "..." : item.food_name
          }
        </Text>
      </Pressable>
    </View>
  )
}

export default LatestRecipes;