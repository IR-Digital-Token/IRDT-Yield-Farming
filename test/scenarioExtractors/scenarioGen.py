integral = []

class Env:
    envTime = 0

    @staticmethod
    def forwardTime(amount):
        Env.envTime += amount
    @staticmethod
    def reset():
        Env.envTime = 0


class Plan:

    def __init__(self, rewardAmount, startTime, duration, referralEnable, referralPercent):
        self.currentId = 1
        self.Users = []
        self.rewardAmount = rewardAmount
        self.duration = duration
        self.referralEnable = referralEnable
        self.referralPercent = referralPercent
        self.startTime = startTime
        self.currentArea = 0
        self.lastEntry = 0
        self.lastPercent = 0
        self.totalEntry = 0
        self.actualStart = 0


class User:

    def __init__(self, plan, entryAmount, referrerID):
        self.refs = 0
        if plan.referralEnable:
            flag = False
            for user in plan.Users:
                if user.id == referrerID:
                    flag = True
                    break
            if not flag:
                referrerID = 1
            self.refs = referrerID

        if plan.currentId == 1:
            plan.actualStart = Env.envTime
        self.id = plan.currentId
        plan.currentId += 1
        plan.totalEntry += entryAmount
        self.enterTime = Env.envTime
        self.entryAmount = entryAmount
        plan.currentArea += (Env.envTime - plan.lastEntry) * plan.lastPercent
        self.enterArea = plan.currentArea
        plan.lastPercent = plan.rewardAmount / ((plan.duration - (plan.actualStart - plan.startTime)) * plan.totalEntry)
        # print(plan.rewardAmount / ((plan.duration - (plan.actualStart - plan.startTime)) * plan.totalEntry))
        plan.lastEntry = Env.envTime
        plan.Users.append(self)

    def unStake(self, plan):
        nowTime = Env.envTime
        plan.totalEntry -= self.entryAmount
        if Env.envTime > plan.startTime + plan.duration:
            nowTime = plan.startTime + plan.duration

        plan.currentArea += (nowTime - plan.lastEntry) * plan.lastPercent
        plan.lastEntry = nowTime

        if plan.totalEntry > 0:
            plan.lastPercent = plan.rewardAmount / (
                    (plan.duration - (plan.actualStart - plan.startTime)) * plan.totalEntry)
        else:
            plan.lastPercent = 0
        activeArea = plan.currentArea - self.enterArea

        yieldAmount = activeArea * self.entryAmount
        plan.Users.remove(self)
        if plan.referralEnable:
            if self.id == 1:
                return {"{}".format(self.id): yieldAmount}
            else:
                return {"{}".format(self.id): yieldAmount * (1 - plan.referralPercent),
                        "{}".format(self.refs): yieldAmount * plan.referralPercent}
        else:
            return yieldAmount


if __name__ == '__main__':
    plan1 = Plan(2000, 0, 100, 0, 0.1)
    # forwardTime(100)
    user1 = User(plan1, 1000, 1)
    forwardTime(20)
    user2 = User(plan1, 2000, 1)
    forwardTime(20)
    user3 = User(plan1, 3000, 1)
    forwardTime(20)
    print(user2.unStake(plan1))
    forwardTime(20)
    print(user3.unStake(plan1))
    forwardTime(20)
    print(user1.unStake(plan1))
