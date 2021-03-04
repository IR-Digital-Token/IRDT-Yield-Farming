from scenarioGen import Plan, User, forwardTime

rewardAmount = 2000
startTime = 50
duration = 100
times = [
    {'time': startTime, 'is_stake': True, 'stake_amount': 1000},
    {'time': (startTime + duration), 'is_stake': False, 'unstake_num': 1, 'unstake_amount': 0}
]
referralEnable = False
referralPercent = 0


def fill_stake_amounts(reward_amount, start_time, stake_duration, stake_times, referral_enable, referral_percent):
    plan = Plan(reward_amount, start_time, stake_duration, referral_enable, referral_percent)
    users = []
    before_time = 0
    for time in stake_times:
        forwardTime(time['time'] - before_time)
        if time['is_stake']:
            users.append(User(plan, time['stake_amount']))
        else:
            time['unstake_amount'] = users[time['unstake_num'] - 1].unStake(plan)
        before_time = time['time']
    print(stake_times)


fill_stake_amounts(rewardAmount, startTime, duration, times, referralEnable, referralPercent)
