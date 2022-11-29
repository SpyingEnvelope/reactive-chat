import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions,
    Pressable,
    Image,
    LogBox
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useSelector, useDispatch } from 'react-redux';
import { addWords, removeWord, removeAllWords, setPageData, setPageName, setEdit, setTalking} from "../redux/actions";
import initRowsAndTables from "../utils/initDB";
import { initFirstAAC } from "../utils/initDB";
import { dropTable } from "../utils/initDB";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';

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


    LogBox.ignoreLogs(['new NativeEventEmitter'])

    const { words, pageName, pageData, talking, edit} = useSelector(state => state.wordsReducer);
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
                        return false
                    },
                    (tx, error) => {
                        console.log(tx)
                        return true
                    }
                )
            })
        } catch (e) {

        }
    }

    const speakFunction = (text) => {
        Tts.speak(text, {
            androidParams: {
                KEY_PARAM_PAN: -1,
                KEY_PARAM_VOLUME: 1.0,
                KEY_PARAM_STREAM: 'STREAM_MUSIC',
              }
        })
    }

    useEffect(() => {
        Tts.addEventListener('tts-start', () => dispatch(setTalking(true)))
        Tts.addEventListener('tts-finish', () => dispatch(setTalking(false)))
        Tts.setDucking(true)
    }, [])

    const readAllWords = () => {
        if (talking == true) {
            return;
        }
        
        for (let i = 0; i < words.length; i++) {
            Tts.speak(words[i].text, {
                androidParams: {
                    KEY_PARAM_PAN: -1,
                    KEY_PARAM_VOLUME: 1.0,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC',
                  }
            })
        }
    }

    

    const updateData = (page, update, updateValue, filter, filterValue) => {
        try {
            console.log('I am in try')
            db.transaction((tx) => {
                console.log('I am executing sql')
                tx.executeSql(
                    "UPDATE " + page + " SET " + update + ' = ' + updateValue + " WHERE " + filter + ' = ' + filterValue,
                    [],
                    (tx, results) => {
                        console.log(results)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            })
        } catch (e) {
            console.log(e)
        }
    }

    const topFlatList = useRef(null)
    const screenWidth = Dimensions.get('window').width

    return(
        <View style={styles.body}>
            <View style={styles.top_rect}>            
                <FlatList 
                    data={words}
                    horizontal={true}
                    ref={topFlatList}
                    onContentSizeChange={() => topFlatList.current.scrollToEnd()}
                    renderItem={({item}) => {
                        return (
                            <View>
                                <Pressable onPress={readAllWords}>
                                    <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image_big}
                                    />
                                    <Text 
                                    style={styles.top_text}> {item.text}</Text>
                                </Pressable>
                            </View>
                        )
                    }}
                />
                <View style={styles.delete}>
                    <TouchableOpacity
                    onPress={() => {
                        Tts.stop()
                        dispatch(removeWord())
                    }}
                    onLongPress={() => {
                        Tts.stop()
                        dispatch(removeAllWords())       
                    }}
                    >
                        <FontAwesome5 
                            name={'backspace'}
                            size={80}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.gray_rect}>

                    {edit ? 
                    <View style={styles.gray_rect_dimensions}>
                        <Pressable>
                            <FontAwesome5 
                                name={'home'}
                                size={screenWidth / 60}
                                color={'#BDBDBD'}
                                style={styles.back_button}
                            />
                        </Pressable>
                        <Pressable>
                            <FontAwesome5 
                                name={'arrow-left'}
                                size={screenWidth / 60}
                                color={'#BDBDBD'}
                            />
                        </Pressable>
                        <Pressable 
                            onPress={() => {
                                dispatch(setEdit(false))
                            }}
                        >
                            <FontAwesome5 
                                name={'check'}
                                size={screenWidth / 60}
                                color={'#fff'}
                                style={styles.edit_button}
                            />
                        </Pressable>
                    </View>
                    :                     
                    <View style={styles.gray_rect_dimensions}>
                        <Pressable>
                            <FontAwesome5 
                                name={'home'}
                                size={screenWidth / 60}
                                color={'#fff'}
                                style={styles.back_button}
                            />
                        </Pressable>
                        <Pressable>
                            <FontAwesome5 
                                name={'arrow-left'}
                                size={screenWidth / 60}
                                color={'#fff'}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                dispatch(setEdit(true))
                            }}
                        >
                            <FontAwesome5 
                                name={'edit'}
                                size={screenWidth / 60}
                                color={'#fff'}
                                style={styles.edit_button}
                            />
                        </Pressable>
                    </View>
                    }

            </View>
                <FlatList
                    data={pageData.slice(0,8)}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'white'}}
                    scrollEnabled={false}
                    renderItem={ ({item}) => {
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
                        if (edit == false) {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                        speakFunction(item.text)
                                        dispatch(addWords({text: item.text, image: item.image}))
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}
                                        />
                                )
                            }
                        } else {
                            if (item.visibility == 1) {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 0, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            } else {
                                return(
                                    <Pressable 
                                    onPress={() => {
                                            updateData(item.page, 'visibility', 1, 'ID', item.ID)
                                            getPageData('firstAac');                     
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.text + 'img'}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={Dimensions.get('window').width / 40}
                                                color={item.visibility ? '#558B2F' : '#000'}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }  
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
        width: Dimensions.get('window').width / 7,
        height: Dimensions.get('window').height / 9,
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
        fontSize: Dimensions.get('window').width / 40,
        color: '#000000'
    },
    core_text: {
        fontSize: Dimensions.get('window').width / 80,
        color: '#000000'
    },
    image :{
        width: Dimensions.get('window').width / 20,
        height: Dimensions.get('window').width / 20,
        resizeMode: 'contain'
    },
    image_big :{
        width: Dimensions.get('window').width / 16,
        height: Dimensions.get('window').width / 16,
        resizeMode: 'contain'
    },
    gray_rect: {
        width: '100%',
        backgroundColor: '#1b2127',
        height: '5%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    gray_rect_text: {
        color: '#fff'
    },
    back_button: {
        position: 'relative',
        left: Dimensions.get('window').width / 2.05,
    },
    gray_rect_dimensions: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    edit_button: {
        position: 'relative',
        left: Dimensions.get('window').width / 1.1,
    },
    edit_check: {
        position: 'absolute',
        left: '70%',
        bottom: '40%'
    }
})