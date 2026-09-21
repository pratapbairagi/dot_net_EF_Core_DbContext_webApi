using EF_Core_WebApi.Data;
using EF_Core_WebApi.Models.Entities;
using EF_Core_WebApi.Models.RequestModels;
using EF_Core_WebApi.Models.ResponseModel;
using EF_Core_WebApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;

namespace EF_Core_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        //private readonly ApplicationDbContext _dbContext; 
        private readonly IEmployeeRepositoryAsync _emp;
        private readonly IConfiguration _configuration;
        public EmployeesController(IEmployeeRepositoryAsync emp, IConfiguration configuration)
        {
            _emp = emp;
            _configuration = configuration;
        }

        [HttpPost("CreateEmployee")]
        public async Task<IActionResult> CreateEmployee(EmployeeRequestModel employee)
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.CreateEmployeeRepositoruAsync(employee);

                switch (res.Status)
                {


                    case 1:
                        response.Errors = res.Messsage;
                        response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                        response.Results = res.Results;
                        break;
                    case 3:
                        response.Errors = res.Messsage;
                        response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                        response.Results = res.Results;
                        break;
                    case 2:

                        response.Message = "Employee created successfully";
                        response.Errors = null;
                        response.StatusCode = System.Net.HttpStatusCode.Created;
                        response.Results = res.Results;
                        break;

                }

            }
            catch (Exception ex)
            {
                response.Errors = ex.Message;
                response.Message = $"Exception error while creating new employee : {ex.Message}";
                response.Results = null;
                response.StatusCode = System.Net.HttpStatusCode.ExpectationFailed;
            }
            return Ok(response);
        }



        [HttpPut("UpdateEmployee")]
        public async Task<IActionResult> UpdateEmployee(EmployeeRequestModel employeeFormData, [FromQuery] string id)
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.UpdateEmployeeRepositoruAsync(employeeFormData, id);

                switch (res.Status)


                {
                    case 1:
                        response.StatusCode = System.Net.HttpStatusCode.NotFound;
                        response.Message = res.Messsage;
                        response.Results = res.Results;
                        break;
                    case 2:
                        response.StatusCode = System.Net.HttpStatusCode.OK;
                        response.Message = res.Messsage;
                        response.Results = res.Results;
                        break;
                    case 3:
                        response.StatusCode = System.Net.HttpStatusCode.ExpectationFailed;
                        response.Message = res.Messsage;
                        response.Results = res.Results;
                        break;
                }
                ;
            }
            catch (Exception ex)
            {
                response.StatusCode = System.Net.HttpStatusCode.ExpectationFailed;
                response.Message = $"Eroor occurs while updating employee : {ex.Message}";
                response.Results = null;

            }
            return Ok(response);
        }

        [HttpDelete("DeleteEmployee")]
        public async Task<IActionResult> DeleteEmployee([FromQuery] string id)
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.DeleteEmployeeRepositoruAsync(id);

                switch (res.Status)
                {
                    case 1:
                        response.StatusCode = System.Net.HttpStatusCode.NotFound;
                        response.Message = res.Messsage;
                        response.Results = null;
                        break;
                    case 2:
                        response.StatusCode = System.Net.HttpStatusCode.OK;
                        response.Message = res.Messsage;
                        response.Results = res.Results;
                        break;
                    case 3:
                        response.StatusCode = System.Net.HttpStatusCode.ExpectationFailed;
                        response.Message = res.Messsage;
                        response.Results = null;
                        break;
                }
            }
            catch (Exception ex)
            {
                response.StatusCode = System.Net.HttpStatusCode.ExpectationFailed;
                response.Message = ex.Message;
                response.Results = null;
            }
            return Ok(response);
        }

        [HttpGet("GetEmployeeById")]
        public async Task<IActionResult> GetEmployeeById([FromQuery] string id)
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.GetEmployeeByIdRepositoryAsync(id);

                switch (res.Status)
                {
                    case 1:
                        response.Results = res.Results;
                        response.Message = res.Messsage;
                        response.StatusCode = HttpStatusCode.NotFound;
                        break;
                    case 2:
                        response.Results = res.Results;
                        response.Message = res.Messsage;
                        response.StatusCode = HttpStatusCode.OK;
                        break;
                    case 3:
                        response.Results = res.Results;
                        response.Message = res.Messsage;
                        response.StatusCode = HttpStatusCode.ExpectationFailed;
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Results = null;
                response.Message = $"Error occurs while fetching employee by id : ${ex.Message}";
                response.StatusCode = HttpStatusCode.ExpectationFailed;
            }
            return Ok(response);
        }

        [HttpGet("GetEmployeesList")]
        public async Task<IActionResult> GetEmployeesList()
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.GetEmployeesRepositoryAsync();

                switch (res.Status)
                {
                    case 1:
                        response.StatusCode = HttpStatusCode.OK;
                        response.Results = res.Results;
                        response.Errors = res.Messsage;
                        response.Message = res.Messsage;
                        break;
                    case 2:
                        response.StatusCode = HttpStatusCode.OK;
                        response.Results = res.Results;
                        response.Errors = res.Messsage;
                        response.Message = res.Messsage;
                        break;
                    case 3:
                        response.StatusCode = HttpStatusCode.ExpectationFailed;
                        response.Results = res.Results;
                        response.Errors = res.Messsage;
                        response.Message = res.Messsage;
                        break;
                }


            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.ExpectationFailed;
                response.Results = null;
                response.Errors = ex.Message;
                response.Message = ex.Message;
            }
            return Ok(response);
        }

        [HttpGet("GetFilteredEmployees")]
        public async Task<IActionResult> GetFilteredEmployees([FromQuery] EmployeeSearchRequestModel search)
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.GetFilteredEmployeesRepositoryAsync(search);

                switch (res.Status)
                {
                    case 1:
                        response.StatusCode = HttpStatusCode.OK;
                        response.Results = res.Results;
                        response.Errors = res.Messsage;
                        response.Message = res.Messsage;
                        break;
                    case 2:
                        response.StatusCode = HttpStatusCode.OK;
                        response.Results = res.Results;
                        response.Errors = res.Messsage;
                        response.Message = res.Messsage;
                        break;
                    case 3:
                        response.StatusCode = HttpStatusCode.ExpectationFailed;
                        response.Results = res.Results;
                        response.Errors = res.Messsage;
                        response.Message = res.Messsage;
                        break;
                }


            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.ExpectationFailed;
                response.Results = null;
                response.Errors = ex.Message;
                response.Message = ex.Message;
            }
            return Ok(response);
        }
    

    // login
    [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequestModel loginForm)
        {
            ApiResponseModel response = new();
            try
            {
                var res = await _emp.LoginRequestRepositoryAsync(loginForm);

                switch (res.Status)
                {
                    case 1:
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Errors = true;
                        response.Message = res.Messsage;
                        response.Results = res.Results;
                        break;
                    case 3:
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Errors = true;
                        response.Message = res.Messsage;
                        response.Results = res.Results;
                        break;
                    case 2:

                        Response.Cookies.Append(
                           "access_token",
                           res.Results.JwtToken,
                           new CookieOptions
                           {
                               HttpOnly = true,
                               SameSite = SameSiteMode.None,
                               Secure = true,
                               Expires = DateTimeOffset.UtcNow.AddMinutes(int.Parse(_configuration.GetSection("Token:ExpireTime").Value))
                           }
                       );

                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Errors = false;
                        response.Message = res.Messsage;
                        response.Results = res.Results;

                       
                        break;
                }
            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.ExpectationFailed;
                response.Errors = true;
                response.Message = $"Exception Error while loging : {ex.Message}";
                response.Results = null;
            }
            return Ok(response);
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup(EmployeeRequestModel signupForm)
        {
            ApiResponseModel res = new();
            try
            {
                if (signupForm == null)
                {
                    res.Message = "All required field needs to be filled";
                    res.StatusCode = HttpStatusCode.NoContent;
                    res.Results = null;
                    res.Errors = "Signup form is null, All required field needs to be filled";
                }
                else
                {
                    var response = await _emp.CreateEmployeeRepositoruAsync(signupForm);

                    switch (response.Status)
                    {
                        case 1:
                            res.Message = response.Messsage;
                            res.Results = response.Results;
                            res.StatusCode = HttpStatusCode.NoContent;
                            res.Errors = response.Messsage;
                            break;
                        case 3:
                            res.Message = response.Messsage;
                            res.Results = response.Results;
                            res.StatusCode = HttpStatusCode.BadRequest;
                            res.Errors = response.Messsage;
                            break;
                        case 4:
                            res.Message = response.Messsage;
                            res.Results = response.Results;
                            res.StatusCode = HttpStatusCode.ExpectationFailed;
                            res.Errors = response.Messsage;
                            break;
                        case 2:
                            res.Message = response.Messsage;
                            res.Results = response.Results;
                            res.StatusCode = HttpStatusCode.Created;
                            res.Errors = response.Messsage;
                            break;

                    }
                }
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                res.Results = null;
                res.StatusCode = HttpStatusCode.ExpectationFailed;
                res.Errors = $"Exception failed - { ex.Message} ";
            }
            return Ok(res);
        }


        // logged in user
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetLoggedInUser()
        {
            ApiResponseModel res = new();
            try
            {
                var id =  User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var name = User.FindFirst(ClaimTypes.Name)?.Value;

                res.Errors = null;
                res.Message = "Logged in user fetched successfully";
                res.StatusCode = HttpStatusCode.OK;
                res.Results = new
                {
                    id = id,
                    email = email,
                    name = name
                };

                
            }
            catch (Exception ex)
            {
                res.Errors = ex.Message;
                res.Message = ex.Message;
                res.StatusCode = HttpStatusCode.ExpectationFailed;
                res.Results =null;
            }
            return Ok(res);
        }

    }
    
}
