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

export const updateMultiColumns = (page, text, colour, image, type, id) => {
    try {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE " + page + " SET text = "
                + "'" + text + "'"
                + ", colour = "
                + "'" + colour + "'"
                + ", image = "
                + "'" + image + "'"
                + ", type = "
                + "'" + type + "'"
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

export function initTable(table) {

    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS " 
            + table
            +" (ID INTEGER PRIMARY KEY AUTOINCREMENT, row TEXT, column INTEGER, page TEXT, visibility INTEGER, type TEXT, image TEXT, colour TEXT, text TEXT)",
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
    })
    console.log('added ' + table + ' table succesfully')
}

export function initAddItemsToTable(table) {
    let columnCounter = 1
    db.transaction((tx) => {
        for (let i = 0; i < 43; i++) {
            let column = columnCounter

            if (columnCounter == 7) {
                columnCounter = 1
            } else {
                columnCounter += 1
            }

            let row = 'a'

            if (i <= 7) {
                row = 'a'
            } else if (i <= 14) {
                row = 'b'
            } else if (i <= 21) {
                row = 'c'
            } else if (i <= 28) {
                row = 'd'
            } else if (i <= 35) {
                row = 'e'
            } else if (i <= 42) {
                row = 'f'
            }

            tx.executeSql(
                "INSERT INTO " + table + " (row, column, page, visibility, type, image, colour, text) VALUES (?,?,?,?,?,?,?,?)",
                [row, column, table, 1, 'text', 'empty', 'white', ''],
                (tt, results) => {
                    console.log(row, + " " + column + " was added successfully to " + table)
                    console.log('Was added succesfully')
                    console.log(results)
                },
                (error) => {
                    console.log('error adding ' + row + " " + column + " to " + table)
                    console.log(error)
                    return;
                }
            )
        }
    })
}

export function dropTable(table) {
    const newTable = table.replace(/\s/g, '')

    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS " + newTable,
            [],
            (tt, results) => {
                console.log('successfully dropped table ' + newTable)
                console.log(results)
            },
            (error) => {
                console.log('error dropping table ' + newTable)
            console.log(error)
            }    
        )
    })
}