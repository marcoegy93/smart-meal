import { OrderedItem, OrderedSection } from "src/domain/model/Aside";
import { OrderItemInput } from "src/domain/model/input/CreateOrderInput";

export function mapOrderedItemsToOrderInputs(orderedItems: OrderedItem[]): OrderItemInput[] {
  return orderedItems.map((orderedItem) => {
    const additionalDetails = orderedItem.asides
      ? orderedItem.asides.flatMap((section) =>
          section.items.map((item) => ({
            itemId: parseInt(item.itemId, 10),
            quantity: item.quantity,
          }))
        )
      : undefined;

    return {
      itemId: parseInt(orderedItem.itemId, 10),
      quantity: orderedItem.quantity,
      additionalDetails: additionalDetails && additionalDetails.length > 0 ? additionalDetails : undefined,
    };
  });
}