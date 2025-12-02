// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/**
 * @title SimplePayroll
 * @notice A simple payroll contract that accepts and distributes native tokens (ETH/QIE)
 */
contract SimplePayroll {
    address public employer;

    struct Employee {
        address wallet;
        uint256 salary; // Salary in wei (native token)
        bool exists;
    }

    mapping(address => Employee) private employees;
    address[] private employeeList;

    event EmployeeAdded(address indexed wallet, uint256 salary);
    event EmployeeRemoved(address indexed wallet);
    event EmployeePaid(address indexed wallet, uint256 amount);
    event PayrollFunded(address indexed employer, uint256 amount);
    event FundsWithdrawn(address indexed employer, uint256 amount);

    modifier onlyEmployer() {
        require(msg.sender == employer, "Not authorized");
        _;
    }

    constructor() {
        employer = msg.sender;
    }

    /**
     * @notice Fund the payroll contract with native tokens
     */
    receive() external payable {
        emit PayrollFunded(msg.sender, msg.value);
    }

    /**
     * @notice Add an employee to the payroll
     * @param _wallet Employee wallet address
     * @param _salary Employee salary in wei
     */
    function addEmployee(address _wallet, uint256 _salary) external onlyEmployer {
        require(!employees[_wallet].exists, "Employee already exists");
        require(_wallet != address(0), "Invalid address");
        require(_salary > 0, "Salary must be greater than 0");

        employees[_wallet] = Employee(_wallet, _salary, true);
        employeeList.push(_wallet);
        
        emit EmployeeAdded(_wallet, _salary);
    }

    /**
     * @notice Remove an employee from the payroll
     * @param _wallet Employee wallet address
     */
    function removeEmployee(address _wallet) external onlyEmployer {
        require(employees[_wallet].exists, "Employee does not exist");
        
        delete employees[_wallet];
        
        // Remove from employeeList
        for (uint256 i = 0; i < employeeList.length; i++) {
            if (employeeList[i] == _wallet) {
                employeeList[i] = employeeList[employeeList.length - 1];
                employeeList.pop();
                break;
            }
        }
        
        emit EmployeeRemoved(_wallet);
    }

    /**
     * @notice Pay a single employee
     * @param _employeeAddress Employee wallet address
     */
    function payEmployee(address _employeeAddress) external onlyEmployer {
        Employee memory emp = employees[_employeeAddress];
        require(emp.exists, "Employee does not exist");
        require(address(this).balance >= emp.salary, "Insufficient balance");

        (bool success, ) = emp.wallet.call{value: emp.salary}("");
        require(success, "Payment failed");

        emit EmployeePaid(emp.wallet, emp.salary);
    }

    /**
     * @notice Pay all employees
     */
    function payAllEmployees() external onlyEmployer {
        uint256 totalRequired = 0;
        
        // Calculate total required
        for (uint256 i = 0; i < employeeList.length; i++) {
            if (employees[employeeList[i]].exists) {
                totalRequired += employees[employeeList[i]].salary;
            }
        }
        
        require(address(this).balance >= totalRequired, "Insufficient balance");

        // Pay all employees
        for (uint256 i = 0; i < employeeList.length; i++) {
            address empAddress = employeeList[i];
            if (employees[empAddress].exists) {
                uint256 salary = employees[empAddress].salary;
                (bool success, ) = empAddress.call{value: salary}("");
                
                if (success) {
                    emit EmployeePaid(empAddress, salary);
                }
            }
        }
    }

    /**
     * @notice Get employee details
     * @param _wallet Employee wallet address
     */
    function getEmployee(address _wallet) external view returns (Employee memory) {
        require(employees[_wallet].exists, "Employee does not exist");
        return employees[_wallet];
    }

    /**
     * @notice Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get all employee addresses
     */
    function getAllEmployees() external view returns (address[] memory) {
        return employeeList;
    }

    /**
     * @notice Emergency withdraw function
     */
    function emergencyWithdraw() external onlyEmployer {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = employer.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(employer, balance);
    }
}
