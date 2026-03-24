import * as SQLite from 'expo-sqlite';

// Section 1: Database Initialization
//=========================================================================================================
export const initDB = async (onSuccess, onError) => {
     const db = await SQLite.openDatabaseAsync('DawitEkub', { useNewConnection: true });
     try {
          await db.execAsync(`CREATE TABLE IF NOT EXISTS ekub (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ekubName TEXT NOT NULL,
                    ekubType TEXT NOT NULL,
                    medebAmount INTEGER NOT NULL, 
                    startDate TEXT NOT NULL,
                    duration INTEGER NOT NULL,
                    endDate TEXT NOT NULL
          )`);

          await db.execAsync(`CREATE TABLE IF NOT EXISTS ekubMembers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ekubTypeId INTEGER NOT NULL,
                    fullName TEXT NOT NULL,
                    phoneNumber TEXT NOT NULL,
                    paymentAmount INTEGER NOT NULL, 
                    otherInfo TEXT,
                    FOREIGN KEY(ekubTypeId) REFERENCES ekub(id)
          )`);

          await db.execAsync(`CREATE TABLE IF NOT EXISTS ekubPayments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ekubTypeId INTEGER NOT NULL,
                    payerId INTEGER NOT NULL,
                    paymentAmount INTEGER NOT NULL, 
                    paymentDate TEXT NOT NULL,
                    FOREIGN KEY (ekubTypeId) REFERENCES ekub (id),
                    FOREIGN KEY (payerId) REFERENCES ekubMember (id)
          )`);

          await db.execAsync(`CREATE TABLE IF NOT EXISTS ekubRecipients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ekubTypeId INTEGER NOT NULL,
                    ekubMemberId INTEGER NOT NULL, 
                    moneyAmount INTEGER NOT NULL,
                    dateOfPayment TEXT NOT NULL,
                    FOREIGN KEY (ekubTypeId) REFERENCES ekub (id),
                    FOREIGN KEY (ekubMemberId) REFERENCES ekubMember (id)
          )`);

          await db.execAsync(`CREATE TABLE IF NOT EXISTS ekubMemberLotNumbers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ekubTypeId INTEGER NOT NULL,
                    ekubMemberId INTEGER NOT NULL,
                    medebType TEXT NOT NULL, 
                    lotNumber TEXT NOT NULL,
                    FOREIGN KEY (ekubTypeId) REFERENCES ekub (id),
                    FOREIGN KEY (ekubMemberId) REFERENCES ekubMember (id)
          )`);

          await db.execAsync(`CREATE TABLE IF NOT EXISTS ekubLotWinners (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ekubTypeId INTEGER NOT NULL,
                    medebType TEXT NOT NULL,
                    lotNumber TEXT NOT NULL, 
                    dateOfWinner TEXT NOT NULL,
                    FOREIGN KEY (ekubTypeId) REFERENCES ekub (id)
          )`)
          onSuccess("Database initialized successfully!")
     } catch (error) {
          onError('Initialize DB Error! ', error)
     };

     // Close the database connection after initialization
     await db.closeAsync();
};





// Section 2: Data Insertion
//==========================================================================================================
export const startNewEkub = async (trimmedName, ekubType, medebAmount, startDate, durashn, endDate, onSuccess, onError) => {
     try {
          //Check if the same ekub name and type exists.
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const ekubname = await db.getFirstAsync("SELECT ekubName, ekubType FROM ekub WHERE ekubName = $en AND ekubType = $et", { $en: trimmedName, $et: ekubType });
          if (ekubname === null) {
               const result = await db.runAsync("INSERT INTO ekub (ekubName, ekubType, medebAmount, startDate, duration, endDate) VALUES (?, ?, ?, ?, ?, ?)",
                    trimmedName, ekubType, medebAmount, startDate, durashn, endDate);
               if (result.changes == 1) {
                    console.log("New ekub started successfully!");
                    onSuccess("አዲስ እቁብ በተሳካ ሁኔታ ጀምረዋል!");
               }
          }

          if (ekubname) {
               console.log("You can't start new ekub with the same name and ekub type")
               onError("በተመሳሳይ የእቁብ ስም እና አይነት እቁብዎን መጀመር አይችሉም!");
          }
     } catch (error) {
          console.log("Start new ekub error!: ", error)
          onError("አዲስ እቁብ ለመጀመር አልተሳካም : " + error.message);
     }
};

