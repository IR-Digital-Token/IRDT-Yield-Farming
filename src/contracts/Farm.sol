pragma solidity 5.0;
import './Interfaces/IFarm.sol';


library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }
}


contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () internal {
        address msgSender = msg.sender;
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
 
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner; 
    }
}


contract Farm is IFarm , Ownable{
    using SafeMath for uint256;

    struct user {
        uint256 startingIntegral;
        address referrer;
        uint256 tokenAmount;
    }

    struct Plan {
        address stakingToken;
        address rewardToken;
        uint256 totalTokenStaked;
        uint256 remainingRewardAmount;
        uint256 rewardAmount;
        uint256 duration;
        uint256 integralOfRewardPerToken;
        bool refferalEnable;
        uint256 referalPercent;
        mapping (address => user) users;
        mapping (address => uint256) addressToId;
        mapping (uint256 => address) idToAddress;
        
    }

    Plan[] private Plans;

    // Mutative
    function addPlan(address token, address rewardToken, uint256 rewardAmount, uint256 startTime, uint256 duration, bool refferalEnable, uint256 referalPercent) public onlyOwner {

    }

    function stake(uint256 planIndex, uint256 amount, uint256 referrer) ;

    function unstakeAndClaimRewards(uint256 planIndex) external;

    // Views
    function getPlanData(uint256 planIndex) external view returns (uint256);

    function rewardPerToken(uint256 planIndex) view returns (uint256) {
        return (rewardAmount.div(totalTokenStaked).div(duration));
    }

    function earned(uint256 planIndex, address account) external view returns (uint256);

    function totalSupply(uint256 planIndex) external view returns (uint256) {
        Plan plan = Plans[planIndex];
        return plan.totalTokenStaked;
    }

    function balanceOf(uint256 planIndex, address account) external view returns (uint256) {
        require(address!=0);
        Plan plan = Plans[planIndex];
        return plan.startingIntegral[account].tokenAmount;
    }
}