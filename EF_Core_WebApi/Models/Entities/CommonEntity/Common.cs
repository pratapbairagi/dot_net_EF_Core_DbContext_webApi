namespace EF_Core_WebApi.Models.Entities.CommonEntity
{
    public class Common
    {
        public string? CreatedBy { get; set; } = string.Empty;
        public DateTime? CreatedOn { get; set; }
        public string? UpdatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; } = false;
        public string? DeletedBy { get; set; } = string.Empty;
        public DateTime? DeletedOn { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
