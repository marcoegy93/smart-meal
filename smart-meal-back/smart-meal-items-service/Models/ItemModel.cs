using smart_meal_items_service.Enums;
using smart_meal_items_service.Models;

public class ItemModel : AbsItemModel
{
    public int RestaurantId { get; set; }
    public ItemType Type { get; set; }
    public int Duration { get; set; }
    public double Price { get; set; }
    public ItemStatus Status { get; set; }
    public int? SectionId { get; set; }
    public string? IngredientsString { get; set; }
    public string? KeywordsString { get; set; }
    public string? CategoriesString { get; set; }
    public string? Description { get; set; }

    public List<string>? Ingredients => IngredientsString?.Split(',').ToList();
    public List<string>? Keywords => KeywordsString?.Split(',').ToList();
    public List<string>? Categories => CategoriesString?.Split(',').ToList();
    public List<SectionModel>? Sections { get; set; }
}