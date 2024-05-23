import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list'
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { getFoodDataApprove } from '../services/FoodDataServices';

const RecipesSearch = ({ SearchValue, pressSearch, resetPress }) => {

  const navigation = useNavigation();
  const [foodData, setFoodData] = useState([]);
  const [filterdData, setFilterdData] = useState([]);

  useEffect(() => {
    const getFoodData = getFoodDataApprove((data) => {
      setFoodData(data)
      setFilterdData(data)
    })
    return getFoodData;
  }, [])

  useEffect(() => {
    if (pressSearch) {
      const filterData = () => {
        const newData = foodData.filter((item) => {
          const itemData = item.food_name ? item.food_name.toUpperCase() : ''.toUpperCase();
          const inputTextData = SearchValue.toUpperCase();
          return itemData.includes(inputTextData);
        });
        setFilterdData(newData);
      };
      filterData();
      resetPress();
    }
  }, [SearchValue, pressSearch, foodData, resetPress]);

  useEffect(() => {
    const filterData = () => {
      const newData = foodData.filter((item) => {
        const itemData = item.food_name ? item.food_name.toUpperCase() : ''.toUpperCase();
        const inputTextData = SearchValue.toUpperCase();
        return itemData.includes(inputTextData);
      });
      setFilterdData(newData);
    };
    filterData();
  },[foodData])

  return (
    <View style={tw`mx-4 mt-3`}>
      <Text style={[tw`font-semibold text-neutral-600`, {
        fontSize: hp(3),
      }]}
      >
        RecipesSearch
      </Text>

      <View>
        <MasonryList
          data={filterdData}
          keyExtractor={(item) => item.id}
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
  let isEven = index % 2 == 0;
  return (
    <View>
      <Pressable
        style={[tw`flex justify-center mb-4 mt-6`, {
          width: '100%',
          paddingLeft: isEven ? 0 : 8,
          paddingRight: isEven ? 8 : 0,
        }]}

        onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })}>
        <Image
          source={{ uri: item.food_image }}
          style={[tw`bg-black/5`, {
            width: "100%",
            height: index % 3 == 0 ? hp(25) : hp(35),
            borderRadius: 35,
          }]}
        />

        <Text
          style={[tw`font-semibold ml-2 text-neutral-600`, { fontSize: hp(1.9) }]}
        >
          {
            item.food_name.length > 20 ? item.food_name.slice(0, 20) + "..." : item.food_name
          }
        </Text>

      </Pressable>
    </View>
  )
}

export default RecipesSearch;