import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Comment from '../components/Comment';
import AddComment from '../components/AddComment';

const CommentScreen = ({ route }) => {

    const { item } = route.params;
    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FFFFFF', paddingBottom: 10, paddingTop: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    className="p-2 rounded-full ml-2 bg-white"
                >
                    <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, marginLeft: 10, color: '#4A4A4A', flex: 1 }}>Bình luận</Text>
            </View>
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white', }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <View>
                    <Comment idblog={item.idblog} idfood={item.idmonan} />
                </View>

            </ScrollView>
            <View>
                <AddComment idblog={item.idblog} idfood={item.idmonan} />
            </View>
        </KeyboardAvoidingView>
    );
};

export default CommentScreen;
