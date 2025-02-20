using smart_meal_back.Enums;

namespace smart_meal_back.Utils;

public class Criteria
{
    public List<string>? Ingredients { get; set; }
    public List<string>? Categories { get; set; }
    public ItemType? Type { get; set; }
    public Duration? Duration { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
