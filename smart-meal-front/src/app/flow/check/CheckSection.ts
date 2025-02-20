import {IItem} from "../../../domain/model/IItem";
import {Section} from "../../../domain/model/Section";

export class CheckSection {
  static checkValueMandatory(item?: Section): boolean {
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
