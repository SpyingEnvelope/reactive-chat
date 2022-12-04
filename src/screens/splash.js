import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    LogBox
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setPageData, setPageName, setPageLoading, setGoHome} from "../redux/actions";
import { initFirstAAC } from "../utils/initDB";
import SQLite from 'react-native-sqlite-storage';

export default function Splash({ navigation }) {
    LogBox.ignoreLogs(['new NativeEventEmitter'])

    const { words, pageName, pageData, talking, edit, pageLoading} = useSelector(state => state.wordsReducer);
    const dispatch = useDispatch();
    const [displayText, setDisplayText] = useState('')
    const [loadCounter, setLoadCounter] = useState('0')

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

    function getPageData(page) {
        try{
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM " + page,
                    [],
                    (tx, results) => {
                        setDisplayText('Database Found. Loading Data.')
                        dispatch(setPageData(results.rows.raw()))
                        dispatch(setPageName(page))
                        dispatch(setGoHome('Main'))
                        dispatch(setPageLoading(false))
                        setDisplayText('Finished Loading Database')
                    },
                    (tx, error) => {
                        console.log(tx)
                        setDisplayText('Database Not Found. Initiating First Database')      
                        dispatch(setPageLoading('not found'))
                    }
                )
            })
        } catch (e) {

        }
    }

    useEffect(() => {
        setDisplayText('Loading Database')
        getPageData('Main')
    }, [])

    useEffect(() => {
        if (pageLoading == 'not found') {
            if (loadCounter == '1') {
                dispatch(setPageLoading('FirstAAC failed'))
            } else if (loadCounter == '0') {
                initFirstAAC()
                getPageData('Main')
                setLoadCounter('1')
            } 

        }
        if (pageLoading == 'FirstAAC initiated') {
            setDisplayText('First Database Initiated Successfully!')
            setTimeout(() => {
                navigation.replace('FirstAac')
            }, 2000)
        }
        if (pageLoading == 'FirstAAC failed') {
            setDisplayText('Failed to initiate database. Please try again or reintall the program.')
        }
        if (pageLoading == false) {
            setTimeout(() => {
                navigation.replace('FirstAac')
            }, 2000)
        }
    }, [pageLoading])

    return(
        <View style={styles.body}>
            <Image 
                source={require('../../assets/images/reactive-logo.png')}
                style={styles.logo}
            />
            <Text style={styles.text}>{displayText}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1b2127'
    },
    text: {
        fontSize: Dimensions.get('window').width / 50,
        color: '#fff'
    },
    logo : {
        width: Dimensions.get('window').width / 1,
        height: Dimensions.get('window').width / 2,
        resizeMode: 'contain'
    }
})