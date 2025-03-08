using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using smart_meal_restaurant_service.Contracts;
using smart_meal_restaurant_service.Repositories;
using smart_meal_restaurant_service.Services;
using smart_meal_restaurant_service.Models;

namespace smart_meal_restaurant_service.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRestaurantRepository _restaurantRepository;
        private readonly IMailSender _mailSender;
        private readonly IConfiguration _config;



        public RestaurantService(IRestaurantRepository restaurantRepository, IMailSender mailSender, IConfiguration config)
        {
            _restaurantRepository = restaurantRepository;
            _mailSender = mailSender;
            _config = config;
        }

        public int CreateOrUpdateRestaurantAndAccounts(Restaurant restaurant)
        {
            int restaurantId;

            try
            {
                if (restaurant.RestaurantId == null)
                {
                    restaurantId = _restaurantRepository.CreateRestaurantAndAccounts(restaurant);
                    restaurant.RestaurantId = restaurantId;
                    _ = _mailSender.SendRestaurantCreationMail(restaurant.Admin.Email, restaurant);
                }
                else
                {
                    restaurantId = _restaurantRepository.UpdateRestaurantAndAccounts(restaurant);
                }

                return restaurantId;
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Cet email existe déjà"))
                {
                    throw new Exception("L'email est déjà utilisé. Veuillez en choisir un autre.");
                }
                throw new Exception("Une erreur est survenue lors de la création ou mise à jour du restaurant.", ex);
            }
        }


        public List<RestaurantModel> GetAllRestaurants()
        {
            return _restaurantRepository.GetAllRestaurants();
        }

        public RestaurantModel? GetRestaurantById(int restaurantId)
        {
            return _restaurantRepository.GetRestaurantById(restaurantId);
        }

        public UserTokenModel? UserAuthentification(UserAuthentification userAuth)
        {
            try
            {
                UserModel? user = _restaurantRepository.UserAuthentification(userAuth);
                if (user != null && BCrypt.Net.BCrypt.Verify(userAuth.Password, user.Password))
                {
                    return new UserTokenModel
                    {
                        Token = GenerateJwtToken(user),
                        User = new UserModel
                        {
                            AdministratorId = user.AdministratorId,
                            RestaurantId = user.RestaurantId,
                            RestaurantName = user.RestaurantName,
                            RestaurantAddress = user.RestaurantAddress,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            Phone = user.Phone,
                            Illustration = user.Illustration,
                            Role = user.Role,
                            RestaurantPicture = user.RestaurantPicture,
                            RestaurantSiret = user.RestaurantSiret,
                            RestaurantTva = user.RestaurantTva
                        }
                    };
                }
                return null;
            }
            catch { return null; }
        }


        private string GenerateJwtToken(UserModel user)
        {
            // Récupération des paramètres JWT depuis la configuration
            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_TOKEN_KEY")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Ajout des claims (informations dans le token)
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim("AdministratorId", user.AdministratorId.ToString()),
            new Claim("RestaurantId", user.RestaurantId.ToString()),
            new Claim("FirstName", user.FirstName),
            new Claim("LastName", user.LastName),
            new Claim("Phone", user.Phone),
            new Claim("Role", user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique ID
            };

            // Création du token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(7), // Expiration : 7 heures
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public List<SalesAndRevenueModel> SalesAndRevenue(int restaurantId, string fromDate)
        {
            return _restaurantRepository.SalesAndRevenue(restaurantId, fromDate);
        }
    }
}
