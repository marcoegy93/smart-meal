/*
* Currently, all step of form is saved on 'progressItem'.
* If a user reload the website, his data may be deleted.
* We need to find a solution to save properly all data
* to retrieve them even if the page is reloaded
*/
import {EventEmitter, Injectable} from "@angular/core";
import {BehaviorSubject, firstValueFrom, Observable, Subject} from "rxjs";
import {Item} from "../../domain/model/Item";
import {IItem, ItemType} from "../../domain/model/IItem";
import {Section} from "../../domain/model/Section";
import {ItemsService} from "../../domain/service/ItemsService";
import {NotificationService} from "../../domain/service/notification.service";

@Injectable({
  providedIn: 'root'
})
export class CreateOrUpdateItemFlow {

  private db: IDBDatabase | null = null;
  private progressItem: BehaviorSubject<Item> = new BehaviorSubject<Item>(new Item(ItemType.SIMPLE));
  public type: BehaviorSubject<string> = new BehaviorSubject<string>("SIMPLE");
  public step: BehaviorSubject<string> = new BehaviorSubject<string>('ITEM')
  public setCommonData: EventEmitter<string> = new EventEmitter<string>();
  public formDone: boolean = false
  public numberOfStep: BehaviorSubject<number> = new BehaviorSubject<number>(1)
  public hasError: boolean = false;
  public toUpdate: boolean = false;
  public itemIdToUpdate: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>('NOT_DEFINED')
  public itemId: string | undefined = undefined
  public currentSubRoute: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  public actionToUpdateOrCreate: EventEmitter<void> = new EventEmitter<void>();

  constructor(private itemService: ItemsService, private notificationService: NotificationService) {

    this.notificationService.currentError.subscribe(error => {
      if (error) {
        this.hasError = true
      }
    })

    this.itemIdToUpdate.subscribe(async (id) => {
      console.log(id)
      console.log("START")

      if(id !== "NOT_DEFINED") {
        if (id) {
          console.log("UPDATE")
          this.toUpdate = true
          this.itemId = id
          const item = await this.itemService.getItemById(id)
          if (item) {
            this.progressItem.next(Item.from(item))
            this.updateType(item.type)
          }
        } else {
          console.log("CREATION")
          this.initDB().then(() => {
            this.initItem()
          })
        }
      }

    })


  }

  reset() {
    this.progressItem.next(new Item(ItemType.SIMPLE));
    this.toUpdate = false
    this.itemId = undefined
    this.itemIdToUpdate.next(undefined)
    this.formDone = false
    console.log("jai reset")
  }

  private initItem() {
    this.getAllItems().then(items => {
      if(items.length > 0) {
        const item = Item.from(items[0]);
        console.log(item);
        this.progressItem.next(item)
        this.updateType(item.type)
      }
    })
  }

  private initDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('local', 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', {keyPath: 'id', autoIncrement: true});
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject()
      };
    })

  }


  saveItem(item: any): Promise<number> {
    console.log("je save")
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction('items', 'readwrite');
      const store = transaction.objectStore('items');

      let request: IDBRequest;

      if (item.id) {
        request = store.put(item);
      } else {
        request = store.add(item);
      }

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  getAllItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction('items', 'readonly');
      const store = transaction.objectStore('items');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      // @ts-ignore
      const transaction = this.db.transaction(this.db.objectStoreNames, 'readwrite');
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event);

      // Parcourir chaque object store et appeler clear()
      // @ts-ignore
      for (const storeName of this.db.objectStoreNames) {
        const store = transaction.objectStore(storeName);
        store.clear();
      }
    });
  }

  private getItem(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');
      const transaction = this.db.transaction('items', 'readonly');
      const store = transaction.objectStore('items');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public updateStep(stepToGo: string) {
    this.step.next(stepToGo)
  }

  public getLiveItem(): Observable<Item> {
    return this.progressItem
  }

  public async getInstantItem(): Promise<Item> {
    return await firstValueFrom(this.progressItem)
  }

  async save(restaurantId: string) {
    return firstValueFrom(this.progressItem)
      .then(async item => {
        try {
          await this.itemService.saved(restaurantId, item)
          const errorDomain = {
            type: "INFO",
            message: "L'item a bien été modifié",
            additionalDetails: ["OK"]
          }
          this.notificationService.send(errorDomain)
        } catch (error: any) {
          console.log(error);
          const errorDomain = {
            type: "ERROR",
            message: "Une erreur s'est produite lors de l'ajout du produit",
            additionalDetails: [error.error.text]
          }
          this.notificationService.send(errorDomain)
          throw error;
        }
        this.formDone = true //TODO : need to change this value when we are sure that the call to api is successful
        this.actionToUpdateOrCreate.next() //TODO: this value too
        if (!this.toUpdate) {
          this.clearAllData()
        }
      }).catch(error => {
        throw error
      });
  }

  public setCommonDataAction() {
    this.setCommonData.emit("test")
  }

  public setCommonItemData(itemToSet: IItem) {
    console.log(itemToSet)
    firstValueFrom(this.progressItem)
      .then(item => {
        this.progressItem.next(item.setCommonItemData(itemToSet))

        console.log(this.toUpdate)
        if(!this.toUpdate) {
          this.saveItem(item).then(value => {
            console.log(this.getAllItems())
          })
        }

      })

    firstValueFrom(this.progressItem)
      .then(item => console.log(item))
  }

  public addSection(section: Section, index?: number) {
    firstValueFrom(this.progressItem)
      .then(item => {
        this.progressItem.next(item.addSection(section, index))
        if(!this.toUpdate) {
          this.saveItem(item).then(value => {
            console.log(this.getAllItems())
          })
        }
      })
  }

  public removeItemOnSection(nameOfSection: string, indexOfItem: number) {
    firstValueFrom(this.progressItem)
      .then(item => {
        this.progressItem.next(item.removeItemOnSection(nameOfSection, indexOfItem))
      })
  }

  removeSection(index: number) {
    firstValueFrom(this.progressItem)
      .then(item => {
        this.progressItem.next(item.removeSection(index))

        if(!this.toUpdate) {
          this.saveItem(item).then(value => {
            console.log(this.getAllItems())
          })
        }
      })
  }

  updateType(type: string) {
    this.type.next(type)

    console.log(type)
    console.log(type === 'SIMPLE')
    if (type === 'SIMPLE') {
      this.numberOfStep.next(1)
    } else {
      this.numberOfStep.next(3)

    }

  }
}
