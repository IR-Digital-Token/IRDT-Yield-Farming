pragma solidity >=0.4.22 <0.9.0;

interface IStakingRewards {
    // Mutative
    function addPlan(address token, address rewardToken, uint256 rewardAmount, uint256 startTime, uint256 duration, bool refferalEnable, uint256 referalPercent) external;

    function stake(uint256 planIndex, uint256 amount, uint256 referrer) external;

    function unstakeAndClaimRewards(uint256 planIndex, uint256 unstakeAmount) external;

    function unstake(uint256 planIndex, uint256 amount) external;

    function claimRewards(uint256 planIndex) external;

    // Views
    function lastTimeRewardApplicable(uint256 planIndex) external view returns (uint256);

    function rewardPerToken(uint256 planIndex, uint256 rewardTokenIndex) external view returns (uint256);

    function earned(uint256 planIndex, address account, uint256 rewardTokenIndex) external view returns (uint256);

    function getRewardForDuration(uint256 planIndex, uint256 rewardTokenIndex) external view returns (uint256);

    function totalSupply(uint256 planIndex) external view returns (uint256);

    function balanceOf(uint256 planIndex, address account) external view returns (uint256);
}
