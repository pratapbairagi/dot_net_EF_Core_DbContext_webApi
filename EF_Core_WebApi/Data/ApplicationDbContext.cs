using EF_Core_WebApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EF_Core_WebApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Employee> TableEmployee { get; set; } 
    }
}
