using EF_Core_WebApi.Models.Entities;
//using EF_Core_WebApi.Models.Entities.ResponseModels;
using EF_Core_WebApi.Models.RequestModels;
using EF_Core_WebApi.Models.ResponseModel;

namespace EF_Core_WebApi.Repositories.Interfaces
{
    public interface IEmployeeRepositoryAsync
    {
        public Task<DmlResponseModel> CreateEmployeeRepositoruAsync(EmployeeRequestModel employeeFormData);
        public Task<DmlResponseModel> UpdateEmployeeRepositoruAsync(EmployeeRequestModel employeeFormData, string id);
        public Task<DmlResponseModel> DeleteEmployeeRepositoruAsync(string id);
        public Task<DmlResponseModel> GetEmployeeByIdRepositoryAsync(string id);
        public Task<DmlResponseModel> GetEmployeesRepositoryAsync();
        public Task<DmlResponseModel> GetFilteredEmployeesRepositoryAsync(EmployeeSearchRequestModel search);

        public Task<DmlResponseModel> LoginRequestRepositoryAsync(LoginRequestModel loginForm);
        public Task<DmlResponseModel> SignupRequestRepository(EmployeeRequestModel employeeForm);
    }
}
