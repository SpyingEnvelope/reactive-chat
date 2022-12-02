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

export const updateData = (page, update, updateValue, filter, filterValue) => {
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

export const updateMultiColumns = (page, text, colour, image, id) => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE " + page + " SET text = "
                + "'" + text + "'"
                + ", colour = "
                + "'" + colour + "'"
                + ", image = "
                + "'" + image + "'"
                + " WHERE ID = " + id,
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