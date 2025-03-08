using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using smart_meal_items_service.Contracts;
using smart_meal_items_service.Controllers;
using smart_meal_items_service.Enums;
using smart_meal_items_service.Models;
using smart_meal_items_service.Services;
using smart_meal_items_service.Utils;


namespace smart_meal_back_test.Controllers;

[TestFixture]
public class ItemsControllerTests
{
    private Mock<IItemsService> _itemsServiceMock;
    private ItemsController _controller;

    [SetUp]
    public void SetUp()
    {
        _itemsServiceMock = new Mock<IItemsService>(MockBehavior.Strict);
        _controller = new ItemsController(_itemsServiceMock.Object);
    }

    [TearDown]
    public void TearDown()
    {
        _itemsServiceMock.VerifyAll();
    }
    
    [Test]
    public void GetItemsFromARestaurant_ShouldReturnListOfItems()
    {
        // Arrange
        const int restaurantId = 1;
        var criteria = new Criteria();
        var itemModels = new List<ItemModel>
        {
            new() { ItemId = 1, Name = "Item1", Type = ItemType.SIMPLE },
            new() { ItemId = 2, Name = "Item2", Type = ItemType.SIMPLE }
        };

        _itemsServiceMock
            .Setup(s => s.GetItemsFromARestaurant(restaurantId, criteria))
            .Returns(itemModels);

        // Act
        var actionResult = _controller.GetItemsFromARestaurant(restaurantId, criteria);

        // Assert
        Assert.That(actionResult, Is.Not.Null);
        
        var items = actionResult.Value;
        Assert.That(items, Is.Not.Null);
        Assert.That(items, Has.Count.EqualTo(2));

        Assert.That(items[0].ItemId, Is.EqualTo(1));
        Assert.That(items[0].Name, Is.EqualTo("Item1"));
    }
    
    [Test]
    public void GetItemById_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        const int itemId = 1;
        _itemsServiceMock
            .Setup(s => s.GetItemById(itemId))
            .Returns((ItemModel)null);

        // Act
        var actionResult = _controller.GetItemById(itemId);

