using smart_meal_items_service.Contracts;
using smart_meal_items_service.Models;
using smart_meal_items_service.Utils;

namespace smart_meal_items_service.Services;

public interface IItemsService
{
    List<ItemModel> GetItemsFromARestaurant(int restaurantId, Criteria criteria);
    void CreateOrUpdateProduct(int restaurantId, Item newItem);
    List<string> GetAllIngredients(int restaurantId);
    List<SectionModel> GetAllSections(int restaurantId);
    List<string> GetAllKeywords(int restaurantId);
    List<string> GetAllCategories(int restaurantId);
    void UpdateSection(int restaurantId, Section section);
    ItemModel? GetItemById(int itemId);
    void RemoveItem(int itemId);
    void RemoveSection(int sectionId);
}