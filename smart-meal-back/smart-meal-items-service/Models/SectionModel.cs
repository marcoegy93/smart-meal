using smart_meal_items_service.Enums;

namespace smart_meal_items_service.Models;

public class SectionModel
{
    public int SectionId { get; set; }
    public int ItemId { get; set; }
    public string Name { get; set; }
    public SectionType Type { get; set; }
    public int Position { get; set; }
    public int ChoiceLimitMax { get; set; }
    public int ChoiceLimitMin { get; set; }
    public string? Description { get; set; }
    public List<ItemModel> Items { get; set; }
}
