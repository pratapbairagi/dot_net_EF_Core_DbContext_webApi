namespace EF_Core_WebApi.Models.RequestModels
{
    public class LoginRequestModel
    {
        public string Email { get; set;  } = string.Empty;
        public string Password { get; set;  } = string.Empty;
    }
}
