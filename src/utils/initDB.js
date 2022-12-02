import SQLite from 'react-native-sqlite-storage';

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
    ['a', 1, 'Main', 1, 'text', 'likeimg', 'white', 'like'],
    ['a', 2, 'Main', 1, 'text', 'wantimg', 'white', 'want'],
    ['a', 3, 'Main', 1, 'text', 'getimg', 'white', 'get'],
    ['a', 4, 'Main', 1, 'text', 'makeimg', 'white', 'make'],
    ['a', 5, 'Main', 1, 'text', 'goodimg', 'white', 'good'],
    ['a', 6, 'Main', 1, 'text', 'moreimg', 'white', 'more'],
    ['a', 7, 'Main', 1, 'text', 'notimg', 'white', 'not'],
    ['b', 1, 'Main', 1, 'text', 'goimg', 'white', 'go'],
    ['b', 2, 'Main', 1, 'text', 'lookimg', 'white', 'look'],
    ['b', 3, 'Main', 1, 'text', 'turnimg', 'white', 'turn'],
    ['b', 4, 'Main', 1, 'text', 'helpimg', 'white', 'help'],
    ['b', 5, 'Main', 1, 'text', 'differentimg', 'white', 'different'],
    ['b', 6, 'Main', 1, 'text', 'iimg', 'white', 'I'],
    ['b', 7, 'Main', 1, 'text', 'heimg', 'white', 'he'],
    ['c', 1, 'Main', 1, 'text', 'openimg', 'white', 'open'],
    ['c', 2, 'Main', 1, 'text', 'doimg', 'white', 'do'],
    ['c', 3, 'Main', 1, 'text', 'putimg', 'white', 'put'],
    ['c', 4, 'Main', 1, 'text', 'sameimg', 'white', 'same'],
    ['c', 5, 'Main', 1, 'text', 'youimg', 'white', 'you'],
    ['c', 6, 'Main', 1, 'text', 'sheimg', 'white', 'she'],
    ['c', 7, 'Main', 1, 'text', 'thatimg', 'white', 'that'],
    ['d', 1, 'Main', 1, 'text', 'upimg', 'white', 'up'],
    ['d', 2, 'Main', 1, 'text', 'allimg', 'white', 'all'],
    ['d', 3, 'Main', 1, 'text', 'someimg', 'white', 'some'],
    ['d', 4, 'Main', 1, 'text', 'itimg', 'white', 'it'],
    ['d', 5, 'Main', 1, 'text', 'hereimg', 'white', 'here'],
    ['d', 6, 'Main', 1, 'text', 'inimg', 'white', 'in'],
    ['d', 7, 'Main', 1, 'text', 'onimg', 'white', 'on'],
    ['e', 1, 'Main', 1, 'text', 'canimg', 'white', 'can'],
    ['e', 2, 'Main', 1, 'text', 'finishedimg', 'white', 'finished'],
    ['e', 3, 'Main', 1, 'text', 'whereimg', 'white', 'where'],
    ['e', 4, 'Main', 1, 'text', 'whatimg', 'white', 'what'],
    ['e', 5, 'Main', 1, 'text', 'whyimg', 'white', 'why'],
    ['e', 6, 'Main', 1, 'text', 'whoimg', 'white', 'who'],
    ['e', 7, 'Main', 1, 'text', 'whenimg', 'white', 'when'],
    ['f', 1, 'Main', 1, 'text', 'stopimg', 'white', 'stop'],
    ['f', 2, 'Main', 1, 'text', 'eatimg', 'white', 'eat'],
    ['f', 3, 'Main', 1, 'text', 'drinkimg', 'white', 'drink'],
    ['f', 4, 'Main', 1, 'text', 'helpimg', 'white', 'help'],
    ['f', 5, 'Main', 1, 'text', 'happyimg', 'white', 'happy'],
    ['f', 6, 'Main', 1, 'text', 'sadimg', 'white', 'sad'],
    ['f', 7, 'Main', 1, 'text', 'walkimg', 'white', 'walk'],
    ['g', 1, 'Main', 1, 'text', 'animalsimg', 'white', 'animals'],
    ['g', 2, 'Main', 1, 'text', 'peopleimg', 'white', 'people'],
    ['g', 3, 'Main', 1, 'text', 'objectsimg', 'white', 'objects'],
    ['g', 4, 'Main', 1, 'text', 'actionsimg', 'white', 'actions'],
    ['g', 5, 'Main', 1, 'text', 'placesimg', 'white', 'places'],
    ['g', 6, 'Main', 1, 'text', 'timeimg', 'white', 'time'],
    ['g', 7, 'Main', 1, 'text', 'describeimg', 'white', 'describe'],
]

export function initFirstAAC() {

    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS " 
            + "Main "
            +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, row TEXT, column INTEGER, page TEXT, visibility INTEGER, type TEXT, image TEXT, colour TEXT, text TEXT)",
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
                "INSERT INTO Main (row, column, page, visibility, type, image, colour, text) VALUES (?,?,?,?,?,?,?,?)",
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
    console.log('added Main table succesfully')
}

export function dropTable(table) {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE " + table,
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