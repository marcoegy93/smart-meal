using smart_meal_restaurant_service.Contracts;

namespace smart_meal_restaurant_service.Services;

public interface IMailSender
{
    Task SendRestaurantCreationMail (string emailDestinataire, Restaurant restaurant);
}
