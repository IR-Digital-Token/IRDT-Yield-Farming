/* eslint-disable */
const {norm_duration, norm_reward_amount, norm_start_time, delta_t} = require('./normData');

module.exports.norm_test_cases = [
    {
        name: "A Normal Test With Just One Stoker",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 100},
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: norm_reward_amount,
                stake_amount: 100
            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With One Stoker & Delay",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 1000},
            {
                time: norm_start_time + norm_duration + delta_t,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: norm_reward_amount,
                stake_amount: 1000
            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With Three Stokers",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 1000},
            {
                time: norm_start_time + 0.2 * norm_duration,
                is_stake: true,
                stake_amount: 2000
            },
            {
                time: norm_start_time + 0.4 * norm_duration,
                is_stake: true,
                stake_amount: 3000
            },
            {
                time: norm_start_time + 0.6 * norm_duration,
                is_stake: false,
                unstake_num: 2,
                // unstake_amount: 266.66666666666663
                stake_amount: 2000,
                unstake_amount: 399.9999999999999
            },
            {
                time: norm_start_time + 0.8 * norm_duration,
                is_stake: false,
                // unstake_amount:253.33333333333331,
                unstake_num: 3,
                stake_amount: 3000,

                unstake_amount: 499.9999999999999
            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: 1100.0,
                stake_amount: 1000,

            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With Three Stokers & Some After Duration UnStakes",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: 0.7 * norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 1000},
            {
                time: norm_start_time + 0.2 * norm_duration,
                is_stake: true,
                stake_amount: 2000
            },
            {
                time: norm_start_time + 0.4 * norm_duration,
                is_stake: true,
                stake_amount: 3000
            },
            {
                time: norm_start_time + 0.6 * norm_duration,
                is_stake: false,
                unstake_num: 2,
                unstake_amount: 571.4285714285714,
                stake_amount: 2000,

            },
            {
                time: norm_start_time + 0.8 * norm_duration,
                is_stake: false,
                unstake_num: 3,
                unstake_amount: 499.9999999999999,
                stake_amount: 3000,

            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: 928.5714285714284,
                stake_amount: 1000,

            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With Four Stokers & Some Complicated",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 3000},
            {
                time: norm_start_time + 0.1 * norm_duration,
                is_stake: true,
                stake_amount: 1000
            },
            {
                time: norm_start_time + 0.2 * norm_duration,
                is_stake: false,
                unstake_num: 2,
                unstake_amount: 50.0,
                stake_amount: 1000,

            },
            {
                time: norm_start_time + 0.5 * norm_duration,
                is_stake: true,
                stake_amount: 3000
            },
            {
                time: norm_start_time + 0.6 * norm_duration,
                is_stake: true,
                stake_amount: 4000
            },
            {
                time: norm_start_time + 0.7 * norm_duration,
                is_stake: false,
                unstake_num: 3,
                stake_amount: 3000,
                unstake_amount: 160.00000000000003
            },
            {
                time: norm_start_time + 0.8 * norm_duration,
                is_stake: false,
                unstake_num: 4,
                stake_amount: 4000,

                unstake_amount: 194.2857142857144
            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                stake_amount: 3000,

                unstake_amount: 1595.7142857142856
            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With Four Stokers & Some After Duration Unstakes",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: 0.600001 * norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 3000},
            {
                time: norm_start_time + 0.1 * norm_duration,
                is_stake: true,
                stake_amount: 1000
            },
            {
                time: norm_start_time + 0.2 * norm_duration,
                is_stake: false,
                unstake_num: 2,
                stake_amount: 1000,

                unstake_amount: 83.33333333333333
            },
            {
                time: norm_start_time + 0.5 * norm_duration,
                is_stake: true,
                stake_amount: 3000
            },
            {
                time: norm_start_time + 0.6 * norm_duration,
                is_stake: true,
                stake_amount: 4000
            },
            {
                time: norm_start_time + 0.7 * norm_duration,
                is_stake: false,
                unstake_num: 3,
                stake_amount: 3000,

                unstake_amount: 166.66666666666674
            },
            {
                time: norm_start_time + 0.8 * norm_duration,
                is_stake: false,
                unstake_num: 4,
                stake_amount: 4000,

                unstake_amount: 0.0
            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                stake_amount: 3000,

                unstake_amount: 1750.0
            }
        ],
        referral_enable: false,
        referral_percent: 0
    }
];