export const addEkubMember = async (ekubId, fullName, phoneNumber, payAmount, otherInfo, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.runAsync("INSERT INTO ekubMembers (ekubTypeId, fullName, phoneNumber, paymentAmount, otherInfo) VALUES (?, ?, ?, ?, ?)", ekubId, fullName, phoneNumber, payAmount, otherInfo);
          if (result.changes == 1) {
               console.log("Member registerd successfully");
               onSuccess("በተሳካ ሁኔታ ተመዝግቧል!");
          }
     } catch (error) {
          console.log("Adding ekub member error! ", error)
          onError("የእቁብ አባል ለማስገባት አልተሳካም " + error);
     }
};

export const addEkubPayment = async (ekubId, ekubMemberId, payment, selectedDate, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.runAsync("INSERT INTO ekubPayments (ekubTypeId, payerId, paymentAmount, paymentDate) VALUES (?, ?, ?, ?)", ekubId, ekubMemberId, payment, selectedDate);
          if (result.changes == 1) {
               console.log("Payment added");
               onSuccess("ክፍያው ተመዝግቧል!");
          }
     } catch (error) {
          console.log("Add payment error!: ", error)
          onError("ክፍያው አልተሳካም " + error.message);
     }
};

export const InsertEkubRecipients = async (ekubId, memberId, payBalance, selectedDate, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.runAsync("INSERT INTO ekubRecipients (ekubTypeId, ekubMemberId, moneyAmount, dateOfPayment) VALUES (?, ?, ?, ?)", ekubId, memberId, payBalance, selectedDate);
          if (result.changes == 1) {
               console.log("Payment added");
               onSuccess("በተሳካ ሁኔታ ተመዝግቧል!");
          }
     } catch (error) {
          console.log("Payment Add error!: ", error)
          onError("ክፍያውን መፈጸም አልተሳካም!" + error.message);
     }
};

