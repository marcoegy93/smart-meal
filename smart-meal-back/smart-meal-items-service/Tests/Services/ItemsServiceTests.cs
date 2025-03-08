using Moq;
using smart_meal_items_service.Enums;
using smart_meal_items_service.Services;
using smart_meal_items_service.Contracts;
using NUnit.Framework;
using smart_meal_items_service.Repositories;
using smart_meal_items_service.Utils;
using smart_meal_items_service.Models;

namespace smart_meal_back_test.Services
{
    [TestFixture]
    public class ItemsServiceTests
    {
        private Mock<IItemsRepository> _itemsRepositoryMock;
        private ItemsService _itemsService;

        [SetUp]
        public void SetUp()
        {
            _itemsRepositoryMock = new Mock<IItemsRepository>(MockBehavior.Strict);
            _itemsService = new ItemsService(_itemsRepositoryMock.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _itemsRepositoryMock.VerifyAll();
        }

        [Test]
        public void GetItemsFromARestaurant_ShouldReturnList()
        {
            const int restaurantId = 123;
            var criteria = new Criteria();
            var expectedItems = new List<ItemModel>
            {
                new() { ItemId = 1, Name = "Item1" },
                new() { ItemId = 2, Name = "Item2" }
            };

            _itemsRepositoryMock
                .Setup(r => r.GetItemsFromARestaurant(restaurantId, criteria))
                .Returns(expectedItems);

            var result = _itemsService.GetItemsFromARestaurant(restaurantId, criteria);

            Assert.That(result, Is.EqualTo(expectedItems));
        }

        [Test]
        public void CreateOrUpdateProduct_ShouldCallCreateProduct_WhenItemIdIsNull()
        {
            int restaurantId = 1;
            var itemModel = new ItemModel
            {
                ItemId = null,
                Name = "NewItem",
                Type = ItemType.SIMPLE,
                Price = 10.0
            };

            var newItem = new Item(itemModel);

            _itemsRepositoryMock
                .Setup(r => r.CreateProduct(restaurantId, It.IsAny<SimpleItem>(), null))
                .Returns(10);

            _itemsService.CreateOrUpdateProduct(restaurantId, newItem);
        }

        [Test]
        public void CreateOrUpdateProduct_ShouldCallUpdateProduct_WhenItemIdIsNotNull()
        {
            int restaurantId = 1;
            var itemModel = new ItemModel
            {
                ItemId = 5,
                Name = "ExistingItem",
                Type = ItemType.SIMPLE,
                Price = 12.0
            };

            var existingItem = new Item(itemModel);

            _itemsRepositoryMock
                .Setup(r => r.UpdateProduct(restaurantId, It.IsAny<SimpleItem>(), null))
                .Returns(5);

            _itemsService.CreateOrUpdateProduct(restaurantId, existingItem);
        }

        [Test]
        public void CreateOrUpdateProduct_CompoundItem_ShouldCreateSectionsAndSubItems()
        {
            // Arrange
            int restaurantId = 1;
            var compoundItemModel = new ItemModel
            {
                ItemId = null,
                Type = ItemType.COMPOUND,
                Name = "CompoundParent",
                Sections =
                [
                    new SectionModel
                    {
                        SectionId = 1,
                        Name = "Section A",
                        Items =
                        [
                            new ItemModel { ItemId = null, Name = "SubItemNew", Type = ItemType.SIMPLE },
                            new ItemModel { ItemId = 20, Name = "SubItemExisting", Type = ItemType.SIMPLE }
                        ]
                    }
                ]
            };
            var compoundItem = new Item(compoundItemModel);

            var expectedSectionsString = string.Join(",", compoundItemModel.Sections.Select(s => s.SectionId).ToList());
            Console.WriteLine($"Expected Sections String: {expectedSectionsString}");

            _itemsRepositoryMock
                .Setup(r => r.CreateProduct(restaurantId, It.IsAny<SimpleItem>(), null))
                .Returns(100)
                .Verifiable();

            _itemsRepositoryMock
                .Setup(r => r.CreateOrUpdateSection(restaurantId, 100, It.IsAny<Section>()))
                .Returns(200)
                .Verifiable();

            _itemsRepositoryMock
                .Setup(r => r.CreateProduct(restaurantId, It.IsAny<SimpleItem>(), 200))
                .Returns(300)
                .Verifiable();

            _itemsRepositoryMock
                .Setup(r => r.UpdateProduct(restaurantId, It.IsAny<SimpleItem>(), 200))
                .Returns(20)
                .Verifiable();

            _itemsRepositoryMock
                .Setup(r => r.RemoveOldSectionsFromCompoundItem(It.IsAny<int>(), It.IsAny<string>()))
                .Verifiable();

            // Act
            _itemsService.CreateOrUpdateProduct(restaurantId, compoundItem);

            // Assert 
            _itemsRepositoryMock.VerifyAll();
        }


        [Test]
        public void RemoveItem_ShouldCallRepositoryRemoveItem()
        {
            int itemId = 999;

            _itemsRepositoryMock
                .Setup(r => r.RemoveItem(itemId))
                .Verifiable();

            _itemsService.RemoveItem(itemId);
        }

        [Test]
        public void GetItemById_ShouldReturnItemModel_WhenItemExists()
        {
            int itemId = 1;
            var expectedModel = new ItemModel { ItemId = 1, Name = "TestItem" };

            _itemsRepositoryMock
                .Setup(r => r.GetItemById(itemId))
                .Returns(expectedModel);

            var result = _itemsService.GetItemById(itemId);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.ItemId, Is.EqualTo(1));
        }

        [Test]
        public void GetItemById_ShouldReturnNull_WhenItemDoesNotExist()
        {
            const int itemId = 9999;
            _itemsRepositoryMock
                .Setup(r => r.GetItemById(itemId))
                .Returns((ItemModel)null);

            var result = _itemsService.GetItemById(itemId);

            Assert.IsNull(result);
        }

        [Test]
        public void GetAllIngredients_ShouldReturnListOfIngredients()
        {
            const int restaurantId = 1;
            var expected = new List<string> { "Tomato", "Cheese" };

            _itemsRepositoryMock
                .Setup(r => r.GetAllIngredients(restaurantId))
                .Returns(expected);

            var result = ((IItemsService)_itemsService).GetAllIngredients(restaurantId);

            Assert.That(result, Is.EqualTo(expected));
        }
    }
}