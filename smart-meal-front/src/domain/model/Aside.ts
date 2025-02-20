export interface OrderedSection {
  name: string,
  sectionId?: string,
  items: {
    itemId: string;
    name: string,
    price: number;
    quantity: number;
  }[];
  
}

export interface OrderedItem {
  itemId: string;
  name: string,
  price: number,
  quantity: number,
  asides?: OrderedSection[];
}


const order: OrderedItem[] = [
  {
    itemId: '1',
    name: 'Tacos XL',
    price: 12,
    quantity: 1,
    asides: [
      {
        name: 'Drinks',
        items: [
          { itemId: '101', name: 'Coca', price: 2, quantity: 2 },
          { itemId: '102', name: 'Fanta', price: 2, quantity: 1 }
        ],
        sectionId: 'a1'
      },
      {
        name: 'Extra Sauces',
        items: [
          { itemId: '201', name: 'Barbecue Sauce', price: 1, quantity: 1 }
        ],
        sectionId: 'a2'
      }
    ]
  },
  {
    itemId: '2',
    name: 'Burger XXL',
    price: 15,
    quantity: 1,
    asides: [
      {
        name: 'Drinks',
        items: [
          { itemId: '103', name: 'Ice Tea', price: 2.5, quantity: 1 }
        ],
        sectionId: 'a3'
      },
      {
        name: 'Add-Ons',
        items: [
          { itemId: '301', name: 'Cheese Slice', price: 1.5, quantity: 2 },
          { itemId: '302', name: 'Bacon', price: 3, quantity: 1 }
        ],
        sectionId: 'a4'
      }
    ]
  }
];
