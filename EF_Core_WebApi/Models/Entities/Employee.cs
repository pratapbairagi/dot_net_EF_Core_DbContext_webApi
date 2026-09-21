using EF_Core_WebApi.Models.Entities.CommonEntity;

namespace EF_Core_WebApi.Models.Entities
{
    public class Employee : Common
    {
        public Guid Id { get; set; }
        public  string Name { get; set; }
        public  string Email { get; set; }
        public  string Phone{ get; set; }
        public decimal? Salary { get; set; } = 0;
        public string? Gender { get; set; } = string.Empty;
        public required string Password { get; set; }

    }
}
