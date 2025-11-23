import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  // return await AsyncStorage.getItem(TOKEN_KEY);
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
};

export const clearToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
