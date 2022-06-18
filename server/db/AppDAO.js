const sqlite3 = require('sqlite3').verbose()

const db = this.db = new sqlite3.Database('./db/database.db', (err) => {
    if (err)
        throw err;
});

// initDB();

// -----------------------------------------------------------------------------

class AppDAO {
    constructor() {
        this.transaction = { onGoing: false };
        this.db = db;
        this.db.run("PRAGMA foreign_keys = ON");
    }

    async run(sql, params = []) {
        const copyDb = this.db;
        let transaction = this.transaction;

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    if (transaction.onGoing) {
                        copyDb.run("ROLLBACK");
                        transaction.onGoing = false;
                    }

                    reject(err)
                } else {
                    resolve({ id: this.lastID, changes: this.changes })
                }
            })
        })
    }

    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    async startTransaction() {
        if (this.transaction.onGoing === true)
            return;

        await this.run("BEGIN TRANSACTION");
        this.transaction.onGoing = true;
    }

    async commitTransaction() {
        if (this.transaction.onGoing === false)
            return;

        await this.run("COMMIT");
        this.transaction.onGoing = false;
    }

    async rollbackTransaction() {
        if (this.transaction.onGoing === false)
            return;

        await this.run("ROLLBACK");
        this.transaction.onGoing = false;
    }
}

// -----------------------------------------------------------------------------

