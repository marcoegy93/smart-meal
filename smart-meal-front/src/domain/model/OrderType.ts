export enum OrderType {
  SUR_PLACE, EMPORTER 
}


export enum OrderTypeString {
  SUR_PLACE = "Sur place", EMPORTER = "A emporter"
}

export function getTypeString(type: OrderType) : string | undefined {
      switch (type) {
      case OrderType.SUR_PLACE:
        return OrderTypeString.SUR_PLACE;
      case OrderType.EMPORTER:
        return OrderTypeString.EMPORTER;
      default:
        return undefined;
    }
}

export function getType(type: String) {
      switch (type) {
      case OrderTypeString.SUR_PLACE:
        return OrderType.SUR_PLACE;
      case OrderTypeString.EMPORTER:
        return OrderType.EMPORTER;
      default:
        return undefined;
    }
}