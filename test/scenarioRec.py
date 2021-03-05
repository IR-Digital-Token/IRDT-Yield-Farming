from scenarioGen import Plan, User, forwardTime
import pprint

norm_start_time = 50
norm_duration = 100
test_1 = {
    'reward_amount': 2000,
    'start_time': norm_start_time,
    'duration': norm_duration,
    'times': [
        {'time': norm_start_time, 'is_stake': True, 'stake_amount': 1000},
        {'time': (norm_start_time + norm_duration), 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 0}
    ],
    'referral_enable': False,
    'referral_percent': 0,
}


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


fill_stake_amounts(test_1)
