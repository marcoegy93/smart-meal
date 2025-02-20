using smart_meal_back.Contracts;

namespace smart_meal_back.IServices
{
    public interface IMailSender
    {
        Task SendRestaurantCreationMail (string emailDestinataire, Restaurant restaurant);
    }
}
