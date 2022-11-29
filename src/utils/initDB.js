import SQLite from 'react-native-sqlite-storage';
import { useSelector, useDispatch } from 'react-redux';
import { addWords, removeWord, removeAllWords, setPageData, setPageName, setEdit, setTalking, setPageLoading} from "../redux/actions";

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

const firstAac = [
    ['a', 1, 'firstAac', 1, 'text', '../utils/images/like.png', 'like.mp3', 'like'],
    ['a', 2, 'firstAac', 1, 'text', '../utils/images/want.png', 'want.mp3', 'want'],
    ['a', 3, 'firstAac', 1, 'text', '../utils/images/get.png', 'get.mp3', 'get'],
    ['a', 4, 'firstAac', 1, 'text', '../utils/images/make.png', 'make.mp3', 'make'],
    ['a', 5, 'firstAac', 1, 'text', '../utils/images/good.png', 'good.mp3', 'good'],
    ['a', 6, 'firstAac', 1, 'text', '../utils/images/more.png', 'more.mp3', 'more'],
    ['a', 7, 'firstAac', 1, 'text', '../utils/images/not', 'not.mp3', 'not'],
    ['b', 1, 'firstAac', 1, 'text', '../utils/images/go.png', 'go.mp3', 'go'],
    ['b', 2, 'firstAac', 1, 'text', '../utils/images/look.png', 'look.mp3', 'look'],
    ['b', 3, 'firstAac', 1, 'text', '../utils/images/turn.png', 'turn.mp3', 'turn'],
    ['b', 4, 'firstAac', 1, 'text', '../utils/images/help.png', 'help.mp3', 'help'],
    ['b', 5, 'firstAac', 1, 'text', '../utils/images/different.png', 'different.mp3', 'different'],
    ['b', 6, 'firstAac', 1, 'text', '../utils/images/i.png', 'i.mp3', 'I'],
    ['b', 7, 'firstAac', 1, 'text', '../utils/images/he.png', 'he.mp3', 'he'],
    ['c', 1, 'firstAac', 1, 'text', '../utils/images/open.png', 'open.mp3', 'open'],
    ['c', 2, 'firstAac', 1, 'text', '../utils/images/do.png', 'doaudio.mp3', 'do'],
    ['c', 3, 'firstAac', 1, 'text', '../utils/images/put.png', 'put.mp3', 'put'],
    ['c', 4, 'firstAac', 1, 'text', '../utils/images/same.png', 'same.mp3', 'same'],
    ['c', 5, 'firstAac', 1, 'text', '../utils/images/you.png', 'you.mp3', 'you'],
    ['c', 6, 'firstAac', 1, 'text', '../utils/images/she.png', 'she.mp3', 'she'],
    ['c', 7, 'firstAac', 1, 'text', '../utils/images/that.png', 'that.mp3', 'that'],
    ['d', 1, 'firstAac', 1, 'text', '../utils/images/up.png', 'up.mp3', 'up'],
    ['d', 2, 'firstAac', 1, 'text', '../utils/images/all.png', 'all.mp3', 'all'],
    ['d', 3, 'firstAac', 1, 'text', '../utils/images/some.png', 'some.mp3', 'some'],
    ['d', 4, 'firstAac', 1, 'text', '../utils/images/it.png', 'it.mp3', 'it'],
    ['d', 5, 'firstAac', 1, 'text', '../utils/images/here.png', 'here.mp3', 'here'],
    ['d', 6, 'firstAac', 1, 'text', '../utils/images/in.png', 'in.mp3', 'in'],
    ['d', 7, 'firstAac', 1, 'text', '../utils/images/on.png', 'on.mp3', 'on'],
    ['e', 1, 'firstAac', 1, 'text', '../utils/images/can.png', 'can.mp3', 'can'],
    ['e', 2, 'firstAac', 1, 'text', '../utils/images/finished.png', 'finished.mp3', 'finished'],
    ['e', 3, 'firstAac', 1, 'text', '../utils/images/where.png', 'where.mp3', 'where'],
    ['e', 4, 'firstAac', 1, 'text', '../utils/images/what.png', 'what.mp3', 'what'],
    ['e', 5, 'firstAac', 1, 'text', '../utils/images/why.png', 'why.mp3', 'why'],
    ['e', 6, 'firstAac', 1, 'text', '../utils/images/who.png', 'who.mp3', 'who'],
    ['e', 7, 'firstAac', 1, 'text', '../utils/images/when.png', 'when.mp3', 'when'],
    ['f', 1, 'firstAac', 1, 'text', '../utils/images/stop.png', 'stop.mp3', 'stop'],
    ['f', 2, 'firstAac', 1, 'text', '../utils/images/eat.png', 'eat.mp3', 'eat'],
    ['f', 3, 'firstAac', 1, 'text', '../utils/images/drink.png', 'drink.mp3', 'drink'],
    ['f', 4, 'firstAac', 1, 'text', '../utils/images/help.png', 'help.mp3', 'help'],
    ['f', 5, 'firstAac', 1, 'text', '../utils/images/happy.png', 'happy.mp3', 'happy'],
    ['f', 6, 'firstAac', 1, 'text', '../utils/images/sad.png', 'sad.mp3', 'sad'],
    ['f', 7, 'firstAac', 1, 'text', '../utils/images/walk.png', 'walk.mp3', 'walk'],
    ['g', 1, 'firstAac', 1, 'text', '../utils/images/animals.png', 'animals.mp3', 'animals'],
    ['g', 2, 'firstAac', 1, 'text', '../utils/images/people.png', 'people.mp3', 'people'],
    ['g', 3, 'firstAac', 1, 'text', '../utils/images/objects.png', 'objects.mp3', 'objects'],
    ['g', 4, 'firstAac', 1, 'text', '../utils/images/actions.png', 'actions.mp3', 'actions'],
    ['g', 5, 'firstAac', 1, 'text', '../utils/images/places.png', 'places.mp3', 'places'],
    ['g', 6, 'firstAac', 1, 'text', '../utils/images/time.png', 'time.mp3', 'time'],
    ['g', 7, 'firstAac', 1, 'text', '../utils/images/describe.png', 'describe.mp3', 'describe'],
]

export function initFirstAAC() {

    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS " 
            + "firstAac "
            +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, row TEXT, column INTEGER, page TEXT, visibility INTEGER, type TEXT, image TEXT, sound TEXT, text TEXT)",
            [],
            (tx, results) => {
                console.log('added successfully')
                console.log(results)
            },
            (tx, error) => {
                console.log(tx)
                console.log(error)
            }
        )
        for (let i = 0; i < firstAac.length; i++) {
            tx.executeSql(
                "INSERT INTO firstAac (row, column, page, visibility, type, image, sound, text) VALUES (?,?,?,?,?,?,?,?)",
                firstAac[i],
                (tt, results) => {
                    console.log(firstAac[i])
                    console.log('Was added succesfully')
                    console.log(results)
                },
                (tn, error) => {
                    console.log('error adding firstAac' + i)
                    console.log(tn)
                    return;
                }
            )
        }

    })
    console.log('added firstAac table succesfully')
}

export function dropTable(table) {
    console.log('I am in drop table')
    db.transaction((tx) => {
        console.log('I am in transaction')
        tx.executeSql(
            "DROP TABLE firstAac",
            [],
            (tx, results) => {
                console.log(results)
                console.log('successfully droppped ' + table)
            },
            (tx, error) => {
                console.log(tx)
                console.log(error)
            }
        )
    })
}