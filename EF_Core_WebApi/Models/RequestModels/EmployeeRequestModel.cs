namespace EF_Core_WebApi.Models.RequestModels
{
    public class EmployeeRequestModel
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required string Password { get; set; }
        public string? Gender { get; set; } = string.Empty;
        public decimal? Salary { get; set; }
        public DateTime? CreateDateFrom { get; set; }
        public DateTime? CreateDateTo { get; set; }
        public int? PageSize { get; set; } = 10;
        public string? SortBy { get; set; }
        public int? PageNumber { get; set; }
    }
}
