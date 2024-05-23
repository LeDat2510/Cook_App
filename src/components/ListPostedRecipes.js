import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, Image, TouchableOpacity, Alert } from 'react-native';
import { ChevronRightIcon, XCircleIcon, EyeIcon, PencilSquareIcon, TrashIcon, PlusIcon } from 'react-native-heroicons/solid';
import Modal from 'react-native-modal';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';
import { getFoodDataByIdUser, deleteFoodData, deleteFoodDataInApproveFoods, deleteFoodDataInNotApproveFood } from '../services/FoodDataServices';
import { Badge } from '@rneui/themed';
import { useSelector } from 'react-redux';


const RecipeCard = ({ item, navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOptionPress = (option) => {
    if (option === 'view') {
      navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item });
    }
    if (option === 'edit') {
      navigation.navigate('CreateUpdateRecipe', { idmonan: item.idmonan, item });
    }

    toggleModal(); // Đảo ngược trạng thái của modal
  };

  const handleDeleteFood = async (id) => {
      try 
      {
        if(item.status === "Approve")
        {
          await deleteFoodDataInApproveFoods(id);
          await deleteFoodData(id);
          Alert.alert("Xóa món ăn thành công !!")
        } 
        else if (item.status === "Not Approve")
        {
          await deleteFoodDataInNotApproveFood(id);
          await deleteFoodData(id);
          Alert.alert("Xóa món ăn thành công !!")
        } else {
          await deleteFoodData(id);
          Alert.alert("Xóa món ăn thành công !!")
        }

      } catch (error) {
        console.log(error)
      }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
      <Pressable onPress={toggleModal}>
        <Image
          source={{ uri: item.food_image }}
          style={{
            width: 110,
            height: 120,
            borderRadius: 15,
          }}
        />
      </Pressable>
      <Pressable
        style={{
          flex: 1,
          marginLeft: 16,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={toggleModal}
      >
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {item.food_name.length > 20 ? item.food_name.slice(0, 20) + '...' : item.food_name}
          </Text>
          {
            item.status === "Approve" ? (
              <Badge value="Đã duyệt" status='success' badgeStyle={{ width: 80, height: 30 }} />
            ) : item.status === "Not Approve" ? (
              <Badge value="Không được duyệt" status='error' badgeStyle={{ width: 120, height: 30 }} />
            ) : (
              <Badge value="Đang đợi duyệt" status='warning' badgeStyle={{ width: 100, height: 30 }} />
            )
          }

        </View>
        <ChevronRightIcon name="ChevronRight" size={24} color="black" />
      </Pressable>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 10,
                borderColor: '#f64e32',
                borderWidth: 2,
              }}
            >
              <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 8 }} onPress={toggleModal}>
                <XCircleIcon name="X" size={24} color="black" />
              </TouchableOpacity>
              <Text style={{ marginTop: 16, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{item.food_name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}
              >
                <Pressable
                  style={{
                    flex: 1,
                    marginBottom: 16,
                    borderColor: '#f64e32',
                    borderWidth: 2,
                    borderRadius: 15,
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                  onPress={() => handleOptionPress('view')}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <EyeIcon name="Eye" size={20} color="black" style={{ marginRight: 8 }} />
                    <Text>Xem</Text>
                  </View>
                </Pressable>

                <Pressable
                  style={{
                    flex: 1,
                    marginBottom: 16,
                    borderColor: '#f64e32',
                    borderWidth: 2,
                    borderRadius: 15,
                    alignItems: 'center',
                    paddingVertical: 8,
                    marginHorizontal: 8,
                  }}
                  onPress={() => handleOptionPress('edit')}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PencilSquareIcon name="PencilSquare" size={20} color="black" style={{ marginRight: 8 }} />
                    <Text>Sửa</Text>
                  </View>
                </Pressable>

                <Pressable
                  style={{
                    flex: 1,
                    marginBottom: 16,
                    borderColor: '#f64e32',
                    borderWidth: 2,
                    borderRadius: 15,
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                  onPress={() => handleDeleteFood(item.idmonan)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TrashIcon name="Trash" size={20} color="black" style={{ marginRight: 8 }} />
                    <Text>Xóa</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ListPostedRecipes = () => {

  const uid = useSelector(state => state.userData.uid);

  const [FoodData, setFoodData] = useState([]);

  useEffect(() => {
    const getFoodData = getFoodDataByIdUser(uid, (data) => {
      setFoodData(data);
    });
    return getFoodData;
  }, []);

  const navigation = useNavigation();

  const handleAddNew = () => {
    // Xử lý khi nhấn vào nút "Thêm mới"
    navigation.navigate('CreateUpdateRecipe');
  };
  return (
    <View className="mx-4 space-y-3">
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          width: 'auto',
          alignItems: 'center',
          position: 'absolute',
          top: 16,
          right: 16,
          borderColor: '#f64e32',
          borderWidth: 2,
          borderRadius: 15,
        }}
        onPress={handleAddNew}
      >
        <PlusIcon size={24} color="black" style={{ marginLeft: 6 }} />
        <Text style={{ marginLeft: 3, marginRight: 5 }}>Thêm mới</Text>
      </TouchableOpacity>

      <View style={{ paddingTop: 40 }}>
        <MasonryList
          data={FoodData}
          keyExtractor={(item) => item.id}
          numColumns={1}
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

export default ListPostedRecipes;