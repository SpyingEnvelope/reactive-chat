import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions,
    Pressable,
    ScrollView,
    Image
} from 'react-native';
import Sound from "react-native-sound";
import SQLite from 'react-native-sqlite-storage';
import { useSelector, useDispatch } from 'react-redux';
import { addWords, removeWord, removeAllWords, setPageData, setPageName, setWidth} from "../redux/actions";
import initRowsAndTables from "../utils/initDB";
import { initFirstAAC } from "../utils/initDB";
import { dropTable } from "../utils/initDB";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const db = SQLite.openDatabase(
    {
        name:'AacDB',
        location: 'default'
    },
    () => {
        console.log('DB is open')
    },
    error => { console.log(error) }
)

export default function FirstAac({navigation}) {
    const { words, pageName, pageData, width } = useSelector(state => state.wordsReducer);
    const dispatch = useDispatch();
    const [page, setPage] = useState([])

    function getPageData(page) {
        try{
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM " + page,
                    [],
                    (tx, results) => {
                        console.log('found table ' + page)
                        dispatch(setPageData(results.rows.raw()))
                        dispatch(setPageName(page))
                    },
                    (tx, error) => {
                        console.log(error)
                        console.log(tx)
                    }
                )
            })
        } catch (e) {

        }
    }

    useEffect(() => {
        getPageData('firstAac');
        dispatch(setWidth(Dimensions.get('window').width))
        Dimensions.addEventListener('change', () => {
            dispatch(setWidth(Dimensions.get('window').width))
        })
    }, [])

    const playSound = (sound) => {
        Sound.setCategory('Playback')

        let soundToPlay = new Sound(sound, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            } else {
                soundToPlay.play((success) => {
                    if (success) {
                        console.log('Successfully played sound')
                        soundToPlay.release()
                    } else {
                        console.log('Failed to play sound due to decoding issues')
                        soundToPlay.release()
                    }
                })
            }

        })
    }

    const updateData = (row, update, updateValue, filter, filterValue) => {
        try {
            console.log('I am in try')
            db.transaction((tx) => {
                console.log('I am executing sql')
                tx.executeSql(
                    "UPDATE " + row + " SET " + update + ' = ' + updateValue + " WHERE " + filter + ' = ' + filterValue,
                    [],
                    (tx, results) => {
                        console.log(results)
                        console.log('log updated successfully')
                    }
                )
            })
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <View style={styles.body}>
            <View style={styles.top_rect}>            
                <FlatList 
                    data={words}
                    horizontal={true}
                    renderItem={({item}) => {
                        return (
                            <View>
                                <Image 
                                    source={require('../utils/images/like.png')}
                                />
                                <Text style={styles.top_text}> {item.text}</Text>

                            </View>
                        )
                    }}
                />
                <View style={styles.delete}>
                    <TouchableOpacity
                    onPress={() => {
                        console.log('delete is pressed')
                        dispatch(removeWord())
                    }}
                    onLongPress={() => dispatch(removeAllWords())}
                    >
                        <FontAwesome5 
                            name={'backspace'}
                            size={80}
                        />
                    </TouchableOpacity>
                </View>
            </View>
                <FlatList
                    data={pageData.slice(0,8)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'a') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/like.png')}
                                    style={styles.image}
                                    />
                                </Pressable>
                            )
                        }
                    }} 


                >
                </FlatList>

                <FlatList
                    data={pageData.slice(7, 16)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'b') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/go.png')}
                                    />
                                </Pressable>
                            )
                        }
                    }}
                >
                </FlatList>
                <FlatList
                    data={pageData.slice(14, 24)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'c') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/i.png')}
                                    />
                                </Pressable>
                            )
                        }
                    }}
                >
                </FlatList>
                <FlatList
                    data={pageData.slice(21, 28)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'd') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/want.png')}
                                    />
                                </Pressable>
                            )
                        }
                    }}
                >
                </FlatList>
                <FlatList
                    data={pageData.slice(28, 35)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'e') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/you.png')}
                                    />
                                </Pressable>
                            )
                        }
                    }}
                >
                </FlatList>
                <FlatList
                    data={pageData.slice(35, 42)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'f') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/like.png')}
                                    />
                                </Pressable>
                            )
                        }
                    }}
                >
                </FlatList>
                <FlatList
                    data={pageData.slice(42, 49)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (item.row == 'g') {
                            return(
                                <Pressable 
                                onPress={() => {
                                    playSound(item.sound)
                                    dispatch(addWords({text: item.text, image: item.image}))
                                }}
                                android_disableSound={true}
                                style={[
                                    {width: width / 7},
                                    styles.aac_list
                                    ]}>
                                    <Text style={styles.core_text}>
                                        {item.text}
                                    </Text>
                                    <Image 
                                    source={require('../utils/images/go.png')}
                                    />
                                </Pressable>
                            )
                        }
                    }}
                >
                </FlatList>

        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    top_rect: {
        width: '100%',
        height: '20%',
        borderWidth: 1,
        borderColor: '#000000',
        textAlign: 'center',
        backgroundColor: 'white'
    },
    text: {
        fontSize: 50,
        color: '#000000'
    },
    aac_list: {
        borderWidth: 1,
        borderColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    delete: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    top_text: {
        fontSize: 50,
        color: '#000000'
    },
    core_text: {
        fontSize: 20,
        color: '#000000'
    },
})