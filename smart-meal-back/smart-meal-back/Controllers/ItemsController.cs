using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smart_meal_back.Contracts;
using smart_meal_back.IServices;
using smart_meal_back.Utils;
using System.Data;

namespace smart_meal_back.Controllers;

[ApiController]
[Route("api/restaurants/{restaurantId}/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemsService _itemsService;

    public ItemsController(IItemsService itemsService)
    {
        _itemsService = itemsService;
    }

    [HttpPost]
    public ActionResult<List<Item>> GetItemsFromARestaurant(int restaurantId, Criteria criteria)
    {
        return new(_itemsService.GetItemsFromARestaurant(restaurantId, criteria)
            .Select(item => (Item)item).ToList());
    }

    [HttpGet("/api/[controller]/{itemId}")]
    public ActionResult<Item> GetItemById(int itemId)
    {
        var itemModel = _itemsService.GetItemById(itemId);
        if (itemModel == null)
        {
            return NotFound();
        }
        return Ok((Item)itemModel);
    }

    [Authorize]
    [HttpPatch]
    public IActionResult CreateOrUpdateProduct(int restaurantId, Item item)
    {
        _itemsService.CreateOrUpdateProduct(restaurantId, item);
        var actionMessage = item.ItemId == null ? "Addition" : "Modification";
        return Ok($"{actionMessage} completed successfully.");
    }

    [Authorize]
    [HttpDelete("/api/[controller]/{itemId}")]
    public IActionResult RemoveItem(int itemId)
    {
        _itemsService.RemoveItem(itemId);
        return Ok($"Item removed successfully.");
    }

    [Authorize]
    [HttpPatch("section")]
    public IActionResult UpdateSection(int restaurantId, Section section)
    {
        _itemsService.UpdateSection(restaurantId, section);
        return Ok($"Update of section {section.SectionId} completed successfully.");
    }

    [Authorize]
    [HttpDelete("/api/[controller]/sections/{sectionId}")]
    public IActionResult RemoveSection(int sectionId)
    {
        _itemsService.RemoveSection(sectionId);
        return Ok($"Section removed successfully.");
    }

    [HttpGet("ingredients")]
    public ActionResult<List<string>> GetAllIngredients(int restaurantId)
    {
        return _itemsService.GetAllIngredients(restaurantId);
    }

    [HttpGet("categories")]
    public ActionResult<List<string>> GetAllCategories(int restaurantId)
    {
        return _itemsService.GetAllCategories(restaurantId);
    }

    [HttpGet("keywords")]
    public ActionResult<List<string>> GetAllKeywords(int restaurantId)
    {
        return _itemsService.GetAllKeywords(restaurantId);
    }

    [HttpGet("sections")]
    public ActionResult<List<Section>> GetAllSections(int restaurantId)
    {
        return new(_itemsService.GetAllSections(restaurantId)
            .Select(section => (Section)section).ToList());
    }

}
