import React from 'react';
import { View, StyleSheet } from 'react-native';
import EditProfileForm from '../components/EditUserDetails';

export default function EditProfileScreen() {
    return (
        <View style={styles.container}>
            <EditProfileForm onClose={undefined as any} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
