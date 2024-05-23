import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomDrawer from '../components/CustomDrawer';
import Home from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import UserDetail from '../screens/UserDetail';
import CreateUpdateRecipe from '../screens/CreateUpdateRecipe';
import Login from '../screens/Login';
import Welcome from '../screens/WelcomeScreen';
import Signup from '../screens/Signup';
import MyPostedScreen from '../screens/MyPostedScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import LatestRecipesScreen from '../screens/LatestRecipesScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';
import CreateUpdateBlog from '../screens/CreateUpdateBlog';
import BlogScreen from '../screens/BlogScreen';
import BlogCommentScreen from '../screens/BlogCommentScreen';
import ReplyBlogCommentScreen from '../screens/ReplyBlogCommentScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import MoreSearchHistoryScreen from '../screens/MoreSearchHistoryScreen';
import MoreUserFoodHistoryScreen from '../screens/MoreUserFoodHistoryScreen';
import PosterDetailScreen from '../screens/PosterDetailScreen';
import AllPosterFoodScreen from '../screens/AllPosterFoodScreen';
import AllPosterBlogScreen from '../screens/AllPosterBlogScreen';

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen name="UserDetail" component={UserDetail} />
      <Stack.Screen name="CreateUpdateRecipe" component={CreateUpdateRecipe} />
      <Stack.Screen name="CreateUpdateBlog" component={CreateUpdateBlog} />
      <Stack.Screen name="BlogComment" component={BlogCommentScreen} />
      <Stack.Screen name="ReplyBlog" component={ReplyBlogCommentScreen} />
      <Stack.Screen name="MoreSearchHistory" component={MoreSearchHistoryScreen} />
      <Stack.Screen name="MoreUserFoodHistory" component={MoreUserFoodHistoryScreen} />
      <Stack.Screen name="PosterDetail" component={PosterDetailScreen} />
      <Stack.Screen name="AllPosterFood" component={AllPosterFoodScreen} />
      <Stack.Screen name="AllPosterBlog" component={AllPosterBlogScreen} />
      <Stack.Screen name="LoginUser" component={LoginNav} />
    </Stack.Navigator>
  )
}

const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="HomeLogin" component={DrawerStack} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const DrawerStack = () => (

  <Drawer.Navigator
    drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerLabelStyle: { marginLeft: -25, fontSize: 15 },
      drawerActiveBackgroundColor: '#f64e32',
      drawerActiveTintColor: '#fff',
      drawerInactiveTintColor: '#333',
    }}
  >
    <Drawer.Screen name="HomeDrawer" component={StackNav} options={{
      drawerLabel: "Home",
      drawerIcon: ({ color }) => (
        <Ionicons name='home-outline' size={22} color={color} />
      ),
    }} />
    <Drawer.Screen name="Latest" component={LatestRecipesScreen} options={{
      drawerIcon: ({ color }) => (
        <Ionicons name='flame-outline' size={22} color={color} />
      ),
    }} />
    <Drawer.Screen name="Blog" component={BlogScreen} options={{
      drawerIcon: ({ color }) => (
        <Ionicons name='earth-outline' size={22} color={color} />
      )
    }} />
    <Drawer.Screen name="Favorite" component={FavoriteScreen} options={{
      drawerIcon: ({ color }) => (
        <Ionicons name='heart-outline' size={22} color={color} />
      )
    }} />
    <Drawer.Screen name="Posted" component={MyPostedScreen} options={{
      drawerIcon: ({ color }) => (
        <Ionicons name='timer-outline' size={22} color={color} />
      )
    }} />
  </Drawer.Navigator>
);

export { DrawerStack, LoginNav };