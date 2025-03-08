using Newtonsoft.Json;
using smart_meal_items_service.Enums;
using smart_meal_items_service.Models;

namespace smart_meal_items_service.Contracts;

public class Section
{
    public Section(SectionModel section)
    {
        SectionId = section.SectionId;
        Name = section.Name;
        Type = section.Type;
        Position = section.Position;
        ChoiceLimitMax = section.ChoiceLimitMax;
        ChoiceLimitMin = section.ChoiceLimitMin;
        ItemId = section.ItemId;
        Items = section.Items.Select(item => (SimpleItem)item).ToList();   
    }

    [JsonConstructor]
    public Section(
      int? sectionId,
      string name,
      SectionType type,
      int? position,
      int choiceLimitMax,
      int choiceLimitMin,
      List<SimpleItem> items)
    {
        SectionId = sectionId;
        Name = name;
        Type = type;
        Position = position;
        ChoiceLimitMax = choiceLimitMax;
        ChoiceLimitMin = choiceLimitMin;
        Items = items;
    }

    public int? SectionId { get; set; }
    public string Name { get; set; }
    public int ItemId { get; set; }

    public SectionType Type { get; set; }
    public int? Position { get; set; }
    public int ChoiceLimitMax { get; set; }
    public int ChoiceLimitMin { get; set; }
    public List<SimpleItem> Items { get; set; }

    public static explicit operator Section(SectionModel section) => new(section);
}
