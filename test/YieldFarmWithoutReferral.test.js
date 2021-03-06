/* eslint-disable */
// const DaiToken = artifacts.require("DaiToken");

import {norm_test_cases} from "./testCaseData/normTestCases";

require("chai")
    .use(require("chai-as-promised"))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm;
    let yieldFarmingContract;
    let token, rewardToken;

    before(async () => {
        //todo
        // for now, yieldFarmingContract & token & rewardToken NeedsTo BeSet

        // Load Contracts
        // daiToken = await DaiToken.new();
        // dappToken = await DappToken.new();
        // tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfer all Dapp tokens to farm (1 million)
        // await dappToken.transfer(tokenFarm.address, tokens("1000000"));

        // Send tokens to investor
        // await daiToken.transfer(investor, tokens("100"), {from: owner});
    });

    describe("Norm Scenarios Testing", async () => {
        for (let testCase of norm_test_cases) {
            it(testCase.name, async () => {
                let plan = await yieldFarmingContract.addPlan(token, rewardToken, testCase.reward_amount, testCase.start_time,
                    testCase.duration, testCase.referral_enable, testCase.referral_percent)
                let beforeTime = 0, usersLen = 0
                for (let time of testCase.times) {
                    await advanceTime(time.time - beforeTime)
                    if (time.is_stake) {
                        await yieldFarmingContract.stake(plan, time.stake_amount, time.referrer | 0, {from: accounts[usersLen]})
                        usersLen++
                    } else {
                        let unstakeAmount = await yieldFarmingContract.unstakeAndClaimRewards(0, {from: accounts[time.unstake_num - 1]})
                        assert.equal(time.unstake_amount, unstakeAmount)
                    }
                    beforeTime = time.time
                }
            });
        }
    })

    describe("Reenter Scenarios Testing", async () => {
        //    todo
    })

    describe("Token Farm deployment", async () => {
        it("has a name", async () => {
            const name = await tokenFarm.name();
            assert.equal(name, "Dapp Token Farm");
        });

        it("contract has tokens", async () => {
            const balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens("1000000"));
        });
    });

    describe("Farming tokens", async () => {
        it("rewards investors for staking mDai tokens", async () => {
            let result;

            // Check investor balance before staking
            result = await daiToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor Mock DAI wallet balance correct before staking"
            );

            // Stake Mock DAI Tokens
            await daiToken.approve(tokenFarm.address, tokens("100"), {
                from: investor
            });
            await tokenFarm.stakeTokens(tokens("100"), {from: investor});

            // Ensure that only onwer can issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({from: investor});

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(
                result.toString(),
                tokens("0"),
                "Token Farm Mock DAI balance correct after staking"
            );

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(
                result.toString(),
                tokens("0"),
                "investor staking balance correct after staking"
            );

            result = await tokenFarm.isStaking(investor);
            assert.equal(
                result.toString(),
                "false",
                "investor staking status correct after staking"
            );
        });
    });
});
