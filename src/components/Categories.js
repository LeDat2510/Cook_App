import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getTypeOfFoodData } from '../services/FoodDataServices';


const Categories = ({ onCategoryChange }) => {
  
  const [activeCategory, setActiveCategory] = useState(null);

  const [typeOfFoodData, setTypeOfFoodData] = useState([]);

  useEffect(() => {
    const getTypeOfFood = getTypeOfFoodData((data) => {
      setTypeOfFoodData(data)
      if (data.length > 0) {
        setActiveCategory(data[0].idloaimon);
        onCategoryChange(data[0].idloaimon)
      }
    })
    return getTypeOfFood;
  }, []);

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      >
        {typeOfFoodData.map((category, index) => {
          const isActive = category.idloaimon === activeCategory;
          const activeButtonStyle = isActive ? { backgroundColor: "#f64e32" } : { backgroundColor: "#DDDDDD" };

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(category.idloaimon)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <View style={[activeButtonStyle, {
                borderRadius: 6,
                padding: 6,
              }]}>
                <Image
                  source={{
                    uri: category.categories_image
                  }}
                  style={{
                    width: hp(6),
                    height: hp(6),
                    borderRadius: hp(3),
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: hp(1.6),
                  color: "black",
                  marginTop: 4,
                }}
              >
                {category.categories_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Categories;