from scenarioGen import Plan, User, forwardTime
import pprint

norm_reward_amount = 2000.0
norm_start_time = 50
norm_duration = 100
delta_t = 10
tests = [
    {
        'name': 'A Normal Test With Just One Stoker',
        'reward_amount': norm_reward_amount,
        'start_time': norm_start_time,
        'duration': norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 1000},
            {
                'time': (norm_start_time + norm_duration),
                'is_stake': False,
                'unstake_num': 1,
                'unstake_amount': 0
            }
        ],
        'referral_enable': False,
        'referral_percent': 0,
    },
    {
        'name': 'A Test With One Stoker & Delay',
        'reward_amount': norm_reward_amount,
        'start_time': norm_start_time,
        'duration': norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 1000},
            {
                'time': (norm_start_time + norm_duration + delta_t),
                'is_stake': False,
                'unstake_num': 1,
                'unstake_amount': 0
            }
        ],
        'referral_enable': False,
        'referral_percent': 0,
    },
    {
        'name': 'A Test With Three Stokers',
        'reward_amount': norm_reward_amount,
        'start_time': norm_start_time,
        'duration': norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 1000},
            {'time': norm_start_time + 0.2 * norm_duration, 'is_stake': True, 'stake_amount': 2000},
            {'time': norm_start_time + 0.4 * norm_duration, 'is_stake': True, 'stake_amount': 3000},
            {'time': norm_start_time + 0.6 * norm_duration, 'is_stake': False, 'unstake_num': 2, 'unstake_amount': 0},
            {'time': norm_start_time + 0.8 * norm_duration, 'is_stake': False, 'unstake_num': 3, 'unstake_amount': 0},
            {'time': norm_start_time + norm_duration, 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 0}
        ],
        'referral_enable': False,
        'referral_percent': 0,
    },
    {
        'name': 'A Test With Three Stokers & Some After Duration UnStakes',
        'reward_amount': norm_reward_amount,
        'start_time': norm_start_time,
        'duration': 0.7 * norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 1000},
            {'time': norm_start_time + 0.2 * norm_duration, 'is_stake': True, 'stake_amount': 2000},
            {'time': norm_start_time + 0.4 * norm_duration, 'is_stake': True, 'stake_amount': 3000},
            {'time': norm_start_time + 0.6 * norm_duration, 'is_stake': False, 'unstake_num': 2, 'unstake_amount': 0},
            {'time': norm_start_time + 0.8 * norm_duration, 'is_stake': False, 'unstake_num': 3, 'unstake_amount': 0},
            {'time': norm_start_time + norm_duration, 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 0}
        ],
        'referral_enable': False,
        'referral_percent': 0,
    },
    {
        'name': 'A Test With Four Stokers & Some Complicated',
        'reward_amount': norm_reward_amount,
        'start_time': norm_start_time,
        'duration': norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 3000},
            {'time': norm_start_time + 0.1 * norm_duration, 'is_stake': True, 'stake_amount': 1000},
            {'time': norm_start_time + 0.2 * norm_duration, 'is_stake': False, 'unstake_num': 2, 'unstake_amount': 0},
            {'time': norm_start_time + 0.5 * norm_duration, 'is_stake': True, 'stake_amount': 3000},
            {'time': norm_start_time + 0.6 * norm_duration, 'is_stake': True, 'stake_amount': 4000},
            {'time': norm_start_time + 0.7 * norm_duration, 'is_stake': False, 'unstake_num': 3, 'unstake_amount': 0},
            {'time': norm_start_time + 0.8 * norm_duration, 'is_stake': False, 'unstake_num': 4, 'unstake_amount': 0},
            {'time': norm_start_time + norm_duration, 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 0},
        ],
        'referral_enable': False,
        'referral_percent': 0,
    },
    {
        'name': 'A Test With Four Stokers & Some After Duration Unstakes',
        'reward_amount': norm_reward_amount,
        'start_time': norm_start_time,
        'duration': 0.6 * norm_duration,
        'times': [
            {'time': norm_start_time, 'is_stake': True, 'stake_amount': 3000},
            {'time': norm_start_time + 0.1 * norm_duration, 'is_stake': True, 'stake_amount': 1000},
            {'time': norm_start_time + 0.2 * norm_duration, 'is_stake': False, 'unstake_num': 2, 'unstake_amount': 0},
            {'time': norm_start_time + 0.5 * norm_duration, 'is_stake': True, 'stake_amount': 3000},
            {'time': norm_start_time + 0.6 * norm_duration, 'is_stake': True, 'stake_amount': 4000},
            {'time': norm_start_time + 0.7 * norm_duration, 'is_stake': False, 'unstake_num': 3, 'unstake_amount': 0},
            {'time': norm_start_time + 0.8 * norm_duration, 'is_stake': False, 'unstake_num': 4, 'unstake_amount': 0},
            {'time': norm_start_time + norm_duration, 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 0},
        ],
        'referral_enable': False,
        'referral_percent': 0,
    }
]


def fill_stake_amounts(scenario):
    plan = Plan(scenario['reward_amount'], scenario['start_time'], scenario['duration'],
                scenario['referral_enable'], scenario['referral_percent'])
    users = []
    before_time = 0
    for time in scenario['times']:
        forwardTime(time['time'] - before_time)
        if time['is_stake']:
            users.append(User(plan, time['stake_amount']))
        else:
            time['unstake_amount'] = users[time['unstake_num'] - 1].unStake(plan)
        before_time = time['time']
    pprint.PrettyPrinter().pprint(scenario)


for test in tests:
    fill_stake_amounts(test)
    print('')
