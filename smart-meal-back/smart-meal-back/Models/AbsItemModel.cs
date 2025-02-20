using smart_meal_back.Enums;

namespace smart_meal_back.Models;

public abstract class AbsItemModel
{
    public int? ItemId { get; set; }
    public string Name { get; set; }
    public string Illustration { get; set; }
    public ItemType Type { get; set; }
}