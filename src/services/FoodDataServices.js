import firestore from '@react-native-firebase/firestore';

export const AddRecipeFoods = async (foodData) => {
    try {
        const FoodRef = firestore().collection('Foods');
        await FoodRef.add(foodData);
        console.log('Đã thêm món ăn vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm món ăn vào Firestore:', error);
    }
}

export const updateFoodData = async (uid, NewFoodData) => {
    try {
        const useRef = firestore().collection('Foods').doc(uid);
        await useRef.update(NewFoodData);
    } catch (error) {
        console.log('Lỗi khi cập nhật thông tin món ăn:', error);
    }
}

export const deleteFoodData = async (uid) => {
    try {
        const FoodRef = firestore().collection('Foods').doc(uid);
        FoodRef.delete();
    } catch (error) {
        console.log('Lỗi khi xóa thông tin món ăn:', error)
    }
}

export const deleteFoodDataInApproveFoods = async (uid) => {
    try {
        const FoodRef = firestore().collection('ApproveFoods');
        const query = FoodRef.where('id_food', '==', uid)

        const snapShot = await query.get();

        if (snapShot.empty) {
            return;
        }

        snapShot.forEach((doc) => {
            doc.ref.delete();
        })

    } catch (error) {
        console.log('Lỗi khi xóa thông tin món ăn:', error)
    }
}

export const deleteFoodDataInNotApproveFood = async (uid) => {
    try {
        const FoodRef = firestore().collection('NotApproveFoods');
        const query = FoodRef.where('id_food', '==', uid)

        const snapShot = await query.get();

        if (snapShot.empty) {
            return;
        }

        snapShot.forEach((doc) => {
            doc.ref.delete();
        })

    } catch (error) {
        console.log('Lỗi khi xóa thông tin món ăn:', error)
    }
}

export const getSaveCount = (id, callback) => {
    try {
        const collectionRef = firestore().collection('Foods').where(firestore.FieldPath.documentId(), '==', id);
        return collectionRef.onSnapshot((snapShot) => {
            let totalsave = 0;
            snapShot.forEach((doc) => {
                const data = doc.data();
                totalsave += data.save_count;
            })
            callback(totalsave);
        })
    } catch (error) {
        console.log(error);
        return;
    }
}

export const updateSaveCount = async (id, updateData) => {
    try {
        const collectionRef = firestore().collection('Foods').doc(id);
        await collectionRef.update({ save_count: updateData });
    } catch (error) {
        console.log(error)
    }
}

export const getNameTypeOfFood = (callback) => {
    try {
        const collectionRef = firestore().collection('FoodCategories');
        return collectionRef.onSnapshot((snapShot) => {
            const loaimon = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                loaimon.push(data);
            })
            callback(loaimon);
        });
    }
    catch (error) {
        console.error(error);
        return [];
    }
}

