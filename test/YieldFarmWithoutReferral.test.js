/* eslint-disable */
const FarmContract = artifacts.require("Farm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
let { advanceTime } = require("./utils/timeController.js");
let { advanceBlock } = require("./utils/timeController.js");
const {time} = require('@openzeppelin/test-helpers');
const { norm_test_cases } = require("./testCaseData/normTestCases");
let { errTypes, tryCatch } = require("./utils/exceptionHandler");
let { reenter_test_cases } = require("./testCaseData/reenterTestCases");
let { referral_test_cases } = require("./testCaseData/referralTestCases");
let { referral_reenter_test_cases } = require("./testCaseData/referralReenterTestCases");

require("chai")
    .use(require("chai-as-promised"))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", (accounts) => {
    let daiToken, dappToken, tokenFarm;
    let yieldFarmingContract;
    let token, rewardToken;
    let totalBalance

    let testerFunc = async (testCases) => {
        for (let testCase of testCases) {
            it(testCase.name, async () => {
                console.log((await time.latest()).toString());
                await dappToken.approve(yieldFarmingContract.address, testCase.reward_amount,{from: accounts[0]});
                await daiToken.approve(yieldFarmingContract.address, testCase.times[0].stake_amount,{from: accounts[0]});
                await yieldFarmingContract.addPlan(daiToken.address, dappToken.address, testCase.reward_amount, testCase.start_time,
                    testCase.duration, testCase.referral_enable, testCase.referral_percent, testCase.times[0].stake_amount,{from: accounts[0]});
                let beforeTime = testCase.start_time, usersLen = 1
                plan = 0
                for (let scene of testCase.times.slice(1)) {
                    beforeTime = await time.latest()
                    console.log(scene.time - beforeTime);
                    await advanceTime(scene.time - beforeTime)

                    var block = await web3.eth.getBlock(web3.eth.blockNumber);
                    // console.log(block.timestamp)
                    console.log((await time.latest()).toString());

                    if (scene.is_stake) {
                        // console.log(accounts[time.stake_num ? (time.stake_num - 1) : usersLen]);
                        await daiToken.approve(yieldFarmingContract.address, scene.stake_amount,{from: accounts[scene.stake_num ? (scene.stake_num - 1) : usersLen]});

                        // The "time.stake_num" Is Just For Reenter TestCases & It's Not Related To "userLen". For That, There Is No Need For userLen
                        let stakeFunc = yieldFarmingContract.stake(plan, scene.stake_amount, scene.referrer | 0, { from: accounts[scene.stake_num ? (scene.stake_num - 1) : usersLen] })

                        if (scene.is_reenter) {
                            await tryCatch(stakeFunc, errTypes.revert);
                        } else {
                            await stakeFunc
                            usersLen++
                        }
                    } else {
                        let unstakeAmountFunc = await yieldFarmingContract.unstakeAndClaimRewards(0, { from: accounts[scene.unstake_num - 1]})
                        if (scene.is_reenter) {
                            await tryCatch(unstakeAmountFunc, errTypes.revert);
                        } else {
                            await unstakeAmountFunc;
                            console.log("shiii")
                            console.log(unstakeAmountFunc);
                            assert.equal(scene.unstake_amount, unstakeAmountFunc)
                        }
                    }
                    beforeTime = scene.time
                }
            });
        }
    }

    before(async () => {
        //todo
        // for now, yieldFarmingContract & token & rewardToken NeedsTo BeSet

        // init contract for owner="The Last Account Of BlockChain"
        // console.log(time.time - beforeTime);
        
        yieldFarmingContract = await FarmContract.new({ from: accounts[0] });
        // console.log(accounts[0]);
        daiToken = await DaiToken.new({ from: accounts[0] });
        dappToken = await DaiToken.new({ from: accounts[0] });
        console.log(accounts);
        totalBalance = 1000000
        accounts.slice(1,3).forEach(account => {
            if (account !== accounts[0]) {
                console.log(account);
                // dappToken.transfer(account, 1000, { from: accounts[0] })
                daiToken.transfer(account, 1000, { from: accounts[0] })
            }
            
        });

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

    // describe("Reenter Scenarios Testing", testerFunc(reenter_test_cases))

    // describe("Referral Scenarios Testing", testerFunc(referral_test_cases))

    // describe("Referral Reenter Scenarios Testing", testerFunc(referral_reenter_test_cases))

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
            await tokenFarm.stakeTokens(tokens("100"), { from: investor });

            // Ensure that only onwer can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({ from: investor });

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
