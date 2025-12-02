// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./IERC20.sol";
import "./ISwapRouter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Payroll {
    address public employer;
    ISwapRouter public dex; // Uniswap V3 SwapRouter
    IERC20 public fallbackToken;  // e.g., USDT

    // Mapping symbol => Chainlink oracle
    mapping(string => AggregatorV3Interface) public oracles;

    struct Employee {
        address wallet;
        address token;
        string symbol;
        uint256 salaryUSD; // 18 decimals
        bool exists;
    }

    mapping(address => Employee) private employees;

    event EmployeeAdded(address indexed wallet, address indexed token, string symbol, uint256 salaryUSD);
    event EmployeeRemoved(address indexed wallet);
    event EmployeePaid(address indexed wallet, address indexed token, string symbol, uint256 amountToken, uint256 amountUSD);
    event PayrollFunded(address indexed employer, uint256 amount);
    event OracleUpdated(string indexed symbol, address oracleAddress);
    event BatchPaymentCompleted(uint256 employeesPaid, uint256 totalAmountUSD);

    modifier onlyEmployer() {
        require(msg.sender == employer, "Not authorized");
        _;
    }

    constructor(address _dex, address _fallbackToken) {
        employer = msg.sender;
        dex = ISwapRouter(_dex);
        fallbackToken = IERC20(_fallbackToken);

        // Initialize Chainlink oracles (example addresses)
        oracles["BTC"] = AggregatorV3Interface(0x9E596d809a20A272c788726f592c0d1629755440);
        oracles["ETH"] = AggregatorV3Interface(0x4bb7012Fbc79fE4Ae9B664228977b442b385500d);
        oracles["XRP"] = AggregatorV3Interface(0x804582B1f8Fea73919e7c737115009f668f97528);
        oracles["SOL"] = AggregatorV3Interface(0xe86999c8e6C8eeF71bebd35286bCa674E0AD7b21);
        oracles["QIE"] = AggregatorV3Interface(0x3Bc617cF3A4Bb77003e4c556B87b13D556903D17);
        oracles["XAUt"] = AggregatorV3Interface(0x9aD0199a67588ee293187d26bA1BE61cb07A214c);
        oracles["BNB"] = AggregatorV3Interface(0x775A56117Fdb8b31877E75Ceeb68C96765b031e6);
    }

    function addEmployee(address _wallet, address _token, string memory _symbol, uint256 _salaryUSD) external onlyEmployer {
        require(!employees[_wallet].exists, "Employee exists");
        require(address(oracles[_symbol]) != address(0), "Oracle not configured");
        employees[_wallet] = Employee(_wallet, _token, _symbol, _salaryUSD, true);
        emit EmployeeAdded(_wallet, _token, _symbol, _salaryUSD);
    }

    function removeEmployee(address _wallet) external onlyEmployer {
        require(employees[_wallet].exists, "No such employee");
        delete employees[_wallet];
        emit EmployeeRemoved(_wallet);
    }

    function getLatestPrice(string memory _symbol) public view returns (int256) {
        require(address(oracles[_symbol]) != address(0), "Oracle not found");
        (, int256 price,,,) = oracles[_symbol].latestRoundData();
        return price;
    }

    function payEmployee(address _employeeAddress) external onlyEmployer {
        Employee memory emp = employees[_employeeAddress];
        require(emp.exists, "No such employee");

        uint256 salaryUSD = emp.salaryUSD;

        // Token price in USD with 8 decimals
        int256 tokenPriceUSD = getLatestPrice(emp.symbol);
        require(tokenPriceUSD > 0, "Invalid oracle price");

        // Calculate required token amount (tokenAmount = salaryUSD * 1e8 / tokenPriceUSD)
        uint256 tokenAmount = (salaryUSD * 1e8) / uint256(tokenPriceUSD);

        // Calculate minimum amount with 2% slippage tolerance
        uint256 minAmountOut = (tokenAmount * 98) / 100;

        // Approve SwapRouter to spend fallback token
        fallbackToken.approve(address(dex), salaryUSD);

        // Execute swap: fallbackToken -> employee token
        uint256 amountOut = dex.swapExactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(fallbackToken),
                tokenOut: emp.token,
                fee: 3000, // 0.3% pool fee
                recipient: emp.wallet,
                deadline: block.timestamp + 120,
                amountIn: salaryUSD,
                amountOutMinimum: minAmountOut,
                sqrtPriceLimitX96: 0
            })
        );

        emit EmployeePaid(emp.wallet, emp.token, emp.symbol, amountOut, salaryUSD);
    }

    function addOracle(string memory _symbol, address _oracleAddress) external onlyEmployer {
        require(_oracleAddress != address(0), "Invalid oracle");
        oracles[_symbol] = AggregatorV3Interface(_oracleAddress);
        emit OracleUpdated(_symbol, _oracleAddress);
    }

    function fundPayroll(uint256 amount) external onlyEmployer {
        require(fallbackToken.transferFrom(msg.sender, address(this), amount), "Funding failed");
        emit PayrollFunded(msg.sender, amount);
    }

    function getBalance() external view returns (uint256) {
        return fallbackToken.balanceOf(address(this));
    }

    function payAllEmployees(address[] calldata _employeeAddresses) external onlyEmployer {
        uint256 totalPaid = 0;
        uint256 successfulPayments = 0;

        for (uint256 i = 0; i < _employeeAddresses.length; i++) {
            Employee memory emp = employees[_employeeAddresses[i]];
            
            if (!emp.exists) continue;

            try this.payEmployee(_employeeAddresses[i]) {
                successfulPayments++;
                totalPaid += emp.salaryUSD;
            } catch {
                // Continue with next employee if payment fails
                continue;
            }
        }

        emit BatchPaymentCompleted(successfulPayments, totalPaid);
    }

    function getEmployee(address _wallet) external view returns (Employee memory) {
        require(employees[_wallet].exists, "Employee not found");
        return employees[_wallet];
    }

    function emergencyWithdraw() external onlyEmployer {
        uint256 balance = fallbackToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        require(fallbackToken.transfer(employer, balance), "Withdrawal failed");
    }
}