export const getTypeOfFoodData = (callback) => {
    try {
        const collectionRef = firestore().collection('FoodCategories');
        return collectionRef.onSnapshot((snapShot) => {
            const loaimonan = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idloaimon = doc.id
                loaimonan.push({ idloaimon, ...data });
            })
            callback(loaimonan);
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getIdTypeOfFood = async (NameTypeOfFood) => {
    try {
        const collectionRef = firestore().collection('FoodCategories');
        const querySnapShot = await collectionRef.where('categories_name', '==', NameTypeOfFood).limit(1);

        const snapShot = await querySnapShot.get();

        if (!snapShot.empty) {
            const doc = snapShot.docs[0];
            return doc.id;
        }
        else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getNameTypeOfFoodById = async (IdTypeOfFood) => {
    try {
        const collectionRef = firestore().collection('FoodCategories');
        const docRef = collectionRef.doc(IdTypeOfFood);
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            if (data) {
                const tenloaimon = data.categories_name;
                return tenloaimon
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getFoodDataApprove = (callback) => {
    try {
        const collectionRef = firestore().collection('Foods');

        return collectionRef
            .where('status', '==', 'Approve')
            .onSnapshot((querySnapshot) => {
                const monan = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const idmonan = doc.id;
                    monan.push({ idmonan, ...data });
                });

                // Sắp xếp món ăn theo ngày tháng năm gần nhất
                monan.sort((a, b) => b.date_posted - a.date_posted);
                callback(monan);
            });
    } catch (error) {
        console.log(error);
    }
};

export const getFoodDataById = async (uid) => {
    try {
        const collectionRef = firestore().collection('Foods').doc(uid);
        const collectionDoc = await collectionRef.get();

        if (collectionDoc.exists) {
            const userData = collectionDoc.data();
            return userData
        }
        else {
            console.log('Không tìm thấy món ăn theo UID đã cho');
            console.log(uid)
            return null;
        }
    } catch (error) {
        console.log('Lỗi khi lấy thông tin món ăn:', error);
        return null;
    }
}

export const getFoodDataByIdUser = (uid, callback) => {
    try {
        const collectionRef = firestore().collection("Foods")
        return collectionRef.where("user_id", "==", uid).onSnapshot((snapShot) => {
            const monan = []
            snapShot.forEach((doc) => {
                const data = doc.data()
                const idmonan = doc.id;
                monan.push({ idmonan, ...data });
            });
            callback(monan);
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getFoodByCategories = (id, callback) => {
    try {
        const collectionRef = firestore().collection('Foods');
        return collectionRef.where('categories_id', '==', id).where('status', '==', 'Approve').onSnapshot((snapShot) => {
            const monan = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idmonan = doc.id
                monan.push({ idmonan, ...data });
            })
            monan.sort((a, b) => b.date_posted - a.date_posted);
            callback(monan);
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const AddUserFoodHistory = async (foodData) => {
    try {
        const FoodRef = firestore().collection('UserFoodHistory');
        await FoodRef.add(foodData);
        console.log('Đã thêm vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm vào Firestore:', error);
    }
}

export const CheckUserFoodHistory = (userId, idFood, callback) => {
    const favoriteRef = firestore().collection('UserFoodHistory');
    return favoriteRef
        .where('id_user', '==', userId)
        .where('id_food', '==', idFood)
        .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
                callback(true);
            }
            else {
                callback(false);
            }
        }, (error) => {
            console.log('Error checking favorite existence:', error);
            callback(false);
        });
}


export const getFoodDataInUserFoodHistory = (userId, callback) => {
    try {
        const foodhistoryRef = firestore().collection('UserFoodHistory');

        foodhistoryRef
            .where('id_user', '==', userId)
            .onSnapshot((querySnapshot) => {
                if (querySnapshot.empty) {
                    // Không có tài liệu phù hợp, trả về một mảng rỗng ngay lập tức
                    callback([]);
                    return;
                }

                const foodhistoryData = querySnapshot.docs.map((doc) => ({
                    id_food: doc.data().id_food,
                    date_seen: doc.data().date_seen,
                }));

                if (foodhistoryData.length === 0) {
                    // Không có dữ liệu lịch sử món ăn, trả về một mảng rỗng ngay lập tức
                    callback([]);
                    return;
                }

                const foodIds = foodhistoryData.map(item => item.id_food);

                const foodRef = firestore().collection('Foods');

                foodRef
                    .where('status', '==', 'Approve')
                    .where(firestore.FieldPath.documentId(), 'in', foodIds)
                    .onSnapshot((foodQuerySnapshot) => {
                        const foods = foodQuerySnapshot.docs.map(doc => ({
                            idmonan: doc.id,
                            ...doc.data()
                        }));

                        // Gắn lại date_seen cho từng món ăn từ UserFoodHistory để sắp xếp chính xác
                        const foodsWithDateSeen = foods.map(food => ({
                            ...food,
                            date_seen: foodhistoryData.find(item => item.id_food === food.idmonan).date_seen
                        }));

                        // Sắp xếp món ăn theo date_seen
                        foodsWithDateSeen.sort((a, b) => b.date_seen.toDate() - a.date_seen.toDate());

                        // Giới hạn chỉ lấy 6 món ăn gần nhất
                        const getSixFoodOnly = foodsWithDateSeen.slice(0, 6);
                        callback(getSixFoodOnly);
                    });
            });
    } catch (error) {
        console.log(error);
    }
};

export const getPosterFoodData = (uid, callback) => {
    try 
    {
        const collectionRef = firestore().collection('Foods');
        
        return collectionRef.where('user_id', '==', uid)
        .onSnapshot((snapShot) => {
            const monan = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idmonan = doc.id;
                monan.push({idmonan, ...data})
            })
            callback(monan);
        })
    } catch (error) {
        console.log(error)
        return []
    }
}

export const getAllFoodDataInUserFoodHistory = (userId, callback) => {
    try {
        const foodhistoryRef = firestore().collection('UserFoodHistory');

        foodhistoryRef
            .where('id_user', '==', userId)
            .onSnapshot((querySnapshot) => {
                if (querySnapshot.empty) {
                    // Không có tài liệu phù hợp, trả về một mảng rỗng ngay lập tức
                    callback([]);
                    return;
                }

                const foodhistoryFoodId = querySnapshot.docs.map((doc) => doc.data().id_food);

                if (foodhistoryFoodId.length === 0) {
                    // Không có favoriteFoodIds, trả về một mảng rỗng ngay lập tức
                    callback([]);
                    return;
                }

                const foodRef = firestore().collection('Foods');

                return foodRef
                    .where('status', '==', 'Approve').where(firestore.FieldPath.documentId(), 'in', foodhistoryFoodId)
                    .onSnapshot((querySnapshot) => {
                        const monan = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            const idmonan = doc.id;
                            monan.push({ idmonan, ...data });
                        });
                        callback(monan);
                    });

            })
    } catch (error) {
        console.log(error);
    }
};
