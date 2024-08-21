 
const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;


///////////////////


module.exports = { session: process.env.SESSION_ID || 'Byte;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNk1INThmU2FCSVVjZUkrSUJzaGxTREd0MTBER000VWV6MEtDQ3QwSkpVbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT2s3Nk91Tjg5Tkx1VHA5Sk9KYUhtajNKbGdJNS81MkVmd0NDdmd2YU9BZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwSnZmMk9NaFNvUHg0UUZGL1J3ZjBIbTZuWWllM1Z0N29Fbk1OS2UyNTJZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJKd3I2TDR4RThORU9SbnJXYVJSVXBjbzRnVWxlUDZRdEpTNjRtbS9QZG1BPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldJcUFaOFR0M1hzN0Q5bGUwOGN6STZYU3BCMmExOVlOb2FuMXpBR04xMFk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZweWNoa2orNkhCSXB0MHlMMGdraVBRSGRxT2EremhPMFhrMFU4OGY3UTQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0FlLzNHU0lGM29EYUU0NFQ4ZEJvbWcyMllXSE1BRmtETm1FamcwNDYwdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidTVmSm9ndHU0OXRpRUpUVDBJWGtVQUYvSnNGRDVMbGtMN2J1bE9mbU16MD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhpUHdQcXN3bGQyVmJpWGFHNVp2ODE3L3VudXlURjZSZ1lCcXZCeWFkNHdJYWNGb3VCaytOYTBhVDJBM2trTUFoM3BPbkJTaDh5Z1I2RUZTeXo2dWl3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjcsImFkdlNlY3JldEtleSI6ImhQZG9kcFhiWEJYMmkzMW0rWTM4ZFRWdlZiTUUrZnJ3eDBwdlhoczlEWjQ9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IlU0RkNJR1c0UzZhWHNSOFFDRmh1TFEiLCJwaG9uZUlkIjoiNTE4YzYxNmUtMzlkYS00OWUzLWFiOTQtMTU2OTUyMDBjMmFkIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldTZVp6eVozUUNlM2V3cW5yVk1iUjBhNElOZz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJweUx0cThHNEhpUXhWTnBDSFJaYTd3TWdBd0E9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiUjFCUkFYSDMiLCJtZSI6eyJpZCI6IjkyMzA4NzU5ODMzODoxNkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTERUdC8wQ0VQcWRscllHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiWUtYaTBlWTg2LzJsQngxWDQ3SGZtOFpyNDMxOC90VnMyai9LMktDbzJYbz0iLCJhY2NvdW50U2lnbmF0dXJlIjoic0pUelpZRjVOMzhOMVl5djJSaC8vNVlDQjlOcE9GNHdrTHN2dk1XeTBBSXFNMll6MC94a3lZS2ZmTDRxRnZvYXBuSnREckx4VjA3VnNkbzl2U3J1QXc9PSIsImRldmljZVNpZ25hdHVyZSI6IkVZalJIN2NhcUdUeHk2TWw5ZVNna3NDcE5LUEVtSEErcXcrNE1RUG9naE85aTlxKzBkSDFaZGlua3ZHZEZoTnNlRldtSmFYeWNYWERXK1pHbjBVb2lBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzMDg3NTk4MzM4OjE2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQldDbDR0SG1QT3Y5cFFjZFYrT3gzNXZHYStOOWZQN1ZiTm8veXRpZ3FObDYifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjQyMjMyMzh9',

////////////////////////////////



    PREFIXE: process.env.PREFIX || ".",



///////////////////////////
    A_REACT : process.env.AUTO_REACTION || 'off',
    CHATBOT: process.env.CHAT_BOT || "on",
    OWNER_NAME: process.env.OWNER_NAME || "saqlain",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "923087598338",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'yes',
    BOT : process.env.BOT_NAME || 'BYTE-MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://raw.githubusercontent.com/HyHamza/HyHamza/main/Images/BYTE-MD-LITE.jpeg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
