import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    LoadingView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setImagePath } from "../redux/actions";
import { Camera, useCameraDevices } from "react-native-vision-camera";

export default function CameraPage({ navigation }) {
    const { imgPath } = useSelector(state => state.wordsReducer);
    const dispatch = useDispatch()

    const newCameraPermission = Camera.requestCameraPermission()

    const devices = useCameraDevices()
    const device = devices.back()

    if (device == null) return <LoadingView />
    return (
        <Camera 
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
        />
        // <View style={styles.main_view}>
        //     <Text style={styles.text}>
        //         You are in the camera page
        //     </Text>
        //     <TouchableOpacity
        //         onPress={() => {
        //             dispatch(setImagePath('right'))
        //             navigation.goBack()
        //         }}
        //         style={styles.return_button}
        //     >
        //         <Text style={styles.text}>
        //             Go back to the previous page
        //         </Text>
        //     </TouchableOpacity>
        // </View>
    )
}

const styles = StyleSheet.create({
    main_view: {
        flex: 1
    },
    text: {
        fontSize: 50,
        color: '#000'
    },
    return_button: {
        width: 500,
        height: 100,
        backgroundColor: '#ff3',
    }
})