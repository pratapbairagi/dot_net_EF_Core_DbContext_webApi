import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7243/api/Employees",
    headers: {
        "Content-Type": "application/json"
    }
});

export const getEmployeeById = async (id) => {
    const response = await api.get("/GetEmployeeById", id);
    return response.data;
}

export const getEmployeesList = async () => {
    const response = await api.get("GetEmployees");
    return response.data;
}

// export const getFilteredEmployees = async (searchFilter) => {
//     // const response = await api.get("GetFilteredEmployees", searchFilter);

//     const response = await api.get("GetFilteredEmployees", { params: searchFilter });
//     return response.data;
// }

export const getFilteredEmployees = async (searchParams) => {
    // const params = Object.fromEntries(
    //     Object.entries(searchParams).filter(
    //         ([_, value]) => value !== "" && value !== null && value !== undefined
    //     )
    // );
        const response = await axios.get(
            `https://localhost:7243/api/Employees/GetFilteredSearchedEmployees`,
            {
                params: searchParams,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
  



    return response.data;
};

export const createEmployee = async (employeeForm) => {
    const response = await api.post("/CreateEmployee", employeeForm);
    return response.data;
}

export const updateEmployee = async (id, employeeForm) => {
    const response = await api.put("/UpdateEmployee", id, employeeForm);
    return response.data;
}

export const deleteEmployee = async (id) => {
    const response = await api.delete("/DeleteEmployee", id);
    return response.data;
}


export const getEmployees = async () => {
    const response = await api.get("/GetEmployeesList");
    return response;
}

