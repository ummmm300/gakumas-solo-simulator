function toNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function decreaseBuffByOne(value) {
  return Math.max(0, toNumber(value, 0) - 1);
}

export function roundScore(value) {
  return Math.ceil(toNumber(value, 0));
}

function getBuffValue(buffs, key) {
  return Math.max(0, toNumber(buffs?.[key], 0));
}

function getAttackList(card) {
  if (Array.isArray(card?.attacks)) {
    return card.attacks;
  }

  if (card?.type === "active" || card?.cardType === "active") {
    return [
      {
        id: "fallback-attack",
        basePower: card?.basePower ?? 0,
        useSpecialBasePower: false,
        specialBaseTarget: "goodCondition",
        specialBasePercent: 100,
        usePowerMultiplier: false,
        powerMultiplierTarget: "goodCondition",
        powerMultiplierValue: 1,
      },
    ];
  }

  return [];
}

function calculateAttackBasePower(attack, buffs) {
  if (attack.useSpecialBasePower) {
    const targetValue = getBuffValue(buffs, attack.specialBaseTarget);
    const percent = toNumber(attack.specialBasePercent, 0);

    return targetValue * (percent / 100);
  }

  return toNumber(attack.basePower, 0);
}

function calculateDefaultAttackScore(attack, buffs, attackIndex) {
  const attackBasePower = calculateAttackBasePower(attack, buffs);
  const scoreMultiplier = toNumber(buffs?.scoreMultiplier, 1);
  const other = toNumber(buffs?.other, 0);

  if (!attack.useSpecialBasePower && attackBasePower <= 0) {
    return {
      formulaType: "defaultAttack",
      attackIndex,
      attack,
      attackBasePower,
      scoreMultiplier,
      other,
      score: 0,
      isZeroDamage: true,
    };
  }

  const extraMultiplier = attack.usePowerMultiplier
    ? toNumber(attack.powerMultiplierValue, 1)
    : 1;

  const score = roundScore(
    (attackBasePower + other) * scoreMultiplier * extraMultiplier
  );

  return {
    formulaType: "defaultAttack",
    attackIndex,
    attack,
    attackBasePower,
    scoreMultiplier,
    other,
    extraMultiplier,
    score,
    isZeroDamage: false,
  };
}

function calculateSenseAttackScore(attack, buffs, attackIndex) {
  const attackBasePower = calculateAttackBasePower(attack, buffs);

  if (!attack.useSpecialBasePower && attackBasePower <= 0) {
    return {
      formulaType: "senseAttack",
      attackIndex,
      attack,
      attackBasePower,
      score: 0,
      isZeroDamage: true,
    };
  }

  const basePower = attackBasePower;
  const concentration = toNumber(buffs.concentration, 0);
  const goodCondition = Math.max(0, toNumber(buffs.goodCondition, 0));
  const excellentCondition = Math.max(
    0,
    toNumber(buffs.excellentCondition, 0)
  );
  const scoreMultiplier = toNumber(buffs.scoreMultiplier, 1);
  const other = toNumber(buffs.other, 0);

  let concentrationPower = concentration;

  // 「好調n倍適用」「絶好調n倍適用」用
  // 好調倍率そのものをn倍するのではなく、
  // 好調による増加分に倍率をかける
  let goodConditionEffectMultiplier = 1;
  let excellentConditionEffectMultiplier = 1;

  if (attack.usePowerMultiplier) {
    const multiplierValue = toNumber(attack.powerMultiplierValue, 1);

    if (attack.powerMultiplierTarget === "concentration") {
      concentrationPower = concentration * multiplierValue;
    }

    if (attack.powerMultiplierTarget === "goodCondition") {
      goodConditionEffectMultiplier = multiplierValue;
    }

    if (attack.powerMultiplierTarget === "excellentCondition") {
      excellentConditionEffectMultiplier = multiplierValue;
    }
  }

  const goodConditionBaseBonus =
    goodCondition > 0 ? 0.5 * goodConditionEffectMultiplier : 0;

  const excellentBonus =
    goodCondition > 0 && excellentCondition > 0
      ? goodCondition *
      0.1 *
      goodConditionEffectMultiplier *
      excellentConditionEffectMultiplier
      : 0;

  const goodConditionMultiplier =
    goodCondition > 0 ? 1 + goodConditionBaseBonus : 1;

  const rawPower = basePower + concentrationPower + other;

  const senseMultiplier =
    goodCondition > 0 ? goodConditionMultiplier + excellentBonus : 1;

  const score = roundScore(rawPower * senseMultiplier * scoreMultiplier);

  return {
    formulaType: "senseAttack",
    attackIndex,
    attack,
    basePower,
    attackBasePower,
    concentration,
    concentrationPower,
    goodCondition,
    excellentCondition,
    goodConditionEffectMultiplier,
    excellentConditionEffectMultiplier,
    goodConditionBaseBonus,
    scoreMultiplier,
    other,
    rawPower,
    goodConditionMultiplier,
    excellentBonus,
    senseMultiplier,
    score,
    isZeroDamage: false,
  };
}

export function calculateCardScore(card, buffs, plan) {
  if (!card) return null;

  if (card.fixedScore !== undefined && card.fixedScore !== null) {
    return {
      score: Number(card.fixedScore),
      attackResults: [],
      isFixedScore: true,
    };
  }

  const isActiveCard = card.type === "active" || card.cardType === "active";

  if (!isActiveCard) {
    return null;
  }

  const attacks = getAttackList(card);

  if (attacks.length === 0) {
    return {
      score: 0,
      attackResults: [],
    };
  }

  const attackResults = attacks.map((attack, attackIndex) => {
    if (plan === "sense") {
      return calculateSenseAttackScore(attack, buffs, attackIndex);
    }

    return calculateDefaultAttackScore(attack, buffs, attackIndex);
  });

  const score = attackResults.reduce((total, result) => {
    return total + Number(result.score ?? 0);
  }, 0);

  return {
    score,
    attackResults,
  };
}

function getBuffDecayGraceValue(state, key) {
  return Math.max(0, toNumber(state?.buffDecayGrace?.[key], 0));
}

function decreaseBuffWithGrace(buffValue, graceValue) {
  const currentBuffValue = Math.max(0, toNumber(buffValue, 0));
  const currentGraceValue = Math.max(0, toNumber(graceValue, 0));

  if (currentBuffValue <= 0) {
    return {
      nextBuffValue: 0,
      nextGraceValue: 0,
    };
  }

  if (currentGraceValue > 0) {
    return {
      nextBuffValue: currentBuffValue,
      nextGraceValue: currentGraceValue - 1,
    };
  }

  return {
    nextBuffValue: Math.max(0, currentBuffValue - 1),
    nextGraceValue: 0,
  };
}

export function applyTurnEndBuffDecay(state) {
  const nextBuffs = { ...state.buffs };

  const nextBuffDecayGrace = {
    goodCondition: getBuffDecayGraceValue(state, "goodCondition"),
    excellentCondition: getBuffDecayGraceValue(state, "excellentCondition"),
    hpCostReduction: getBuffDecayGraceValue(state, "hpCostReduction"),
  };

  function decayBuff(key) {
    const result = decreaseBuffWithGrace(
      state.buffs[key],
      nextBuffDecayGrace[key]
    );

    nextBuffs[key] = result.nextBuffValue;
    nextBuffDecayGrace[key] = result.nextGraceValue;
  }

  decayBuff("hpCostReduction");

  if (state.plan === "sense") {
    decayBuff("goodCondition");
    decayBuff("excellentCondition");
  }

  return {
    nextBuffs,
    nextBuffDecayGrace,
  };
}