export const AddEkubMemberLotNumber = async (ekubTypeId, ekubMemberId, medebType, lotNumber, onSuccess, onError) => {
     if (medebType === "ሙሉ_መደብ") {
          try {
               const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
               const result = await db.getFirstAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND lotNumber = ?", [ekubTypeId, lotNumber]);
               if (result !== null) {
                    onError("ለሙሉ መደብ እቁብ ተመሳሳይ እጣ ቁጥር መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("You can't add the same lot number")
               } else {
                    const result2 = await db.runAsync("INSERT INTO ekubMemberLotNumbers (ekubTypeId, ekubMemberId, medebType, lotNumber) VALUES (?, ?, ?, ?)", ekubTypeId, ekubMemberId, medebType, lotNumber);
                    if (result2.changes == 1) {
                         console.log("Lot Number added");
                         onSuccess("እጣ ቁጥሩን ሰይመዋል!");
                    }
               }
          } catch (error) {
               console.log("Lot Number registration error!: ", error)
               onError("የእጣ ቁጥር ለመሰየም አልተሳካም " + error.message);
          }
     } else if (medebType === "ግማሽ_መደብ") {
          try {
               const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
               const result = await db.getFirstAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND medebType = ? AND lotNumber = ? ", [ekubTypeId, "ሙሉ_መደብ", lotNumber]);
               if (result !== null) {
                    console.log(result)
                    onError("ይህ ቁጥር ( ለሙሉ ) መደብ እጣ ቁጥር ስለተሰየመ ለግማሽ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("ይህ ቁጥር ( ለሙሉ ) መደብ እጣ ቁጥር ስለተሰየመ ለግማሽ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    return
               }

               const result2 = await db.getFirstAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND medebType = ? AND lotNumber = ? ", [ekubTypeId, "እሩብ_መደብ", lotNumber]);
               if (result2 !== null) {
                    console.log(result2)
                    onError("ይህ ቁጥር ( ለእሩብ ) መደብ እጣ ቁጥር ስለተሰየመ ለግማሽ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("ይህ ቁጥር ( ለእሩብ ) መደብ እጣ ቁጥር ስለተሰየመ ለግማሽ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    return
               }

               const result3 = await db.getAllAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND lotNumber = ? ", [ekubTypeId, lotNumber]);
               if (result3.length >= 2) {
                    onError("ለግማሽ መደብ እቁብ ከ ሁለት (2) በላይ ተመሳሳይ እጣ ቁጥር መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("You can't add simillar lot number more than 2 for half ekub ")
               } else {
                    const result4 = await db.runAsync("INSERT INTO ekubMemberLotNumbers (ekubTypeId, ekubMemberId, medebType, lotNumber) VALUES (?, ?, ?, ?)", ekubTypeId, ekubMemberId, medebType, lotNumber);
                    if (result4.changes == 1) {
                         console.log("Lot Number added");
                         onSuccess("እጣ ቁጥሩን ሰይመዋል!");
                    }
               }
          } catch (error) {
               console.log("Lot Number registration error!: ", error)
               onError("የእጣ ቁጥር ለመሰየም አልተሳካም " + error.message);
          }
     } else {
          try {
               const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
               const result = await db.getFirstAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND medebType = ? AND lotNumber = ? ", [ekubTypeId, "ሙሉ_መደብ", lotNumber]);
               if (result !== null) {
                    console.log(result)
                    onError("ይህ ቁጥር ( ለሙሉ ) መደብ እጣ ቁጥር ስለተሰየመ ለእሩብ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("ይህ ቁጥር ( ለሙሉ ) መደብ እጣ ቁጥር ስለተሰየመ ለእሩብ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    return
               }

               const result2 = await db.getFirstAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND medebType = ? AND lotNumber = ? ", [ekubTypeId, "ግማሽ_መደብ", lotNumber]);
               if (result2 !== null) {
                    console.log(result2)
                    onError("ይህ ቁጥር ( ለግማሽ ) መደብ እጣ ቁጥር ስለተሰየመ ለእሩብ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("ይህ ቁጥር ( ለግማሽ ) መደብ እጣ ቁጥር ስለተሰየመ ለእሩብ መደብ መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    return
               }

               const result3 = await db.getAllAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? AND lotNumber = ? ", [ekubTypeId, lotNumber]);
               if (result3.length >= 4) {
                    onError("ለእሩብ መደብ እቁብ ከ አራት (4) በላይ ተመሳሳይ እጣ ቁጥር መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
                    console.log("ለእሩብ መደብ እቁብ ከ አራት (4) በላይ ተመሳሳይ እጣ ቁጥር መሰየም አይችሉም!\n\nእጣ ቁጥሩን ይቀይሩ")
               } else {
                    const result4 = await db.runAsync("INSERT INTO ekubMemberLotNumbers (ekubTypeId, ekubMemberId, medebType, lotNumber) VALUES (?, ?, ?, ?)", ekubTypeId, ekubMemberId, medebType, lotNumber);
                    if (result4.changes == 1) {
                         console.log("Lot Number added");
                         onSuccess("እጣ ቁጥሩን ሰይመዋል!");
                    }
               }

          } catch (error) {
               console.log("Lot Number registration error!: ", error)
               onError("የእጣ ቁጥር ለመሰየም አልተሳካም " + error.message);
          }
     }

};

export const AddEkubLotWinners = async (ekubId, medebType, selectedLotNumber, selectedDate, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.runAsync("INSERT INTO ekubLotWinners (ekubTypeId, medebType, lotNumber, dateOfWinner) VALUES (?, ?, ?, ?)", ekubId, medebType, selectedLotNumber, selectedDate);
          if (result.changes == 1) {
               console.log("ከእጣ ዝርዝር አውጥተዋል");
               onSuccess("ከእጣ ዝርዝር አውጥተዋል");
          }
     } catch (error) {
          console.log("Lot registration error!: ", error)
          onError("ከእጣ ዝርዝር ማውጣት አልተሳካም " + error.message);
     }
};









// Section 3: Data Selection
//=========================================================================================================

export const selectAllEkub = async (callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const ekubList = await db.getAllAsync("SELECT * FROM ekub");
          callback(ekubList);
     } catch (error) {
          console.log("Fetching ekub list data error!: ", error)
     }
}

export const selectEkub = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const firstRow = await db.getFirstAsync("SELECT * FROM ekub WHERE id = $ek", { $ek: ekubId });
          callback(firstRow);
     } catch (error) {
          console.log("Select ekub Error!: ", error)
     }
}

export const selectAllEkubMember = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const allEkubMember = await db.getAllAsync("SELECT * FROM ekubMembers WHERE ekubTypeId = ? ORDER BY paymentAmount DESC", [ekubId]);
          callback(allEkubMember);
     } catch (error) {
          console.log("Select all ekub member error!: ", error)
     }
}

export const selectAllUniqueEkubMemberLotNumbers = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.getAllAsync(`
            SELECT medebType, lotNumber
            FROM ekubMemberLotNumbers eml
            WHERE (
                (medebType = 'ሙሉ_መደብ' AND ekubTypeId = ?)
                OR (medebType = 'ግማሽ_መደብ' AND lotNumber IN (
                    SELECT lotNumber
                    FROM ekubMemberLotNumbers
                    WHERE medebType = 'ግማሽ_መደብ' AND ekubTypeId = ?
                    GROUP BY lotNumber
                    HAVING COUNT(*) >= 2
                ))
                OR (medebType = 'እሩብ_መደብ' AND lotNumber IN (
                    SELECT lotNumber
                    FROM ekubMemberLotNumbers
                    WHERE medebType = 'እሩብ_መደብ' AND ekubTypeId = ?
                    GROUP BY lotNumber
                    HAVING COUNT(*) >= 4
                ))
            )
            AND lotNumber NOT IN (
                SELECT lotNumber
                FROM ekubLotWinners
                WHERE ekubTypeId = ?
            )
            GROUP BY lotNumber
            ORDER BY lotNumber` , [ekubId, ekubId, ekubId, ekubId]);

          callback(result);
     } catch (error) {
          console.log("Select All Unique Member Lot Number has Error!: ", error);
     }
}

