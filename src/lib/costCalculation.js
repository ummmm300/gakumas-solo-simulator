export function calculateCostPayment(buffs, playerStatus, costs = []) {
  const nextBuffs = { ...buffs };
  const nextPlayerStatus = { ...playerStatus };

  const costLogs = [];
  const errorLogs = [];

  const activeCosts = costs.filter((cost) => {
    return toNumber(cost.amount, 0) > 0;
  });

  if (activeCosts.length === 0) {
    return {
      canPay: true,
      nextBuffs,
      nextPlayerStatus,
      costLogs,
      errorLogs,
    };
  }

  for (const cost of activeCosts) {
    const target = cost.target;
    const amount = toNumber(cost.amount, 0);
    const label = getCostTargetLabel(target);

    if (target === "hp") {
      const beforeVitality = toNumber(nextPlayerStatus.vitality, 0);
      const beforeHp = toNumber(nextPlayerStatus.hp, 0);
      const totalAvailable = beforeVitality + beforeHp;

      if (totalAvailable < amount) {
        errorLogs.push(
          `${label}${amount}を支払えません。現在: 体力${beforeHp} / 元気${beforeVitality}`
        );
        break;
      }

      const paidByVitality = Math.min(beforeVitality, amount);
      const paidByHp = amount - paidByVitality;

      nextPlayerStatus.vitality = beforeVitality - paidByVitality;
      nextPlayerStatus.hp = beforeHp - paidByHp;

      costLogs.push(
        `${label}${amount}（元気${beforeVitality}→${nextPlayerStatus.vitality} / 体力${beforeHp}→${nextPlayerStatus.hp}）`
      );

      continue;
    }

    if (target === "redHp") {
      const beforeHp = toNumber(nextPlayerStatus.hp, 0);

      if (beforeHp < amount) {
        errorLogs.push(
          `${label}${amount}を支払えません。現在: 体力${beforeHp}`
        );
        break;
      }

      nextPlayerStatus.hp = beforeHp - amount;

      costLogs.push(
        `${label}${amount}（体力${beforeHp}→${nextPlayerStatus.hp}）`
      );

      continue;
    }

    const beforeBuff = toNumber(nextBuffs[target], 0);

    if (beforeBuff < amount) {
      errorLogs.push(
        `${label}${amount}を支払えません。現在: ${label}${beforeBuff}`
      );
      break;
    }

    nextBuffs[target] = beforeBuff - amount;

    costLogs.push(`${label}${amount}（${beforeBuff}→${nextBuffs[target]}）`);
  }

  if (errorLogs.length > 0) {
    return {
      canPay: false,
      nextBuffs: { ...buffs },
      nextPlayerStatus: { ...playerStatus },
      costLogs,
      errorLogs,
    };
  }

  return {
    canPay: true,
    nextBuffs,
    nextPlayerStatus,
    costLogs,
    errorLogs,
  };
}