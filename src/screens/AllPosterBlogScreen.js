import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AllPosterBlog from '../components/AllPosterBlog';

const AllPosterBlogScreen = ({ navigation, route }) => {

    const { iduser } = route.params;

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FFFFFF', paddingBottom: 10, paddingTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        className="p-2 rounded-full ml-2 bg-white"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, paddingLeft: 20, color: '#4A4A4A', flex: 8 }}>Blog</Text>
                </View>
                <AllPosterBlog iduser={iduser} />
            </SafeAreaView>
        </View>
    )
}

export default AllPosterBlogScreen