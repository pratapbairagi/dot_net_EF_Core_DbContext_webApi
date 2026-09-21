using EF_Core_WebApi.Repositories.Implementation;
using EF_Core_WebApi.Repositories.Interfaces;

namespace EF_Core_WebApi
{
    public static class ServicesExtension
    {
        public static void DependencyInjection(this IServiceCollection services )
        {
            services.AddScoped<IEmployeeRepositoryAsync, EmployeeRepositoryAsync>();
        }
    }
}
