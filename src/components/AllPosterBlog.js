import { View, Text, Pressable, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import MansonryList from '@react-native-seoul/masonry-list'
import { getAllPosterBlogData, getPosterBlogCount} from '../services/BlogDataServices';

const AllPosterBlog = ({ iduser }) => {

    const navigation = useNavigation();

    const [PosterBlogData, setPosterBlogData] = useState([]);
    const [filterdData, setFilterdData] = useState([]);
    const [onPressSearch, setOnPressSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [posterBlogCount, setPosterBlogCount] = useState(0);

    useEffect(() => {
        const getBlogData = getAllPosterBlogData(iduser, (data) => {
            setPosterBlogData(data);
            setFilterdData(data)
        });
        const getBlogCount = getPosterBlogCount(iduser, (data) => {
            setPosterBlogCount(data);
        })
        return () => {
            getBlogData();
            getBlogCount();
        };
    }, [iduser]);

    useEffect(() => {
        const filterData = () => {
            const newData = PosterBlogData.filter((item) => {
                const itemData = item.title_blog ? item.title_blog.toUpperCase() : ''.toUpperCase();
                const inputTextData = searchValue.toUpperCase();
                return itemData.includes(inputTextData);
            });
            setFilterdData(newData);
        };
        filterData();
    }, [PosterBlogData, searchValue])

    return (
        <View className="bg-[#F8F6F2] py-5 mb-8">
            {
                onPressSearch == true ? (
                    <View className="flex-row items-center justify-between px-5 py-2">
                        <TextInput
                            placeholder='Tìm blog'
                            placeholderTextColor={"gray"}
                            className="text-base ml-1 bg-[#FCFCFB] rounded-lg border border-black pl-5 py-2"
                            style={{
                                flex: 6,
                            }}
                            onChangeText={(text) => setSearchValue(text)}
                            value={searchValue}
                        />
                        <TouchableOpacity
                            className="flex-1 items-center justify-center ml-1 h-12"
                            onPress={() => {
                                setOnPressSearch(!onPressSearch);
                                setSearchValue('');
                            }}>
                            <View>
                                <Text>
                                    Hủy
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between px-5 py-2">
                        <Text className="text-lg font-semibold text-[#4A4A4A]">
                            <Icon source={"card-text"} size={24} color='#4A4A4A' /> {posterBlogCount} blog
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setOnPressSearch(!onPressSearch);
                            }}>
                            <Icon source={"magnify"} size={22} />
                        </TouchableOpacity>
                    </View>
                )
            }
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 10,
                }} className="space-y-1 pt-3"
            >
                <View>
                    <SafeAreaView>
                        <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 240,
                            }} className="space-y-6"
                        >
                            <MansonryList
                                data={filterdData}
                                keyExtractor={(item) => item.idmonan}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, i }) => <BlogCard item={item} index={i} navigation={navigation} />}
                                onEndReachedThreshold={0.1}
                            />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ScrollView>
        </View>
    );
}

const BlogCard = ({ item, navigation }) => {

    return (
        <Pressable onPress={() => navigation.navigate('RecipeDetail', { idmonan: item.idmonan, item })}>
            <View className="m-3 rounded-lg">
                <View className="flex-row">
                    <Image
                        source={{
                            uri: item.blog_image
                        }}
                        className="rounded-lg w-full h-40 flex-1">
                    </Image>
                </View>
                <View className="max-w-xs">
                    <Text className="text-black mt-1 pl-2" numberOfLines={1}>{item.title_blog}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default AllPosterBlog
