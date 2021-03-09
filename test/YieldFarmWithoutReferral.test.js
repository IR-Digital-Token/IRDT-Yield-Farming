/* eslint-disable */
const FarmContract = artifacts.require("Farm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

import {norm_test_cases} from "./testCaseData/normTestCases";
import {errTypes, tryCatch} from "./utils/exceptionHandler";
import {reenter_test_cases} from "./testCaseData/reenterTestCases";
import {referral_test_cases} from "./testCaseData/referralTestCases";
import {referral_reenter_test_cases} from "./testCaseData/referralReenterTestCases"
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
    let totalBalance

    let testerFunc = async (testCases) => {
        for (let testCase of testCases) {
            it(testCase.name, async () => {
                let plan = await yieldFarmingContract.addPlan(token, rewardToken, testCase.reward_amount, testCase.start_time,
                    testCase.duration, testCase.referral_enable, testCase.referral_percent)
                let beforeTime = 0, usersLen = 0
                for (let time of testCase.times) {
                    await advanceTime(time.time - beforeTime)
                    if (time.is_stake) {
                        // The "time.stake_num" Is Just For Reenter TestCases & It's Not Related To "userLen". For That, There Is No Need For userLen
                        let stakeFunc = yieldFarmingContract.stake(plan, time.stake_amount, time.referrer | 0, {from: accounts[time.stake_num ? (time.stake_num - 1) : usersLen]})

                        if (time.is_reenter) {
                            await tryCatch(stakeFunc, errTypes.revert);
                        } else {
                            await stakeFunc
                            usersLen++
                        }
                    } else {
                        let unstakeAmountFunc = yieldFarmingContract.unstakeAndClaimRewards(0, {from: accounts[time.unstake_num - 1]})
                        if (time.is_reenter) {
                            await tryCatch(unstakeAmountFunc, errTypes.revert);
                        } else {
                            assert.equal(time.unstake_amount, unstakeAmount)
                        }
                    }
                    beforeTime = time.time
                }
            });
        }
    }

    before(async () => {
        //todo
        // for now, yieldFarmingContract & token & rewardToken NeedsTo BeSet

        // init contract for owner="The Last Account Of BlockChain"
        yieldFarmingContract = await FarmContract.new({from: owner})
        daiToken = await DaiToken.new({from: owner})
        dappToken = await DappToken.new({from: owner});

        totalBalance = 1000000
        for (let account in accounts) {
            await dappToken.transfer(account, tokens(totalBalance.accounts.length), {from: owner})
            await daiToken.transfer(account, tokens(totalBalance.accounts.length), {from: owner})
        }
        // Load Contracts
        // daiToken = await DaiToken.new();
        // dappToken = await DappToken.new();
        // tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfer all Dapp tokens to farm (1 million)
        // await dappToken.transfer(tokenFarm.address, tokens("1000000"));

        // Send tokens to investor
        // await daiToken.transfer(investor, tokens("100"), {from: owner});
    });

    describe("Check Balances", async () => {
        it("Check Balances Of Token", async () => {
            for (let account in accounts) {
                let balance = await dappToken.balanceOf[account]
                let balance2 = await daiToken.balanceOf[account]
                assert.equal(balance, totalBalance / accounts.length)
                assert.equal(balance2, totalBalance / accounts.length)
            }
        })
    })

    describe("Norm Scenarios Testing", testerFunc(norm_test_cases))

    describe("Reenter Scenarios Testing", testerFunc(reenter_test_cases))

    describe("Referral Scenarios Testing", testerFunc(referral_test_cases))

    describe("Referral Reenter Scenarios Testing", testerFunc(referral_reenter_test_cases))

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
