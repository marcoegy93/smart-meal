﻿using smart_meal_items_service.Contracts;
using smart_meal_items_service.Models;
using smart_meal_items_service.Utils;

namespace smart_meal_items_service.Repositories;

public interface IItemsRepository
{
    List<ItemModel> GetItemsFromARestaurant(int restaurantId, Criteria criteria);
    int CreateProduct(int restaurantId, SimpleItem newItem, int? sectionId);
    int UpdateProduct(int restaurantId, SimpleItem item, int? sectionId);
    int CreateOrUpdateSection(int restaurantId, int itemId, Section section);
    List<string> GetAllCategories(int restaurantId);
    List<string> GetAllKeywords(int restaurantId);
    List<SectionModel> GetAllSections(int restaurantId);
    List<string> GetAllIngredients(int restaurantId);
    ItemModel? GetItemById(int itemId);
    void RemoveItem(int itemId);
    void RemoveSection(int sectionId);
    void RemoveOldSectionsFromCompoundItem(int itemId, string v);
}