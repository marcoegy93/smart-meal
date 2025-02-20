using smart_meal_back.Contracts;
using smart_meal_back.Enums;
using smart_meal_back.IRepositories;
using smart_meal_back.IServices;
using smart_meal_back.Models;
using smart_meal_back.Utils;
using static System.Collections.Specialized.BitVector32;
using Section = smart_meal_back.Contracts.Section;

namespace smart_meal_back.Services;

public class ItemsService : IItemsService
{
    private readonly IItemsRepository _itemsRepository;

    public ItemsService(IItemsRepository itemsRepository)
    {
        _itemsRepository = itemsRepository;
    }

    public List<ItemModel> GetItemsFromARestaurant(int restaurantId, Criteria criteria)
    {
        return _itemsRepository.GetItemsFromARestaurant(restaurantId, criteria);
    }

    public void CreateOrUpdateProduct(int restaurantId, Item newItem)
    {
        int itemId;
        if (newItem.ItemId != null)
        {
            itemId = _itemsRepository.UpdateProduct(restaurantId, newItem, null);
        }
        else
        {
            itemId = _itemsRepository.CreateProduct(restaurantId, newItem, null);
        }

        if (newItem.Type == ItemType.COMPOUND)
        {
            var sectionsToKeep = newItem.Sections?.Select(s => s.SectionId).ToList();
            if(sectionsToKeep != null)
            {
                _itemsRepository.RemoveOldSectionsFromCompoundItem(itemId, string.Join(",", sectionsToKeep));
            }
            int sectionId;
            newItem.Sections?.ForEach(section =>
            {
                sectionId = _itemsRepository.CreateOrUpdateSection(restaurantId, itemId, section);
                section.Items.ForEach(item =>
                {
                    if (item.Type == ItemType.SIMPLE)
                    {
                        if (item.ItemId == null)
                        {
                            _itemsRepository.CreateProduct(restaurantId, item, sectionId);
                        }
                        else
                        {
                            _itemsRepository.UpdateProduct(restaurantId, item, sectionId);
                        }
                    }
                    else
                    {
                        throw new Exception("A compound item cannot contain another compound item.");
                    }
                });
            });
        }
    }

    List<string> IItemsService.GetAllIngredients(int restaurantId)
    {
        return _itemsRepository.GetAllIngredients(restaurantId);
    }

    List<SectionModel> IItemsService.GetAllSections(int restaurantId)
    {
        return _itemsRepository.GetAllSections(restaurantId);
    }

    List<string> IItemsService.GetAllKeywords(int restaurantId)
    {
        return _itemsRepository.GetAllKeywords(restaurantId);
    }

    List<string> IItemsService.GetAllCategories(int restaurantId)
    {
        return _itemsRepository.GetAllCategories(restaurantId);
    }

    public void UpdateSection(int restaurantId, Section section)
    {
        int sectionId = _itemsRepository.CreateOrUpdateSection(restaurantId, section.ItemId, section);
        section.Items.ForEach(item =>
        {
            if (item.Type == ItemType.SIMPLE)
            {
                if (item.ItemId == null)
                {
                    _itemsRepository.CreateProduct(restaurantId, item, sectionId);
                }
                else
                {
                    _itemsRepository.UpdateProduct(restaurantId, item, sectionId);
                }
            }
            else
            {
                throw new Exception("A compound item cannot contain another compound item.");
            }
        });

    }

    public ItemModel? GetItemById(int itemId)
    {
        return _itemsRepository.GetItemById(itemId);
    }

    public void RemoveItem(int itemId)
    {
        _itemsRepository.RemoveItem(itemId);
    }

    public void RemoveSection(int sectionId)
    {
        _itemsRepository.RemoveSection(sectionId);
    }
}