
import React, { useEffect, useState } from "react";

import {
    getFilteredEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "./api/employeeApi";


function App() {

    // =========================================================
    // EMPLOYEE / API STATE
    // =========================================================

    const [apiResponse, setApiResponse] = useState({
        employees: [],
        totalRecords: 0,
        loading: false,
        message: "",
        error: ""
    });


    // =========================================================
    // SEARCH / FILTER / SORT / PAGINATION
    // =========================================================

    const [searchParams, setSearchParams] = useState({
        searchText: "",
        name: "",
        phone: "",
        gender: "",
        minSalary: "",
        maxSalary: "",
        sortBy: "name",
        pageSize: 10,
        pageNo: 1,
        sortDescending: false
    });


    const [showAdvancedSearch, setShowAdvancedSearch] =
        useState(false);


    // =========================================================
    // FORM MODAL
    // =========================================================

    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        salary: "",
        gender: ""
    };


    const [showForm, setShowForm] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const [formData, setFormData] = useState(emptyForm);


    // =========================================================
    // VIEW MODAL
    // =========================================================

    const [showDetails, setShowDetails] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);


    // =========================================================
    // CONFIRMATION MODAL
    // =========================================================

    const [showConfirm, setShowConfirm] = useState(false);

    const [confirmTitle, setConfirmTitle] = useState("");

    const [confirmMessage, setConfirmMessage] = useState("");

    const [confirmAction, setConfirmAction] = useState(null);


    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    useEffect(() => {

        loadEmployees(searchParams);

    }, [searchParams]);


    const loadEmployees = async (params = searchParams) => {

        try {

            setApiResponse(prev => ({
                ...prev,
                loading: true,
                error: ""
            }));


            const response =
                await getFilteredEmployees(params);


            /*
                Axios response:

                response.data
                    =
                backend DmlResponseModel
            */

            const data = response.data;


            console.log("Filtered Employees Response:", data);


            /*
                Expected backend response:

                {
                    status: 2,
                    results: [],
                    totalRecords: 25,
                    messsage: "Employee list fetched successfully"
                }
            */


            const employees =
                Array.isArray(data?.results)
                    ? data.results
                    : Array.isArray(data)
                        ? data
                        : [];


            const totalRecords =
                Number(data?.totalRecords || 0);


            setApiResponse({
                employees,
                totalRecords,
                loading: false,
                message:
                    data?.messsage || "",
                error: ""
            });

        }
        catch (err) {

            console.error(
                "Error loading employees:",
                err
            );


            setApiResponse({
                employees: [],
                totalRecords: 0,
                loading: false,
                message: "",
                error:
                    "Unable to load employees."
            });

        }

    };


    // =========================================================
    // SEARCH INPUT CHANGE
    // =========================================================

    const handleSearchChange = (e) => {

        const { name, value } = e.target;


        setSearchParams(prev => ({
            ...prev,
            [name]: value,
            pageNo: 1
        }));

    };


    // =========================================================
    // SEARCH BUTTON
    // =========================================================

    const handleSearch = () => {

        const params = {
            ...searchParams,
            pageNo: 1
        };


        setSearchParams(params);

        loadEmployees(params);

    };


    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClearSearch = () => {

        const params = {
            searchText: "",
            name: "",
            phone: "",
            gender: "",
            minSalary: "",
            maxSalary: "",
            sortBy: "name",
            pageSize: searchParams.pageSize,
            pageNo: 1,
            sortDescending: false
        };


        setSearchParams(params);

        loadEmployees(params);

    };


    // =========================================================
    // SORT
    // =========================================================

    const handleSort = (field) => {

        let descending = false;


        if (searchParams.sortBy === field) {

            descending =
                !searchParams.sortDescending;

        }


        const params = {
            ...searchParams,
            sortBy: field,
            sortDescending: descending,
            pageNo: 1
        };


        setSearchParams(params);

        loadEmployees(params);

    };


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }


        const params = {
            ...searchParams,
            pageNo: page
        };


        setSearchParams(params);

        loadEmployees(params);

    };


    // =========================================================
    // PAGE SIZE CHANGE
    // =========================================================

    const handlePageSizeChange = (e) => {

        const size =
            Number(e.target.value);


        const params = {
            ...searchParams,
            pageSize: size,
            pageNo: 1
        };


        setSearchParams(params);

        loadEmployees(params);

    };


    // =========================================================
    // PAGINATION CALCULATION
    // =========================================================

    const {
        employees,
        totalRecords,
        loading,
        message,
        error
    } = apiResponse;


    const totalPages =
        Math.ceil(
            totalRecords /
            searchParams.pageSize
        );


    const startRecord =
        totalRecords === 0
            ? 0
            : (
                (searchParams.pageNo - 1)
                * searchParams.pageSize
            ) + 1;


    const endRecord =
        Math.min(
            searchParams.pageNo *
            searchParams.pageSize,
            totalRecords
        );


    // =========================================================
    // ADD EMPLOYEE
    // =========================================================

    const openAddEmployee = () => {

        setEditMode(false);

        setSelectedId(null);

        setFormData(emptyForm);

        setShowForm(true);

    };


    // =========================================================
    // EDIT EMPLOYEE
    // =========================================================

    const openEditEmployee = async (id) => {

        try {

            setApiResponse(prev => ({
                ...prev,
                loading: true,
                error: ""
            }));


            const response =
                await getEmployeeById(id);


            const data =
                response.data;


            const employee =
                data?.results || data;


            setSelectedId(id);


            setFormData({
                name:
                    employee?.name || "",

                email:
                    employee?.email || "",

                phone:
                    employee?.phone || "",

                salary:
                    employee?.salary ?? "",

                gender:
                    employee?.gender || ""
            });


            setEditMode(true);

            setShowForm(true);


        }
        catch (err) {

            console.error(err);


            setApiResponse(prev => ({
                ...prev,
                error:
                    "Unable to load employee details."
            }));

        }
        finally {

            setApiResponse(prev => ({
                ...prev,
                loading: false
            }));

        }

    };


    // =========================================================
    // VIEW EMPLOYEE
    // =========================================================

    const viewEmployee = async (id) => {

        try {

            setApiResponse(prev => ({
                ...prev,
                loading: true,
                error: ""
            }));


            const response =
                await getEmployeeById(id);


            const data =
                response.data;


            const employee =
                data?.results || data;


            setSelectedEmployee(employee);

            setShowDetails(true);

        }
        catch (err) {

            console.error(err);


            setApiResponse(prev => ({
                ...prev,
                error:
                    "Unable to load employee details."
            }));

        }
        finally {

            setApiResponse(prev => ({
                ...prev,
                loading: false
            }));

        }

    };


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================================================
    // ASK CONFIRMATION
    // =========================================================

    const askConfirmation = (
        title,
        text,
        action
    ) => {

        setConfirmTitle(title);

        setConfirmMessage(text);

        setConfirmAction(() => action);

        setShowConfirm(true);

    };


    // =========================================================
    // FORM SUBMIT
    // =========================================================

    const handleSubmit = (e) => {

        e.preventDefault();


        setApiResponse(prev => ({
            ...prev,
            error: "",
            message: ""
        }));


        if (!formData.name.trim()) {

            setApiResponse(prev => ({
                ...prev,
                error:
                    "Employee name is required."
            }));

            return;

        }


        if (!formData.email.trim()) {

            setApiResponse(prev => ({
                ...prev,
                error:
                    "Employee email is required."
            }));

            return;

        }


        if (editMode) {

            askConfirmation(
                "Update Employee",
                "Are you sure you want to update this employee?",
                updateEmployeeData
            );

        }
        else {

            askConfirmation(
                "Add Employee",
                "Are you sure you want to add this employee?",
                createEmployeeData
            );

        }

    };


    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    const createEmployeeData = async () => {

        try {

            setApiResponse(prev => ({
                ...prev,
                loading: true,
                error: ""
            }));


            await createEmployee({

                ...formData,

                salary:
                    formData.salary
                        ? Number(formData.salary)
                        : 0

            });


            setShowForm(false);


            setApiResponse(prev => ({
                ...prev,
                loading: false,
                message:
                    "Employee added successfully."
            }));


            /*
                Reload first page after adding.
            */

            const params = {
                ...searchParams,
                pageNo: 1
            };


            setSearchParams(params);

            await loadEmployees(params);

        }
        catch (err) {

            console.error(err);


            setApiResponse(prev => ({
                ...prev,
                loading: false,
                error:
                    "Unable to add employee."
            }));

        }

    };


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    const updateEmployeeData = async () => {

        try {

            setApiResponse(prev => ({
                ...prev,
                loading: true,
                error: ""
            }));


            await updateEmployee(

                selectedId,

                {
                    ...formData,

                    salary:
                        formData.salary
                            ? Number(formData.salary)
                            : 0
                }

            );


            setShowForm(false);


            setApiResponse(prev => ({
                ...prev,
                loading: false,
                message:
                    "Employee updated successfully."
            }));


            await loadEmployees(searchParams);

        }
        catch (err) {

            console.error(err);


            setApiResponse(prev => ({
                ...prev,
                loading: false,
                error:
                    "Unable to update employee."
            }));

        }

    };


    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    const askDelete = (id) => {

        askConfirmation(

            "Delete Employee",

            "Are you sure you want to delete this employee?",

            async () => {

                try {

                    setApiResponse(prev => ({
                        ...prev,
                        loading: true,
                        error: ""
                    }));


                    await deleteEmployee(id);


                    setApiResponse(prev => ({
                        ...prev,
                        loading: false,
                        message:
                            "Employee deleted successfully."
                    }));


                    /*
                        Reload current page.
                    */

                    await loadEmployees(
                        searchParams
                    );

                }
                catch (err) {

                    console.error(err);


                    setApiResponse(prev => ({
                        ...prev,
                        loading: false,
                        error:
                            "Unable to delete employee."
                    }));

                }

            }

        );

    };


    // =========================================================
    // STYLES
    // =========================================================

    const styles = {

        app: {
            minHeight: "100vh",
            background: "#f1f5f9",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box"
        },

        container: {
            maxWidth: "1400px",
            margin: "auto"
        },

        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "20px"
        },

        title: {
            margin: 0,
            fontSize: "28px",
            color: "#1e293b"
        },

        button: {
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold"
        },

        addButton: {
            background: "#2563eb",
            color: "white"
        },

        searchBox: {
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)"
        },

        searchRow: {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
        },

        input: {
            width: "100%",
            padding: "11px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            boxSizing: "border-box",
            fontSize: "14px"
        },

        searchInput: {
            flex: "1 1 300px",
            padding: "11px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "14px"
        },

        advancedGrid: {
            display: "grid",
            gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginTop: "15px"
        },

        searchButton: {
            background: "#2563eb",
            color: "white"
        },

        clearButton: {
            background: "#64748b",
            color: "white"
        },

        tableCard: {
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)"
        },

        tableWrapper: {
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse"
        },

        th: {
            padding: "14px",
            background: "#f8fafc",
            textAlign: "left",
            borderBottom: "1px solid #e2e8f0",
            cursor: "pointer",
            whiteSpace: "nowrap"
        },

        td: {
            padding: "14px",
            borderBottom: "1px solid #e2e8f0"
        },

        actionBox: {
            display: "flex",
            gap: "5px",
            flexWrap: "wrap"
        },

        smallButton: {
            border: "none",
            padding: "7px 10px",
            borderRadius: "5px",
            cursor: "pointer",
            color: "white"
        },

        pagination: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            flexWrap: "wrap",
            gap: "10px"
        },

        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "15px",
            zIndex: 1000
        },

        modal: {
            background: "white",
            width: "100%",
            maxWidth: "550px",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "10px",
            padding: "25px",
            boxSizing: "border-box"
        },

        formGroup: {
            marginBottom: "15px"
        },

        label: {
            display: "block",
            marginBottom: "6px",
            fontWeight: "bold"
        },

        modalFooter: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px"
        },

        confirmModal: {
            background: "white",
            width: "100%",
            maxWidth: "400px",
            padding: "25px",
            borderRadius: "10px",
            textAlign: "center"
        }

    };


    // =========================================================
    // JSX
    // =========================================================

    return (

        <div style={styles.app}>

            <div style={styles.container}>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div style={styles.header}>

                    <h1 style={styles.title}>
                        Employee Management
                    </h1>


                    <button
                        style={{
                            ...styles.button,
                            ...styles.addButton
                        }}
                        onClick={openAddEmployee}
                    >
                        + Add Employee
                    </button>

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div
                        style={{
                            background: "#dcfce7",
                            color: "#166534",
                            padding: "12px",
                            marginBottom: "15px",
                            borderRadius: "6px"
                        }}
                    >
                        {message}
                    </div>

                )}


                {error && (

                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "12px",
                            marginBottom: "15px",
                            borderRadius: "6px"
                        }}
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div style={styles.searchBox}>

                    <div style={styles.searchRow}>

                        <input
                            style={styles.searchInput}
                            name="searchText"
                            placeholder="Search by name, email or phone..."
                            value={
                                searchParams.searchText
                            }
                            onChange={
                                handleSearchChange
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    handleSearch();
                                }

                            }}
                        />


                        <button
                            style={{
                                ...styles.button,
                                ...styles.searchButton
                            }}
                            onClick={handleSearch}
                        >
                            Search
                        </button>


                        <button
                            style={styles.button}
                            onClick={() =>
                                setShowAdvancedSearch(
                                    !showAdvancedSearch
                                )
                            }
                        >
                            Advanced Search
                        </button>


                        <button
                            style={{
                                ...styles.button,
                                ...styles.clearButton
                            }}
                            onClick={handleClearSearch}
                        >
                            Clear
                        </button>

                    </div>


                    {/* =================================================
                        ADVANCED SEARCH
                    ================================================= */}

                    {showAdvancedSearch && (

                        <div style={styles.advancedGrid}>


                            <input
                                style={styles.input}
                                name="name"
                                placeholder="Name"
                                value={
                                    searchParams.name
                                }
                                onChange={
                                    handleSearchChange
                                }
                            />


                            <input
                                style={styles.input}
                                name="phone"
                                placeholder="Phone"
                                value={
                                    searchParams.phone
                                }
                                onChange={
                                    handleSearchChange
                                }
                            />


                            <select
                                style={styles.input}
                                name="gender"
                                value={
                                    searchParams.gender
                                }
                                onChange={
                                    handleSearchChange
                                }
                            >

                                <option value="">
                                    All Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>


                            <input
                                style={styles.input}
                                type="number"
                                name="minSalary"
                                placeholder="Minimum Salary"
                                value={
                                    searchParams.minSalary
                                }
                                onChange={
                                    handleSearchChange
                                }
                            />


                            <input
                                style={styles.input}
                                type="number"
                                name="maxSalary"
                                placeholder="Maximum Salary"
                                value={
                                    searchParams.maxSalary
                                }
                                onChange={
                                    handleSearchChange
                                }
                            />


                            <button
                                style={{
                                    ...styles.button,
                                    ...styles.searchButton
                                }}
                                onClick={handleSearch}
                            >
                                Apply Filters
                            </button>

                        </div>

                    )}

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div style={styles.tableCard}>

                    <div style={styles.tableWrapper}>

                        <table style={styles.table}>

                            <thead>

                                <tr>

                                    <th
                                        style={styles.th}
                                        onClick={() =>
                                            handleSort("name")
                                        }
                                    >
                                        Name

                                        {searchParams.sortBy === "name"
                                            ? searchParams.sortDescending
                                                ? " ↓"
                                                : " ↑"
                                            : ""}
                                    </th>


                                    <th
                                        style={styles.th}
                                        onClick={() =>
                                            handleSort("email")
                                        }
                                    >
                                        Email

                                        {searchParams.sortBy === "email"
                                            ? searchParams.sortDescending
                                                ? " ↓"
                                                : " ↑"
                                            : ""}
                                    </th>


                                    <th
                                        style={styles.th}
                                        onClick={() =>
                                            handleSort("phone")
                                        }
                                    >
                                        Phone

                                        {searchParams.sortBy === "phone"
                                            ? searchParams.sortDescending
                                                ? " ↓"
                                                : " ↑"
                                            : ""}
                                    </th>


                                    <th
                                        style={styles.th}
                                        onClick={() =>
                                            handleSort("gender")
                                        }
                                    >
                                        Gender

                                        {searchParams.sortBy === "gender"
                                            ? searchParams.sortDescending
                                                ? " ↓"
                                                : " ↑"
                                            : ""}
                                    </th>


                                    <th
                                        style={styles.th}
                                        onClick={() =>
                                            handleSort("salary")
                                        }
                                    >
                                        Salary

                                        {searchParams.sortBy === "salary"
                                            ? searchParams.sortDescending
                                                ? " ↓"
                                                : " ↑"
                                            : ""}
                                    </th>


                                    <th
                                        style={{
                                            ...styles.th,
                                            cursor: "default"
                                        }}
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign: "center",
                                                padding: "30px"
                                            }}
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : employees.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign: "center",
                                                padding: "30px"
                                            }}
                                        >
                                            No employees found.
                                        </td>

                                    </tr>

                                ) : (

                                    employees.map(
                                        employee => (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                <td style={styles.td}>
                                                    {employee.name}
                                                </td>


                                                <td style={styles.td}>
                                                    {employee.email}
                                                </td>


                                                <td style={styles.td}>
                                                    {employee.phone}
                                                </td>


                                                <td style={styles.td}>
                                                    {
                                                        employee.gender
                                                        || "-"
                                                    }
                                                </td>


                                                <td style={styles.td}>
                                                    {
                                                        employee.salary
                                                        ?? "-"
                                                    }
                                                </td>


                                                <td style={styles.td}>

                                                    <div
                                                        style={
                                                            styles.actionBox
                                                        }
                                                    >

                                                        <button
                                                            style={{
                                                                ...styles.smallButton,
                                                                background: "#0ea5e9"
                                                            }}
                                                            onClick={() =>
                                                                viewEmployee(
                                                                    employee.id
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>


                                                        <button
                                                            style={{
                                                                ...styles.smallButton,
                                                                background: "#f59e0b"
                                                            }}
                                                            onClick={() =>
                                                                openEditEmployee(
                                                                    employee.id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            style={{
                                                                ...styles.smallButton,
                                                                background: "#dc2626"
                                                            }}
                                                            onClick={() =>
                                                                askDelete(
                                                                    employee.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )

                                    )

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    <div style={styles.pagination}>

                        <span>

                            Showing{" "}

                            {startRecord}

                            {" - "}

                            {endRecord}

                            {" of "}

                            {totalRecords}

                        </span>


                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >

                            <select
                                value={
                                    searchParams.pageSize
                                }
                                onChange={
                                    handlePageSizeChange
                                }
                            >

                                <option value="5">
                                    5
                                </option>

                                <option value="10">
                                    10
                                </option>

                                <option value="20">
                                    20
                                </option>

                                <option value="50">
                                    50
                                </option>

                            </select>


                            <button
                                style={styles.button}
                                disabled={
                                    searchParams.pageNo <= 1
                                }
                                onClick={() =>
                                    handlePageChange(
                                        searchParams.pageNo - 1
                                    )
                                }
                            >
                                Previous
                            </button>


                            <span>

                                Page{" "}

                                {searchParams.pageNo}

                                {" / "}

                                {totalPages || 1}

                            </span>


                            <button
                                style={styles.button}
                                disabled={
                                    searchParams.pageNo >=
                                    totalPages
                                }
                                onClick={() =>
                                    handlePageChange(
                                        searchParams.pageNo + 1
                                    )
                                }
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ADD / EDIT MODAL
                ================================================= */}

                {showForm && (

                    <div style={styles.modalOverlay}>

                        <div style={styles.modal}>

                            <h2>

                                {editMode
                                    ? "Edit Employee"
                                    : "Add Employee"}

                            </h2>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div
                                    style={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        style={
                                            styles.label
                                        }
                                    >
                                        Name
                                    </label>

                                    <input
                                        style={
                                            styles.input
                                        }
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div
                                    style={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        style={
                                            styles.label
                                        }
                                    >
                                        Email
                                    </label>

                                    <input
                                        style={
                                            styles.input
                                        }
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div
                                    style={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        style={
                                            styles.label
                                        }
                                    >
                                        Phone
                                    </label>

                                    <input
                                        style={
                                            styles.input
                                        }
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div
                                    style={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        style={
                                            styles.label
                                        }
                                    >
                                        Salary
                                    </label>

                                    <input
                                        style={
                                            styles.input
                                        }
                                        type="number"
                                        name="salary"
                                        value={
                                            formData.salary
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div
                                    style={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        style={
                                            styles.label
                                        }
                                    >
                                        Gender
                                    </label>

                                    <select
                                        style={
                                            styles.input
                                        }
                                        name="gender"
                                        value={
                                            formData.gender
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                <div
                                    style={
                                        styles.modalFooter
                                    }
                                >

                                    <button
                                        type="button"
                                        style={
                                            styles.button
                                        }
                                        onClick={() =>
                                            setShowForm(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        style={{
                                            ...styles.button,
                                            ...styles.addButton
                                        }}
                                    >

                                        {editMode
                                            ? "Update"
                                            : "Add Employee"}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =================================================
                    VIEW DETAILS MODAL
                ================================================= */}

                {showDetails &&
                    selectedEmployee && (

                        <div
                            style={
                                styles.modalOverlay
                            }
                        >

                            <div
                                style={
                                    styles.modal
                                }
                            >

                                <h2>
                                    Employee Details
                                </h2>


                                <p>
                                    <b>ID:</b>{" "}
                                    {
                                        selectedEmployee.id
                                    }
                                </p>


                                <p>
                                    <b>Name:</b>{" "}
                                    {
                                        selectedEmployee.name
                                    }
                                </p>


                                <p>
                                    <b>Email:</b>{" "}
                                    {
                                        selectedEmployee.email
                                    }
                                </p>


                                <p>
                                    <b>Phone:</b>{" "}
                                    {
                                        selectedEmployee.phone
                                    }
                                </p>


                                <p>
                                    <b>Gender:</b>{" "}
                                    {
                                        selectedEmployee.gender
                                    }
                                </p>


                                <p>
                                    <b>Salary:</b>{" "}
                                    {
                                        selectedEmployee.salary
                                    }
                                </p>


                                <button
                                    style={
                                        styles.button
                                    }
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    )}


                {/* =================================================
                    CONFIRMATION MODAL
                ================================================= */}

                {showConfirm && (

                    <div
                        style={
                            styles.modalOverlay
                        }
                    >

                        <div
                            style={
                                styles.confirmModal
                            }
                        >

                            <h2>
                                {confirmTitle}
                            </h2>


                            <p>
                                {confirmMessage}
                            </p>


                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px"
                                }}
                            >

                                <button
                                    style={
                                        styles.button
                                    }
                                    onClick={() => {

                                        setShowConfirm(
                                            false
                                        );

                                        setConfirmAction(
                                            null
                                        );

                                    }}
                                >
                                    No
                                </button>


                                <button
                                    style={{
                                        ...styles.button,
                                        background: "#2563eb",
                                        color: "white"
                                    }}
                                    onClick={async () => {

                                        setShowConfirm(
                                            false
                                        );


                                        if (
                                            confirmAction
                                        ) {

                                            await confirmAction();

                                        }

                                    }}
                                >
                                    Yes
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


export default App;
