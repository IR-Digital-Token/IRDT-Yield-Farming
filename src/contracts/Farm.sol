pragma solidity ^0.5.4;

// import './Interfaces/IERC20.sol';

// pragma solidity ^0.5.16;

contract IERC20 {
    function totalSupply() external view returns (uint256);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

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


contract Farm is Ownable {
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
        uint256 idCounter;
        uint256 currentUserCount;
    }

    mapping(uint256 => mapping(address => uint256)) addressToId;
    mapping(uint256 => mapping(uint256 => address)) idToAddress;
    mapping(uint256 => mapping(address => User)) users;
    Plan[] private plans;

    constructor () public {
    }


    
    // Mutative
    function addPlan(address token, address rewardToken, uint256 rewardAmount, uint256 startTime, uint256 duration, bool referralEnable, uint256 referralPercent, uint256 initialStakingAmount) public onlyOwner {
        Plan memory plan = Plan({
            integralOfRewardPerToken  : 0,
            idCounter : 2,
            stakingTokenAddress : token,
            rewardTokenAddress : rewardToken,
            stakingToken : IERC20(token),
            rewardToken : IERC20(rewardToken),
            remainingRewardAmount : rewardAmount.mul(1e18),
            rewardAmount : rewardAmount,
            duration : duration,
            referralEnable : referralEnable,
            referralPercent : referralPercent,
            startTime: startTime,
            prevTimeStake : startTime,
            totalTokenStaked: initialStakingAmount,
            currentUserCount: 1
        });
        
        
        addressToId[plans.length][msg.sender] = 1;
        idToAddress[plans.length][1] = msg.sender;
        plan.rewardToken.transferFrom(msg.sender, address(this), rewardAmount);
        plan.stakingToken.transferFrom(msg.sender, address(this), initialStakingAmount);
        User memory newUser = User(0, msg.sender, initialStakingAmount);
        users[plans.length][msg.sender] = newUser;
        plans.push(plan);
    }


    function stakeWithPermit(uint256 planIndex, uint256 amount, uint256 referrerID, uint deadlineRT, uint8 vRT, bytes32 rRT, bytes32 sRT) public returns(uint256 id) {
        plans[planIndex].stakingToken.permit(msg.sender, address(this), amount, deadlineRT, vRT, rRT, sRT);
        stake(planIndex, amount, referrerID);
    }
    
    function stake(uint256 planIndex, uint256 amount, uint256 referrerID) public returns(uint256 id) {
        Plan storage plan = plans[planIndex];
        require(users[planIndex][msg.sender].tokenAmount == 0);
        require(plan.idCounter > referrerID , "referrerID is not valid");
        require(block.timestamp < plan.startTime.add(plan.duration),"Too Late");
        require(block.timestamp > plan.startTime,"Too Early");
        plan.stakingToken.transferFrom(msg.sender, address(this), amount);
        plan.integralOfRewardPerToken = plan.integralOfRewardPerToken.add((block.timestamp.sub(plan.prevTimeStake)).mul(rewardPerToken(planIndex)));
        plan.prevTimeStake = block.timestamp;
        plan.totalTokenStaked = plan.totalTokenStaked.add(amount);
        address referrerAddr = idToAddress[planIndex][referrerID];
        User memory newUser = User(plan.integralOfRewardPerToken, referrerAddr, amount);
        users[planIndex][msg.sender] = newUser;
        addressToId[planIndex][msg.sender] = plan.idCounter;
        idToAddress[planIndex][plan.idCounter] = msg.sender;
        plan.idCounter++;
        plan.currentUserCount++;
        return(plan.idCounter - 1);
    }
 

    function unstakeAndClaimRewards(uint256 planIndex) public returns(uint256 reward) {
        Plan storage plan = plans[planIndex];
        require(block.timestamp > plan.startTime,"Too Early");
        User storage user = users[planIndex][msg.sender];
        require(user.tokenAmount > 0);
        uint256 dur = block.timestamp.sub(plan.prevTimeStake);
        if(plan.startTime.add(plan.duration) < block.timestamp){
            dur = plan.startTime.add(plan.duration).sub(plan.prevTimeStake);
        }
        plan.integralOfRewardPerToken = plan.integralOfRewardPerToken.add((dur).mul(rewardPerToken(planIndex)));
        plan.prevTimeStake = plan.prevTimeStake.add(dur);

        plan.totalTokenStaked = plan.totalTokenStaked.sub(user.tokenAmount);

        reward = plan.integralOfRewardPerToken.sub(user.startingIntegral).mul(user.tokenAmount);


        plan.remainingRewardAmount = plan.remainingRewardAmount.sub(reward);
        if(plan.referralEnable){
            uint256 referralReward = (reward.mul(plan.referralPercent)).div(100);
            reward = reward.sub(referralReward);
            plan.rewardToken.transfer(user.referrer, referralReward.div(1e18));
        }

        plan.rewardToken.transfer(msg.sender, reward.div(1e18));
        plan.stakingToken.transfer(msg.sender, user.tokenAmount);
        user.tokenAmount = 0;
        plan.currentUserCount--;
    }

    // Views
    function getPlanData(uint256 planIndex) view public returns (address stakingTokenAddress, address rewardTokenAddress, uint256 totalTokenStaked ,uint256 rewardAmount, uint256 remainingRewardAmount, bool referralEnable, uint256 referralPercent, uint256 startTime, uint256 duration, uint256 currentUserCount, uint256 idCounter){
        Plan memory plan = plans[planIndex];
        return (plan.stakingTokenAddress, plan.rewardTokenAddress, plan.totalTokenStaked, plan.rewardAmount, plan.remainingRewardAmount, plan.referralEnable, plan.referralPercent, plan.startTime, plan.duration, plan.currentUserCount, plan.idCounter);
    }

    function getIntegral(uint256 planIndex) public view returns (uint256) {
        Plan memory plan = plans[planIndex];
        if (block.timestamp < plan.startTime)
            return 0;
        else {
            uint256 dur = block.timestamp.sub(plan.prevTimeStake);
            if(plan.startTime.add(plan.duration) < block.timestamp)
                dur = plan.startTime.add(plan.duration).sub(plan.prevTimeStake);
            return plan.integralOfRewardPerToken.add((dur.sub(plan.prevTimeStake)).mul(rewardPerToken(planIndex)));
        }
    }

    function rewardPerToken(uint256 planIndex) view public returns (uint256) {
        Plan memory plan = plans[planIndex];
        return (plan.rewardAmount.mul(1e18).div(plan.totalTokenStaked).div(plan.duration));
    }

    function totalSupply(uint256 planIndex) public view returns (uint256) {
        Plan memory plan = plans[planIndex];
        return plan.totalTokenStaked;
    }

    function getUserData(uint256 planIndex, address account) public view returns (uint256 stakingAmount, uint256 rewardAmount) {
        Plan memory plan = plans[planIndex];
        User memory user = users[planIndex][account];
        require(user.tokenAmount > 0);
        if (block.timestamp < plan.startTime)
            return (user.tokenAmount, 0);
        uint256 dur = block.timestamp.sub(plan.prevTimeStake);
        if(plan.startTime.add(plan.duration) < block.timestamp){
            dur = plan.startTime.add(plan.duration).sub(plan.prevTimeStake);
        }
        uint256 integralOfRewardPerToken = plan.integralOfRewardPerToken.add((dur.sub(plan.prevTimeStake)).mul(rewardPerToken(planIndex)));
        uint256 reward = (integralOfRewardPerToken.sub(user.startingIntegral)).mul(user.tokenAmount);
        return (user.tokenAmount, reward);
    }

    function getID(uint256 planIndex) view public returns (uint256 id) {
        return addressToId[planIndex][msg.sender];
    }
}