/* eslint-disable */
import {norm_duration, norm_reward_amount, norm_start_time, delta_t} from "./normData";

export const reenter_test_cases = [
    {
        name: "One Stoker &, UnStake With NonStake Account, & Stakes After Duration",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 1000},
            {
                time: norm_start_time + 0.5 * norm_duration,
                is_stake: false,
                is_reenter: true,
                unstake_num: 2,
                unstake_amount: norm_reward_amount
            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: norm_reward_amount
            },
            {time: norm_start_time + 1.5 * norm_duration, is_stake: true, is_reenter: true, stake_amount: 1000}
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With One Stoker & Delay, &repeated Unstakes, & Some Stakes & Unstakes For Another Account",
        reward_amount: norm_reward_amount,
        start_time: norm_start_time,
        duration: norm_duration,
        times: [
            {time: norm_start_time, is_stake: true, stake_amount: 1000},
            {
                time: norm_start_time + norm_duration + delta_t,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: norm_reward_amount
            },
            {
                time: norm_start_time + 1.1 * norm_duration,
                is_stake: false,
                is_reenter: true,
                unstake_num: 1,
                unstake_amount: norm_reward_amount
            },
            {time: norm_start_time + 1.5 * norm_duration, is_stake: true, is_reenter: true, stake_amount: 5000},
            {
                time: norm_start_time + 1.9 * norm_duration,
                is_stake: false,
                is_reenter: true,
                unstake_num: 2,
                unstake_amount: norm_reward_amount
            },
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With Three Stokers (Early Unstakes & Repeated Stakes&Unstakes For Account 2 & AfterDuration Unstakes For Account 1)",
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
                time: norm_start_time + 0.25 * norm_duration,
                is_stake: true,
                is_reenter: true,
                stake_num: 1,
                stake_amount: 2000
            },
            {
                time: norm_start_time + 0.3 * norm_duration,
                is_stake: false,
                is_reenter: true,
                unstake_num: 3,
                unstake_amount: 399.9999999999999
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
                unstake_amount: 399.9999999999999
            },
            {
                time: norm_start_time + 0.7 * norm_duration,
                is_stake: true,
                is_reenter: true,
                stake_num: 2,
                stake_amount: 2000
            },
            {
                time: norm_start_time + 0.8 * norm_duration,
                is_stake: false,
                unstake_num: 3,
                unstake_amount: 499.9999999999999
            },
            {
                time: norm_start_time + 0.9 * norm_duration,
                is_stake: false,
                is_reenter: true,
                unstake_num: 2,
                unstake_amount: 499.9999999999999
            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: 1100.0
            },
            {
                time: norm_start_time + 1.3 * norm_duration,
                is_stake: false,
                is_reenter: true,
                unstake_num: 1,
                unstake_amount: 1100.0
            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    {
        name: "A Test With Three Stokers & Repeated Stake For 1 & Repeated Unstake After Duration for 1",
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
                unstake_amount: 571.4285714285714
            },
            {
                time: norm_start_time + 0.8 * norm_duration,
                is_stake: true,
                is_reenter: true,
                stake_num: 1,
                stake_amount: 1500.0
            },
            {
                time: norm_start_time + norm_duration,
                is_stake: false,
                unstake_num: 3,
                unstake_amount: 499.9999999999999
            },
            {
                time: norm_start_time + 1.2 * norm_duration,
                is_stake: false,
                unstake_num: 1,
                unstake_amount: 928.5714285714284
            }
        ],
        referral_enable: false,
        referral_percent: 0
    },
    // {
    //     name: "A Test With Four Stokers & Some Complicated",
    //     reward_amount: norm_reward_amount,
    //     start_time: norm_start_time,
    //     duration: norm_duration,
    //     times: [
    //         {time: norm_start_time, is_stake: true, stake_amount: 3000},
    //         {
    //             time: norm_start_time + 0.1 * norm_duration,
    //             is_stake: true,
    //             stake_amount: 1000
    //         },
    //         {
    //             time: norm_start_time + 0.2 * norm_duration,
    //             is_stake: false,
    //             unstake_num: 2,
    //             unstake_amount: 50.0
    //         },
    //         {
    //             time: norm_start_time + 0.5 * norm_duration,
    //             is_stake: true,
    //             stake_amount: 3000
    //         },
    //         {
    //             time: norm_start_time + 0.6 * norm_duration,
    //             is_stake: true,
    //             stake_amount: 4000
    //         },
    //         {
    //             time: norm_start_time + 0.7 * norm_duration,
    //             is_stake: false,
    //             unstake_num: 3,
    //             unstake_amount: 160.00000000000003
    //         },
    //         {
    //             time: norm_start_time + 0.8 * norm_duration,
    //             is_stake: false,
    //             unstake_num: 4,
    //             unstake_amount: 194.2857142857144
    //         },
    //         {
    //             time: norm_start_time + norm_duration,
    //             is_stake: false,
    //             unstake_num: 1,
    //             unstake_amount: 1595.7142857142856
    //         }
    //     ],
    //     referral_enable: false,
    //     referral_percent: 0
    // },
    // {
    //     name: "A Test With Four Stokers & Some After Duration Unstakes",
    //     reward_amount: norm_reward_amount,
    //     start_time: norm_start_time,
    //     duration: 0.6 * norm_duration,
    //     times: [
    //         {time: norm_start_time, is_stake: true, stake_amount: 3000},
    //         {
    //             time: norm_start_time + 0.1 * norm_duration,
    //             is_stake: true,
    //             stake_amount: 1000
    //         },
    //         {
    //             time: norm_start_time + 0.2 * norm_duration,
    //             is_stake: false,
    //             unstake_num: 2,
    //             unstake_amount: 83.33333333333333
    //         },
    //         {
    //             time: norm_start_time + 0.5 * norm_duration,
    //             is_stake: true,
    //             stake_amount: 3000
    //         },
    //         {
    //             time: norm_start_time + 0.6 * norm_duration,
    //             is_stake: true,
    //             stake_amount: 4000
    //         },
    //         {
    //             time: norm_start_time + 0.7 * norm_duration,
    //             is_stake: false,
    //             unstake_num: 3,
    //             unstake_amount: 166.66666666666674
    //         },
    //         {
    //             time: norm_start_time + 0.8 * norm_duration,
    //             is_stake: false,
    //             unstake_num: 4,
    //             unstake_amount: 0.0
    //         },
    //         {
    //             time: norm_start_time + norm_duration,
    //             is_stake: false,
    //             unstake_num: 1,
    //             unstake_amount: 1750.0
    //         }
    //     ],
    //     referral_enable: false,
    //     referral_percent: 0
    // }
];
