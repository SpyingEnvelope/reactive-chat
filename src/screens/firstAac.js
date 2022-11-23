import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions
} from 'react-native';
import Sound from "react-native-sound";

const windowWidth = Dimensions.get('window').width

export default function FirstAac({navigation}) {

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

    const aacList = [
        {
            'image': '',
            'sound': 'open.mp3',
            'text': 'Open'
        },
        {
            'image': '',
            'sound': 'close.mp3',
            'text': 'Close'
        },
        {
            'image': '',
            'sound': 'go.mp3',
            'text': 'Go'
        },
        {
            'image': '',
            'sound': 'happy.mp3',
            'text': 'Happy'
        },
        {
            'image': '',
            'sound': 'grab.mp3',
            'text': 'Grab'
        },
        {
            'image': '',
            'sound': 'chase.mp3',
            'text': 'Chase'
        },
        {
            'image': '',
            'sound': 'dump.mp3',
            'text': 'Dump'
        }
    ]

    return(
        <View style={styles.body}>
            <View style={styles.top_rect}>
                <Text>
                    This is the top view
                </Text>
            </View>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}>
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
                >
                </FlatList>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}
                                >
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
                >
                </FlatList>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}
                                >
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
                >
                </FlatList>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}
                                >
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
                >
                </FlatList>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}
                                >
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
                >
                </FlatList>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}
                                >
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
                >
                </FlatList>
                <FlatList
                    data={aacList}
                    horizontal={true}
                    contentContainerStyle={{flex: 1, alignItems: "stretch"}}
                    style={{backgroundColor: 'skyblue'}}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                                <TouchableOpacity 
                                onPress={() => playSound(item.sound)}
                                style={styles.aac_list}
                                >
                                    <Text>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                    )}
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
        textAlign: 'center'
    },
    text: {
        fontSize: 50,
        color: '#000000'
    },
    aac_list: {
        width: windowWidth / 7,
        borderWidth: 1,
        borderColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
})