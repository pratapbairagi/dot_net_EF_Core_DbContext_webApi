using System.Net;

namespace EF_Core_WebApi.Models.ResponseModel
{
    public class ApiResponseModel
    {
        public HttpStatusCode StatusCode { get; set; }
        public string? Message { get; set; } = string.Empty;
        public dynamic? Errors { get; set; }
        public dynamic? Results { get; set; }
    }
}
