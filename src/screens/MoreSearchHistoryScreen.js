import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MoreSearchHistory from '../components/MoreSearchHistory';
import { Menu } from 'react-native-paper';
import DialogPopup from '../components/DialogPopup';

const MoreSearchHistoryScreen = ({ navigation }) => {

    const [visible, setVisible] = useState(false);
    const [visibleDialog, setVisibleDialog] = useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const openDialogPopup = () => {
        setVisibleDialog(true);
    };

    return (
        <View className="flex-1" style={{ backgroundColor: '#F8F6F2' }}>
            <SafeAreaView>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2, backgroundColor: '#FCFCFB', paddingBottom: 10, paddingTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        className="p-2 rounded-full ml-2"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={hp(3.5)} strokeWidth={4.5} color={'#4A4A4A'} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, marginLeft: 10, color: '#4A4A4A', flex: 8 }}>Tìm kiếm gần đây</Text>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <TouchableOpacity style={{ flex: 1, marginTop: 10 }} onPress={openMenu}>
                                <MaterialCommunityIcons name='dots-vertical' size={30} />
                            </TouchableOpacity>
                        }
                        contentStyle={{ backgroundColor: '#ffffff' }}
                    >
                        <Menu.Item onPress={() => {
                            openDialogPopup()
                            closeMenu()
                        }} title="Xóa toàn bộ lịch sử tìm kiếm" />
                    </Menu>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 10,
                    }} className="space-y-1 pt-3"
                >
                    <View>
                        <SafeAreaView>
                            <ScrollView showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: 50,
                                }} className="space-y-6"
                            >
                                <MoreSearchHistory />
                            </ScrollView>
                        </SafeAreaView>
                    </View>

                </ScrollView>
            </SafeAreaView>
            <DialogPopup visible={visibleDialog} hideDialog={() => setVisibleDialog(false)} screen="SearchHistory"/>
        </View>
    )
}

export default MoreSearchHistoryScreen