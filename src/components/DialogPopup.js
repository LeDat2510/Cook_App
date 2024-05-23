import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Dialog, Portal } from 'react-native-paper'
import { deleteAllSearchHistoryData, deleteAllUserFoodHistoryData } from '../services/UserDataServices'

const DialogPopup = ({ visible, hideDialog, screen }) => {

    const [visibleDialog, setVisibleDialog] = useState(false);

    useEffect(() => {
        setVisibleDialog(visible);
    }, [visible]);

  
    const handleDelete = async () => {
        if(screen === 'SearchHistory') 
        {
            await deleteAllSearchHistoryData();
            hideDialog();
        }
        else if(screen === 'UserFoodHistory')
        {
            await deleteAllUserFoodHistoryData();
            hideDialog();
        }
    }

    return (
        <Portal>
            <Dialog visible={visibleDialog} onDismiss={hideDialog} style={{backgroundColor: '#ffffff'}}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={{ textAlign: 'center' }}>
                    {
                        screen === 'SearchHistory' ? (
                            'Xóa lịch sử tìm kiếm ?'
                        ) : (
                            'Xóa lịch sử các món đã xem ?'
                        )
                    }
                </Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        {
                            screen === 'SearchHistory' ? (
                                'Lịch sử tìm kiếm sẽ không thể hoàn tác lại sau khi xóa'
                            ) : (
                                'Lịch sử các món ăn sẽ không thể hoàn tác và có thể mất vài phút để xóa các món này'
                            )
                        }
                        
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Hủy</Button>
                    <Button onPress={handleDelete}>Xóa</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default DialogPopup