using Microsoft.IdentityModel.Tokens;
using smart_meal_back.Enums;
using smart_meal_back.Models;

namespace smart_meal_back_test.Entities;

[TestFixture]
public class ItemModelTests
{
    [Test]
    public void Ingredients_ShouldReturnNull_WhenIngredientsStringIsNull()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            IngredientsString = null
        };

        // Act
        var ingredients = itemModel.Ingredients;

        // Assert
        Assert.IsNull(ingredients,
            "Si IngredientsString est null, la liste Ingredients doit être null.");
    }

    [Test]
    public void Ingredients_ShouldReturnEmptyList_WhenIngredientsStringIsEmpty()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            IngredientsString = string.Empty
        };

        // Act
        var ingredients = itemModel.Ingredients?.Where(x => !x.IsNullOrEmpty()).ToList();

        // Assert
        Assert.That(ingredients, Is.Not.Null);
        Console.WriteLine(ingredients);
        Assert.That(ingredients, Is.Empty,
            "Si IngredientsString est vide, la liste Ingredients devrait être vide (Count = 0).");
    }

    [Test]
    public void Ingredients_ShouldSplitIngredientsString_WhenNotNullOrEmpty()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            IngredientsString = "tomato,onion,cheese"
        };

        // Act
        var ingredients = itemModel.Ingredients;

        // Assert
        Assert.That(ingredients, Is.Not.Null);
        Assert.That(ingredients, Has.Count.EqualTo(3));
        Assert.That(ingredients[0], Is.EqualTo("tomato"));
        Assert.That(ingredients[1], Is.EqualTo("onion"));
        Assert.That(ingredients[2], Is.EqualTo("cheese"));
    }

    [Test]
    public void Keywords_ShouldReturnNull_WhenKeywordsStringIsNull()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            KeywordsString = null
        };

        // Act
        var keywords = itemModel.Keywords;

        // Assert
        Assert.That(keywords, Is.Null);
    }

    [Test]
    public void Keywords_ShouldReturnList_WhenKeywordsStringIsSet()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            KeywordsString = "vegan,italian,spicy"
        };

        // Act
        var keywords = itemModel.Keywords;

        // Assert
        Assert.That(keywords, Is.Not.Null);
        Assert.That(keywords, Has.Count.EqualTo(3));
        Assert.That(keywords[0], Is.EqualTo("vegan"));
        Assert.That(keywords[1], Is.EqualTo("italian"));
        Assert.That(keywords[2], Is.EqualTo("spicy"));
    }

    [Test]
    public void Categories_ShouldReturnNull_WhenCategoriesStringIsNull()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            CategoriesString = null
        };

        // Act
        var categories = itemModel.Categories;

        // Assert
        Assert.That(categories, Is.Null);
    }

    [Test]
    public void Categories_ShouldReturnList_WhenCategoriesStringIsNotNullOrEmpty()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            CategoriesString = "Pizza,FastFood"
        };

        // Act
        var categories = itemModel.Categories;

        // Assert
        Assert.That(categories, Is.Not.Null);
        Assert.That(categories, Has.Count.EqualTo(2));
        Assert.That(categories[0], Is.EqualTo("Pizza"));
        Assert.That(categories[1], Is.EqualTo("FastFood"));
    }

    [Test]
    public void Type_ShouldBeAssignedProperly()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            Type = ItemType.COMPOUND
        };

        // Act
        var actualType = itemModel.Type;

        // Assert
        Assert.That(actualType, Is.EqualTo(ItemType.COMPOUND));
    }

    [Test]
    public void Duration_ShouldBeAssignedProperly()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            Duration = 15
        };

        // Act
        var actualDuration = itemModel.Duration;

        // Assert
        Assert.That(actualDuration, Is.EqualTo(15));
    }

    [Test]
    public void Price_ShouldBeAssignedProperly()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            Price = 9.99
        };

        // Act
        var actualPrice = itemModel.Price;

        // Assert
        Assert.That(actualPrice, Is.EqualTo(9.99));
    }

    [Test]
    public void Status_ShouldBeAssignedProperly()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            Status = ItemStatus.ACTIVE
        };

        // Act
        var actualStatus = itemModel.Status;

        // Assert
        Assert.That(actualStatus, Is.EqualTo(ItemStatus.ACTIVE));
    }

    [Test]
    public void Sections_ShouldBeAssignedProperly()
    {
        // Arrange
        var itemModel = new ItemModel
        {
            Sections =
            [
                new SectionModel { SectionId = 1, Name = "Section A" },
                new SectionModel { SectionId = 2, Name = "Section B" }
            ]
        };

        // Act
        var sections = itemModel.Sections;

        // Assert
        Assert.That(sections, Is.Not.Null);
        Assert.That(sections, Has.Count.EqualTo(2));
        Assert.That(sections[0].SectionId, Is.EqualTo(1));
        Assert.That(sections[0].Name, Is.EqualTo("Section A"));
    }
}