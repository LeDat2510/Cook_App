import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux';
//import { AppStack, LoginStack } from './authNavigation';
import { DrawerStack, LoginNav } from './authNavigation';

export default function rootNavigation() {

    const uid = useSelector(state => state.userData.uid)

    return (
        <NavigationContainer>
            {
                uid ? <DrawerStack /> : <LoginNav />
            }
        </NavigationContainer>
    )
}


