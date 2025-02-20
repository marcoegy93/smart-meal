using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smart_meal_back.Contracts;
using smart_meal_back.IServices;
using smart_meal_back.Models;

namespace smart_meal_back.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class RestaurantController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpPatch]
    public IActionResult CreateOrUpdateRestaurantAndAccounts(Restaurant restaurant)
    {
        try
        {
        int restaurantId = _restaurantService.CreateOrUpdateRestaurantAndAccounts(restaurant);
        return Ok(restaurantId);
    }
        catch (Exception ex)
        {
            if (ex.Message.Contains("L'email est déjà utilisé"))
            {
                return BadRequest(new { message = ex.Message });
            }
            return StatusCode(500, new { message = "Une erreur est survenue lors de la création ou mise à jour du restaurant." });
        }
    }


    [HttpGet("{restaurantId}")]
    public ActionResult<RestaurantInfos> GetRestaurantById(int restaurantId)
    {
        RestaurantModel? restaurant = _restaurantService.GetRestaurantById(restaurantId);
        if (restaurant == null)
            return NotFound();

        return (RestaurantInfos)restaurant;
    }

    [HttpGet("getAllRestaurants")]
    public ActionResult<List<RestaurantInfos>> GetAllRestaurants()
    {
        return new(_restaurantService.GetAllRestaurants()
            .Select(restaurant => (RestaurantInfos)restaurant).ToList());
    }

    [HttpPost("Authentification")]
    public ActionResult<UserToken> UserAuthentification(UserAuthentification userAuth)
    {
        UserTokenModel? usertoken = _restaurantService.UserAuthentification(userAuth);

        if (usertoken == null)
            return NotFound();

        return (UserToken)usertoken;
    }

    [HttpGet("SalesAndRevenue/{restaurantId}/{fromDate}")]
    public ActionResult<List<SalesAndRevenueModel>> SalesAndRevenue(int restaurantId, string fromDate)
    {
        return Ok(_restaurantService.SalesAndRevenue(restaurantId, fromDate));
    }
}
