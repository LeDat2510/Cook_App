import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { addReplyBlogCommentData } from '../services/BlogDataServices';
import firestore from '@react-native-firebase/firestore'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { addReplyFoodCommentData } from '../services/FoodDataServices';

const AddReplyComment = ({ idcomment, idblog, idfood, shouldFocusTextInput, setShouldFocusTextInput}) => {

    const uid = useSelector(state => state.userData.uid);
    const [commentText, setCommentText] = useState('');

    const addReplyComment = async () => {
        if(idblog)
        {
            const NewReplyComment = {
                id_comment: idcomment,
                id_blog: idblog,
                id_user: uid,
                comment_content: commentText,
                date_comment: firestore.Timestamp.now()
            }
            await addReplyBlogCommentData(NewReplyComment);
            console.log("Thêm comment thành công");
        }
        else
        {
            const NewReplyComment = {
                id_comment: idcomment,
                id_food: idfood,
                id_user: uid,
                comment_content: commentText,
                date_comment: firestore.Timestamp.now()
            }
            await addReplyFoodCommentData(NewReplyComment);
            console.log("Thêm comment thành công");
        }
    }

    const textInputRef = useRef(null);

    useEffect(() => {
        if (shouldFocusTextInput) {
          textInputRef.current.focus();
          setShouldFocusTextInput(false); 
        }
    }, [shouldFocusTextInput]);

    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
                style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }}
                placeholder="Nhập bình luận..."
                ref={textInputRef}
                value={commentText}
                onChangeText={setCommentText}
            />
            <TouchableOpacity
                style={{ backgroundColor: '#f64e32', padding: 10, borderRadius: 5, marginLeft: 10, alignItems: 'center' }}
                onPress={() => {
                    addReplyComment();
                }}
            >
                <Text style={{ color: 'white', fontSize: hp(2) }}>OK</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddReplyComment