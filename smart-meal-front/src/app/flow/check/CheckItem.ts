import {IItem} from "../../../domain/model/IItem";

export class CheckItem {
  static checkValueMandatory(item?: IItem): boolean {
    return true;
    /*
    return item != undefined &&
      item?.type != undefined &&
      item?.name != undefined &&
      item?.duration != undefined &&
      item?.price != undefined
     */
  }
}