export const getSummOfAllMemberPayment = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getFirstAsync("SELECT SUM(paymentAmount) as paymentAmounts FROM ekubPayments WHERE ekubTypeId = $etId", { $etId: ekubId });
               callback(result.paymentAmounts);
          });
     } catch (error) {
          console.log("Get sum of all member ekub payment error!: ", error)
     }
}

export const getSumOfAllEkubRecipients = async (ekubTypeId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getFirstAsync("SELECT SUM(moneyAmount) as moneyAmounts FROM ekubRecipients WHERE ekubTypeId = $ekTId", { $ekTId: ekubTypeId });
               callback(result.moneyAmounts);
          });
     } catch (error) {
          console.log("Cant get sum of all member ekub birr recipients! ", error)
     }
}

export const selectEkubMemberLotNumbers = async (ekubMemberId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.getAllAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubMemberId = ?", [ekubMemberId]);
          callback(result);
     } catch (error) {
          console.log("Select Member lot Numbers has Error!: ", error)
     }
}

export const selectEkubMember = async (ekubMemberId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const firstRow = await db.getFirstAsync("SELECT * FROM ekubMembers WHERE id = $ekm", { $ekm: ekubMemberId });
          callback(firstRow);
     } catch (error) {
          console.log("Select ekub member Error!: ", error)
     }
}

export const selectMemberPayment = async (ekubMemberId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const firstRow = await db.getAllAsync("SELECT * FROM ekubPayments WHERE payerId = $pid ORDER BY id DESC", { $pid: ekubMemberId });
          callback(firstRow);
     } catch (error) {
          console.log("Select member payment Error!: ", error)
     }
}

export const getSumOfEkubRecipients = async (ekubMemberId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getFirstAsync("SELECT SUM(moneyAmount) as moneyAmounts FROM ekubRecipients WHERE ekubMemberId = $ekMId", { $ekMId: ekubMemberId });
               callback(result.moneyAmounts);
          });
     } catch (error) {
          console.log("Get sum of ekub recipients birr error!: ", error)
     }
}

export const getSumOfMemberPayment = async (ekubMemberId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getFirstAsync("SELECT SUM(paymentAmount) as paymentAmounts FROM ekubPayments WHERE payerId = $pid", { $pid: ekubMemberId });
               callback(result.paymentAmounts);
          });
     } catch (error) {
          console.log("Sum of member payment error!: ", error)
     }
}

export const selectAllEkubMemberLotNumbers = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.getAllAsync("SELECT * FROM ekubMemberLotNumbers WHERE ekubTypeId = ? ORDER BY lotNumber", [ekubId]);
          callback(result);
     } catch (error) {
          console.log("Select All Member lot Number Error!: ", error)
     }
}

