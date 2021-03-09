pragma solidity 0.5.16;

interface IFarm {
    // Mutative
    function addPlan(address token, address rewardToken, uint256 rewardAmount, uint256 startTime, uint256 duration, bool refferalEnable, uint256 referalPercent) external;

    function stake(uint256 planIndex, uint256 amount, uint256 referrer) external;

    function unstakeAndClaimRewards(uint256 planIndex) external;

    // Views
    function getPlanData(uint256 planIndex) external view returns (address, address, uint256, uint256, uint256, uint256, uint256);

    function rewardPerToken(uint256 planIndex, uint256 rewardTokenIndex) external view returns (uint256);

    function totalSupply(uint256 planIndex) external view returns (uint256);

    function balanceOf(uint256 planIndex, address account) external view returns (uint256);

    function getID(uint256 planIndex) external view returns (uint256);
}
