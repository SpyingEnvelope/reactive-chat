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
    LogBox,
    Modal,
    TextInput,
    Switch,
    ScrollView
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs'
import { useSelector, useDispatch } from 'react-redux';
import { addWords, removeWord, removeAllWords, setPageData, setPageName, setEdit, setTalking, setImagePath, setImageDone, setScreenHeight, setScreenWidth, addPageName, removePageName, setGoHome} from "../redux/actions";
import initRowsAndTables from "../utils/initDB";
import { initFirstAAC } from "../utils/initDB";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';
import { updateData, updateMultiColumns, initTable, dropTable, initAddItemsToTable } from "../utils/sql_fucntions";

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

    const { words, pageName, pageData, talking, edit, imgPath, imageDone, screenWidth, screenHeight, pageHist} = useSelector(state => state.wordsReducer);
    const dispatch = useDispatch();

    
    const [buttonModal, setButtonModal] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [buttonImg, setButtonImg] = useState('');
    const [buttonColour, setButtonColour] = useState('');
    const [buttonId, setButtonId] = useState(0);
    const [buttonType, setButtonType] = useState('')
    const [initType, setInitType] = useState('')
    const [initText, setInitText] = useState('')
    const [page, setPage] = useState('');

    const [loadingTable, setLoadingTable] = useState(false)

    const [tableDataCounter, setTableDataCounter] = useState(true);
    const [deletePage, setDeletePage] = useState(false)

    function getPageData(page) {
        const newPage = page.replace(/\s/g, '')
        try{
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM " + newPage,
                    [],
                    (tx, results) => {
                        console.log('found table ' + newPage)
                        setTableDataCounter(true)
                        dispatch(setPageData(results.rows.raw()))
                        dispatch(setPageName(newPage))
                        if (newPage != pageHist[pageHist.length - 2]) {
                            dispatch(addPageName(newPage))
                        }
                        return false
                    },
                    (tx, error) => {
                        console.log(tx)
                        if (tx.code == 0 && tableDataCounter) {
                            console.log('initiating table ' + newPage)
                            setLoadingTable(true)
                            initTable(newPage)
                            initAddItemsToTable(newPage)
                            setLoadingTable(false)
                            getPageData(newPage)
                            setTableDataCounter(false)
                        } else {
                            setTableDataCounter(true)
                        }
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

    const getFileContent = async (path) => {
        const reader = await RNFS.readDir(path)
        console.log(reader)
    }

    useEffect(() => {
        Tts.addEventListener('tts-start', () => dispatch(setTalking(true)))
        Tts.addEventListener('tts-finish', () => dispatch(setTalking(false)))
        Tts.setDucking(true)
        dispatch(setScreenWidth(Dimensions.get('window').width))
        dispatch(setScreenHeight(Dimensions.get('window').height))
    }, [])

    useEffect(() => {
        if (imageDone) {
            setButtonImg(imgPath)
            dispatch(setImageDone(false))
            setButtonModal(true)
        }    
    }, [imageDone])

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

    const topFlatList = useRef(null)

    return(
        <View style={styles.body}>
            <Modal
                visible={loadingTable}
                transparent
                animationType='fade'
            >
                <View style={styles.centered_view}>

                </View>
            </Modal>
            <Modal
                visible={buttonModal}
                transparent
                onRequestClose={() => setButtonModal(false)}
                animationType='slide'
                hardwareAccelerated

            >
                <View style={styles.centered_view}>
                        <Text style={styles.modal_text}>Text to display</Text>  
                        {initType == 'page' ? 
                        <Text style={styles.modal_warning_text}>Note! Changing page name will delete page data</Text>
                        : null}
                        <TextInput 
                            style={styles.modal_input}
                            value={buttonText}
                            placeholder='Text for button'
                            onChangeText={(value) => setButtonText(value)}
                        >
                        </TextInput>
                        <Text style={styles.modal_text}>Is this a page?</Text>
                        <Switch 
                        trackColor={{false: "#767577", true: "#81b0ff"}}
                        value={buttonType == 'page' ? true : false}
                        onValueChange={() => {
                            if (buttonType == 'page') {
                                setButtonType('text')
                            } else {
                                setButtonType('page')
                            }
                        }}
                        />
                        {buttonType == 'page' ? null :
                            initType == 'page' ? 
                                <View>
                                    <Text style={styles.modal_text}>Do you want to delete page data?</Text>
                                    <Switch 
                                        trackColor={{false: "#767577", true: "#81b0ff"}}
                                        value={deletePage}
                                        onValueChange={() => setDeletePage(!deletePage)}
                                    />
                                </View>
                            : null}
                            

                    <Text style={[
                        {marginBottom: 10},
                        styles.modal_text
                        ]}>Image</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setButtonModal(false)
                            navigation.navigate('Images')
                        }}
                        style={styles.modal_image_button}
                    >
                        <Image 
                            source={{uri: buttonImg}}
                            style={styles.modal_image}
                        />
                    </TouchableOpacity>
                    <Text style={styles.modal_text}>Background Colour</Text>  
                    <View style={styles.color_bar}>
                        <TouchableOpacity
                            style={styles.color_white}
                            onPress={() => setButtonColour('white')}
                        >
                            {
                                buttonColour == 'white' &&
                                    <FontAwesome5 
                                        name={'check'}
                                        size={screenWidth / 40}
                                        color={'#000000'}
                                    />
                            }

                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.color_red}
                            onPress={() => setButtonColour('#f797ac')}
                        >
                            {
                                buttonColour == '#f797ac' &&
                                    <FontAwesome5 
                                        name={'check'}
                                        size={screenWidth / 40}
                                        color={'#000000'}
                                    />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.color_blue}
                            onPress={() => setButtonColour('#a3acf7')}
                        >
                            {
                                buttonColour == '#a3acf7' &&
                                    <FontAwesome5 
                                        name={'check'}
                                        size={screenWidth / 40}
                                        color={'#000000'}
                                    />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.color_yellow}
                            onPress={() => setButtonColour('#f0f7a3')}
                        >
                            {
                                buttonColour == '#f0f7a3' &&
                                    <FontAwesome5 
                                        name={'check'}
                                        size={screenWidth / 40}
                                        color={'#000000'}
                                    />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.color_bar}>
                        <TouchableOpacity 
                            onPress={() => setButtonModal(false)}
                            style={styles.modal_cancel}
                        >
                            <FontAwesome5 
                                name={'times'}
                                color={'#f24e79'}
                                size={screenWidth / 20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {
                                if (deletePage) {
                                    dropTable(buttonText)
                                    setDeletePage(false)
                                }
                                updateMultiColumns(page, buttonText, buttonColour, buttonImg, buttonType, buttonId)
                                getPageData(pageName)
                                setButtonModal(false)
                            }}
                            style={styles.modal_submit}
                        >
                            <FontAwesome5 
                                name={'check'}
                                color={'#77f777'}
                                size={screenWidth / 20}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
                                        source={{uri: item.image}}
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
                        <Pressable
                            onPress={() => console.log(pageHist)}
                        >
                            <FontAwesome5 
                                name={'home'}
                                size={screenWidth / 60}
                                color={'#fff'}
                                style={styles.back_button}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                console.log(pageHist)
                                if (pageHist.length == 1) {
                                    dispatch(setGoHome('Main'))
                                    getPageData('Main')
                                } else {
                                    dispatch(removePageName('Main'))
                                    getPageData(pageHist[pageHist.length - 2])
                                }
                            }}
                        >
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
                                        if (item.type == 'page') {
                                            getPageData(item.text)
                                        }
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>
                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
                                            getPageData(pageName);                     
                                    }}
                                    onLongPress={() => {
                                        setButtonText(item.text)
                                        setInitText(item.text)
                                        setButtonImg(item.image)
                                        setButtonId(item.ID)
                                        setButtonColour(item.colour)
                                        setPage(item.page)
                                        setButtonType(item.type)
                                        setInitType(item.type)
                                        setButtonModal(true)
                                    }}
                                    android_disableSound={true}
                                    style={[
                                        {backgroundColor: item.colour},
                                        {width: screenWidth / 7},
                                        styles.aac_list
                                        ]}>

                                        <Text style={styles.core_text}>
                                            {item.text}
                                        </Text>
                                        <Image 
                                        source={{uri: item.image}}
                                        style={styles.image}
                                        />
                                        <View style={styles.edit_check}>
                                            <FontAwesome5 
                                                name={'check'}
                                                size={screenWidth / 40}
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
        height: Dimensions.get('window').height / 8,
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
    },
    centered_view: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(27,33,39,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    modal_text: {
        color: '#fff',
        fontSize: Dimensions.get('window').width / 60,
    },
    modal_input: {
        width: Dimensions.get('window').width / 4,
        backgroundColor: '#fff',
        color: '#000000',
        justifyContent: 'center',
        textAlign: 'center',
        borderColor: '#000000',
        borderRadius: 5,
        margin: 10,
    },
    modal_image :{
        width: Dimensions.get('window').width / 10,
        height: Dimensions.get('window').width / 10,
        resizeMode: 'contain',
        margin: Dimensions.get('window').height / 20
    },
    color_white: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    color_red: {
        flex: 1,
        backgroundColor: '#f797ac',
        justifyContent: 'center',
        alignItems: 'center'
    },
    color_blue: {
        flex: 1,
        backgroundColor: '#a3acf7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    color_yellow: {
        flex: 1,
        backgroundColor: '#f0f7a3',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    color_bar: {
        flexDirection: 'row',
        height: Dimensions.get('window').height / 14,
        width: Dimensions.get('window').width / 2,
        marginTop: Dimensions.get('window').height / 50
    },
    modal_cancel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal_submit: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    change_image: {
        color: '#fff',
        fontSize: Dimensions.get('window').width / 50,
        marginBottom: 10
    },
    modal_image_button: {
        width: Dimensions.get('window').width / 5,
        height: Dimensions.get('window').height / 3.5,
        backgroundColor: '#1b2127',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    top_modal_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    page_question: {
        flexDirection: 'row',
        position: 'relative',
        left: '10%',
        alignItems: 'center'
    },
    text_question: {
        flexDirection: 'row',
        position: 'relative',
        right: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal_warning_text: {
        fontSize: Dimensions.get('window').width / 80,
        color: '#fa5c7c'
    }
})