export const selectEkubMembersByLotNumber = async (ekubId, lotNumber, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          // SQL query to fetch ekubMembers based on the lotNumber and ekubTypeId
          const result = await db.getAllAsync(`
            SELECT em.*
            FROM ekubMembers em
            INNER JOIN ekubMemberLotNumbers eml ON em.id = eml.ekubMemberId
            WHERE eml.ekubTypeId = ? AND eml.lotNumber = ?
        `, [ekubId, lotNumber]);

          callback(result);
     } catch (error) {
          console.log("Select Ekub Members by Lot Number has Error!: ", error);
     }
}

export const selectAllEkubLotWinner = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.getAllAsync("SELECT * FROM ekubLotWinners WHERE ekubTypeId = $eId GROUP BY lotNumber ORDER BY id", { $eId: ekubId });
          callback(result);
     } catch (error) {
          console.log("Select ekub lot winners Error!: ", error)
     }
}

export const selectAllEkubRecipients = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.getAllAsync("SELECT er.id, er.dateOfPayment, er.moneyAmount, em.fullName AS takerName FROM ekubRecipients er JOIN ekubMembers em ON er.ekubMemberId = em.id WHERE er.ekubTypeId = $ek ORDER BY er.id DESC", { $ek: ekubId })
          callback(result);
     } catch (error) {
          console.log("Selection of all ekub recipients Error!: ", error)
     }
}

export const getSumOfAllMemberPaymentAmount = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getFirstAsync("SELECT SUM(paymentAmount) as paymentAmounts FROM ekubMembers WHERE ekubTypeId = $ekId", { $ekId: ekubId });
               callback(result.paymentAmounts);
          });
     } catch (error) {
          console.log("Get sum of all memeber payment amount error!: ", error)
     }
}

export const fetchPaymentsByDate = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getAllAsync("SELECT ep.paymentDate, em.fullName AS payerName, SUM(ep.paymentAmount) AS totalAmount FROM ekubPayments ep JOIN ekubMembers em ON ep.payerId = em.id WHERE ep.ekubTypeId = $ek GROUP BY ep.paymentDate, em.id ORDER BY ep.id DESC, ep.id", { $ek: ekubId })
               callback(result);
          });
     } catch (error) {
          console.log(error)
     }
}

export const fetchPaymentsTwo = async (ekubId, callback) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.withTransactionAsync(async () => {
               const result = await db.getAllAsync("SELECT ep.paymentDate, SUM(ep.paymentAmount) AS totalAmount FROM ekubPayments ep WHERE ep.ekubTypeId = $ek GROUP BY ep.paymentDate ORDER BY ep.id DESC", { $ek: ekubId })
               callback(result);
          });
     } catch (error) {
          console.log(error)
     }
}







// Section: 3 Data Updation
//=========================================================================================================

export const updateEkubMember = async (ekubMemberId, ekubTypeId, fullName, phoneNumber, payAmount, otherInfo, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.runAsync(
               "UPDATE ekubMembers SET fullName = ?, phoneNumber = ?, paymentAmount = ?, otherInfo = ? WHERE id = ? AND ekubTypeId = ?",
               [fullName, phoneNumber, payAmount, otherInfo, ekubMemberId, ekubTypeId]);
          if (result.changes == 1) {
               console.log("Ekub Member Updated");
               onSuccess("በተሳካ ሁኔታ ተስተካክሏል!");
          }
     } catch (error) {
          console.log("Update ekub member Error!: ", error)
          onError("የአባሉን መረጃ ማስተካከል አልተሳካም " + error.message);
     }
}



// Section: 4 Data Deletion
//=========================================================================================================

export const deleteEkub = async (ekubId, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.runAsync("DELETE FROM ekubLotWinners WHERE ekubTypeId = $ekId", { $ekId: ekubId });
          await db.runAsync("DELETE FROM ekubMemberLotNumbers WHERE ekubTypeId = $ekId", { $ekId: ekubId });
          await db.runAsync("DELETE FROM ekubRecipients WHERE ekubTypeId = $ekId", { $ekId: ekubId });
          await db.runAsync("DELETE FROM ekubPayments WHERE ekubTypeId = $ekId", { $ekId: ekubId });
          await db.runAsync("DELETE FROM ekubMembers WHERE ekubTypeId = $ekId", { $ekId: ekubId });
          await db.runAsync("DELETE FROM ekub WHERE id = $ekId", { $ekId: ekubId });
          onSuccess("በሚገባ ሰርዘዋል")
          console.log("Deleted Successfully");
     } catch (error) {
          console.log("Delete Ekub Error!: ", error)
          onError("እቁቡን መሰረዝ አልተሳካም " + error.message);
     }
}

