import { IItem } from "src/domain/model/IItem";
import { Section, SectionType } from "src/domain/model/Section";


export const MOCK_INGREDIENTS: string[] = ['Chicken', 'Cheese', 'Tomato', 'Lettuce', 'Chili', 'Sausage', 'Beef', 'Potato', 'Carrot', 'Onion'];
export const MOCK_KEYWORDS: string[] = ['Spicy', 'Vegetarian', 'Gluten-Free', 'Popular', 'Chef Special', 'Low Calorie'];
export const MOCK_CATEGORIES: string[] = ['Main Course', 'Desserts', 'Entrées', 'Beverages', 'Sides'];

export const MOCK_ITEMS: IItem[] = [
    {
        type: 'MAIN',
        name: 'Tacos XL',
        illustration: 'https://via.placeholder.com/150',
        duration: 15,
        price: 15,
        status: 'Available',
        ingredients: ['Chicken', 'Cheese', 'Tomato'],
        keywords: ['Spicy'],
        categories: ['Main Course'],
        itemId: '1',
        sections: []
    },
    {
        type: 'MAIN',
        name: 'Tacos M',
        illustration: 'https://via.placeholder.com/150',
        duration: 10,
        price: 12,
        status: 'Available',
        ingredients: ['Lettuce', 'Chili', 'Sausage'],
        keywords: ['Popular'],
        categories: ['Main Course'],
        itemId: '2',
        sections: []
    },
    {
        type: 'MAIN',
        name: 'Burger Deluxe',
        illustration: 'https://via.placeholder.com/150',
        duration: 20,
        price: 18,
        status: 'Available',
        ingredients: ['Beef', 'Cheese', 'Onion'],
        keywords: ['Chef Special'],
        categories: ['Main Course'],
        itemId: '3',
        sections: []
    },
    {
        type: 'DESSERT',
        name: 'Chocolate Cake',
        illustration: 'https://via.placeholder.com/150',
        duration: 10,
        price: 8,
        status: 'Available',
        ingredients: ['Chocolate', 'Flour', 'Sugar'],
        keywords: ['Vegetarian'],
        categories: ['Desserts'],
        itemId: '4',
        sections: []
    },
    {
        type: 'DESSERT',
        name: 'Fruit Salad',
        illustration: 'https://via.placeholder.com/150',
        duration: 5,
        price: 6,
        status: 'Available',
        ingredients: ['Apple', 'Banana', 'Carrot'],
        keywords: ['Low Calorie'],
        categories: ['Desserts'],
        itemId: '5',
        sections: []
    },
    {
        type: 'ADDITIONAL',
        name: 'French Fries',
        illustration: 'https://via.placeholder.com/150',
        duration: 5,
        price: 4,
        status: 'Available',
        ingredients: ['Potato', 'Salt'],
        keywords: ['Popular'],
        categories: ['Sides'],
        itemId: '6',
        sections: []
    },
    {
        type: 'ADDITIONAL',
        name: 'Onion Rings',
        illustration: 'https://via.placeholder.com/150',
        duration: 7,
        price: 5,
        status: 'Available',
        ingredients: ['Onion', 'Flour', 'Oil'],
        keywords: ['Vegetarian'],
        categories: ['Sides'],
        itemId: '7',
        sections: []
    },
    {
        type: 'ENTRÉE',
        name: 'Spring Rolls',
        illustration: 'https://via.placeholder.com/150',
        duration: 8,
        price: 9,
        status: 'Available',
        ingredients: ['Carrot', 'Cabbage', 'Flour'],
        keywords: ['Vegetarian', 'Popular'],
        categories: ['Entrées'],
        itemId: '8',
        sections: []
    },
    {
        type: 'ENTRÉE',
        name: 'Garlic Bread',
        illustration: 'https://via.placeholder.com/150',
        duration: 5,
        price: 3,
        status: 'Available',
        ingredients: ['Bread', 'Garlic', 'Butter'],
        keywords: ['Vegetarian'],
        categories: ['Entrées'],
        itemId: '9',
        sections: []
    },
    {
        type: 'BEVERAGE',
        name: 'Lemonade',
        illustration: 'https://via.placeholder.com/150',
        duration: 2,
        price: 3,
        status: 'Available',
        ingredients: ['Lemon', 'Sugar', 'Water'],
        keywords: ['Low Calorie'],
        categories: ['Beverages'],
        itemId: '10',
        sections: []
    },
];

export const MOCK_SECTIONS: Section[] = [
    {
        name: 'Main Dishes',
        type: 'MAIN',
        position: 1,
        choiceLimitMax: 3,
        choiceLimitMin: 1,
        sectionId: '1',
        items: MOCK_ITEMS.filter((_, index) => [0, 1, 2].includes(index)),
    },
    {
        name: 'Desserts',
        type: 'DESSERT',
        position: 2,
        choiceLimitMax: 2,
        choiceLimitMin: 1,
        sectionId: '2',
        items: MOCK_ITEMS.filter((_, index) => [3, 4].includes(index)),
    },
    {
        name: 'Sides',
        type: 'ADDITIONAL',
        position: 3,
        choiceLimitMax: 2,
        choiceLimitMin: 1,
        sectionId: '3',
        items: MOCK_ITEMS.filter((_, index) => [5, 6].includes(index)),
    },
    {
        name: 'Entrées',
        type: 'ENTRÉE',
        position: 4,
        choiceLimitMax: 2,
        choiceLimitMin: 1,
        sectionId: '4',
        items: MOCK_ITEMS.filter((_, index) => [7, 8].includes(index)),
    },
    {
        name: 'Beverages',
        type: 'BEVERAGE',
        position: 5,
        choiceLimitMax: 1,
        choiceLimitMin: 0,
        sectionId: '5',
        items: MOCK_ITEMS.filter((_, index) => [9].includes(index)),
    },
];

