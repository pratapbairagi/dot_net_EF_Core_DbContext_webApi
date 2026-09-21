namespace EF_Core_WebApi.Models.RequestModels
{
    public class EmployeeSearchRequestModel
    {
        public string? name { get; set; } = string.Empty;
        public string? email { get; set; } = string.Empty;
        public string? phone { get; set; } = string.Empty;
        public string? gender { get; set; } = string.Empty;
        public decimal? minSalary { get; set; } = 0;
        public decimal? maxSalary { get; set; } = 999999999;
        public string? sortBy { get; set; } = string.Empty; 
        public string? searchText { get; set; } = string.Empty;
        public int pageNo { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public bool sortDescending { get; set; } = false;
    }
}
