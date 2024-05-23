//import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ImageCropPicker from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';
import { AddRecipeFoods, deleteFoodDataInApproveFoods, deleteFoodDataInNotApproveFood, getFoodDataById, getIdTypeOfFood, getNameTypeOfFood, getNameTypeOfFoodById, updateFoodData } from '../services/FoodDataServices';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

const CreateUpdateRecipe = ({ route, navigation }) => {

  const { idmonan, item } = route.params || {};
  const DefaultImageFood = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultlogo%2Flogo.jpg?alt=media&token=8b4fb801-5f77-432b-a4a3-8454e920fddc'

  const [selectedLoaiMon, setSelectedLoaiMon] = useState(null);
  const [loaiMonData, setLoaiMonData] = useState([]);
  const difficultyLevels = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Hard', value: 'Hard' },
  ];

  const [IdTypeOfFood, setIdTypeOfFood] = useState('');
  const [FoodName, setFoodName] = useState('');
  const [TimeToCook, setTimeToCook] = useState('');
  const [Ingredient, setIngredient] = useState('');
  const [Tutorial, setTutorial] = useState('');
  const [FoodImage, setFoodimage] = useState('');
  const [Size, setSize] = useState('');
  const [DifficultyLevel, setDifficultyLevel] = useState(difficultyLevels[0].value);
  const [Calories, setCalories] = useState('');
  const [Linkyoutube, setLinkYoutube] = useState('');
  const uid = useSelector(state => state.userData.uid);

  const uploadImageToFirebaseStorage = async (imagePath) => {
    const imageFileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    const reference = storage().ref(`images/foods/${imageFileName}`);

    await reference.putFile(imagePath);

    const imageUrl = await reference.getDownloadURL();
    return imageUrl;
  };

  const openImagePicker = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        includeBase64: false,
        includeExif: true,
      });

      const imagePath = image.path;
      const imageUrl = await uploadImageToFirebaseStorage(imagePath);
      setFoodimage(imageUrl);
      console.log(imageUrl);

    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const SaveFoodData = async () => {
    if (!FoodImage) {
      Alert.alert('Vui lòng chọn hình ảnh món ăn');
      return;
    }
    else {
      const NewFood = {
        categories_id: IdTypeOfFood,
        food_name: FoodName,
        time_to_cook: parseInt(TimeToCook),
        ingredient: Ingredient,
        tutorial: Tutorial,
        food_image: FoodImage,
        size: parseInt(Size),
        difficulty: DifficultyLevel,
        calories: parseInt(Calories),
        user_id: uid,
        date_posted: firestore.Timestamp.now(),
        youtube_link: Linkyoutube,
        status: 'Awaiting approval',
        save_count: 0
      }

      const hasNullValues = Object.entries(NewFood).some(([key, value]) => key !== 'Link_youtube' && value === null || (typeof value === 'number' && isNaN(value)));

      if (hasNullValues) {
        console.log('Có thành phần trong NewFood có giá trị null');
        Alert.alert('Vui lòng kiểm tra lại từng thông tin !!')
        return;
      }
      else {
        if (idmonan) {
          await deleteFoodDataInApproveFoods(idmonan)
          await deleteFoodDataInNotApproveFood(idmonan)
          await updateFoodData(idmonan, NewFood);
          console.log('Cập nhật món thành công')
        }
        else {
          await AddRecipeFoods(NewFood);
          console.log('Thêm món thành công')
        }
      }
    }
    navigation.goBack();
  }

  if (idmonan) {
    useEffect(() => {
      const fetchFoodData = async () => {
        setSelectedLoaiMon(await getNameTypeOfFoodById(item.categories_id))
        setFoodName(item.food_name);
        setTimeToCook(item.time_to_cook.toString());
        setIngredient(item.ingredient);
        setTutorial(item.tutorial);
        setFoodimage(item.food_image);
        setDifficultyLevel(item.difficulty);
        setCalories(item.calories.toString())
        setSize(item.size.toString());
        setLinkYoutube(item.youtube_link)
      };
      fetchFoodData()
    }, [idmonan])
  }

  useEffect(() => {
    const NameTypeOfFood = getNameTypeOfFood((data) => {
      setLoaiMonData(data);
    });
    return NameTypeOfFood;
  }, []);


  const TypeOfFoodPickerChange = (itemValue) => {
    setSelectedLoaiMon(itemValue);
  };

  const setDifficultyLevelPickerChange = (itemValue) => {
    setDifficultyLevel(itemValue);
  };

  useEffect(() => {
    const getIdTypeOfFoodAndSet = async () => {
      const id = await getIdTypeOfFood(selectedLoaiMon);
      setIdTypeOfFood(id);
    };

    if (selectedLoaiMon) {
      getIdTypeOfFoodAndSet();
    }
  }, [selectedLoaiMon]);

  return (
    <ScrollView
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View className="w-full absolute flex-row justify-between items-center pt-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-2 bg-white"
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#f64e32'} />
        </TouchableOpacity>
      </View>

      <View className="px-4 justify-between flex space-y-4 pt-8" style={{ paddingTop: 100 }}>

        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Hình ảnh:
        </Text>
        <TouchableOpacity onPress={openImagePicker}>
          {FoodImage ? (
            <Image source={{ uri: FoodImage }} style={{ width: 100, height: 100 }} />
          ) : (
            <Image source={{ uri: DefaultImageFood }} style={{ width: 100, height: 100 }} />
          )}
        </TouchableOpacity>

        {/* Input Text - Name */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Tên món ăn:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          value={FoodName}
          onChangeText={text => setFoodName(text)}
        />

        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Loại món:
        </Text>
        <View>
          <RNPickerSelect
            value={selectedLoaiMon}
            onValueChange={TypeOfFoodPickerChange}
            items={loaiMonData.map((item) => ({
              label: item.categories_name,
              value: item.categories_name,
            }))}
          >
          </RNPickerSelect>
        </View>

        {/* Input Text - time to cook */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Thời gian nấu:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          value={TimeToCook}
          onChangeText={text => setTimeToCook(text)}
        />

        {/* Input Text - serving */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Khẩu phần ăn:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          value={Size}
          onChangeText={text => setSize(text)}
        />


        {/* Input Text - calo */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Số calo:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          value={Calories}
          onChangeText={text => setCalories(text)}
        />

        {/* Input Text - level */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Mức độ:
        </Text>

        <View>
          <RNPickerSelect
            value={DifficultyLevel}
            onValueChange={setDifficultyLevelPickerChange}
            items={difficultyLevels}
          >
          </RNPickerSelect>
        </View>

        {/* Input Text - nguyên liệu */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Nguyên liệu:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
            height: hp(10), // Đặt chiều cao cho TextInput
          }}
          value={Ingredient}
          onChangeText={text => setIngredient(text)}
          multiline // Cho phép hiển thị nhiều dòng văn bản
          numberOfLines={4} // Số dòng tối đa hiển thị
        />


        {/* Input Text - hướng dẫn */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Hướng dẫn:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
            height: hp(30), // Đặt chiều cao cho TextInput
          }}
          value={Tutorial}
          onChangeText={text => setTutorial(text)}
          multiline // Cho phép hiển thị nhiều dòng văn bản
          numberOfLines={12} // Số dòng tối đa hiển thị
        />


        {/* Input Text - link youtube */}
        <Text style={{
          fontSize: hp(2),
        }}
          className="font-medium mr-1 flex-1 text-neutral-500"
        >
          Đường dẫn video:
        </Text>
        <TextInput
          style={{
            fontSize: hp(2),
            borderWidth: 1,
            borderColor: 'gray',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          value={Linkyoutube}
          onChangeText={text => setLinkYoutube(text)}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#f64e32',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            alignItems: 'center',
          }}
          onPress={() => {
            SaveFoodData();
          }}
        >
          <Text style={{ color: 'white', fontSize: hp(2) }}>OK</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/*
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

  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },

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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});*/


/*return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("HOME")}>
          <Text>AddRecipe</Text>
        </TouchableOpacity>
        <View style={styles.form}>
          <TouchableOpacity onPress={openImagePicker}>
            {FoodImage ? (
              <Image source={{ uri: FoodImage }} style={{ width: 100, height: 100 }} />
            ) : (
              <Image source={{ uri: DefaultImageFood }} style={{ width: 100, height: 100 }} />
            )}
          </TouchableOpacity>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Tên món ăn: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={FoodName}
              onChangeText={Text => setFoodName(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Thời gian nấu: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={TimeToCook}
              onChangeText={Text => setTimeToCook(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <PickerSelect
            value={selectedLoaiMon}
            onValueChange={TypeOfFoodPickerChange}
            items={loaiMonData.map((item) => ({
              label: item.Ten_loai_mon,
              value: item.Ten_loai_mon,
            }))}>
          </PickerSelect>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Nguyên liệu: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={Ingredient}
              onChangeText={Text => setIngredient(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Hướng dẫn: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={Tutorial}
              onChangeText={Text => setTutorial(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Suất ăn: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={Size}
              onChangeText={Text => setSize(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <PickerSelect
            value={DifficultyLevel}
            onValueChange={setDifficultyLevelPickerChange}
            items={difficultyLevels}>
          </PickerSelect>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Lượng calo: </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={Calories}
              onChangeText={Text => setCalories(Text)}
              placeholderTextColor="#6b7280"
              style={styles.inputControl} />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => {
                SaveFoodData();
              }}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Lưu thông tin</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
)*/

export default CreateUpdateRecipe