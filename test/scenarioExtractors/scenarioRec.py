from scenarioGen import Plan, User, Env
import pprint

norm_reward_amount = 2000.0
norm_start_time = 50
norm_duration = 100
delta_t = 10
norm_test_cases =  [
    {
        "name": "A Normal Test With Just One Stoker",
        "reward_amount": norm_reward_amount,
        "start_time": norm_start_time,
        "duration": norm_duration,
        "times": [
            {"time": norm_start_time, "is_stake": True, "stake_amount": 1000, "referrer": 1},
            {
                "time": norm_start_time + norm_duration,
                "is_stake": False,
                "unstake_num": 1,
                "unstake_amount": norm_reward_amount
            }
        ],
        "referral_enable": True,
        "referral_percent": 10
    },
    {
        "name": "A Test With One Stoker & Delay",
        "reward_amount": norm_reward_amount,
        "start_time": norm_start_time,
        "duration": norm_duration,
        "times": [
            {"time": norm_start_time, "is_stake": True, "stake_amount": 1000, "referrer": 2},
            {
                "time": norm_start_time + norm_duration + delta_t,
                "is_stake": False,
                "unstake_num": 1,
                "unstake_amount": norm_reward_amount
            }
        ],
        "referral_enable": True,
        "referral_percent": 6
    },
    {
        "name": "A Test With Three Stokers",
        "reward_amount": norm_reward_amount,
        "start_time": norm_start_time,
        "duration": norm_duration,
        "times": [
            {"time": norm_start_time, "is_stake": True, "stake_amount": 1000, "referrer": 1},
            {
                "time": norm_start_time + 0.2 * norm_duration,
                "is_stake": True,
                "stake_amount": 2000,
                "referrer": 2
            },
            {
                "time": norm_start_time + 0.4 * norm_duration,
                "is_stake": True,
                "stake_amount": 3000,
                "referrer": 2
            },
            {
                "time": norm_start_time + 0.6 * norm_duration,
                "is_stake": False,
                "unstake_num": 2,
                "unstake_amount": 399.9999999999999,
                
            },
            {
                "time": norm_start_time + 0.8 * norm_duration,
                "is_stake": False,
                "unstake_num": 3,
                "unstake_amount": 499.9999999999999
            },
            {
                "time": norm_start_time + norm_duration,
                "is_stake": False,
                "unstake_num": 1,
                "unstake_amount": 1100.0
            }
        ],
        "referral_enable": True,
        "referral_percent": 4
    },
    {
        "name": "A Test With Three Stokers & Some After Duration UnStakes",
        "reward_amount": norm_reward_amount,
        "start_time": norm_start_time,
        "duration": 0.7 * norm_duration,
        "times": [
            {"time": norm_start_time, "is_stake": True, "stake_amount": 1000,"referrer": 1},
            {
                "time": norm_start_time + 0.2 * norm_duration,
                "is_stake": True,
                "stake_amount": 2000,
                "referrer": 1
            },
            {
                "time": norm_start_time + 0.4 * norm_duration,
                "is_stake": True,
                "stake_amount": 3000,
                "referrer": 2
            },
            {
                "time": norm_start_time + 0.6 * norm_duration,
                "is_stake": False,
                "unstake_num": 2,
                "unstake_amount": 571.4285714285714
            },
            {
                "time": norm_start_time + 0.8 * norm_duration,
                "is_stake": False,
                "unstake_num": 3,
                "unstake_amount": 499.9999999999999
            },
            {
                "time": norm_start_time + norm_duration,
                "is_stake": False,
                "unstake_num": 1,
                "unstake_amount": 928.5714285714284
            }
        ],
        "referral_enable": True,
        "referral_percent": 8
    },
    {
        "name": "A Test With Four Stokers & Some Complicated",
        "reward_amount": norm_reward_amount,
        "start_time": norm_start_time,
        "duration": norm_duration,
        "times": [
            {"time": norm_start_time, "is_stake": True, "stake_amount": 3000,"referrer": 1},
            {
                "time": norm_start_time + 0.1 * norm_duration,
                "is_stake": True,
                "stake_amount": 1000,
                "referrer": 1
            },
            {
                "time": norm_start_time + 0.2 * norm_duration,
                "is_stake": False,
                "unstake_num": 2,
                "unstake_amount": 50.0
            },
            {
                "time": norm_start_time + 0.5 * norm_duration,
                "is_stake": True,
                "stake_amount": 3000,
                "referrer": 2
            },
            {
                "time": norm_start_time + 0.6 * norm_duration,
                "is_stake": True,
                "stake_amount": 4000,
                "referrer": 1
            },
            {
                "time": norm_start_time + 0.7 * norm_duration,
                "is_stake": False,
                "unstake_num": 3,
                "unstake_amount": 160.00000000000003
            },
            {
                "time": norm_start_time + 0.8 * norm_duration,
                "is_stake": False,
                "unstake_num": 4,
                "unstake_amount": 194.2857142857144
            },
            {
                "time": norm_start_time + norm_duration,
                "is_stake": False,
                "unstake_num": 1,
                "unstake_amount": 1595.7142857142856
            }
        ],
        "referral_enable": True,
        "referral_percent": 14
    },
    {
        "name": "A Test With Four Stokers & Some After Duration Unstakes",
        "reward_amount": norm_reward_amount,
        "start_time": norm_start_time,
        "duration": 0.6 * norm_duration,
        "times": [
            {"time": norm_start_time, "is_stake": True, "stake_amount": 3000, "referrer": 1},
            {
                "time": norm_start_time + 0.1 * norm_duration,
                "is_stake": True,
                "stake_amount": 1000,
                "referrer": 1
            },
            {
                "time": norm_start_time + 0.2 * norm_duration,
                "is_stake": False,
                "unstake_num": 2,
                "unstake_amount": 83.33333333333333
            },
            {
                "time": norm_start_time + 0.5 * norm_duration,
                "is_stake": True,
                "stake_amount": 3000,
                "referrer": 1
            },
            {
                "time": norm_start_time + 0.6 * norm_duration,
                "is_stake": True,
                "stake_amount": 4000,
                "referrer": 2
            },
            {
                "time": norm_start_time + 0.7 * norm_duration,
                "is_stake": False,
                "unstake_num": 3,
                "unstake_amount": 166.66666666666674
            },
            {
                "time": norm_start_time + 0.8 * norm_duration,
                "is_stake": False,
                "unstake_num": 4,
                "unstake_amount": 0.0
            },
            {
                "time": norm_start_time + norm_duration,
                "is_stake": False,
                "unstake_num": 1,
                "unstake_amount": 1750.0
            }
        ],
        "referral_enable": True,
        "referral_percent": 18
    }
]


def fill_stake_amounts(scenario):
    Env.reset()
    plan = Plan(scenario['reward_amount'], scenario['start_time'], scenario['duration'],
                scenario['referral_enable'], scenario['referral_percent']/100)
    User(plan, time['stake_amount'], referrerID = time['referrer'])
    users = []
    before_time = 0
    for time in scenario['times']:
        Env.forwardTime(time['time'] - before_time)
        if time['is_stake']:
            users.append(User(plan, time['stake_amount'], referrerID=time['referrer']))
        else:
            time['unstake_amount'] = users[time['unstake_num'] - 1].unStake(plan)
        before_time = time['time']
    pprint.PrettyPrinter().pprint(scenario)


for test in norm_test_cases:
    fill_stake_amounts(test)
    print('')
