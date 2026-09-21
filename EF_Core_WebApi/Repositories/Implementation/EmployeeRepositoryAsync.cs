using Azure;
using EF_Core_WebApi.Data;
using EF_Core_WebApi.Models.Entities;
//using EF_Core_WebApi.Models.Entities.ResponseModels;
using EF_Core_WebApi.Models.RequestModels;
using EF_Core_WebApi.Models.ResponseModel;
using EF_Core_WebApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace EF_Core_WebApi.Repositories.Implementation
{
    public class EmployeeRepositoryAsync : IEmployeeRepositoryAsync
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public EmployeeRepositoryAsync(ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<DmlResponseModel> CreateEmployeeRepositoruAsync(EmployeeRequestModel employeeFormData)
        {

            DmlResponseModel response = new();

            try
            {

                if (employeeFormData == null)
                {
                    response.Status = 2;
                    response.Messsage = "employee form is null";
                    response.Results = null;
                }
                else
                {
                    Guid newId = Guid.NewGuid();

                    Employee newEmpl = new()
                    {
                        Id = newId,
                        Name = employeeFormData.Name,
                        Email = employeeFormData.Email,
                        Phone = employeeFormData.Phone,
                        Gender = employeeFormData.Gender,
                        Password = employeeFormData.Password,
                        CreatedBy = newId.ToString(),
                        CreatedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        IsActive = true

                    };

                    await _dbContext.AddAsync(newEmpl);
                    await _dbContext.SaveChangesAsync();

                    response.Status = 1;
                    response.Messsage = "Employee created successfully !";
                    response.Results = newEmpl;

                }

            }
            catch (Exception ex)
            {

                response.Status = 3;
                response.Messsage = $"Error occurs while creating new employee : {ex.Message}";
                response.Results = null;
            }
            return response;

        }

        public async Task<DmlResponseModel> UpdateEmployeeRepositoruAsync(EmployeeRequestModel employeeFormData, string id)
        {
            DmlResponseModel response = new();
            try
            {

                var res = await _dbContext.TableEmployee.FirstOrDefaultAsync(option => option.Id.ToString() == id.ToString());

                if (res == null)
                {
                    response.Status = 1;
                    response.Messsage = "Employee not found";
                    response.Results = null;
                }
                else
                {


                    res.Name = !string.IsNullOrWhiteSpace(employeeFormData.Name) ? employeeFormData.Name : res.Name;
                    res.Email = !string.IsNullOrWhiteSpace(employeeFormData.Email) ? employeeFormData.Email : res.Email;
                    res.Phone = !string.IsNullOrWhiteSpace(employeeFormData.Phone) ? employeeFormData.Phone : res.Phone;
                    res.Gender = !string.IsNullOrWhiteSpace(employeeFormData.Gender) ? employeeFormData.Gender : res.Gender;
                    res.Password = !string.IsNullOrWhiteSpace(employeeFormData.Password) ? employeeFormData.Password : res.Password;
                    res.Salary = employeeFormData.Salary ?? res.Salary;
                    res.UpdatedBy = id;
                    res.UpdatedOn = DateTime.UtcNow;

                    await _dbContext.SaveChangesAsync();

                    response.Status = 2;
                    response.Messsage = "Employee updated successfully";
                    response.Results = res;
                }
            }
            catch (Exception ex)
            {
                response.Status = 3;
                response.Messsage = $"Error occurs while updating employee : {ex.Message}";
                response.Results = null;
            }
            return response;
        }

        public async Task<DmlResponseModel> DeleteEmployeeRepositoruAsync(string id)
        {
            DmlResponseModel response = new();
            try
            {
                var res = await _dbContext.TableEmployee.FirstOrDefaultAsync(option => option.Id.ToString() == id.ToString());

                if (res == null)
                {
                    response.Status = 1;
                    response.Messsage = "Employee not found with this id !";
                    response.Results = null;
                }
                else
                {
                    res.IsDeleted = true;
                    res.DeletedOn = DateTime.UtcNow;
                    res.DeletedBy = res.Id.ToString();

                    await _dbContext.SaveChangesAsync();

                    var list = await _dbContext.TableEmployee.Where(op => op.IsDeleted == false).ToListAsync();

                    response.Status = 2;
                    response.Messsage = "Employee deleted successfully !";
                    response.Results = list;
                }
            }
            catch (Exception ex)
            {
                response.Status = 3;
                response.Messsage = $"Error while deleting employee : {ex.Message}";
                response.Results = null;
            }
            return response;
        }

        public async Task<DmlResponseModel> GetEmployeeByIdRepositoryAsync(string id)
        {
            DmlResponseModel response = new();
            try
            {
                var res = await _dbContext.TableEmployee.FirstOrDefaultAsync(option => option.Id.ToString() == id.ToString());

                if (res == null)
                {
                    response.Messsage = "no employee found with the given id";
                    response.Status = 1;
                    response.Results = res;
                }
                else
                {
                    response.Messsage = "Fetched employee details successfully";
                    response.Status = 2;
                    response.Results = res;
                }
            }
            catch (Exception ex)
            {
                response.Messsage = $"Error occurs while fetching employee  y id : {ex.Message}";
                response.Status = 3;
                response.Results = null;
            }
            return response;
        }

        public async Task<DmlResponseModel> GetEmployeesRepositoryAsync()
        {
            DmlResponseModel response = new();
            IEnumerable<Employee> listResponse = new List<Employee>();
            try
            {
                var res = await _dbContext.TableEmployee.Where(option => option.IsDeleted == false).ToListAsync();

                if (res.Count > 0)
                {
                    listResponse = res;

                    response.Status = 2;
                    response.Messsage = "Employee list fetched successfully";
                    response.Results = listResponse;

                }
                else
                {
                    listResponse = new List<Employee>();
                    response.Status = 1;
                    response.Messsage = "empty employee list";
                    response.Results = listResponse;

                }
            }
            catch (Exception ex)
            {
                listResponse = new List<Employee>();

                response.Status = 3;
                response.Messsage = $"Error occurs while fetching employee list : {ex.Message}";
                response.Results = listResponse;
            }
            return response;
        }


        // search or filtered list
        //public async Task<DmlResponseModel> GetFilteredEmployeesRepositoryAsync(EmployeeSearchRequestModel search)
        //{
        //    DmlResponseModel response = new();

        //    try
        //    {
        //        IQueryable<Employee> query = _dbContext.TableEmployee
        //    .Where(x => x.IsDeleted == false);
        //        var query = await _dbContext.TableEmployee.Where(option => option.IsDeleted == false).AsQueryable();

        //        if (!string.IsNullOrWhiteSpace(search.searchText))
        //        {
        //            query = query.Where(option => option.Name.Contains(search.searchText) || option.Email.Contains(search.searchText) || option.Phone.Contains(search.searchText));

        //        }

        //        if (!string.IsNullOrWhiteSpace(search.name))
        //        {
        //            query = query.Where(option => option.Name.Contains(search.name));
        //        }

        //        if (!string.IsNullOrWhiteSpace(search.phone))
        //        {
        //            query = query.Where(option => option.Phone.Contains(search.phone));
        //        }

        //        if (!string.IsNullOrWhiteSpace(search.gender))
        //        {
        //            query = query.Where(option => option.Gender.Contains(search.gender));
        //        }

        //        if (search.minSalary.HasValue)
        //        {
        //            query = query.Where(option => option.Salary > search.minSalary.Value);
        //        }

        //        if (search.maxSalary.HasValue)
        //        {
        //            query = query.Where(option => option.Salary <= search.maxSalary.Value);
        //        }

        //        query = search.sortBy?.ToLower() switch
        //        {
        //            "name" => search.sortDescending ?
        //            query.OrderByDescending(option => option.Name)
        //            : query.OrderBy(option => option.Name),
        //            "email" => search.sortDescending ?
        //            query.OrderByDescending(option => option.Email)
        //            : query.OrderBy(option => option.Email),
        //            "gender" => search.sortDescending ?
        //            query.OrderByDescending(option => option.Gender)
        //            : query.OrderBy(option => option.Gender),
        //            "salary" => search.sortDescending ?
        //            query.OrderByDescending(option => option.Salary)
        //            : query.OrderBy(option => option.Salary),

        //            _ => query.OrderBy(x => x.Name)

        //        };

        //        var totalRecords = await query.CountAsync();

        //        // pagination
        //        var result = await query.Skip((search.pageNo - 1) * search.pageSize).Take(search.pageSize).ToListAsync();

        //        if (result.Count > 0)
        //        {
        //            response.Status = 2;
        //            response.Results = result;
        //            response.Messsage = "Employee list fetched successfully";

        //        }
        //        else
        //        {
        //            response.Status = 1;
        //            response.Results = result;
        //            response.Messsage = "Employee list not found";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        response.Status = 3;
        //        response.Results = null;
        //        response.Messsage = $"Error occurs while fetching employee list : {ex.Message}";
        //    }
        //    return response;
        //}

        public async Task<DmlResponseModel> GetFilteredEmployeesRepositoryAsync(EmployeeSearchRequestModel search)
        {
            DmlResponseModel response = new();
            try
            {
                IQueryable<Employee> query = _dbContext.TableEmployee.Where(op => op.IsDeleted == false);

                if (!string.IsNullOrWhiteSpace(search.name))
                {
                    query = query.Where(op => op.Name.ToLower().Contains(search.name.ToLower()));
                }

                if (!string.IsNullOrWhiteSpace(search.email))
                {
                    query = query.Where(op => op.Email.ToLower().Contains(search.email.ToLower()));
                }

                if (search.minSalary.HasValue)
                {
                    query = query.Where(op => op.Salary >= search.minSalary.Value);
                }

                if (search.maxSalary.HasValue)

                {
                    query = query.Where(op => op.Salary <= search.maxSalary.Value);
                }

                if (!string.IsNullOrWhiteSpace(search.gender))
                {
                    query = query.Where(op => op.Gender == search.gender);
                }

                if (search.sortDescending != null && !string.IsNullOrWhiteSpace(search.sortBy))
                {
                    switch (search.sortBy)
                    {
                        case "name":
                            query = search.sortDescending ? query.OrderByDescending(op => op.Name) : query.OrderBy(op => op.Name);
                            break;
                        case "salary":
                            query = search.sortDescending ? query.OrderByDescending(op => op.Salary) : query.OrderBy(op => op.Salary);
                            break;
                    }
                }

                query = query.Skip((search.pageNo - 1) * search.pageSize).Take(search.pageSize);

                var r = await query.ToListAsync();

                response.Results = r;
                response.Status = 2;
                response.Messsage = "Employee list fetched successfully !";
            }
            catch (Exception ex)
            {
                response.Messsage = "Error occurs while fetching employee list : {ex.Message}";
                response.Results = null;
                response.Status = 3;

            }
            return response;
        }


        // login request repository
        public async Task<DmlResponseModel> LoginRequestRepositoryAsync(LoginRequestModel loginForm)
        {
            DmlResponseModel response = new();
          

            try
            {
                if (loginForm != null)
                {
                    if (loginForm.Email != null && loginForm.Password != null)
                    {
                        var res = await _dbContext.TableEmployee.Where(e => e.Email.ToUpper() == loginForm.Email.ToUpper() && e.Password == loginForm.Password).FirstOrDefaultAsync();

                        if (res != null) {

                            LoginResponseModel loginModel = new()
                            {
                                Email = res.Email,
                                UserId = res.Id
                            };

                            var token = await CreateJwtToken(loginModel, _configuration.GetSection("Token:TokenKey").Value, _configuration.GetSection("Token:ExpireTime").Value);

                            if (token != null)
                            {
                                loginModel.JwtToken = token;

                                response.Status = 2;
                                response.Messsage = "Login successful.";
                                response.Results = loginModel;
                            }
                            else
                            {
                                response.Status = 3;
                                response.Messsage = "Error occurs while generating token.";
                                response.Results = null;
                            }
                        }
                        else
                        {
                           
                            response.Messsage = "Invalid email or password.";
                            response.Results = null;
                            response.Status = 1;
                        }
                    }
                    else {
                        
                        response.Messsage = "All fields are required.";
                        response.Results = null;
                        response.Status = 1;
                       
                        
                    }
                }
                }
            catch (Exception ex)
            {
                throw;
            }
            return response;
        }

        // create account or signup
        public async Task<DmlResponseModel> SignupRequestRepository(EmployeeRequestModel signupForm)
        {
            DmlResponseModel response = new();
            try
            {
                if (signupForm != null)
                {
                    var res = await _dbContext.TableEmployee.Where(op => op.Email.ToLower() == signupForm.Email.ToLower()).FirstOrDefaultAsync();

                    if (res != null)
                    {
                        response.Messsage = "User already exist";
                        response.Results = null;
                        response.Status = 3;
                    }
                    else
                    {
                        var id = Guid.NewGuid();
                        Employee emp = new ()
                        {
                            Id = id,
                            Name = signupForm.Name,
                            Email = signupForm.Email,
                            Phone = signupForm.Phone,
                            Password = signupForm.Password,
                            Gender = signupForm.Gender,
                            Salary = signupForm.Salary,
                            CreatedBy = id.ToString(),
                            CreatedOn = DateTime.UtcNow,
                            IsActive = true,
                            IsDeleted = false

                        };

                        await _dbContext.TableEmployee.AddAsync(emp);

                        response.Messsage = "User created successfully !";
                        response.Results = emp;
                        response.Status = 2;

                        await _dbContext.SaveChangesAsync();
                    }
                }
                
            }
            catch (Exception ex) {
                response.Messsage = $"Error occure while creating new user : {ex.Message}";
                response.Results = null;
                response.Status = 4;
            }
            return response;
        }

        // token generate
        private async Task<string> CreateJwtToken(LoginResponseModel loginModel, string tokenKey, string expirationn)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(tokenKey);
            if (loginModel != null)
            {
                var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Email, loginModel.Email),
                    new Claim(ClaimTypes.NameIdentifier, loginModel.UserId.ToString()),
                    new Claim("Age", "18")
                    //new Claim(ClaimTypes.Expired, DateTime.UtcNow.AddDays(double.Parse(expirationn)).ToString("dd/MM/yyyy"))
                };

                var tokenDescriptor = new SecurityTokenDescriptor()
                {
                    Subject = new ClaimsIdentity(),
                    //Expires = DateTime.UtcNow.AddDays(double.Parse(expirationn)),
                    Expires = DateTime.UtcNow.AddMinutes(int.Parse(expirationn)),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            else
            {
                return string.Empty;
            }
            
        }
    }
}
