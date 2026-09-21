import React, {useState, useEffect} from "react";
import axios from "axios";
import AddEmployeePopup from "./AddEmployeePopup";
// import Header from "./Header";

const Home = () => {
            
    const [filter, setFilter] = useState({
        name: "",
        email: "",
        minSalary: 0,
        maxSalary: 999999999,
        sortDescending : false,
        sortBy : ""
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        salary: 0,
        gender: "",
        phone: "",
        password : ""
    });

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: false,
        message: "",
        employees: [],
        employee: {},
        showAddPopup: false,
        update : false,
        create : false
    });

    async function apiCall() {
        setData(o => ({ ...o, loading: true }));

        try {
            const res = await axios.get(
                `https://localhost:7243/api/Employees/GetFilteredEmployees`,
                {
                    params: {
                        name: filter.name,
                        email: filter.email,
                        minSalary: filter.minSalary,
                        maxSalary: filter.maxSalary,
                        pageNo : filter.pageNo,
                        pageSize : filter.pageSize,
                        sortDescending : filter.sortDescending,
                        sortBy : filter.sortBy
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.status === 200) {
                console.log("response 1 ", res.data.results);

                setData((o) => ({
                    ...o,
                    loading: false,
                    success: true,
                    message: "Successful",
                    employees: res.data.results,
                    employee: {}
                }));
            }
            else {
                console.log("response 2 ");

                setData((o) => ({
                    ...o,
                    loading: false,
                    success: false,
                    error: true,
                    message: res.data.message
                }));
            }

            console.log("response : ", res);
        }
        catch (error) {
            console.log("response error ");

            setData((o) => ({
                ...o,
                loading: false,
                success: false,
                error: true,
                message: "An error occurred while fetching employee data."
            }));
        }
        finally {
            setData( o => ({ ...o, loading : false, success : false, error : false, message : "" }));
        }
    }

    useEffect(() => {
        apiCall();
    }, [filter.sortDescending]);

    function sortHandlingFun ({sortDescending, sortBy }){
        setFilter((op)=> ({...op, sortDescending : sortDescending, sortBy : sortBy}))
    }

    console.log("data : ", data);


    // popup form input handler
    const handleAddEmployee = async ({employeeData : employeeData}) => {
        try{
        console.log("Employee data:", employeeData);
        setData((prev)=>({...prev, loading : true}));
        console.log("check update status ", data);
        // Call your API here
        // await addEmployee(employeeData);
        let res;
            if(data.create){
        res = await axios.post("https://localhost:7243/api/Employees/CreateEmployee", employeeData, {
            headers : {
                "Content-Type" : "application/json"
            }
        });
        }
        console.log("id to update employee - ",data );
        if(data.update && data.employee.id != null
            
        ){
            console.log("update url hit");
            res = await axios.put(`https://localhost:7243/api/Employees/UpdateEmployee/`, formData, {
                params : {
                    id :data.employee.id
                }
            });
        }


        console.log("add emp response ", res);
        console.log("type of api call ", data);
        if(res.status === 200){
            setData((prev)=>({
                ...prev,
                loading : false,
                success : true,
                message : res.data.message,
                employees : [...prev.employees, res.data.results],
                employe : res.data.results,
                showAddPopup : false
            }));
        }
        else{
            console.log("add emp response ", res);
            }

        
    }
    catch(error){
        console.log("add emp response ", error);
        setData((prev)=> ({...prev, loading : false, error : true, message : error.message}))
    }
    finally{
        setData((prev)=> ({...prev, loading : false, error : false, success : false, message : "", update : false, create : false}))
    }  
    };

    // get employee details api call
    async function getEmployeeDetailFun(id){
        try{
            console.log("emp details 1", data);
            setData((prev)=> ({...prev, loading : true, showAddPopup : true, update : true}));
            let res;
            if( id != null){
                console.log("emp details 2", data);
             res = await axios.get(`https://localhost:7243/api/Employees/GetEmployeeById`, {
                headres : {
                    "Content-Type" : "application/json"
                },
                params : {
                    id : id
                }
                
            });

            console.log(" res emp detail 3 ", data);
            console.log("response - ", res);
            if(res.status === 200){
                setFormData((op)=>({...op, name : res.data.results.name, email : res.data.results.email, phone : res.data.results.phone, password : res.data.results.password, salary : res.data.results.salary, gender : res.data.results.gender}));
                setData((prev)=> ({...prev, update : true, employee : res.data.results }));
            }
        }
        else{
            setData((prev)=> ({...prev, loading : false, success : false, error : true, message : "Invalid or null id"}))
        }
        }
        catch(error){
            setData((prev)=> ({...prev, loading : false, success : false, error : true, message : `Exception error : {error.message}`}))
        }
        finally{
            console.log("emp details 4 ", data);
            setData((prev)=> ({...prev, loading : false, success : false, error : false, message : "", update : true}))
        }
    }

    // delete fun
    async function deleteById(id){
        try{
            setData((prev)=> ({...prev, loading : true}));

            let res = await axios.delete("https://localhost:7243/api/Employees/DeleteEmployee", {
                headers : {
                    "Content-Type" : "application/json"
                },
                params : {
                    id : id
                }
            });

            if(res.status === 200){
                setData((op)=> ({...op, employees : res.data.results, loading : false, success : true, message : res.data.message}));
            }
            else{
                console.log("non 200 status - ", res);
            }
        }
        catch(error){
            console.log("catch part of deleting emp - ", error);
            setData((op)=>({...op, loading : false, error : true, message : error.message}));
        }
        finally{
            setData((op)=>({...op, loading : false, success : false, error : false, message : ""}));
        }
    }
    return (
            <div style={styles.page}>
                        {/* <Header/> */}
                        {/* popup - employee creation/add form - start */}
                    {data.showAddPopup && (
                            <AddEmployeePopup
                            formData={formData}
                            setFormData={setFormData}
                                onClose={() =>
                                    setData(prev => ({
                                        ...prev,
                                        showAddPopup: false
                                    }))
                                }
                                onSubmit={handleAddEmployee}
                                data={data}
                            />
                        )}
                        {/* popup - employee creation/add form - end */}
                        <div style={styles.container}>
            
                            {/* Header */}
                            <div style={styles.header}>
                                <div>
                                    <h1 style={styles.title}>
                                        Employee Management
                                    </h1>
            
                                    <p style={styles.subtitle}>
                                        Search and view employee records
                                    </p>
                                </div>
            
                                <div style={styles.employeeCount}>
                                    <span style={styles.countNumber}>
                                        {data.employees?.length}
                                    </span>
                                    <span style={styles.countText}>
                                        Employees
                                    </span>
                                </div>
                            </div>
            
            
                            {/* Search Card */}
                            <div style={styles.searchCard}>
            
                                <div style={styles.searchHeader}>
                                    <div>
                                        <h2 style={styles.searchTitle}>
                                            Search Employees
                                        </h2>
            
                                        <p style={styles.searchSubtitle}>
                                            Filter employees using the options below
                                        </p>
                                    </div>
                                </div>
            
            
                                <div style={styles.filterGrid}>
            
                                    {/* Name */}
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>
                                            Employee Name
                                        </label>
            
                                        <div style={styles.inputWrapper}>
                                            <span style={styles.inputIcon}>
                                                👤
                                            </span>
            
                                            <input
                                                placeholder="Search by name"
                                                type="search"
                                                name="name"
                                                value={filter.name}
                                                onChange={(e) =>
                                                    setFilter(o => ({
                                                        ...o,
                                                        name: e.target.value
                                                    }))
                                                }
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
            
            
                                    {/* Email */}
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>
                                            Email Address
                                        </label>
            
                                        <div style={styles.inputWrapper}>
                                            <span style={styles.inputIcon}>
                                                ✉
                                            </span>
            
                                            <input
                                                placeholder="Search by email"
                                                type="search"
                                                name="email"
                                                value={filter.email}
                                                onChange={(e) =>
                                                    setFilter(o => ({
                                                        ...o,
                                                        email: e.target.value
                                                    }))
                                                }
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
            
            
                                    {/* Minimum Salary */}
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>
                                            Minimum Salary
                                        </label>
            
                                        <div style={styles.inputWrapper}>
                                            <span style={styles.inputIcon}>
                                                ₹
                                            </span>
            
                                            <input
                                                type="search"
                                                name="minSalary"
                                                value={filter.minSalary}
                                                onChange={(e) =>
                                                    setFilter(o => ({
                                                        ...o,
                                                        minSalary: e.target.value
                                                    }))
                                                }
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
            
            
                                    {/* Maximum Salary */}
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>
                                            Maximum Salary
                                        </label>
            
                                        <div style={styles.inputWrapper}>
                                            <span style={styles.inputIcon}>
                                                ₹
                                            </span>
            
                                            <input
                                                type="search"
                                                name="maxSalary"
                                                value={filter.maxSalary}
                                                onChange={(e) =>
                                                    setFilter(o => ({
                                                        ...o,
                                                        maxSalary: e.target.value
                                                    }))
                                                }
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
            
                                </div>
            
            
                                {/* Search Button */}
                                <div style={styles.buttonContainer}>
            
                                    <button
                                        onClick={() => apiCall()}
                                        style={styles.searchButton}
                                    >
                                        <span style={styles.buttonIcon}>
                                            🔍
                                        </span>
            
                                        Search Employees
                                    </button>
            
                                </div>
            
                            </div>
            
            
                            <button
                                        onClick={() =>
                                setData(prev => ({
                                    ...prev,
                                    showAddPopup: true
                                }))
                            }
                                        style={styles.searchButton}
                                    >
                                        Add Employee
                                    </button>
                            {/* Employee Table Card */}
                            <div style={styles.tableCard}>
            
                                <div style={styles.tableHeader}>
            
                                    <div>
                                        <h2 style={styles.tableTitle}>
                                            Employee Records
                                        </h2>
            
                                        <p style={styles.tableSubtitle}>
                                            List of employees matching your search
                                        </p>
                                    </div>
            
                                    <div style={styles.resultBadge}>
                                        {data.employees.length} Results
                                    </div>
            
                                </div>
            
            
                                {/* Responsive table wrapper */}
                                <div style={styles.tableWrapper}>
            
                                    <table style={styles.table}>
            
                                        <thead>
                                            <tr>
            
                                                <th style={styles.th}>
                                                    ID No
                                                </th>
            
                                                <th onClick={()=> sortHandlingFun({sortBy : "name", sortDescending : filter.orderDescending ? false : true })} style={{...styles.th, cursor : "pointer"}}>
                                                    Employee Name
                                                </th>
            
                                                <th style={styles.th}>
                                                    Email
                                                </th>
            
                                                <th style={styles.th}>
                                                    Salary
                                                </th>
            
                                                <th style={styles.th}>
                                                    Action
                                                </th>
            
                                            </tr>
                                        </thead>
            
            
                                        <tbody>
            
                                            {data.loading ? (
            
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        style={styles.loadingCell}
                                                    >
                                                        <div style={styles.loadingContainer}>
            
                                                            <div style={styles.spinner}></div>
            
                                                            <span>
                                                                Loading employees...
                                                            </span>
            
                                                        </div>
                                                    </td>
                                                </tr>
            
                                            ) : (
            
                                                data.employees.length > 0 ? (
            
                                                    data.employees.map((v, i) => (
            
                                                        <tr
                                                            key={v.id}
                                                            style={styles.tableRow}
                                                        >
            
                                                            <td style={styles.td}>
                                                                <span style={styles.idBadge}>
                                                                    #{v.id}
                                                                </span>
                                                            </td>
            
                                                            <td style={styles.td}>
                                                                <div style={styles.employeeName}>
                                                                    <div style={styles.avatar}>
                                                                        {v.name
                                                                            ? v.name.charAt(0).toUpperCase()
                                                                            : "?"}
                                                                    </div>
            
                                                                    <span>
                                                                        {v.name}
                                                                    </span>
                                                                </div>
                                                            </td>
            
                                                            <td style={styles.td}>
                                                                <span style={styles.email}>
                                                                    {v.email}
                                                                </span>
                                                            </td>
            
                                                            <td style={styles.td}>
                                                                <span style={styles.salary}>
                                                                    ₹ {v.salary}
                                                                </span>
                                                            </td>
            
                                                            <td style={styles.td}>
                                                                <span style={styles.email}>
                                                                    <button 
                                                                    type="button" 
                                                                    onClick={() => getEmployeeDetailFun(v.id)  }
                                                                    style={{
                                                                            border: "none",
                                                                            background: "transparent",
                                                                            color: "#fff",
                                                                            fontSize: "25px",
                                                                            cursor: "pointer",
                                                                            lineHeight: 1
                                                                            }}> 
                                                                            ✏️
                                                                    </button>
            
                                                                    <button 
                                                                    type="button" 
                                                                    onClick={() => deleteById(v.id)  }
                                                                    style={{
                                                                            border: "none",
                                                                            background: "transparent",
                                                                            color: "#fff",
                                                                            fontSize: "25px",
                                                                            cursor: "pointer",
                                                                            lineHeight: 1
                                                                            }}> 
                                                                            ❌
                                                                    </button>
                                                                </span>
                                                            </td>
            
                                                        </tr>
            
                                                    ))
            
                                                ) : (
            
                                                    <tr>
                                                        <td
                                                            colSpan="4"
                                                            style={styles.emptyCell}
                                                        >
            
                                                            <div style={styles.emptyContainer}>
            
                                                                <div style={styles.emptyIcon}>
                                                                    👥
                                                                </div>
            
                                                                <h3 style={styles.emptyTitle}>
                                                                    No Employees Found
                                                                </h3>
            
                                                                <p style={styles.emptyText}>
                                                                    No employee records match
                                                                    your current search.
                                                                </p>
            
                                                            </div>
            
                                                        </td>
                                                    </tr>
            
                                                )
            
                                            )}
            
                                        </tbody>
            
                                    </table>
            
                                </div>
            
                            </div>
            
                        </div>
            
                    </div>
    );
};


const styles = {

    page: {
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f4f7fb",
        padding: "30px 20px",
        boxSizing: "border-box",
        fontFamily: "Arial, Helvetica, sans-serif",
        // marginBottom : "20px"
    },

    container: {
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px"
    },

    title: {
        margin: "0 0 6px",
        fontSize: "30px",
        fontWeight: "700",
        color: "#172033"
    },

    subtitle: {
        margin: 0,
        fontSize: "15px",
        color: "#718096"
    },

    employeeCount: {
        backgroundColor: "#ffffff",
        border: "1px solid #e5eaf1",
        borderRadius: "12px",
        padding: "12px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "90px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
    },

    countNumber: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#2563eb"
    },

    countText: {
        fontSize: "12px",
        color: "#718096",
        marginTop: "2px"
    },

    searchCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "25px",
        marginBottom: "25px",
        border: "1px solid #e5eaf1",
        boxShadow: "0 6px 20px rgba(15,23,42,0.05)"
    },

    searchHeader: {
        marginBottom: "22px"
    },

    searchTitle: {
        margin: "0 0 5px",
        fontSize: "20px",
        color: "#172033"
    },

    searchSubtitle: {
        margin: 0,
        fontSize: "14px",
        color: "#718096"
    },

    filterGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "18px"
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },

    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151"
    },

    inputWrapper: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d9e0ea",
        borderRadius: "9px",
        backgroundColor: "#ffffff",
        transition: "all 0.2s ease",
        overflow: "hidden"
    },

    inputIcon: {
        paddingLeft: "12px",
        fontSize: "15px",
        color: "#64748b"
    },

    input: {
        width: "100%",
        border: "none",
        outline: "none",
        padding: "12px 12px 12px 8px",
        fontSize: "14px",
        color: "#1f2937",
        backgroundColor: "transparent",
        boxSizing: "border-box"
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "22px"
    },

    searchButton: {
        border: "none",
        borderRadius: "9px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        padding: "12px 22px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(37,99,235,0.25)"
    },

    buttonIcon: {
        marginRight: "7px"
    },

    tableCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e5eaf1",
        boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
        overflow: "hidden"
    },

    tableHeader: {
        padding: "22px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        borderBottom: "1px solid #edf0f5"
    },

    tableTitle: {
        margin: "0 0 5px",
        fontSize: "20px",
        color: "#172033"
    },

    tableSubtitle: {
        margin: 0,
        fontSize: "13px",
        color: "#718096"
    },

    resultBadge: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "650px"
    },

    th: {
        textAlign: "left",
        padding: "15px 20px",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #e5eaf1"
    },

    td: {
        padding: "15px 20px",
        borderBottom: "1px solid #edf0f5",
        color: "#334155",
        fontSize: "14px"
    },

    tableRow: {
        transition: "background-color 0.2s ease"
    },

    idBadge: {
        display: "inline-block",
        backgroundColor: "#f1f5f9",
        color: "#475569",
        padding: "5px 9px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600"
    },

    employeeName: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "600",
        color: "#1e293b"
    },

    avatar: {
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        backgroundColor: "#dbeafe",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "700",
        flexShrink: 0
    },

    email: {
        color: "#64748b"
    },

    salary: {
        fontWeight: "700",
        color: "#15803d"
    },

    loadingCell: {
        padding: "50px 20px",
        textAlign: "center"
    },

    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        color: "#64748b",
        fontSize: "14px"
    },

    spinner: {
        width: "20px",
        height: "20px",
        border: "3px solid #dbeafe",
        borderTop: "3px solid #2563eb",
        borderRadius: "50%"
    },

    emptyCell: {
        padding: "55px 20px",
        textAlign: "center"
    },

    emptyContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    emptyIcon: {
        width: "55px",
        height: "55px",
        borderRadius: "50%",
        backgroundColor: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        marginBottom: "12px"
    },

    emptyTitle: {
        margin: "0 0 6px",
        fontSize: "17px",
        color: "#334155"
    },

    emptyText: {
        margin: 0,
        fontSize: "13px",
        color: "#94a3b8"
    }
};


export default Home;