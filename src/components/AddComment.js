import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { addCommentData, getBlogCommentCount, getReplyBlogCommentCount, updateNumComment } from '../services/BlogDataServices';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { addCommentFoodData } from '../services/FoodDataServices';

const AddComment = ({idblog, idfood}) => {

    const uid = useSelector(state => state.userData.uid);
    const [commentText, setCommentText] = useState('');

    const addComment = async () => {
        if(idblog)
        {
            const NewComment = {
                id_blog: idblog,
                id_user: uid,
                comment_content: commentText,
                date_comment: firestore.Timestamp.now(),
            }
            await addCommentData(NewComment);
            console.log("Thêm comment thành công");
        }
        else
        {
            const NewComment = {
                id_food: idfood,
                id_user: uid,
                comment_content: commentText,
                date_comment: firestore.Timestamp.now(),
            }
            await addCommentFoodData(NewComment);
            console.log("Thêm comment thành công");
        }
    }

    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
                style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }}
                placeholder="Nhập bình luận..."
                value={commentText}
                onChangeText={text => setCommentText(text)}
            />
            <TouchableOpacity
                style={{ backgroundColor: '#f64e32', padding: 10, borderRadius: 5, marginLeft: 10, alignItems: 'center' }}
                onPress={() => {
                    addComment();
                }}
            >
                <Text style={{ color: 'white', fontSize: hp(2) }}>OK</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddComment