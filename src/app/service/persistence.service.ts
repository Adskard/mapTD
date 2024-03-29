import { Injectable } from '@angular/core';
import { openDB, deleteDB, wrap, unwrap, DBSchema } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  //Gets all players with score at least 1
  getTopLeaders = async () : Promise<LeaderboardItem[] | undefined>  =>  {
    console.log("Getting Leaders")
  
    //establish db connection using wrapper
    const db = await openDB<dbSchema>("db", 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log("upgrading")
        if(!db.objectStoreNames.contains("leaderboard")){
          console.log("upgrading db")
          const store =  db.createObjectStore("leaderboard", {autoIncrement: true, keyPath: 'key'});
          store.createIndex("by-score", "score");
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        console.log("Db blocked")
      },
      blocking(currentVersion, blockedVersion, event) {
        console.log("Db blocking")
      },
      terminated() {
        console.log("Db terminated")
      },
    });
    

    try{
      //get leaders by index
      const top_leaders = await db.getAllFromIndex("leaderboard", "by-score", IDBKeyRange.lowerBound(1))
      return top_leaders;
    }
    catch(err){
      console.error(err)
    }
    return undefined;
  } 


  //add leaderBoard item to DB asynchronously
  addLeader = async (item : LeaderboardItem) : Promise<void>  =>  {
    console.log("Adding leader")
  
    const db = await openDB<dbSchema>("db", 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log("upgrading")
        if(!db.objectStoreNames.contains("leaderboard")){
          console.log("upgrading db")
          const store =  db.createObjectStore("leaderboard", {autoIncrement: true, keyPath: 'key'});
          store.createIndex("by-score", "score");
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        console.log("Db blocked")
      },
      blocking(currentVersion, blockedVersion, event) {
        console.log("Db blocking")
      },
      terminated() {
        console.log("Db terminated")
      },
    });
    
  
    try{
      await db.add("leaderboard", item);
    }
    catch(err){
      console.error(err)
    }
  } ;

  constructor() { }
}



//database schema for easy insertions
interface dbSchema extends DBSchema {
  leaderboard: {
    value: LeaderboardItem;
    key: number;
    indexes: { 'by-score': number };
  };
}

//Item displayed on leaderboard
//name - player name
//score -player score
export interface LeaderboardItem{
  name: String;
  score: number;
}
