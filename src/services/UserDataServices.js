import firestore from '@react-native-firebase/firestore';

export const getUserData = (uid, callback) => {
    try {
        const useRef = firestore().collection('Users').doc(uid);

        return useRef.onSnapshot((useDoc) => {
            if (useDoc.exists) {
                const userData = useDoc.data();
                callback(userData);
            } else {
                console.log('Không tìm thấy người dùng với UID đã cho');
                callback(null);
            }
        });
    } catch (error) {
        console.log('Lỗi khi lấy thông tin người dùng:', error);
        callback(null);
    }
};

export const updateUserData = async (uid, NewDataUser) => {
    try {
        const useRef = firestore().collection('Users').doc(uid);
        await useRef.update(NewDataUser);
    } catch (error) {
        console.log('Lỗi khi cập nhật thông tin người dùng:', error);
    }
}

export const AddToFavorite = async (data) => {
    try {
        const FavoriteRef = firestore().collection('FavoriteFoods');
        await FavoriteRef.add(data);
        console.log('Đã thêm món ăn vào danh sách yêu thích');
    } catch (error) {
        console.error('Lỗi khi thêm món ăn danh sách yêu thích:', error);
    }
}

export const DeleteFromFavorite = async (foodId, userId) => {
    try {
        const FavoriteRef = firestore().collection('FavoriteFoods')
            .where('id_food', '==', foodId)
            .where('id_user', '==', userId).get();

        if (!(await FavoriteRef).empty) {
            (await FavoriteRef).forEach(async (doc) => {
                await doc.ref.delete();
            })
            console.log('Đã xóa dữ liệu thành công');
        } else {
            console.log('Không tìm thấy dữ liệu cần xóa');
        }

    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
    }
}

export const getFoodDataFromFavorite = (userId, callback) => {
    const favoriteRef = firestore().collection('FavoriteFoods');

    favoriteRef
        .where('id_user', '==', userId)
        .onSnapshot((querySnapshot) => {
            if (querySnapshot.empty) {
                callback([]);
                return;
            }

            const favoriteFoodIds = querySnapshot.docs.map((doc) => doc.data().id_food);

            if (favoriteFoodIds.length === 0) {
                callback([]);
                return;
            }

            const foodRef = firestore().collection('Foods');

            foodRef
                .where(firestore.FieldPath.documentId(), 'in', favoriteFoodIds)
                .get()
                .then((foodSnapshot) => {
                    const favoriteFoods = foodSnapshot.docs.map((doc) => {
                        const foodData = doc.data();
                        return {
                            Id_food: doc.id,
                            ...foodData,
                        };
                    });
                    callback(favoriteFoods);
                })
                .catch((error) => {
                    console.log('Error fetching favorite foods:', error);
                });
        }, (error) => {
            console.log('Error checking favorite user:', error);
        });
};

export const CheckUserFavorite = (userId, foodId, callback) => {
    const favoriteRef = firestore().collection('FavoriteFoods');

    const unsubscribe = favoriteRef
        .where('id_user', '==', userId)
        .where('id_food', '==', foodId)
        .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
                callback(true);
            }
            else {
                callback(false);
            }
        });
    return unsubscribe;
}

export const UserTotalRecipes = (id, callback) => {
    try {
        const collectionRef = firestore().collection('Foods');

        return collectionRef.where('user_id', '==', id).where('status', '==', 'Approve')
            .onSnapshot((snapshot) => {
                const total = snapshot.size;
                callback(total);
            })
    } catch (error) {
        console.log(error)
    }
}

export const searchFoodByName = (keyword, callback) => {
    try {
        const collectionRef = firestore().collection('Foods');
        return collectionRef
            .where('food_name', '==', keyword)
            .onSnapshot((querySnapshot) => {
                const monan = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const idmonan = doc.id;
                    monan.push({ idmonan, ...data });
                });
                callback(monan);
            });
    } catch (error) {
        console.error('Error searching foods:', error);
        return [];
    }
};

export const AddSearchHistory = async (historyData) => {
    try {
        const FavoriteRef = firestore().collection('SearchHistory');
        await FavoriteRef.add(historyData);
        console.log('Đã thêm');
    } catch (error) {
        console.error('Lỗi khi thêm', error);
    }
}

export const CheckSearchContent = (uid, searchcontent, callback) => {
    try {
        const collectionRef = firestore().collection('SearchHistory');
        return collectionRef.where("search_content", '==', searchcontent).where("id_user", '==', uid)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            })
    } catch (error) {
        console.log(error)
        callback(false);
    }
}

export const updateSearchContent = (searchcontent, uid) => {

    const collectionRef = firestore().collection('SearchHistory');
    return collectionRef
        .where('id_user', '==', uid)
        .where('search_content', '==', searchcontent)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) 
            {
                const docRef = querySnapshot.docs[0].ref;
                docRef.update({ date_search: firestore.Timestamp.now() });
            } 
            else 
            {
                callback(false);
            }
        })
        .catch((error) => {
            console.error('Error updating search content:', error);
        });
}

export const getAllSearchHistoryData = (uid, callback) => {
    try {
        const collectionRef = firestore().collection('SearchHistory');
        return collectionRef
            .where('id_user', '==', uid)
            .onSnapshot((querySnapshot) => {
                const historyData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const idsearch = doc.id;
                    historyData.push({ idsearch, ...data });
                });
                historyData.sort((a, b) => b.date_search - a.date_search);
                callback(historyData)
            })
    } catch (error) {
        console.error('Error retrieving search history:', error);
        return [];
    }
}

export const getSearchHistoryData = (uid, callback) => {
    try {
        const collectionRef = firestore().collection('SearchHistory');
        return collectionRef
            .where('id_user', '==', uid)
            .onSnapshot((querySnapshot) => {
                const historyData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const idsearch = doc.id;
                    historyData.push({ idsearch, ...data });
                });

                historyData.sort((a, b) => b.date_search - a.date_search);
                const limitedData = historyData.slice(0, 6);
                callback(limitedData);
            });
    } catch (error) {
        console.error('Error retrieving search history:', error);
        return [];
    }
};

export const deleteAllSearchHistoryData = async () => {
    try {
        const collectionRef = firestore().collection('SearchHistory');
        const batch = firestore().batch();

        const snapshot = await collectionRef.get();

        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
        })

        await batch.commit();
        console.log('All documents deleted successfully.');
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
}

export const deleteAllUserFoodHistoryData = async () => {
    try {
        const collectionRef = firestore().collection('UserFoodHistory');
        const batch = firestore().batch();

        const snapshot = await collectionRef.get();

        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
        })

        await batch.commit();
        console.log('All documents deleted successfully.');
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
}

export const deleteSearchHistoryData = async (idsearch) => {
    try {
        const collectionRef = firestore().collection('SearchHistory').doc(idsearch);
        collectionRef.delete();
        console.log('All documents deleted successfully.');
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
}

export const deleteUserFoodHistoryData = async (idFood, uid) => {
    try {
        const collectionRef = firestore().collection('UserFoodHistory');
        const snapshot = await collectionRef.where('id_food', '==', idFood).where('id_user', '==', uid).get();

        if (snapshot.empty) {
            console.log('No documents to delete');
            return;
        }

        const batch = firestore().batch();

        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
        })

        await batch.commit();
        console.log('All documents deleted successfully.');
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
}