export const deleteEkubMember = async (ekubMemberId, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.runAsync("DELETE FROM ekubMemberLotNumbers WHERE ekubMemberId = $ekMId", { $ekMId: ekubMemberId });
          await db.runAsync("DELETE FROM ekubPayments WHERE payerId = $ekMId", { $ekMId: ekubMemberId });
          await db.runAsync("DELETE FROM ekubRecipients WHERE ekubMemberId = $ekMId", { $ekMId: ekubMemberId });
          await db.runAsync("DELETE FROM ekubMembers WHERE id = $ekMId", { $ekMId: ekubMemberId });
          onSuccess("በሚገባ ተሰርዟል")
          console.log("Deleted Successfully");
     } catch (error) {
          console.log("Delete Ekub Member Error!: ", error)
          onError("መሰረዝ አልተሳካም " + error.message);
     }
}

export const deletePayment = async (paymentId, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.runAsync("DELETE FROM ekubPayments WHERE id = $pId", { $pId: paymentId });
          onSuccess("በሚገባ ተሰርዟል")
          console.log("Deleted Successfully");
     } catch (error) {
          console.log("Delete Payment Error!: ", error)
          onError("መሰረዝ አልተሳካም " + error.message);
     }
}

export const deleteMemberLotNumber = async (lotNumber, lotId, ekubTypeId, ekubMemberId, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          const result = await db.getFirstAsync("SELECT lotNumber FROM ekubLotWinners WHERE lotNumber = $ln AND ekubTypeId = $eId", { $ln: lotNumber, $eId: ekubTypeId });
          if (result !== null) {
               onError("ይህን እጣ ቁጥር ከዚህ አባል ላይ ለመሰረዝ ከአሸናፊዎች እጣ ዝርዝር ውስጥ ማስወጣት ይገባዎታል! \n\nእንዲሁም ከአሸናፊ እጣ ዝርዝር ከማውጣትዎ በፊት ይህን እጣ ቁጥር ሌሎች አባሎችዎ እንደማይጋሩት እርግጠኛ ይሁኑ!");
               console.log(result)
          } else {
               await db.runAsync("DELETE FROM ekubMemberLotNumbers WHERE id = ? AND ekubTypeId = ? AND ekubMemberId = ?", [lotId, ekubTypeId, ekubMemberId]);
               onSuccess("በሚገባ ተሰርዟል")
               console.log("Deleted Successfully");
          }
     } catch (error) {
          console.log("Delete Member LotNumber Error!: ", error)
          onError("መሰረዝ አልተሳካም " + error.message);
     }
}

export const deleteEkubLotWinner = async (ekubId, lotNumber, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.runAsync("DELETE FROM ekubLotWinners WHERE ekubTypeId = $etId AND lotNumber = $lnId", { $etId: ekubId, $lnId: lotNumber });
          onSuccess("በሚገባ ተሰርዟል")
          console.log("Deleted Successfully");
     } catch (error) {
          console.log("Delete Ekub Lot Winner Error!: ", error)
          onError("ለመሰረዝ አልተሳካም " + error.message);
     }
}

export const deleteAllEkubLotWinner = async (ekubId, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.runAsync("DELETE FROM ekubLotWinners WHERE ekubTypeId = $ekId", { $ekId: ekubId });
          onSuccess("በሚገባ ተሰርዟል")
          console.log("Deleted Successfully");
     } catch (error) {
          console.log("Delete All Ekub Lot Winner Error!: ", error)
          onError("መሰረዝ አልተሳካም " + error.message);
     }
}

export const deleteEkubRecipients = async (payId, onSuccess, onError) => {
     try {
          const db = await SQLite.openDatabaseAsync("DawitEkub", { useNewConnection: true });
          await db.runAsync("DELETE FROM ekubRecipients WHERE id = $pId", { $pId: payId });
          onSuccess("በሚገባ ተሰርዟል")
          console.log("Deleted Successfully");
     } catch (error) {
          console.log("Deletion Error!: ", error)
          onError("መሰረዝ አልተሳካም " + error.message);
     }
}