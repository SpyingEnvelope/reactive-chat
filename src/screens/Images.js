import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions,
    Pressable,
    Image,
    Alert
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux';
import {setImagePath, setImageDone} from "../redux/actions";

export default function Images({navigation}) {
    const dispatch = useDispatch()

    const [imageSelected, setImageSelected] = useState('')

    const drawableImages = [
        'actionsimg',
        'allimg',
        'animalsimg',
        'describeimg',
        'differentimg',
        'doimg',
        'drinkimg',
        'eatimg',
        'finishedimg',
        'getimg',
        'goimg',
        'goodimg',
        'happyimg',
        'heimg',
        'helpimg',
        'hereimg',
        'iimg',
        'inimg',
        'itimg',
        'likeimg',
        'lookimg',
        'makeimg',
        'moreimg',
        'notimg',
        'objectsimg',
        'onimg',
        'openimg',
        'peopleimg',
        'placesimg',
        'putimg',
        'sadimg',
        'sameimg',
        'sheimg',
        'someimg',
        'stopimg',
        'thatimg',
        'timeimg',
        'turnimg',
        'upimg',
        'walkimg',
        'wantimg',
        'whatimg',
        'whenimg',
        'whereimg',
        'whoimg',
        'whyimg',
        'youimg'
    ]

    return (
        <View style={styles.main_cont}>
            <View style={styles.top}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.back}    
                >
                    <Text style={styles.back_text}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (imageSelected != '') {
                            dispatch(setImagePath(imageSelected));
                            dispatch(setImageDone(true))
                            navigation.goBack()
                        } else {
                            Alert.alert('None Selected', 'No image was selected.')
                        }
                        
                    }}
                    style={styles.submit}    
                >
                    <Text style={styles.back_text}>Submit</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                data={drawableImages}
                style={{backgroundColor: '#1b2127'}}
                renderItem={({item}) => {
                    return(
                        <TouchableOpacity
                            onPress={() => {
                                setImageSelected(item)
                            }} 
                            style={styles.touch_image}
                        >
                            {imageSelected == item ? 
                                <FontAwesome5 
                                    name={'check'}
                                    size={Dimensions.get('window').width / 15}
                                    style={styles.checkmark}
                                /> 
                                :
                                null         
                            }

                            <Image 
                                source={{uri: item}}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    main_cont: {
        flex: 1,
        backgroundColor: '#1b2127'
    },
    image: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').height / 7,
        resizeMode: 'contain'
    },
    touch_image: {
        flex: 1,
        marginBottom: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    top: {
        height: Dimensions.get('window').width / 23,
        backgroundColor: '#1b2127',
        flexDirection: 'row'
    },
    back_text: {
        fontSize: Dimensions.get('window').width / 40,
        color: 'white'
    },
    back: {
        position: 'absolute',
        left: '1%'
    },
    submit: {
        position: 'absolute',
        left: '91%'
    },
    checkmark: {
        position: 'absolute',
        right: '90%',
        top: '15%'
    }
})