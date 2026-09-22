namespace EF_Core_WebApi.Models.ResponseModel
{
    public class LoginResponseModel
    {
        public string? JwtToken { get; set; } = null;
        public string? Name { get; set; } = string.Empty;
        //public bool Success { get; set; } = false;
        //public string Message { get; set; } = string.Empty;
        public Guid UserId { get; set; } = Guid.Empty;
        public string Email { get; set; } = string.Empty;
        
        //public string Role { get; set; } = string.Empty;
    }
}
