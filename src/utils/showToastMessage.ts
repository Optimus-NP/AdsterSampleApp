import { ToastAndroid } from 'react-native';

export const showToastMessage = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );
};
