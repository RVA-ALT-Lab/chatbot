const fs = require('fs')

let file = fs.readFileSync('./online-programs.json')
let jsonFile = JSON.parse(file)

// let ids = jsonFile.map(record => record.id)
let titles = jsonFile.map(record => {

    let newRecord = {
        "title": record.title.rendered,
        "department": record.acf.department,
        "college": record.acf.mode
    }
    return newRecord
})

console.log(titles)

