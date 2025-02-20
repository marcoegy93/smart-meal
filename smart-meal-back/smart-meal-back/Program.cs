using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using smart_meal_back.IRepositories;
using smart_meal_back.IServices;
using smart_meal_back.Repositories;
using smart_meal_back.Services;
using smart_meal_back.Utils;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;
using System.Text;
using DotNetEnv;
using Newtonsoft.Json;
using smart_meal_back.DbInitializer;

Env.Load(Directory.GetCurrentDirectory() + "/../.env");

var AllowSpecificOrigins = "_allowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.WebHost.UseUrls("http://0.0.0.0:7172");


// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        options.SerializerSettings.Converters.Add(new StringEnumConverter());
    });


builder.Services.AddScoped<DapperDBContext>();
builder.Services.AddScoped<IOrdersService, OrdersService>();
builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
builder.Services.AddScoped<IItemsService, ItemsService>();
builder.Services.AddScoped<IPaiementService, PaiementService>();
builder.Services.AddScoped<IItemsRepository, ItemsRepository>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IRestaurantRepository, RestaurantRepository>();
builder.Services.AddScoped<IMailSender, MailSender>();

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidIssuer = config["JwtSettings:Issuer"],
        ValidAudience = config["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_TOKEN_KEY")!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

builder.Services.AddAuthorization();

builder.Services.Configure<DatabaseOptions>(options =>
{
    var configuration = builder.Configuration.GetSection("ConnectionStrings");
    configuration.Bind(options);

    // Replace the hostname with the environment variable
    var dbHostname = Environment.GetEnvironmentVariable("DB_HOSTNAME_SMART_MEAL");
    if (!string.IsNullOrEmpty(dbHostname))
    {
        options.DefaultConnection = options.DefaultConnection.Replace("{DB_HOSTNAME}", dbHostname);
    }

    // Replace the password with the environment variable
    var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD_SMART_MEAL");
    if (!string.IsNullOrEmpty(dbPassword))
    {
        options.DefaultConnection = options.DefaultConnection.Replace("{DB_PASSWORD}", dbPassword);
    }
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins,
                      builder =>
                      {
                          builder.AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API Example",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Veuillez insérer un token JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(AllowSpecificOrigins);

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

await app.InitializeDatabaseAsync();

app.Run();
