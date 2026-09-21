namespace EF_Core_WebApi.Models.ResponseModel
{
    public class DmlResponseModel
    {
        public int Status { get; set; }
        public string Messsage { get; set; } = string.Empty;
        public dynamic? Results { get; set; }
    }
}
