﻿using smart_meal_restaurant_service.Models;

namespace smart_meal_restaurant_service.Contracts;

public class UserToken
{

    public UserToken(UserTokenModel userToken)
    {
        Token = userToken.Token;
        User = (User)userToken.User;
    }

    public string Token { get; set; }
    public User User { get; set; }

    public static explicit operator UserToken(UserTokenModel userToken) => new(userToken);
}
