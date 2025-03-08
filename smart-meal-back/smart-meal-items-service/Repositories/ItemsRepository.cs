using Dapper;
using smart_meal_items_service.Contracts;
using smart_meal_items_service.Models;
using smart_meal_items_service.Utils;
using System.Data;

namespace smart_meal_items_service.Repositories;

public class ItemsRepository : IItemsRepository
{
    private readonly DapperDBContext _dBContext;

    public ItemsRepository(DapperDBContext dBContext)
    {
        _dBContext = dBContext;
    }

    public List<ItemModel> GetItemsFromARestaurant(int restaurantId, Criteria criteria)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        using var multi = connection.QueryMultiple(
            "GetItemsFromARestaurant",
            new
            {
                RestaurantId = restaurantId,
                Ingredients = criteria.Ingredients != null ? string.Join(",", criteria.Ingredients) : null,
                criteria.Duration,
                criteria.MinPrice,
                criteria.MaxPrice,
                criteria.Type,
                Categories = criteria.Categories != null ? string.Join(",", criteria.Categories) : null
            },
            commandType: CommandType.StoredProcedure);
        var itemList = multi.Read<ItemModel>().ToList();

        if (criteria.Type == null || criteria.Type == Enums.ItemType.COMPOUND)
        {
            var sectionsList = multi.Read<SectionModel>().ToList();
            var itemsForSectionsList = multi.Read<ItemModel>().ToList();
            var sectionsDict = sectionsList
            .GroupBy(s => s.ItemId)
            .ToDictionary(g => g.Key, g => g.Select(s =>
            {
                return new SectionModel
                {
                    ItemId = s.ItemId,
                    SectionId = s.SectionId,
                    Position = s.Position,
                    Name = s.Name,
                    Type = s.Type,
                    ChoiceLimitMax = s.ChoiceLimitMax,
                    ChoiceLimitMin = s.ChoiceLimitMin
                                   };
            }).ToList());

            var itemsForSectionsDict = itemsForSectionsList
                .GroupBy(i => (int)i.SectionId)
                .ToDictionary(g => g.Key, g => g.Select(i => new ItemModel
                {
                    ItemId = i.ItemId,
                    Name = i.Name,
                    Price = i.Price,
                    Duration = i.Duration,
                    Status = i.Status,
                    Type = i.Type,
                    Illustration = i.Illustration,
                    IngredientsString = i.IngredientsString,
                    CategoriesString = i.CategoriesString,
                    KeywordsString = i.KeywordsString,
                    Description = i.Description
                }).ToList());

            foreach (var item in itemList)
            {
                item.Sections = sectionsDict.TryGetValue((int)item.ItemId, out List<SectionModel>? SectionValue) ? SectionValue : null;
                if(item.Sections?.Count > 0)
                {
                    foreach (var section in item.Sections)
                    {
                        section.Items = itemsForSectionsDict.TryGetValue(section.SectionId, out List<ItemModel>? items) ? items : [];
                    }
                }
            }
        }
        return itemList;
    }

    public int CreateProduct(int restaurantId, SimpleItem newItem, int? sectionId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.QuerySingle<int>(
                 "CreateProduct",
                 new
                 {
                     RestaurantId = restaurantId,
                     newItem.Name,
                     newItem.Illustration,
                     newItem.Duration,
                     newItem.Price,
                     newItem.Status,
                     newItem.Type,
                     Ingredients = newItem.Ingredients != null ? string.Join(",", newItem.Ingredients) : null,
                     Keywords = newItem.Keywords != null ? string.Join(",", newItem.Keywords) : null,
                     Categories = newItem.Categories != null ? string.Join(",", newItem.Categories) : null,
                     SectionId = sectionId ?? (object)DBNull.Value,
                     newItem.Description
                 },
                 commandType: CommandType.StoredProcedure
             );
        }
        catch (Exception e)
        {
            throw new Exception(e.Message.ToString());
        }
    }

    public int CreateOrUpdateSection(int restaurantId, int itemId, Section section)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.QuerySingle<int>(
                 "CreateOrUpdateSection",
                 new
                 {
                     RestaurantId = restaurantId,
                     itemId,
                     sectionId = section.SectionId ?? (object)DBNull.Value,
                     section.Name,
                     section.Type,
                     section.ChoiceLimitMax,
                     section.ChoiceLimitMin,
                     section.Position
                 },
                 commandType: CommandType.StoredProcedure
             );
        }
        catch (Exception e)
        {
            throw new Exception(e.Message.ToString());
        }
    }

    public int UpdateProduct(int restaurantId, SimpleItem item, int? sectionId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.QuerySingle<int>(
                 "UpdateProduct",
                 new
                 {
                     RestaurantId = restaurantId,
                     item.Name,
                     item.ItemId,
                     item.Illustration,
                     item.Duration,
                     item.Price,
                     item.Status,
                     item.Type,
                     Ingredients = item.Ingredients != null ? string.Join(",", item.Ingredients) : null,
                     Keywords = item.Keywords != null ? string.Join(",", item.Keywords) : null,
                     Categories = item.Categories != null ? string.Join(",", item.Categories) : null,
                     SectionId = sectionId ?? (object)DBNull.Value,
                     item.Description
                 },
                 commandType: CommandType.StoredProcedure
             );
        }
        catch (Exception e)
        {
            throw new Exception(e.Message.ToString());
        }
    }

    public List<string> GetAllCategories(int restaurantId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        var categories = connection.Query<string>(
            "GetAllCategoriesFromARestaurant",
            new { RestaurantId = restaurantId },
            commandType: CommandType.StoredProcedure
        ).ToList();
        return categories;
    }

    public List<string> GetAllKeywords(int restaurantId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        var keywords = connection.Query<string>(
            "GetAllKeywordsFromARestaurant",
            new { RestaurantId = restaurantId },
            commandType: CommandType.StoredProcedure
        ).ToList();
        return keywords;
    }

    public List<SectionModel> GetAllSections(int restaurantId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        using var multi = connection.QueryMultiple(
            "GetAllSectionsFromARestaurant",
            new { RestaurantId = restaurantId },
            commandType: CommandType.StoredProcedure);
        var sections = multi.Read<SectionModel>().ToList();
        var itemsForSectionsList = multi.Read<ItemModel>().ToList();

        var itemsForSectionsDict = itemsForSectionsList
            .GroupBy(i => (int)i.SectionId)
            .ToDictionary(g => g.Key, g => g.Select(i => new ItemModel
            {
                ItemId = i.ItemId,
                Name = i.Name,
                Price = i.Price,
                Duration = i.Duration,
                Status = i.Status,
                Type = i.Type,
                Illustration = i.Illustration,
                IngredientsString = i.IngredientsString,
                CategoriesString = i.CategoriesString,
                KeywordsString = i.KeywordsString,
                Description = i.Description
            }).ToList());

        foreach (var section in sections)
        {
            section.Items = itemsForSectionsDict.TryGetValue(section.SectionId, out List<ItemModel>? value) ? value : [];
        }

        return sections;
    }

    public List<string> GetAllIngredients(int restaurantId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        var ingredients = connection.Query<string>(
            "GetAllIngredientsFromARestaurant",
            new { RestaurantId = restaurantId },
            commandType: CommandType.StoredProcedure
        ).ToList();
        return ingredients;
    }

    public ItemModel? GetItemById(int itemId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        using var multi = connection.QueryMultiple("GetItemById", new { ItemId = itemId }, commandType: CommandType.StoredProcedure);
        var item = multi.Read<ItemModel>().FirstOrDefault();
        if (item != null && item.Type == Enums.ItemType.COMPOUND)
        {
            item.Sections = multi.Read<SectionModel>().ToList();
            if (item.Sections.Count > 0)
            {
                var itemsForSectionsList = multi.Read<ItemModel>().ToList();
                var itemsForSectionsDict = itemsForSectionsList
                    .GroupBy(i => (int)i.SectionId)
                    .ToDictionary(g => g.Key, g => g.Select(i => new ItemModel
                    {
                        ItemId = i.ItemId,
                        Name = i.Name,
                        Price = i.Price,
                        Duration = i.Duration,
                        Status = i.Status,
                        Type = i.Type,
                        Illustration = i.Illustration,
                        IngredientsString = i.IngredientsString,
                        CategoriesString = i.CategoriesString,
                        KeywordsString = i.KeywordsString,
                        Description = i.Description
                    }).ToList());

                foreach (var section in item.Sections)
                {
                    section.Items = itemsForSectionsDict.TryGetValue(section.SectionId, out List<ItemModel>? value) ? value : [];
                }
            }
        }
        return item;
    }

    public void RemoveItem(int itemId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            connection.Execute(
                "RemoveItem",
                new { ItemId = itemId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (Exception e)
        {
            throw new Exception(e.Message.ToString());
        }
    }

    public void RemoveSection(int sectionId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            connection.Execute(
                "RemoveSection",
                new { SectionId = sectionId },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (Exception e)
        {
            throw new Exception(e.Message.ToString());
        }
    }

    public void RemoveOldSectionsFromCompoundItem(int itemId, string sectionIds)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();

        var parameters = new DynamicParameters();
        parameters.Add("@ItemId", itemId);
        parameters.Add("@SectionIds", sectionIds);

        connection.Execute("RemoveOldSectionsFromCompoundItem", parameters, commandType: CommandType.StoredProcedure);
    }
}