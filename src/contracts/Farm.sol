pragma solidity 5.0;

import './Interfaces/IFarm.sol';
import './Interfaces/IERC20.sol';


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


contract Farm is IFarm, Ownable {
    using SafeMath for uint256;

    struct User {
        uint256 startingIntegral;
        address referrer;
        uint256 tokenAmount;
    }

    struct Plan {
        address stakingTokenAddress;
        address rewardTokenAddress;
        IERC20 stakingToken;
        IERC20 rewardToken;
        uint256 totalTokenStaked;
        uint256 remainingRewardAmount;
        uint256 rewardAmount;
        uint256 duration;
        uint256 integralOfRewardPerToken;
        bool referralEnable;
        uint256 referralPercent;
        uint256 startTime;
        uint256 prevTimeStake;
        mapping(address => User) users;
        uint256 idCounter;
        mapping(address => uint256) addressToId;
        mapping(uint256 => address) idToAddress;
    }

    Plan[] private Plans;

    // Mutative
    function addPlan(address token, address rewardToken, uint256 rewardAmount, uint256 startTime, uint256 duration, bool referralEnable, uint256 referralPercent, uint256 initialStakingAmount) public onlyOwner {
        Plan memory plan = Plan({
            stakingTokenAddress : token,
            rewardTokenAddress : rewardToken,
            stakingToken : IERC20(token),
            rewardToken : IERC20(rewardToken),
            remainingRewardAmount : rewardAmount,
            rewardAmount : rewardAmount,
            duration : duration,
            referralEnable : referralEnable,
            referralPercent : referralPercent,
            startTime: startTime,
            prevTimeStake : startTime,
            totalTokenStaked: initialStakingAmount,
        });
        plan.addressToId[msg.sender] = 0;
        plan.idToAddress[0] = msg.sender;
        plan.idCounter++; 
        plan.rewardToken.transferFrom(msg.sender, this, rewardAmount);
        plan.stakingToken.transferFrom(msg.sender, this, initialStakingAmount);
        User newUser = User(0, msg.sender, initialStakingAmount);
        plan.users[msg.sender] = newUser;
        Plans.push(plan);
    }

    function stake(uint256 planIndex, uint256 amount, uint256 referrer) {
        Plan storage plan = Plans[planIndex];
        require(plan.users[msg.sender].tokenAmount == 0);
        plan.stakingToken.transferFrom(msg.sender, this, amount);
        plan.integralOfRewardPerToken = plan.integralOfRewardPerToken.add((now.sub(plan.prevTimeStake)).mul(rewardPerToken(planIndex)));
        plan.prevTimeStake = now;
        plan.totalTokenStaked = plan.totalTokenStaked.add(amount);
        address referrerAddr = plan.idToAddress[referrer];
        User newUser = User(plan.integralOfRewardPerToken, referrerAddr, amount);
        plan.users[msg.sender] = newUser;
        plan.addressToId[msg.sender] = plan.idCounter;
        plan.idToAddress[plan.idCounter] = msg.sender;
        plan.idCounter++;
    }

    function unstakeAndClaimRewards(uint256 planIndex) external {
        Plan storage plan = Plans[planIndex];
        User storage user = plan.users[msg.sender];
        require(user.tokenAmount > 0);
        plan.integralOfRewardPerToken = plan.integralOfRewardPerToken.add((now.sub(plan.prevTimeStake)).mul(rewardPerToken(planIndex)));
        plan.prevTimeStake = now;
        plan.totalTokenStaked = plan.totalTokenStaked.sub(user.tokenAmount);
        uint256 reward = (plan.integralOfRewardPerToken.sub(user.startingIntegral)).mul(user.tokenAmount);
        plan.remainingRewardAmount = plan.remainingRewardAmount.sub(reward);
        if(plan.referralEnable){
            uint256 referralReward = (reward.mul(plan.referralPercent)).div(100);
            reward = reward.sub(referralReward);
            plan.rewardToken.transfer(user.referrer, referralReward);
        }
        plan.rewardToken.transfer(msg.sender, reward);
        plan.stakingToken.transfer(msg.sender, user.tokenAmount);
        user.tokenAmount = 0;
    }

    // Views
    function getPlanData(uint256 planIndex) view returns (address, address, uint256, uint256, uint256, uint256, uint256){
        Plan memory plan = Plans[planIndex];
        return (plan.stakingTokenAddress, plan.rewardTokenAddress, plan.totalTokenStaked, plan.rewardAmount, plan.referralPercent,plan.startTime, plan.duration);
    }

    function rewardPerToken(uint256 planIndex) view returns (uint256) {
        return (rewardAmount.div(totalTokenStaked).div(duration));
    }

    function totalSupply(uint256 planIndex) external view returns (uint256) {
        Plan memory plan = Plans[planIndex];
        return plan.totalTokenStaked;
    }

    function balanceOf(uint256 planIndex, address account) external view returns (uint256) {
        require(address != 0);
        Plan memory plan = Plans[planIndex];
        return plan.startingIntegral[account].tokenAmount;
    }

    function getID(uint256 planIndex) view returns (uint256) {
        return Plans[planIndex].addressToId[msg.sender];
    }
}