        // Assert
        Assert.That(actionResult.Result, Is.InstanceOf<NotFoundResult>());
    }
    
    [Test]
    public void GetItemById_ShouldReturnItem_WhenItemExists()
    {
        // Arrange
        const int itemId = 1;
        var itemModel = new ItemModel { ItemId = itemId, Name = "Test Item", Type = ItemType.SIMPLE };

        _itemsServiceMock
            .Setup(s => s.GetItemById(itemId))
            .Returns(itemModel);

        // Act
        var actionResult = _controller.GetItemById(itemId);

        // Assert
        Assert.That(actionResult, Is.Not.Null, "L'action ne doit pas retourner un résultat null.");

        var okResult = actionResult.Result as OkObjectResult;
        Assert.That(okResult, Is.Not.Null, "Le résultat OkObjectResult ne doit pas être null.");
        Assert.That(okResult!.Value, Is.Not.Null, "La valeur retournée dans OkObjectResult ne doit pas être null.");

        var item = okResult.Value as Item;
        Assert.That(item, Is.Not.Null, "La conversion de ItemModel en Item a échoué.");

        Assert.That(item!.ItemId, Is.EqualTo(itemId), "L'ID de l'item ne correspond pas.");
        Assert.That(item.Name, Is.EqualTo("Test Item"), "Le nom de l'item ne correspond pas.");
    }
    
    [Test]
    public void CreateOrUpdateProduct_ShouldReturnOkWithAdditionMessage_WhenItemIdIsNull()
    {
        // Arrange
        const int restaurantId = 1;
        var itemModel = new ItemModel { ItemId = null, Name = "New Item", Type = ItemType.SIMPLE };
        var item = new Item(itemModel);

        _itemsServiceMock.Setup(s => s.CreateOrUpdateProduct(restaurantId, item));

        // Act
        var actionResult = _controller.CreateOrUpdateProduct(restaurantId, item);

        // Assert
        var okResult = actionResult as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);
        var message = okResult.Value as string;
        Assert.That(message, Does.Contain("Addition completed successfully."));
    }
    
    [Test]
    public void CreateOrUpdateProduct_ShouldReturnOkWithModificationMessage_WhenItemIdIsNotNull()
    {
        // Arrange
        const int restaurantId = 1;
        var itemModel = new ItemModel { ItemId = 10, Name = "Existing Item", Type = ItemType.SIMPLE };
        var item = new Item(itemModel);

        _itemsServiceMock.Setup(s => s.CreateOrUpdateProduct(restaurantId, item));

        // Act
        var actionResult = _controller.CreateOrUpdateProduct(restaurantId, item);

        // Assert
        var okResult = actionResult as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);
        var message = okResult.Value as string;
        Assert.That(message, Does.Contain("Modification completed successfully."));
    }
    
    [Test]
    public void RemoveItem_ShouldReturnOk()
    {
        // Arrange
        int itemId = 1;
        _itemsServiceMock.Setup(s => s.RemoveItem(itemId));

        // Act
        var actionResult = _controller.RemoveItem(itemId);

        // Assert
        var okResult = actionResult as OkObjectResult;
        Assert.IsNotNull(okResult);
        Assert.That(okResult.Value as string, Is.EqualTo("Item removed successfully."));
    }
    
    [Test]
    public void UpdateSection_ShouldReturnOk()
    {
        // Arrange
        const int restaurantId = 1;
        var sectionModel = new SectionModel
        {
            SectionId = 5,
            ItemId = 1,
            Name = "Section A",
            Type = SectionType.MAIN, // Remplacez par une valeur valide
            Position = 1,
            ChoiceLimitMax = 1,
            ChoiceLimitMin = 1,
            Items = []
        };
        var section = new Section(sectionModel);

        _itemsServiceMock.Setup(s => s.UpdateSection(restaurantId, section));

        // Act
        var actionResult = _controller.UpdateSection(restaurantId, section);

        // Assert
        var okResult = actionResult as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult.Value as string,
            Is.EqualTo($"Update of section {section.SectionId} completed successfully."));
    }
    
    [Test]
    public void RemoveSection_ShouldReturnOk()
    {
        // Arrange
        int sectionId = 5;
        _itemsServiceMock.Setup(s => s.RemoveSection(sectionId));

        // Act
        var actionResult = _controller.RemoveSection(sectionId);

        // Assert
        var okResult = actionResult as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);
        Assert.That(okResult.Value as string, Is.EqualTo("Section removed successfully."));
    }
    
    [Test]
    public void GetAllIngredients_ShouldReturnListOfStrings()
    {
        // Arrange
        int restaurantId = 1;
        var expected = new List<string> { "Tomato", "Cheese" };

        _itemsServiceMock.Setup(s => s.GetAllIngredients(restaurantId)).Returns(expected);

        // Act
        var actionResult = _controller.GetAllIngredients(restaurantId);

        // Assert
        Assert.IsInstanceOf<ActionResult<List<string>>>(actionResult);
        Assert.That(actionResult.Value, Is.EqualTo(expected));
    }

    [Test]
    public void GetAllCategories_ShouldReturnListOfStrings()
    {
        // Arrange
        int restaurantId = 1;
        var expected = new List<string> { "Pizza", "Salad" };

        _itemsServiceMock.Setup(s => s.GetAllCategories(restaurantId)).Returns(expected);

        // Act
        var actionResult = _controller.GetAllCategories(restaurantId);

        // Assert
        Assert.IsInstanceOf<ActionResult<List<string>>>(actionResult);
        Assert.That(actionResult.Value, Is.EqualTo(expected));
    }

    [Test]
    public void GetAllKeywords_ShouldReturnListOfStrings()
    {
        // Arrange
        int restaurantId = 1;
        var expected = new List<string> { "Vegan", "Spicy" };

        _itemsServiceMock.Setup(s => s.GetAllKeywords(restaurantId)).Returns(expected);

        // Act
        var actionResult = _controller.GetAllKeywords(restaurantId);

        // Assert
        Assert.That(actionResult, Is.InstanceOf<ActionResult<List<string>>>());
        Assert.That(actionResult.Value, Is.EqualTo(expected));
    }

    [Test]
    public void GetAllSections_ShouldReturnListOfSections()
    {
        // Arrange
        const int restaurantId = 1;
        var sectionModels = new List<SectionModel>
        {
            new()
            {
                SectionId = 5, ItemId = 1, Name = "Section A", Position = 1, ChoiceLimitMax = 1, ChoiceLimitMin = 1,
                Items = []
            },
            new()
            {
                SectionId = 6, ItemId = 1, Name = "Section B", Position = 2, ChoiceLimitMax = 1, ChoiceLimitMin = 1,
                Items = []
            }
        };

        _itemsServiceMock.Setup(s => s.GetAllSections(restaurantId)).Returns(sectionModels);

        // Act
        var actionResult = _controller.GetAllSections(restaurantId);

        // Assert
        var sections = actionResult.Value;
        Assert.That(sections, Is.Not.Null);
        Assert.That(sections, Has.Count.EqualTo(2));
    }
}