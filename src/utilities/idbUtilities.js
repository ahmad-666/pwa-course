let indexDB = idb.open('db',1,db=>{
    if(!db.objectStoreNames.contains('users')) db.createObjectStore('users',{keyPath:'id'}) ;
    if(!db.objectStoreNames.contains('sync-userTable')) db.createObjectStore('sync-userTable',{keyPath:'id'}) ; //for bg-sync
}) ;
function indexDbWrite(table,data){
    return indexDB
    .then(db=>{
        let tx = db.transaction(table,'readwrite') ;
        let currTable = tx.objectStore(table) ;
        currTable.put(data) ;
        return tx.complete ;
    })
    .catch(msg=>console.error(msg))
}
function indexDbReadAll(table){
    return indexDB
    .then(db=>{
        let tx = db.transaction(table,'readonly') ;
        let currTable = tx.objectStore(table) ;
        return currTable.getAll() ;
    })
    .catch(msg=>console.error(msg)) ;
}
function indexDbClear(table){
    return indexDB
    .then(db=>{
        let tx = db.transaction(table,'readwrite') ;
        let currTable = tx.objectStore(table) ;
        currTable.clear() ;
        return tx.complete ;
    })
    .catch(msg=>console.error(msg))
}
function indexDbDelete(table,id){
    return indexDB
    .then(db=>{
        let tx = db.transaction(table,'readwrite') ;
        let currTable = tx.objectStore(table) ;
        currTable.delete(id) ;
        return tx.complete ;
    })
    .catch(msg=>console.error(msg)) 
}