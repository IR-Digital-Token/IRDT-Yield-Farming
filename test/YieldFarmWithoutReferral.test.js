/* eslint-disable */
// const DaiToken = artifacts.require("DaiToken");

require("chai")
    .use(require("chai-as-promised"))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, "ether");
}


let norm_start_time = 50
let norm_duration = 100
let testCases = [
    {
        'name': 'A Normal Test With Just One Stoker',
        'reward_amount': 2000,
        'start_time': norm_start_time,
        'duration': norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 1000},
            {'time': (norm_start_time + norm_duration), 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 2000.0}
        ],
        'referral_enable': False,
        'referral_percent': 0,
    }
]

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

    describe("Different Scenarios Testing", async () => {
        for (let testCase of testCases) {
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

    describe("Mock DAI deployment", async () => {
        it("has a name", async () => {
            const name = await daiToken.name();
            assert.equal(name, "Mock DAI Token");
        });
    });

    describe("Dapp Token deployment", async () => {
        it("has a name", async () => {
            const name = await dappToken.name();
            assert.equal(name, "DApp Token");
        });
    });

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

            // Check staking result
            result = await daiToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("0"),
                "investor Mock DAI wallet balance correct after staking"
            );

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(
                result.toString(),
                tokens("100"),
                "Token Farm Mock DAI balance correct after staking"
            );

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor staking balance correct after staking"
            );

            result = await tokenFarm.isStaking(investor);
            assert.equal(
                result.toString(),
                "true",
                "investor staking status correct after staking"
            );

            // Issue Tokens
            await tokenFarm.issueTokens({from: owner});

            // Check balances after issuance
            result = await dappToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor DApp Token wallet balance correct affter issuance"
            );

            // Ensure that only onwer can issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({from: investor});

            // Check results after unstaking
            result = await daiToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor Mock DAI wallet balance correct after staking"
            );

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
