import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BlogComment from '../components/Comment';
import AddCommentBlog from '../components/AddComment';

const RecipeCommentScreen = ({ route }) => {

    const { item } = route.params;
    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white', }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2), marginLeft: wp(2) }}>
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#f64e32'} />
                    <Text style={{ fontSize: 28, marginLeft: 80, color: '#f64e32' }}>Bình Luận</Text>
                </TouchableOpacity>

                <View>
                    <BlogComment idblog={item.idblog} />
                </View>     

            </ScrollView> 
                <View>
                    <AddCommentBlog idblog={item.idblog}/>
                </View>
        </KeyboardAvoidingView>
    );
};

export default RecipeCommentScreen;
