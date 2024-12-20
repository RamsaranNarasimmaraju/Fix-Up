
using FIx_Up.Dtos.CustomIssueDtos;
using FIx_Up.Dtos.IssueDtos;
using FIx_Up.Dtos.RoleDtos;
using FIx_Up.Dtos.SolutionDtos;
using FIx_Up.Dtos.TIckets_Dtos;
using FIx_Up.Dtos.UserDtos;
using FIx_Up.Models;
using FIx_Up.Repos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;



var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication(opt => {
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });


builder.Services.AddSwaggerGen(setup =>
{
    var jwtsecurityscheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "JWT Authentication",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "put ** only your ** jwt BEarer token",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    setup.AddSecurityDefinition(jwtsecurityscheme.Reference.Id, jwtsecurityscheme);
    setup.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {jwtsecurityscheme,Array.Empty<string>() }
    });



});




// Add services to the container.


builder.Services.AddScoped<IFixupRepository<Role, RoleReadDto,RoleCreateDto,RoleUpdateDto>, RoleRepo>();
builder.Services.AddScoped<IFixupRepository<User,UserReadDto,UserCreateDto,UserUpdateDto>, UserRepo>();
builder.Services.AddScoped<IFixupRepository<Ticket,TicketReadDto,TicketCreateDto,TicketUpdateDto>,TicketRepo>();
builder.Services.AddScoped<TicketRepo>();
builder.Services.AddScoped<IFixupRepository<Issue, IssueReadDto,IssueCreateDto,IssueUpdateDto>, IssueRepo>();
builder.Services.AddScoped<IFixupRepository<CustomIssue, CustomIssueReadDto,CustomIssueCreateDto,CustomIssueUpdateDto>, CustomIssueRepo>();
builder.Services.AddScoped<IFixupRepository<Solution, SolutionReadDto,SolutionCreateDto,SolutionUpdateDto>,SolutionRepo>();

builder.Services.AddScoped<IFeedbackRepo,FeedbackRepo>();
builder.Services.AddScoped<IDashboardRepo<Dashboard>, DashboardRepo>();
builder.Services.AddScoped<UserRepo>();


builder.Services.AddDbContext<FixupDbContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("Fixupdb")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FixupAllow",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200") // Replace with your Angular app's URL
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("FixupAllow");

app.MapControllers();

app.Run();
