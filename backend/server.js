const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());


const db = mysql.createPool({
    host: "localhost",
    user: "webapi",
    password: "password1",
    database: "dashboard_data",
});

function getFilters(query) {
    let sql = "";
    let i = 0;
    if (Object.entries(query).length > 0) sql = sql + "WHERE ";
    query.forEach(([key, value]) => {
        let filterValue = "";
        
        value.split(',').forEach((elem, idx, array) => {
            if (idx !== array.length - 1){
                filterValue += `'${elem}',`;
            }
            else {
                filterValue += `'${elem}'`;
            }
        });

        // ${value.split(',').forEach((elem, idx, array) => {
        //     console.log(elem);
        //     if (idx !== array.length - 1){
        //         return `'${elem},'`;
        //     }
        //     return `'${elem}'`;
        // })}

        sql = sql + `${key} IN (${filterValue}) `;
        i++;
        if (i !== Object.entries(query).length) sql = sql + "AND ";
    })

    return sql;
}

app.get('/', (request, reason) => {
    return reason.json("from backend");
})

app.get('/test', (request, reason) => {
    let a = Object.entries(request.query);
    console.log(a.shift()[1]);
    return reason.json("test");
})


app.get('/dummy', (request, reason) => {
    const sql = "SELECT * FROM dummy WHERE id=4505";
    console.log(sql);
    db.query(sql, (err, data) => {
        if (err) return reason.json(err);
        return reason.json(data);
    })
})

app.get('/dummy/get', (request, reason) => {
    let qry = Object.entries(request.query);
    let select = qry.shift()[1];
    let filters = getFilters(qry);
    let sql = `SELECT ${select}, COUNT(*) as 'count' FROM dummy ${filters} GROUP BY ${select} ORDER BY 2 DESC`;
    console.log(sql);
    db.query(sql, (err, data) => {
        if (err) return reason.json(err);
        return reason.json(data);
    })
})

// app.get('/dummy/objective', (request, reason) => {
//     let sql = `SELECT objective, COUNT(*) as 'count' FROM dummy ${getFilters(request.query)} GROUP BY objective ORDER BY 2 DESC`;
//     console.log(sql);
//     db.query(sql, (err, data) => {
//         if (err) return reason.json(err);
//         return reason.json(data);
//     })
// })

// app.get('/dummy/ethnicity', (request, reason) => {
//     const sql = `SELECT ethnicity, COUNT(*) AS 'count' FROM dummy ${getFilters(request.query)} GROUP BY ethnicity ORDER BY 2 DESC`;
//     console.log(sql);
//     db.query(sql, (err, data) => {
//         if (err) return reason.json(err);
//         return reason.json(data);
//     })
// })

// app.get('/dummy/gender', (request, reason) => {
//     const sql = `SELECT gender, COUNT(*) AS 'count' FROM dummy ${getFilters(request.query)} GROUP BY gender`;
//     console.log(sql);
//     db.query(sql, (err, data) => {
//         if (err) return reason.json(err);
//         return reason.json(data);
//     })
// })

// app.get('/dummy/student_count/by_quarter', (request, reason) => {
//     const sql = "SELECT quarter, COUNT('quarter') AS 'count' FROM dummy GROUP BY quarter";
//     console.log(sql);
//     db.query(sql, (err, data) => {
//         if (err) return reason.json(err);
//         return reason.json(data);
//     })
// })

// app.get('/dummy/division', (request, reason) => {
//     const sql = `SELECT division, COUNT(division) as 'count' FROM dummy ${getFilters(request.query)} GROUP BY division`;
//     console.log(sql);
//     db.query(sql, (err, data) => {
//         if (err) return reason.json(err);
//         return reason.json(data);
//     })
// })

app.get('/dummy/columns', (request, reason) => {
    const sql = "SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_NAME = 'dummy' AND table_schema = 'dashboard_data'";
    console.log(sql);
    db.query(sql, (err, data) => {
        if (err) return reason.json(err);
        return reason.json(data);
    })
})

app.get('/dummy/filters', (request, reason) => {
    const sql = `SELECT DISTINCT ${request.query["column"]} FROM dummy`;
    console.log(sql);
    db.query(sql, (err, data) => {
        if (err) return reason.json(err);
        return reason.json(data);
    })
})


app.listen(8081, () => {
    console.log("listening...");
});