function initDB() {
    db.serialize(function(){
        this.run("PRAGMA foreign_keys = ON");

        this.run("DROP TABLE IF EXISTS user");
        this.run("DROP TABLE IF EXISTS studyPlan");
        this.run("DROP TABLE IF EXISTS studyPlan_course");
    
        this.run('CREATE TABLE IF NOT EXISTS "course"(\
            "code" TEXT,\
            "name"	TEXT,\
            "credits" INTEGER,\
            "propedeuticCourse" TEXT,\
            "currentStudents" INTEGER DEFAULT 0,\
            "maxStudents" INTEGER,\
            PRIMARY KEY("code"),\
            FOREIGN KEY("propedeuticCourse") REFERENCES "course"("code")\
        )');
    
        this.run('CREATE TABLE IF NOT EXISTS "incompatibleCourse"(\
            "firstCourse" TEXT,\
            "secondCourse" TEXT,\
            PRIMARY KEY ("firstCourse", "secondCourse"),\
            FOREIGN KEY("firstCourse") REFERENCES "course"("code"),\
            FOREIGN KEY("secondCourse") REFERENCES "course"("code")\
        )');
    
        this.run('CREATE TABLE IF NOT EXISTS "user"(\
            "id" INTEGER,\
            "email" TEXT,\
            "name" TEXT,\
            "password" TEXT,\
            "salt" TEXT,\
            PRIMARY KEY("id" AUTOINCREMENT),\
            UNIQUE("email")\
        )');
    
        this.run('CREATE TABLE IF NOT EXISTS "studyPlan"(\
            "id" INTEGER,\
            "type" TEXT,\
            "user" INTEGER,\
            PRIMARY KEY("id" AUTOINCREMENT),\
            UNIQUE("user"),\
            FOREIGN KEY("user") REFERENCES "user"("id")\
        )');
    
        this.run('CREATE TABLE IF NOT EXISTS "studyPlan_course"(\
            "studyPlan" INTEGER,\
            "course" INTEGER,\
            PRIMARY KEY("course", "studyPlan"),\
            FOREIGN KEY("studyPlan") REFERENCES "studyPlan"("id"),\
            FOREIGN KEY("course") REFERENCES "course"("code")\
        )');
    
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('02GOLOV','Architetture dei sistemi di elaborazione', 12)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('02LSEOV','Computer architectures', 12)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01SQJOV','Data Science and Database Technology', 8)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01SQMOV','Data Science e Tecnologie per le Basi di Dati', 8)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01SQLOV','Database systems', 8)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'maxStudents') VALUES ('01OTWOV','Computer network technologies and services', 6, 3)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'maxStudents') VALUES ('02KPNOV','Tecnologie e servizi di rete', 6, 3)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01TYMOV','Information systems security services', 12)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01UDUOV','Sicurezza dei sistemi informativi', 12)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'propedeuticCourse') VALUES ('05BIDOV','Ingegneria del software', 6, '02GOLOV')");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'propedeuticCourse') VALUES ('04GSPOV','Software engineering', 6, '02LSEOV')");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01UDFOV','Applicazioni Web I', 6)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'maxStudents') VALUES ('01TXYOV','Web Applications I', 6, 3)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'propedeuticCourse') VALUES ('01TXSOV','Web Applications II', 6, '01TXYOV')");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('02GRSOV','Programmazione di sistema', 6)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'maxStudents') VALUES ('01NYHOV','System and device programming', 6, 3)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01SQOOV','Reti Locali e Data Center', 6)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01TYDOV','Software networking', 7)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('03UEWOV','Challenge', 5)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01URROV','Computational intelligence', 6)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits') VALUES ('01OUZPD','Model based software design', 4)");
        this.run("INSERT OR IGNORE INTO course('code','name','credits', 'maxStudents') VALUES ('01URSPD','Internet Video Streaming', 6, 2)");
        
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('02GOLOV','02LSEOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('02LSEOV','02GOLOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01SQJOV','01SQMOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01SQJOV','01SQLOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01SQMOV','01SQJOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01SQMOV','01SQLOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01SQLOV','01SQJOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01SQLOV','01SQMOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01OTWOV','02KPNOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('02KPNOV','01OTWOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01TYMOV','01UDUOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01UDUOV','01TYMOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('05BIDOV','04GSPOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('04GSPOV','05BIDOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01UDFOV','01TXYOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01TXYOV','01UDFOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('02GRSOV','01NYHOV')");
        this.run("INSERT OR IGNORE INTO incompatibleCourse VALUES ('01NYHOV','02GRSOV')");
        
        this.run("INSERT OR IGNORE INTO user('email','name','password', 'salt') VALUES ('testUser1@mail.com','testUser1', '5475f0277f604875b86ebff6876396e0c412635a7c36f8d0dcda6915de6ef1f8', 'cae62ca688b9f493b5c9a7ee5c2ace42b17e6603279a77a8a9c39b8e155188fb')");
        this.run("INSERT OR IGNORE INTO user('email','name','password', 'salt') VALUES ('testUser2@mail.com','testUser2', '71052a14ee7dc3f56ae3dc7877cc7ca301926e2b52b53310809a1ff178f93d80', '509242012061e481ee3a2e72591015d296707334c3a78777ef751956f15d21f5')");
        this.run("INSERT OR IGNORE INTO user('email','name','password', 'salt') VALUES ('testUser3@mail.com','testUser3', '195943cd804b8d179579a04b01f494f0e3907273bac25f43159505fcc39e9eb7', 'e887ff3cf5649ae1e3de9657e542fd6ac3900f4b2b2a6241aa35c2af80a3ce64')");
        this.run("INSERT OR IGNORE INTO user('email','name','password', 'salt') VALUES ('testUser4@mail.com','testUser4', '559fa477d83635be868e092a8ee4c4ac177ede39cd94b6b937dc524b21f6d067', '067c451344fd81a1c3215370c13dc304f2e76173b04373cbd12c75405bc5104b')");
        this.run("INSERT OR IGNORE INTO user('email','name','password', 'salt') VALUES ('testUser5@mail.com','testUser5', '773553c10f4ad14e6edee29f3bbb8ba012983c0c58991503e7dc0768da9525a6', 'fe0826b2b5e1fdfccca879496651e7494dfd102d98dc84759fe5929d9cd2f2de')");
        
        this.run("INSERT OR IGNORE INTO studyPlan('type', 'user') VALUES ('PARTTIME', 1)")

        this.run("INSERT OR IGNORE INTO studyPlan_course VALUES (1, '02GOLOV')")
        this.run("INSERT OR IGNORE INTO studyPlan_course VALUES (1, '02LSEOV')")
    })
}

module.exports = AppDAO;