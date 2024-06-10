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
            const loaimonanData = loaimonan.slice(0, 6);
            callback(loaimonanData);
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
                    callback([]);
                    return;
                }

                const foodhistoryData = querySnapshot.docs.map((doc) => ({
                    id_food: doc.data().id_food,
                    date_seen: doc.data().date_seen,
                }));

                if (foodhistoryData.length === 0) {
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

                        const foodsWithDateSeen = foods.map(food => ({
                            ...food,
                            date_seen: foodhistoryData.find(item => item.id_food === food.idmonan).date_seen
                        }));

                        foodsWithDateSeen.sort((a, b) => b.date_seen.toDate() - a.date_seen.toDate());

                        const getSixFoodOnly = foodsWithDateSeen.slice(0, 6);
                        callback(getSixFoodOnly);
                    });
            });
    } catch (error) {
        console.log(error);
    }
};

export const getAllPosterFoodData = (uid, callback) => {
    try {
        const collectionRef = firestore().collection('Foods');
        return collectionRef.where('user_id', '==', uid).where('status', '==', 'Approve')
            .onSnapshot((snapShot) => {
                const monan = []
                snapShot.forEach((doc) => {
                    const data = doc.data();
                    const idmonan = doc.id;
                    monan.push({ idmonan, ...data })
                })
                monan.sort((a, b) => b.date_posted - a.date_posted);
                callback(monan);
            })
    } catch (error) {
        console.log(error)
        return []
    }
}
export const getPosterFoodData = (uid, callback) => {
    try {
        const collectionRef = firestore().collection('Foods');

        return collectionRef.where('user_id', '==', uid).where('status', '==', 'Approve')
            .onSnapshot((snapShot) => {
                const monan = []
                snapShot.forEach((doc) => {
                    const data = doc.data();
                    const idmonan = doc.id;
                    monan.push({ idmonan, ...data })
                })
                monan.sort((a, b) => b.date_posted - a.date_posted);
                const foodData = monan.slice(0, 6);
                callback(foodData);
            })
    } catch (error) {
        console.log(error)
        return []
    }
}

export const getPosterFoodCount = (uid, callback) => {
    try {
        const collectionRef = firestore().collection('Foods');
        return collectionRef.where('user_id', '==', uid).where('status', '==', 'Approve').onSnapshot((snapShot) => {
            callback(snapShot.size);
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
                    callback([]);
                    return;
                }

                const foodhistoryFoodId = querySnapshot.docs.map((doc) => doc.data().id_food);

                if (foodhistoryFoodId.length === 0) {
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
                        monan.sort((a, b) => b.date_posted - a.date_posted);
                        callback(monan);
                    });

            })
    } catch (error) {
        console.log(error);
    }
};

export const getCommentFoodDetailData = (idfood, callback) => {
    try {
        const collectionRef = firestore().collection("FoodComments");
        return collectionRef.where("id_food", "==", idfood).onSnapshot((snapShot) => {
            const comment = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idcomment = doc.id;
                comment.push({ idcomment, ...data });
            })
            comment.sort((a, b) => b.date_comment - a.date_comment);
            const limitedCommment = comment.slice(0, 3);
            callback(limitedCommment);
        })
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getAllCommentFoodData = (idfood, callback) => {
    try {
        const collectionRef = firestore().collection("FoodComments");
        return collectionRef.where("id_food", "==", idfood).onSnapshot((snapShot) => {
            const comment = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idcomment = doc.id;
                comment.push({ idcomment, ...data });
            })
            const sortData = comment.sort((a, b) => b.date_comment - a.date_comment);
            callback(sortData);
        })
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const CheckUserLikeCommentFood = (userId, idComment, callback) => {
    try {
        const favoriteRef = firestore().collection('CommentFoodLikes');
        return favoriteRef
            .where('id_user', '==', userId)
            .where('id_comment', '==', idComment)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            })
    } catch (error) {
        console.log('Error checking favorite existence:', error);
        callback(false);
    }
}

export const getReplyFoodCommentCount = (idComment, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyFoodComments");
        const query = collectionRef.where("id_comment", "==", idComment);

        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const getCommentFoodLikeCount = (idComment, callback) => {
    try {
        const collectionRef = firestore().collection("CommentFoodLikes");
        const query = collectionRef.where("id_comment", "==", idComment);
        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const DeleteFromCommentFoodLikes = async (idComment, userId) => {
    try {
        const collectionRef = firestore().collection('CommentFoodLikes')
        const query = await collectionRef.where('id_comment', '==', idComment).where('id_user', '==', userId).get();
        if (!query.empty) {
            query.forEach((doc) => {
                doc.ref.delete();
            })
            console.log('Đã xóa dữ liệu thành công');
        } else {
            console.log('Không tìm thấy dữ liệu cần xóa');
        }

    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
    }
}

export const AddToCommentFoodLikes = async (data) => {
    try {
        const FavoriteRef = firestore().collection('CommentFoodLikes');
        await FavoriteRef.add(data);
        console.log('Thêm vào bảng thành công ');
    } catch (error) {
        console.error('Lỗi khi thêm vào bảng:', error);
    }
}

export const getAllReplyCommentFood = (idcomment, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyFoodComments");
        return collectionRef.where("id_comment", "==", idcomment).onSnapshot((snapShot) => {
            const comment = []
            snapShot.forEach((doc) => {
                const data = doc.data();
                const idreply = doc.id;
                comment.push({ idreply, ...data });
            })
            callback(comment);
        })
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const CheckUserLikeReplyCommentFood = (userId, idReply, callback) => {
    try {
        const favoriteRef = firestore().collection('ReplyFoodCommentLikes');
        return favoriteRef
            .where('id_user', '==', userId)
            .where('id_reply', '==', idReply)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            })
    } catch (error) {
        console.log('Error checking favorite existence:', error);
        callback(false);
    }
}

export const getReplyFoodCommentLikeCount = (idReply, callback) => {
    try {
        const collectionRef = firestore().collection("ReplyFoodCommentLikes");
        const query = collectionRef.where("id_reply", "==", idReply);
        return query.onSnapshot((querySnapshot) => {
            const count = querySnapshot.size;
            callback(count);
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export const DeleteFromReplyFoodCommentLikes = async (idReply, userId) => {
    try {
        const collectionRef = firestore().collection('ReplyFoodCommentLikes')
        const query = await collectionRef.where('id_reply', '==', idReply).where('id_user', '==', userId).get();
        if (!query.empty) {
            query.forEach((doc) => {
                doc.ref.delete();
            })
            console.log('Đã xóa dữ liệu thành công');
        } else {
            console.log('Không tìm thấy dữ liệu cần xóa');
        }

    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
    }
}

export const AddToReplyFoodCommentLikes = async (data) => {
    try {
        const FavoriteRef = firestore().collection('ReplyFoodCommentLikes');
        await FavoriteRef.add(data);
        console.log('Thêm vào bảng thành công ');
    } catch (error) {
        console.error('Lỗi khi thêm vào bảng:', error);
    }
}

export const addCommentFoodData = async (commentData) => {
    try {
        const collectionRef = firestore().collection('FoodComments');
        await collectionRef.add(commentData);
        console.log('Đã thêm comment mới vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm comment mới vào Firestore:', error);
    }
}

export const addReplyFoodCommentData = async (commentData) => {
    try {
        const collectionRef = firestore().collection('ReplyFoodComments');
        await collectionRef.add(commentData);
        console.log('Đã thêm comment mới vào Firestore');
    } catch (error) {
        console.error('Lỗi khi thêm comment mới vào Firestore:', error);
    }
}