import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  DECKS_STORAGE_KEY,
  SELECTED_DECK_STORAGE_KEY,
} from "./constants/gameConstants";
import {
  roundScore,
  calculateCardScore,
  applyTurnEndBuffDecay,
} from "./lib/scoreCalculation";
import { DEFAULT_VISITOR_DECK_EXPORT } from "./data/defaultVisitorDeck";


const X_TWITTER_URL = "https://x.com/wandering_sen";

const SPECIAL_CARD_TEMPLATES = [
  {
    templateId: "summer_night_memory_minus",
    name: "夏夜に咲く思い出",
    count: 1,
    cardType: "active",

    costs: [
      {
        id: "template-cost-summer-night-memory-minus-1",
        target: "hp",
        amount: 7,
      },
    ],

    // 夏夜本体の打点は0
    fixedScore: 0,
    attacks: [],

    afterUseDestination: "removed",

    buffEffects: [],

    specialEffectId: "summer_night_memory",
    automationLevel: "partial",

    specialEffect: {
      type: "persistent_every_n_skill_cards",
      duration: "battle",
      stackable: true,

      // 使用時効果
      onUse: {
        removeRandomSleepinessFrom: ["deck", "trash"],
        destination: "removed",
      },

      // 設置後効果
      trigger: "every_n_skill_cards_used",
      interval: 5,

      additionalAttack: {
        basePower: 4,
        useNormalScoreCalculation: true,
        affectedByConcentration: true,
        affectedByGoodCondition: true,
        affectedByExcellentCondition: true,
        affectedByScoreMultiplier: true,
      },
    },

    memo:
      "使用時、ランダムな山札または捨て札の眠気1枚を除外へ移動する\n以降、スキルカードを5回使用するごとに、パラメータ+4",
  },
  {
    templateId: "supreme_entertainment",
    name: "至高のエンタメ",
    count: 1,
    cardType: "active",

    costs: [
      {
        id: "template-cost-supreme-entertainment-1",
        target: "concentration",
        amount: 3,
      },
    ],

    // エンタメ本体の打点は常に0
    fixedScore: 0,

    attacks: [],

    afterUseDestination: "removed",

    buffEffects: [],

    specialEffectId: "supreme_entertainment",
    automationLevel: "partial",

    specialEffect: {
      type: "persistent_additional_attack",
      duration: "battle",
      stackable: true,

      trigger: "after_active_card_used",
      targetCardType: "active",
      excludesSelf: true,

      additionalAttack: {
        basePower: 4,
        useNormalScoreCalculation: true,

        affectedByConcentration: true,
        affectedByGoodCondition: true,
        affectedByExcellentCondition: true,
        affectedByScoreMultiplier: true,
      },
    },

    memo:
      "以降、A札使用時、パラメータ+4",
  },
  {
    templateId: "supreme_entertainment_plus",
    name: "至高のエンタメ+",
    count: 1,
    cardType: "active",

    costs: [
      {
        id: "template-cost-supreme-entertainment-plus-1",
        target: "concentration",
        amount: 2,
      },
    ],

    // エンタメ+本体の打点は常に0
    fixedScore: 0,

    attacks: [],

    afterUseDestination: "removed",

    buffEffects: [],

    // 通常エンタメと同じ特殊効果グループとして扱う
    specialEffectId: "supreme_entertainment",
    automationLevel: "partial",

    specialEffect: {
      type: "persistent_additional_attack",
      duration: "battle",
      stackable: true,

      trigger: "after_active_card_used",
      targetCardType: "active",
      excludesSelf: true,

      additionalAttack: {
        basePower: 5,
        useNormalScoreCalculation: true,

        affectedByConcentration: true,
        affectedByGoodCondition: true,
        affectedByExcellentCondition: true,
        affectedByScoreMultiplier: true,
      },
    },

    memo:
      "以降、A札使用時、パラメータ+5",
  },
  {
    templateId: "national_idol",
    name: "国民的アイドル",
    count: 1,
    cardType: "mental",

    costs: [
      {
        id: "template-cost-national-idol-1",
        target: "goodCondition",
        amount: 1,
      },
    ],

    fixedScore: 0,
    attacks: [],

    afterUseDestination: "removed",

    buffEffects: [],

    specialEffectId: "national_idol",
    automationLevel: "partial",

    specialEffect: {
      type: "one_shot_repeat_next_skill_effect",
      duration: "next_skill_card",
      stackable: true,
    },

    memo:
      "次に使用するスキルカードの効果をもう1回発動する",
  },
  {
    templateId: "tenshinranman",
    name: "天真爛漫",
    count: 1,
    cardType: "mental",

    costs: [
      {
        id: "template-cost-tenshinranman-1",
        target: "hp",
        amount: 6,
      },
    ],

    fixedScore: 0,
    attacks: [],

    afterUseDestination: "removed",

    buffEffects: [
      {
        id: "template-buff-tenshinranman-1",
        target: "concentration",
        amount: 1,
      },
    ],

    specialEffectId: "tenshinranman",
    automationLevel: "partial",

    specialEffect: {
      type: "persistent_turn_end_buff",
      duration: "battle",
      stackable: true,

      trigger: "turn_end",
      condition: {
        target: "concentration",
        min: 3,
      },

      buffEffect: {
        target: "concentration",
        amount: 2,
      },
    },

    memo:
      "集中+1\n以降、ターン終了時集中3以上の場合、集中+2",
  },
  {
    templateId: "wish_power",
    name: "願いの力",
    count: 1,
    cardType: "mental",

    costs: [
      {
        id: "template-cost-wish-power-1",
        target: "hp",
        amount: 4,
      },
    ],

    fixedScore: 0,
    attacks: [],

    afterUseDestination: "removed",

    buffEffects: [
      {
        id: "template-buff-wish-power-1",
        target: "concentration",
        amount: 2,
      },
    ],

    specialEffectId: "wish_power",
    automationLevel: "partial",

    specialEffect: {
      type: "persistent_after_active_card_buff",
      duration: "battle",
      stackable: true,

      trigger: "after_active_card_used",
      targetCardType: "active",

      buffEffect: {
        target: "concentration",
        amount: 1,
      },
    },

    memo:
      "集中+2\n以降、A札使用時、集中+1",
  },
];

function createInitialGameState(
  maxHp = 35,
  examConfig = createDefaultExamConfig(),
  examTurnOrder = null,
  initialBuffs = null
) {
  const normalizedExamConfig = normalizeExamConfig(examConfig);
  const normalizedInitialBuffs = normalizeDeckInitialBuffs(initialBuffs);

  return {
    turn: 1,
    plan: "sense",
    deck: [],
    hand: [],
    used: [],
    trash: [],
    removed: [],
    selectedCardId: null,

    buffs: {
      ...createInitialBuffs(),
      ...normalizedInitialBuffs,
    },

    buffDecayGrace: {
      goodCondition: 0,
      excellentCondition: 0,
      hpCostReduction: 0,
    },

    playerStatus: createInitialPlayerStatus(maxHp),

    specialEffects: {
      supremeEntertainmentStacks: [],
      summerNightMemoryStacks: [],
      tenshinranmanStacks: [],
      wishPowerStacks: [],
      nationalIdolStockCount: 0,
    },

    scoreTotals: {
      total: 0,
      vo: 0,
      da: 0,
      vi: 0,
    },

    reservedAttacks: [],

    examConfig: normalizedExamConfig,
    examTurnOrder: examTurnOrder ?? generateExamTurnOrder(normalizedExamConfig),

    logs: ["ゲーム未開始"],
  };
}

function createCardForImmediateScore(card) {
  const immediateAttacks = Array.isArray(card?.attacks)
    ? card.attacks.filter((attack) => !isReservedAttack(attack))
    : [];

  return {
    ...card,
    attacks: immediateAttacks,
  };
}

function createReservedAttackRecords(
  card,
  currentTurn,
  examTurnOrder = [],
  repeatCount = 1
) {
  if (!Array.isArray(card?.attacks)) return [];

  const finalTurn = Math.max(1, examTurnOrder.length || currentTurn);
  const records = [];
  const normalizedRepeatCount = Math.max(1, toNumber(repeatCount, 1));

  card.attacks.forEach((attack, attackIndex) => {
    const reservation = normalizeDamageReservation(attack.damageReservation);

    if (!reservation.enabled) return;

    const targetTurn =
      reservation.targetType === "finalTurn"
        ? finalTurn
        : currentTurn + reservation.turnsAfter;

    for (let i = 0; i < normalizedRepeatCount; i += 1) {
      records.push({
        id: createId("reservedAttack"),
        sourceCardName: card.name,
        attackLabel:
          normalizedRepeatCount > 1
            ? `攻撃${attackIndex + 1}-${i + 1}回目`
            : `攻撃${attackIndex + 1}`,
        attack: {
          ...attack,
          damageReservation: createDefaultDamageReservation(),
        },
        createdTurn: currentTurn,
        targetTurn,
        targetType: reservation.targetType,
        turnsAfter: reservation.turnsAfter,
        triggerTiming: reservation.triggerTiming,
      });
    }
  });

  return records;
}

function createCardForReservedAttack(reservedAttack) {
  return {
    id: reservedAttack.id,
    name: `${reservedAttack.sourceCardName} ${reservedAttack.attackLabel}`,
    cardType: "active",
    type: "active",
    fixedScore: null,
    attacks: [
      {
        ...reservedAttack.attack,
        damageReservation: createDefaultDamageReservation(),
      },
    ],
  };
}

function resolveReservedAttacksAtTiming(state, triggerTiming) {
  const reservedAttacks = Array.isArray(state.reservedAttacks)
    ? state.reservedAttacks
    : [];

  const remainingReservedAttacks = [];
  const resolvedLogs = [];

  let nextScoreTotals = state.scoreTotals;

  reservedAttacks.forEach((reservedAttack) => {
    const shouldResolve =
      reservedAttack.targetTurn === state.turn &&
      reservedAttack.triggerTiming === triggerTiming;

    if (!shouldResolve) {
      remainingReservedAttacks.push(reservedAttack);
      return;
    }

    const virtualCard = createCardForReservedAttack(reservedAttack);
    const scoreResult = calculateCardScore(virtualCard, state.buffs, state.plan);

    const rawScore = Number(scoreResult?.score ?? 0);
    const finalScore = applyCurrentExamMultiplier(rawScore, state);
    const currentExamType = getCurrentExamType(state);
    const currentExamText = formatCurrentExamMultiplier(state);

    if (finalScore > 0) {
      nextScoreTotals = addScoreToTotals(
        nextScoreTotals,
        finalScore,
        currentExamType
      );
    }

    resolvedLogs.push(
      `打点予約発動：${reservedAttack.sourceCardName} ${reservedAttack.attackLabel} ${finalScore}点（${rawScore} × ${currentExamText}）`
    );
  });

  return {
    nextState: {
      ...state,
      reservedAttacks: remainingReservedAttacks,
      scoreTotals: nextScoreTotals,
    },
    logs: resolvedLogs,
  };
}

function formatReservedAttackLog(reservedAttacks) {
  if (!reservedAttacks.length) return "";

  return `打点予約：${reservedAttacks
    .map((reservedAttack) => {
      return `${reservedAttack.attackLabel}を${getDamageReservationTargetLabel(
        reservedAttack
      )}${getDamageReservationTriggerLabel(
        reservedAttack.triggerTiming
      )}に予約`;
    })
    .join("、")}`;
}

function formatPlayerStatus(playerStatus) {
  const hp = toNumber(playerStatus?.hp, 0);
  const maxHp = toNumber(playerStatus?.maxHp, 35);
  const vitality = toNumber(playerStatus?.vitality, 0);
  const damage = Math.max(0, maxHp - hp);

  return `体力${hp}/${maxHp}：元気${vitality}`;
}

function truncateText(text, maxLength = 7) {
  const chars = Array.from(String(text ?? ""));

  if (chars.length <= maxLength) {
    return chars.join("");
  }

  return `${chars.slice(0, maxLength).join("")}...`;
}

function decreaseBuffByOne(value) {
  return Math.max(0, toNumber(value, 0) - 1);
}

function toNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function formatNumber(value) {
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
}

function getOptionLabel(options, key) {
  return options.find((option) => option.key === key)?.label ?? key;
}

function getBuffValue(buffs, key) {
  return Math.max(0, toNumber(buffs?.[key], 0));
}

function calculateAttackBasePower(attack, buffs) {
  if (attack.useSpecialBasePower) {
    const targetValue = getBuffValue(buffs, attack.specialBaseTarget);
    const percent = toNumber(attack.specialBasePercent, 0);

    return targetValue * (percent / 100);
  }

  return toNumber(attack.basePower, 0);
}

function formatAttackBasePower(attack, buffs) {
  if (attack.useSpecialBasePower) {
    const targetLabel = getOptionLabel(
      SPECIAL_BASE_TARGET_OPTIONS,
      attack.specialBaseTarget
    );
    const targetValue = getBuffValue(buffs, attack.specialBaseTarget);
    const percent = toNumber(attack.specialBasePercent, 0);
    const basePower = calculateAttackBasePower(attack, buffs);

    return `${targetLabel}${targetValue} × ${percent}% = ${formatNumber(
      basePower
    )}`;
  }

  return String(toNumber(attack.basePower, 0));
}

function calculateDefaultAttackScore(attack, buffs, attackIndex) {
  const attackBasePower = calculateAttackBasePower(attack, buffs);
  const scoreMultiplier = toNumber(buffs.scoreMultiplier, 1);
  const other = toNumber(buffs.other, 0);

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
  let goodConditionMultiplier = goodCondition > 0 ? 1.5 : 1;
  let excellentBonus =
    goodCondition > 0 && excellentCondition > 0 ? goodCondition * 0.1 : 0;

  if (attack.usePowerMultiplier) {
    const multiplierValue = toNumber(attack.powerMultiplierValue, 1);

    if (attack.powerMultiplierTarget === "concentration") {
      concentrationPower = concentration * multiplierValue;
    }

    if (attack.powerMultiplierTarget === "goodCondition") {
      goodConditionMultiplier = goodCondition > 0 ? multiplierValue : 1;
    }

    if (attack.powerMultiplierTarget === "excellentCondition") {
      excellentBonus =
        goodCondition > 0 && excellentCondition > 0
          ? goodCondition * 0.1 * multiplierValue
          : 0;
    }
  }

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

function formatScoreCalculation(scoreResult) {
  if (!scoreResult) return "打点計算対象外";

  const attackCount = scoreResult.attackResults?.length ?? 0;

  if (attackCount === 0) {
    return `合計${scoreResult.score ?? 0}点`;
  }

  if (attackCount === 1) {
    return `合計${scoreResult.score ?? 0}点（1回攻撃 / 切り上げ）`;
  }

  return `合計${scoreResult.score ?? 0}点（${attackCount}回攻撃 / 各攻撃ごとに切り上げ）`;
}

function formatAttackCalculation(attackResult) {
  const attackNumber = attackResult.attackIndex + 1;

  if (attackResult.isZeroDamage) {
    return `攻撃${attackNumber}: 基礎打点0のため0点`;
  }

  if (attackResult.formulaType === "senseAttack") {
    const baseText = formatAttackBasePower(
      attackResult.attack,
      {
        concentration: attackResult.concentration,
        goodCondition: attackResult.goodCondition,
        excellentCondition: attackResult.excellentCondition,
      }
    );

    return `攻撃${attackNumber}: (基礎打点${baseText} + 集中${formatNumber(
      attackResult.concentrationPower
    )} + その他補正${attackResult.other}) × 好調倍率${formatNumber(
      attackResult.senseMultiplier
    )} × スコア倍率補正${formatNumber(
      attackResult.scoreMultiplier
    )} = ${attackResult.score}`;
  }

  return `攻撃${attackNumber}: (基礎打点${formatNumber(
    attackResult.attackBasePower
  )} + その他補正${attackResult.other}) × スコア倍率補正${formatNumber(
    attackResult.scoreMultiplier
  )} × 追加倍率${formatNumber(
    attackResult.extraMultiplier ?? 1
  )} = ${attackResult.score}`;
}

function formatScoreBreakdown(scoreResult) {
  if (!scoreResult?.attackResults?.length) return "";

  return scoreResult.attackResults.map(formatAttackCalculation).join(" / ");
}

function applyBuffEffectsRepeatedly(
  buffs,
  playerStatus,
  buffEffects = [],
  repeatCount = 1,
  buffDecayGrace = {}
) {
  let nextBuffs = { ...buffs };
  let nextPlayerStatus = { ...playerStatus };
  let nextBuffDecayGrace = { ...buffDecayGrace };
  const effectLogs = [];

  const normalizedRepeatCount = Math.max(1, toNumber(repeatCount, 1));

  for (let i = 0; i < normalizedRepeatCount; i += 1) {
    const result = applyBuffEffectsToBuffs(
      nextBuffs,
      nextPlayerStatus,
      buffEffects,
      nextBuffDecayGrace
    );

    nextBuffs = result.nextBuffs;
    nextPlayerStatus = result.nextPlayerStatus;
    nextBuffDecayGrace = result.nextBuffDecayGrace;

    result.effectLogs.forEach((log) => {
      effectLogs.push(
        normalizedRepeatCount > 1 ? `${i + 1}回目：${log}` : log
      );
    });
  }

  return {
    nextBuffs,
    nextPlayerStatus,
    nextBuffDecayGrace,
    effectLogs,
  };
}

const BUFF_DECAY_GRACE_TARGETS = [
  "goodCondition",
  "excellentCondition",
  "hpCostReduction",
];

function shouldAddBuffDecayGrace(target, before, amount) {
  return (
    BUFF_DECAY_GRACE_TARGETS.includes(target) &&
    toNumber(before, 0) <= 0 &&
    toNumber(amount, 0) > 0
  );
}

function getBuffGainIncreasePercent(buffs, target) {
  if (target === "goodCondition") {
    return Math.max(0, toNumber(buffs?.goodConditionGainIncreasePercent, 0));
  }

  if (target === "concentration") {
    return Math.max(0, toNumber(buffs?.concentrationGainIncreasePercent, 0));
  }

  return 0;
}

function getEffectiveBuffGainAmount(buffs, target, amount) {
  const baseAmount = toNumber(amount, 0);

  // 減少効果や0は補正しない
  if (baseAmount <= 0) {
    return baseAmount;
  }

  const increasePercent = getBuffGainIncreasePercent(buffs, target);

  if (increasePercent <= 0) {
    return baseAmount;
  }

  return Math.ceil(baseAmount * (1 + increasePercent / 100));
}

function applyBuffEffectsToBuffs(
  buffs,
  playerStatus,
  buffEffects = [],
  buffDecayGrace = {}
) {
  const nextBuffs = { ...buffs };
  const nextPlayerStatus = { ...playerStatus };
  const nextBuffDecayGrace = {
    goodCondition: toNumber(buffDecayGrace.goodCondition, 0),
    excellentCondition: toNumber(buffDecayGrace.excellentCondition, 0),
    hpCostReduction: toNumber(buffDecayGrace.hpCostReduction, 0),
  };

  const effectLogs = [];

  buffEffects.forEach((effect) => {
    const amount = toNumber(effect.amount, 0);

    if (amount === 0) return;

    const label = getOptionLabel(BUFF_EFFECT_TARGET_OPTIONS, effect.target);
    const sign = amount > 0 ? "+" : "";

    if (effect.target === "vitality") {
      const before = toNumber(nextPlayerStatus.vitality, 0);
      const after = Math.max(0, before + amount);

      nextPlayerStatus.vitality = after;

      effectLogs.push(`${label}${sign}${amount}（${before}→${after}）`);
      return;
    }

    const before = toNumber(nextBuffs[effect.target], 0);
    const effectiveAmount = getEffectiveBuffGainAmount(
      nextBuffs,
      effect.target,
      amount
    );
    const effectiveSign = effectiveAmount > 0 ? "+" : "";
    const after = Math.max(0, before + effectiveAmount);

    nextBuffs[effect.target] = after;

    if (shouldAddBuffDecayGrace(effect.target, before, effectiveAmount)) {
      nextBuffDecayGrace[effect.target] =
        toNumber(nextBuffDecayGrace[effect.target], 0) + 1;
    }

    const gainIncreasePercent = getBuffGainIncreasePercent(
      nextBuffs,
      effect.target
    );

    if (amount > 0 && effectiveAmount !== amount && gainIncreasePercent > 0) {
      effectLogs.push(
        `${label}${effectiveSign}${effectiveAmount}（元${sign}${amount} / 増加量+${gainIncreasePercent}% / ${before}→${after}）`
      );
    } else {
      effectLogs.push(`${label}${effectiveSign}${effectiveAmount}（${before}→${after}）`);
    }
  });

  return {
    nextBuffs,
    nextPlayerStatus,
    nextBuffDecayGrace,
    effectLogs,
  };
}

function getCostTargetLabel(target) {
  return getOptionLabel(COST_TARGET_OPTIONS, target);
}

function calculateCostPayment(buffs, playerStatus, costs = []) {
  const nextBuffs = { ...buffs };
  const nextPlayerStatus = { ...playerStatus };
  const costLogs = [];
  const errorLogs = [];

  costs.forEach((cost) => {
    const originalAmount = Math.max(0, toNumber(cost.amount, 0));
    const amount = getEffectiveHpCostAmount(originalAmount, buffs, cost.target);

    if (amount === 0) return;

    const target = cost.target;
    const label = getCostTargetLabel(target);

    if (target === "hp") {
      const beforeVitality = toNumber(nextPlayerStatus.vitality, 0);
      const beforeHp = toNumber(nextPlayerStatus.hp, 0);

      const paidByVitality = Math.min(beforeVitality, amount);
      const remaining = amount - paidByVitality;

      if (beforeHp < remaining) {
        errorLogs.push(
          `${label}${amount}が不足しています（体力${beforeHp} / 元気${beforeVitality}）`
        );
        return;
      }

      nextPlayerStatus.vitality = beforeVitality - paidByVitality;
      nextPlayerStatus.hp = beforeHp - remaining;

      if (paidByVitality > 0 && remaining > 0) {
        costLogs.push(
          `${label}${amount}（元気${beforeVitality}→${nextPlayerStatus.vitality} / 体力${beforeHp}→${nextPlayerStatus.hp}）`
        );
      } else if (paidByVitality > 0) {
        costLogs.push(
          `${label}${amount}（元気${beforeVitality}→${nextPlayerStatus.vitality}）`
        );
      } else {
        costLogs.push(
          `${label}${amount}（体力${beforeHp}→${nextPlayerStatus.hp}）`
        );
      }

      return;
    }

    if (target === "redHp") {
      const beforeHp = toNumber(nextPlayerStatus.hp, 0);

      if (beforeHp < amount) {
        errorLogs.push(`${label}${amount}が不足しています（体力${beforeHp}）`);
        return;
      }

      nextPlayerStatus.hp = beforeHp - amount;
      costLogs.push(`${label}${amount}（体力${beforeHp}→${nextPlayerStatus.hp}）`);
      return;
    }

    const beforeBuff = toNumber(nextBuffs[target], 0);

    if (beforeBuff < amount) {
      errorLogs.push(`${label}${amount}が不足しています（現在${beforeBuff}）`);
      return;
    }

    nextBuffs[target] = beforeBuff - amount;
    costLogs.push(`${label}${amount}（${beforeBuff}→${nextBuffs[target]}）`);
  });

  if (errorLogs.length > 0) {
    return {
      canPay: false,
      nextBuffs: buffs,
      nextPlayerStatus: playerStatus,
      costLogs: [],
      errorLogs,
    };
  }

  return {
    canPay: true,
    nextBuffs,
    nextPlayerStatus,
    costLogs,
    errorLogs: [],
  };
}

function getEffectiveHpCostAmount(amount, buffs, target) {
  const isHpCost = target === "hp" || target === "redHp";

  if (!isHpCost) {
    return amount;
  }

  let effectiveAmount = Math.max(0, toNumber(amount, 0));

  if (toNumber(buffs?.hpCostReduction, 0) > 0) {
    effectiveAmount = Math.ceil(effectiveAmount * 0.5);
  }

  const discount = Math.max(0, toNumber(buffs?.hpCostDiscount, 0));
  effectiveAmount = Math.max(0, effectiveAmount - discount);

  return effectiveAmount;
}

function formatCostPaymentResult(costPaymentResult) {
  if (!costPaymentResult) return "";

  if (costPaymentResult.errorLogs.length > 0) {
    return `コスト不足: ${costPaymentResult.errorLogs.join(" / ")}`;
  }

  if (costPaymentResult.costLogs.length === 0) {
    return "コストなし";
  }

  return costPaymentResult.costLogs.join(" / ");
}

function getSpecialEffectUseLog(card) {
  if (!card?.specialEffectId) return "";

  if (card.specialEffectId === "supreme_entertainment") {
    return "至高のエンタメが有効になりました。";
  }
  if (card.specialEffectId === "summer_night_memory") {
    return "夏夜に咲く思い出が有効になりました。";
  }

  if (card.specialEffectId === "tenshinranman") {
    return "天真爛漫が有効になりました。";
  }

  if (card.specialEffectId === "national_idol") {
    return "国民的アイドルが有効になりました。";
  }

  if (card.specialEffectId === "wish_power") {
    return "願いの力が有効になりました。";
  }

  return `${card.name}の特殊効果があります。必要に応じて効果メモを確認してください。`;
}

function getSupremeEntertainmentBasePower(card) {
  return toNumber(card?.specialEffect?.additionalAttack?.basePower, 4);
}

function isSupremeEntertainmentCard(card) {
  return (
    card?.specialEffectId === "supreme_entertainment" ||
    card?.templateId === "supreme_entertainment" ||
    card?.templateId === "supreme_entertainment_plus"
  );
}

function isSleepinessCard(card) {
  return card?.type === "sleepiness" || card?.cardType === "sleepiness";
}

function isSkillCard(card) {
  return (
    card?.type === "active" ||
    card?.cardType === "active" ||
    card?.type === "mental" ||
    card?.cardType === "mental" ||
    isSleepinessCard(card)
  );
}

function isNationalIdolCard(card) {
  return card?.specialEffectId === "national_idol";
}

function getNationalIdolStockCount(state) {
  return Math.max(
    0,
    toNumber(state?.specialEffects?.nationalIdolStockCount, 0)
  );
}

function getNationalIdolEffectInfo(state, card) {
  const stockCount = getNationalIdolStockCount(state);
  const shouldApply = isSkillCard(card) && stockCount > 0;

  return {
    stockCount,
    shouldApply,

    // 1ストック = このカードの効果を2回発動
    repeatCount: shouldApply ? 2 : 1,

    // スキルカードを使用したら、ストックを1つだけ消費
    nextStockCount: shouldApply ? Math.max(0, stockCount - 1) : stockCount,
  };
}

function isSummerNightMemoryCard(card) {
  return card?.specialEffectId === "summer_night_memory";
}

function getSummerNightMemoryStacks(state) {
  const stacks = state?.specialEffects?.summerNightMemoryStacks;

  if (Array.isArray(stacks)) {
    return stacks;
  }

  return [];
}

function getSummerNightMemoryBasePower(card) {
  return toNumber(card?.specialEffect?.additionalAttack?.basePower, 4);
}

function getSummerNightMemoryInterval(card) {
  return Math.max(1, toNumber(card?.specialEffect?.interval, 5));
}

function removeRandomSleepinessFromDeckOrTrash(state) {
  const candidates = [];

  state.deck.forEach((card, index) => {
    if (isSleepinessCard(card)) {
      candidates.push({
        zone: "deck",
        index,
        card,
      });
    }
  });

  state.trash.forEach((card, index) => {
    if (isSleepinessCard(card)) {
      candidates.push({
        zone: "trash",
        index,
        card,
      });
    }
  });

  if (candidates.length === 0) {
    return {
      nextState: state,
      removedCard: null,
      sourceZone: null,
    };
  }

  const selectedCandidate =
    candidates[Math.floor(Math.random() * candidates.length)];

  const nextDeck =
    selectedCandidate.zone === "deck"
      ? state.deck.filter((_, index) => index !== selectedCandidate.index)
      : state.deck;

  const nextTrash =
    selectedCandidate.zone === "trash"
      ? state.trash.filter((_, index) => index !== selectedCandidate.index)
      : state.trash;

  return {
    nextState: {
      ...state,
      deck: nextDeck,
      trash: nextTrash,
      removed: [...state.removed, selectedCandidate.card],
    },
    removedCard: selectedCandidate.card,
    sourceZone: selectedCandidate.zone,
  };
}

function resolveSummerNightMemoryTriggers(state, card, buffsForScore) {
  const currentStacks = getSummerNightMemoryStacks(state);

  if (currentStacks.length === 0) {
    return {
      nextStacks: currentStacks,
      result: null,
    };
  }

  if (!isSkillCard(card)) {
    return {
      nextStacks: currentStacks,
      result: null,
    };
  }

  const triggerResults = [];

  const nextStacks = currentStacks.map((stack) => {
    const interval = Math.max(1, toNumber(stack.interval, 5));
    const basePower = toNumber(stack.basePower, 4);
    const previousUsedCount = Math.max(0, toNumber(stack.usedCount, 0));
    const nextUsedCountRaw = previousUsedCount + 1;

    if (nextUsedCountRaw < interval) {
      return {
        ...stack,
        usedCount: nextUsedCountRaw,
      };
    }

    const scoreResult = calculateSupremeEntertainmentSingleAttack(
      basePower,
      buffsForScore,
      state.plan
    );

    triggerResults.push({
      id: stack.id,
      name: stack.name ?? "夏夜に咲く思い出",
      basePower,
      interval,
      score: Number(scoreResult?.score ?? 0),
      scoreResult,
    });

    return {
      ...stack,
      usedCount: nextUsedCountRaw % interval,
    };
  });

  if (triggerResults.length === 0) {
    return {
      nextStacks,
      result: null,
    };
  }

  const totalScore = triggerResults.reduce((total, result) => {
    return total + result.score;
  }, 0);

  return {
    nextStacks,
    result: {
      triggerResults,
      totalScore,
    },
  };
}

function isActiveCard(card) {
  return card?.cardType === "active" || card?.type === "active";
}

function getSupremeEntertainmentStacks(state) {
  const stacks = state?.specialEffects?.supremeEntertainmentStacks;

  if (Array.isArray(stacks)) {
    return stacks;
  }

  // 旧形式との保険。supremeEntertainmentCount が残っている場合は基礎4として扱う。
  const oldCount = Math.max(
    0,
    toNumber(state?.specialEffects?.supremeEntertainmentCount, 0)
  );

  return Array.from({ length: oldCount }, () => ({
    name: "至高のエンタメ",
    basePower: 4,
  }));
}

function shouldTriggerSupremeEntertainment(card) {
  if (!isActiveCard(card)) return false;

  // エンタメ自身の使用時には発動しない
  if (card?.specialEffectId === "supreme_entertainment") return false;

  return true;
}

function calculateSupremeEntertainmentSingleAttack(basePower, buffs, plan) {
  const virtualCard = {
    id: "supreme_entertainment_additional_attack",
    name: "エンタメ発動",
    cardType: "active",
    type: "active",
    attacks: [
      {
        id: "supreme_entertainment_attack_1",
        basePower,
        useSpecialBasePower: false,
        specialBaseTarget: "goodCondition",
        specialBasePercent: 100,
        usePowerMultiplier: false,
        powerMultiplierTarget: "goodCondition",
        powerMultiplierValue: 1,
      },
    ],
    fixedScore: null,
  };

  return calculateCardScore(virtualCard, buffs, plan);
}

function calculateSupremeEntertainmentAdditionalAttack(state, card, buffsForScore) {
  const stacks = getSupremeEntertainmentStacks(state);

  if (stacks.length === 0) return null;
  if (!shouldTriggerSupremeEntertainment(card)) return null;

  const stackResults = stacks.map((stack, index) => {
    const basePower = toNumber(stack.basePower, 4);

    const scoreResult = calculateSupremeEntertainmentSingleAttack(
      basePower,
      buffsForScore,
      state.plan
    );

    return {
      index,
      name: stack.name ?? "至高のエンタメ",
      basePower,
      score: Number(scoreResult?.score ?? 0),
      scoreResult,
    };
  });

  const totalScore = stackResults.reduce((total, result) => {
    return total + result.score;
  }, 0);

  return {
    count: stackResults.length,
    stackResults,
    totalScore,
  };
}

function isWishPowerCard(card) {
  return card?.specialEffectId === "wish_power";
}

function getWishPowerStacks(state) {
  const stacks = state?.specialEffects?.wishPowerStacks;

  if (Array.isArray(stacks)) {
    return stacks;
  }

  return [];
}

function getWishPowerBuffAmount(card) {
  return Math.max(
    0,
    toNumber(card?.specialEffect?.buffEffect?.amount, 1)
  );
}

function resolveWishPowerActiveCardTrigger(
  state,
  card,
  buffs,
  playerStatus,
  buffDecayGrace = {}
) {
  const stacks = getWishPowerStacks(state);

  if (stacks.length === 0 || !isActiveCard(card)) {
    return {
      nextBuffs: buffs,
      nextPlayerStatus: playerStatus,
      nextBuffDecayGrace: buffDecayGrace,
      logs: [],
    };
  }

  let nextBuffs = { ...buffs };
  let nextPlayerStatus = { ...playerStatus };
  let nextBuffDecayGrace = { ...buffDecayGrace };
  const logs = [];

  stacks.forEach((stack) => {
    const amount = Math.max(0, toNumber(stack.amount, 1));

    const result = applyBuffEffectsToBuffs(
      nextBuffs,
      nextPlayerStatus,
      [
        {
          id: createId("wishPowerBuff"),
          target: "concentration",
          amount,
        },
      ],
      nextBuffDecayGrace
    );

    nextBuffs = result.nextBuffs;
    nextPlayerStatus = result.nextPlayerStatus;
    nextBuffDecayGrace = result.nextBuffDecayGrace;

    result.effectLogs.forEach((log) => {
      logs.push(`${stack.name ?? "願いの力"}：${log}`);
    });
  });

  return {
    nextBuffs,
    nextPlayerStatus,
    nextBuffDecayGrace,
    logs,
  };
}

function isTenshinranmanCard(card) {
  return card?.specialEffectId === "tenshinranman";
}

function getTenshinranmanStacks(state) {
  const stacks = state?.specialEffects?.tenshinranmanStacks;

  if (Array.isArray(stacks)) {
    return stacks;
  }

  return [];
}

function resolveTenshinranmanTurnEnd(state) {
  const stacks = getTenshinranmanStacks(state);

  if (stacks.length === 0) {
    return {
      nextBuffs: state.buffs,
      logs: [],
    };
  }

  const nextBuffs = { ...state.buffs };
  const logs = [];

  stacks.forEach((stack) => {
    const conditionMin = Math.max(
      0,
      toNumber(stack?.condition?.min, 3)
    );

    const currentConcentration = toNumber(nextBuffs.concentration, 0);

    if (currentConcentration < conditionMin) {
      logs.push(
        `${stack.name ?? "天真爛漫"}：集中${currentConcentration}のため発動なし`
      );
      return;
    }

    const amount = toNumber(stack?.amount, 2);
    const before = currentConcentration;
    const after = before + amount;

    nextBuffs.concentration = after;

    logs.push(`${stack.name ?? "天真爛漫"}：集中+${amount}（${before}→${after}）`);
  });

  return {
    nextBuffs,
    logs,
  };
}

function getShortSpecialEffectName(name) {
  if (name === "至高のエンタメ-") return "エンタメ-";
  if (name === "至高のエンタメ+") return "エンタメ+";
  if (name === "至高のエンタメ") return "エンタメ";
  if (name === "夏夜に咲く思い出-") return "夏夜";
  if (name === "夏夜に咲く思い出+") return "夏夜+";
  if (name === "天真爛漫") return "天真爛漫";
  if (name === "願いの力") return "願い";

  return name ?? "特殊効果";
}

function getSpecialEffectRows(state) {
  const rows = [];

  const supremeEntertainmentStacks = getSupremeEntertainmentStacks(state);

  supremeEntertainmentStacks.forEach((stack) => {
    rows.push({
      id: stack.id ?? `supreme_${rows.length}`,
      name: getShortSpecialEffectName(stack.name),
      value: "発動中",
    });
  });

  const summerNightMemoryStacks = getSummerNightMemoryStacks(state);

  summerNightMemoryStacks.forEach((stack) => {
    const usedCount = toNumber(stack.usedCount, 0);
    const interval = toNumber(stack.interval, 5);

    rows.push({
      id: stack.id ?? `summer_${rows.length}`,
      name: getShortSpecialEffectName(stack.name),
      value: `${usedCount}/${interval}`,
    });
  });

  const tenshinranmanStacks = getTenshinranmanStacks(state);

  tenshinranmanStacks.forEach((stack) => {
    rows.push({
      id: stack.id ?? `tenshinranman_${rows.length}`,
      name: getShortSpecialEffectName(stack.name),
      value: "ターン終了時",
    });
  });

  const nationalIdolStockCount = getNationalIdolStockCount(state);

  if (nationalIdolStockCount > 0) {
    rows.push({
      id: "national_idol",
      name: "国民",
      value: `残り${nationalIdolStockCount}ストック`,
    });
  }

  const wishPowerStacks = getWishPowerStacks(state);

  wishPowerStacks.forEach((stack) => {
    rows.push({
      id: stack.id ?? `wish_power_${rows.length}`,
      name: getShortSpecialEffectName(stack.name),
      value: `A札時 集中+${toNumber(stack.amount, 1)}`,
    });
  });

  return rows;
}

const PLAN_OPTIONS = [
  { key: "sense", label: "センス" },
  { key: "logic", label: "ロジック" },
  { key: "anomaly", label: "アノマリー" },
];

const CARD_TYPE_OPTIONS = [
  { key: "active", label: "A札" },
  { key: "mental", label: "M札" },
  { key: "sleepiness", label: "眠気" },
];

const COST_TARGET_OPTIONS = [
  { key: "hp", label: "体力" },
  { key: "redHp", label: "体力(赤)" },
  { key: "goodCondition", label: "好調" },
  { key: "concentration", label: "集中" },
  { key: "excellentCondition", label: "絶好調" },
];

const BUFF_EFFECT_TARGET_OPTIONS = [
  { key: "goodCondition", label: "好調" },
  { key: "concentration", label: "集中" },
  { key: "excellentCondition", label: "絶好調" },
  { key: "vitality", label: "元気" },
  { key: "hpCostReduction", label: "消費体力減少" },
  { key: "hpCostDiscount", label: "消費体力削減" },
];

const SPECIAL_BASE_TARGET_OPTIONS = [
  { key: "goodCondition", label: "好調" },
  { key: "concentration", label: "集中" },
  { key: "excellentCondition", label: "絶好調" },
];

const POWER_MULTIPLIER_TARGET_OPTIONS = [
  { key: "goodCondition", label: "好調" },
  { key: "concentration", label: "集中" },
  { key: "excellentCondition", label: "絶好調" },
];

const DAMAGE_RESERVATION_TARGET_OPTIONS = [
  { key: "afterTurns", label: "nターン後" },
  { key: "finalTurn", label: "最終ターン" },
];

const DAMAGE_RESERVATION_TRIGGER_OPTIONS = [
  { key: "turnStart", label: "開始時" },
  { key: "turnEnd", label: "終了時" },
];

const AFTER_USE_DESTINATION_OPTIONS = [
  { key: "removed", label: "除外" },
  { key: "trash", label: "捨て札" },
  { key: "deck", label: "山札" },
  { key: "hand", label: "手札" },
];

const EXAM_TYPE_KEYS = ["vo", "da", "vi"];

const EXAM_TYPE_OPTIONS = [
  { key: "vo", label: "Vo" },
  { key: "da", label: "Da" },
  { key: "vi", label: "Vi" },
];

function createDefaultExamConfig() {
  return {
    counts: {
      vo: 5,
      da: 4,
      vi: 3,
    },
    multipliers: {
      vo: 4000,
      da: 4000,
      vi: 2000,
    },
    extraTurns: 0,
  };
}

function normalizeExamConfig(examConfig) {
  const defaultConfig = createDefaultExamConfig();

  return {
    counts: {
      vo: Math.max(1, toNumber(examConfig?.counts?.vo, defaultConfig.counts.vo)),
      da: Math.max(1, toNumber(examConfig?.counts?.da, defaultConfig.counts.da)),
      vi: Math.max(1, toNumber(examConfig?.counts?.vi, defaultConfig.counts.vi)),
    },
    multipliers: {
      vo: Math.max(
        0,
        toNumber(examConfig?.multipliers?.vo, defaultConfig.multipliers.vo)
      ),
      da: Math.max(
        0,
        toNumber(examConfig?.multipliers?.da, defaultConfig.multipliers.da)
      ),
      vi: Math.max(
        0,
        toNumber(examConfig?.multipliers?.vi, defaultConfig.multipliers.vi)
      ),
    },
    extraTurns: Math.max(
      0,
      Math.floor(toNumber(examConfig?.extraTurns, defaultConfig.extraTurns))
    ),
  };
}

function addScoreToTotals(scoreTotals, score, examType) {
  const nextScoreTotals = {
    total: toNumber(scoreTotals?.total, 0),
    vo: toNumber(scoreTotals?.vo, 0),
    da: toNumber(scoreTotals?.da, 0),
    vi: toNumber(scoreTotals?.vi, 0),
  };

  const scoreValue = Math.max(0, toNumber(score, 0));

  nextScoreTotals.total += scoreValue;

  if (examType === "vo" || examType === "da" || examType === "vi") {
    nextScoreTotals[examType] += scoreValue;
  }

  return nextScoreTotals;
}

function getCurrentExamType(state) {
  const turnIndex = Math.max(0, toNumber(state?.turn, 1) - 1);

  return state?.examTurnOrder?.[turnIndex] ?? null;
}

function getCurrentExamMultiplierPercent(state) {
  const currentType = getCurrentExamType(state);

  if (!currentType) {
    return 100;
  }

  return toNumber(state?.examConfig?.multipliers?.[currentType], 100);
}

function getCurrentExamMultiplierValue(state) {
  return getCurrentExamMultiplierPercent(state) / 100;
}

function applyCurrentExamMultiplier(score, state) {
  const baseScore = toNumber(score, 0);
  const multiplier = getCurrentExamMultiplierValue(state);

  return roundScore(baseScore * multiplier);
}

function formatCurrentExamMultiplier(state) {
  const currentType = getCurrentExamType(state);
  const multiplierPercent = getCurrentExamMultiplierPercent(state);

  if (!currentType) {
    return "審査倍率なし";
  }

  return `${getExamTypeLabel(currentType)}${multiplierPercent}%`;
}

function getExamTypeLabel(type) {
  return EXAM_TYPE_OPTIONS.find((option) => option.key === type)?.label ?? type;
}

function getExamTotalTurnCount(examConfig) {
  const normalized = normalizeExamConfig(examConfig);

  const baseTurnCount = EXAM_TYPE_KEYS.reduce((total, key) => {
    return total + toNumber(normalized.counts[key], 0);
  }, 0);

  return baseTurnCount + toNumber(normalized.extraTurns, 0);
}

function getMostExamCountType(examConfig) {
  const normalized = normalizeExamConfig(examConfig);
  const counts = normalized.counts;

  const sortedTypes = [...EXAM_TYPE_KEYS].sort((a, b) => {
    const countDiff = counts[b] - counts[a];

    if (countDiff !== 0) return countDiff;

    return EXAM_TYPE_KEYS.indexOf(a) - EXAM_TYPE_KEYS.indexOf(b);
  });

  return sortedTypes[0];
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function normalizeCost(cost) {
  return {
    ...createEmptyCost(),
    ...cost,
    id: cost?.id ?? createId("cost"),
    target: cost?.target ?? "hp",
    amount: Number(cost?.amount ?? 0),
  };
}

function createDefaultDamageReservation() {
  return {
    enabled: false,
    targetType: "afterTurns",
    turnsAfter: 1,
    triggerTiming: "turnStart",
  };
}

function normalizeDamageReservation(reservation) {
  const defaultReservation = createDefaultDamageReservation();

  return {
    ...defaultReservation,
    ...reservation,
    enabled: Boolean(reservation?.enabled),
    targetType:
      reservation?.targetType === "finalTurn" ? "finalTurn" : "afterTurns",
    turnsAfter: Math.max(1, Math.floor(toNumber(reservation?.turnsAfter, 1))),
    triggerTiming:
      reservation?.triggerTiming === "turnEnd" ? "turnEnd" : "turnStart",
  };
}

function isReservedAttack(attack) {
  return Boolean(attack?.damageReservation?.enabled);
}

function getDamageReservationTargetLabel(reservation) {
  const normalized = normalizeDamageReservation(reservation);

  if (normalized.targetType === "finalTurn") {
    return "最終ターン";
  }

  return `${normalized.turnsAfter}ターン後`;
}

function getDamageReservationTriggerLabel(triggerTiming) {
  return triggerTiming === "turnEnd" ? "終了時" : "開始時";
}

function normalizeAttack(attack) {
  return {
    ...createEmptyAttack(),
    ...attack,
    id: attack?.id ?? createId("attack"),
    basePower: Number(attack?.basePower ?? 0),
    useSpecialBasePower: Boolean(attack?.useSpecialBasePower),
    specialBaseTarget: attack?.specialBaseTarget ?? "goodCondition",
    specialBasePercent: Number(attack?.specialBasePercent ?? 450),
    usePowerMultiplier: Boolean(attack?.usePowerMultiplier),
    powerMultiplierTarget: attack?.powerMultiplierTarget ?? "goodCondition",
    powerMultiplierValue: Number(attack?.powerMultiplierValue ?? 1.5),

    damageReservation: normalizeDamageReservation(attack?.damageReservation),
  };
}

function normalizeBuffEffect(effect) {
  return {
    ...createEmptyBuffEffect(),
    ...effect,
    id: effect?.id ?? createId("buff"),
    target: effect?.target ?? "goodCondition",
    amount: Number(effect?.amount ?? 0),
  };
}

function normalizeDeckCard(card) {
  const baseCard = createEmptyDeckCard();

  const normalizedCard = {
    ...baseCard,
    ...card,
    id: card?.id ?? createId("deckCard"),
    name: card?.name ?? "",
    count: Number(card?.count ?? 1),
    cardType: card?.cardType ?? "active",
    costs: Array.isArray(card?.costs)
      ? card.costs.map(normalizeCost)
      : [createEmptyCost()],
    attacks: Array.isArray(card?.attacks)
      ? card.attacks.map(normalizeAttack)
      : [createEmptyAttack()],
    afterUseDestination: card?.afterUseDestination ?? "trash",
    buffEffects: Array.isArray(card?.buffEffects)
      ? card.buffEffects.map(normalizeBuffEffect)
      : [createEmptyBuffEffect()],
    memo: card?.memo ?? "",

    startInHand: Boolean(card?.startInHand),

    generatesSleepiness: Boolean(card?.generatesSleepiness),

    fixedScore: card?.fixedScore ?? null,
    specialEffectId: card?.specialEffectId ?? "",
    automationLevel: card?.automationLevel ?? "manual",
    specialEffect: card?.specialEffect ?? null,
    templateId: card?.templateId ?? "",
  };

  if (normalizedCard.cardType === "sleepiness") {
    return {
      ...normalizedCard,
      name: normalizedCard.name || "眠気",
      costs: [],
      attacks: [],
      buffEffects: [],
      afterUseDestination: "removed",
      fixedScore: 0,
      generatesSleepiness: false,
    };
  }

  return normalizedCard;
}

function normalizeDeck(deck) {
  const baseDeck = createEmptyDeck();

  return {
    ...baseDeck,
    ...deck,
    id: deck?.id ?? createId("deck"),
    name: deck?.name ?? "名称未設定デッキ",
    plan: deck?.plan ?? "sense",
    maxHp: Math.max(1, toNumber(deck?.maxHp, 35)),
    examConfig: normalizeExamConfig(deck?.examConfig),
    initialBuffs: normalizeDeckInitialBuffs(deck?.initialBuffs),
    cards: Array.isArray(deck?.cards)
      ? deck.cards.map(normalizeDeckCard)
      : [],
  };
}

function loadDecksFromStorage() {
  try {
    const rawDecks = localStorage.getItem(DECKS_STORAGE_KEY);

    if (!rawDecks) {
      return createInitialDecks();
    }

    const parsedDecks = JSON.parse(rawDecks);

    if (!Array.isArray(parsedDecks)) {
      return createInitialDecks();
    }

    return parsedDecks.map(normalizeDeck);
  } catch {
    return createInitialDecks();
  }
}

function loadSelectedDeckIdFromStorage() {
  return localStorage.getItem(SELECTED_DECK_STORAGE_KEY) ?? "";
}

function getPrimaryBasePower(deckCard) {
  if (deckCard.cardType !== "active") return 0;

  const firstAttack = deckCard.attacks?.[0];

  return Number(firstAttack?.basePower ?? 0);
}

function buildPlayDeckFromRegisteredDeck(deck) {
  const cards = [];

  deck.cards.forEach((deckCard) => {
    const count = Math.max(0, Number(deckCard.count ?? 0));

    for (let i = 0; i < count; i += 1) {
      cards.push({
        ...deckCard,
        id: createId("playCard"),
        deckCardId: deckCard.id,
        copyIndex: i + 1,

        // 既存のプレイ画面・打点計算が参照している形式に合わせる
        type: deckCard.cardType,
        basePower: getPrimaryBasePower(deckCard),
        memo: deckCard.memo ?? "",
      });
    }
  });

  return shuffle(cards);
}

function createEmptyCost() {
  return {
    id: createId("cost"),
    target: "hp",
    amount: 0,
  };
}

function createEmptyAttack() {
  return {
    id: createId("attack"),
    basePower: 0,

    useSpecialBasePower: false,
    specialBaseTarget: "goodCondition",
    specialBasePercent: 150,

    usePowerMultiplier: false,
    powerMultiplierTarget: "goodCondition",
    powerMultiplierValue: 1.5,

    damageReservation: createDefaultDamageReservation(),
  };
}

function createEmptyBuffEffect() {
  return {
    id: createId("buff"),
    target: "goodCondition",
    amount: 0,
  };
}

function createEmptyDeckCard() {
  return {
    id: createId("deckCard"),
    name: "",
    count: 1,
    cardType: "active",
    costs: [createEmptyCost()],
    attacks: [createEmptyAttack()],
    afterUseDestination: "trash",
    buffEffects: [createEmptyBuffEffect()],
    memo: "",

    startInHand: false,

    // 使用時に眠気を山札へ生成するか
    generatesSleepiness: false,

    // 特殊カード用
    fixedScore: null,
    specialEffectId: "",
    automationLevel: "manual",
    specialEffect: null,
    templateId: "",
  };
}

function createSleepinessCard() {
  return {
    id: createId("sleepiness"),
    name: "眠気",

    // A札/M札判定を持たない
    cardType: "sleepiness",
    type: "sleepiness",

    costs: [],
    attacks: [],
    buffEffects: [],

    basePower: 0,
    fixedScore: 0,

    afterUseDestination: "removed",

    memo: "",
  };
}

function insertCardAtRandomPosition(cards, newCard) {
  const insertIndex = Math.floor(Math.random() * (cards.length + 1));

  return [
    ...cards.slice(0, insertIndex),
    newCard,
    ...cards.slice(insertIndex),
  ];
}

function createEmptyDeck(deckName = "新規デッキ") {
  return {
    id: createId("deck"),
    name: deckName,
    plan: "sense",
    maxHp: 35,
    examConfig: createDefaultExamConfig(),
    initialBuffs: createDefaultDeckInitialBuffs(),
    cards: [],
  };
}

function createInitialDecks() {
  const initialDeck = normalizeDeck({
    ...DEFAULT_VISITOR_DECK_EXPORT.deck,

    // 初期デッキ用にIDを作り直す
    id: createId("deck"),
  });

  return [initialDeck];
}

function getPlanLabel(plan) {
  if (plan === "sense") return "センス";
  if (plan === "logic") return "ロジック";
  if (plan === "anomaly") return "アノマリー";
  return "未設定";
}

function getCardTypeLabelForDeck(cardType) {
  if (cardType === "active") return "A札";
  if (cardType === "mental") return "M札";
  if (cardType === "sleepiness") return "眠気";
  return "未設定";
}

function getAfterUseDestinationLabel(destination) {
  const option = AFTER_USE_DESTINATION_OPTIONS.find(
    (item) => item.key === destination
  );

  return option?.label ?? "未設定";
}

function getDeckCardCount(deck) {
  return deck.cards.reduce((total, card) => {
    return total + Number(card.count ?? 0);
  }, 0);
}

const BUFF_FIELDS = [
  { key: "goodCondition", label: "好調", plans: ["sense"], defaultValue: 0 },
  { key: "concentration", label: "集中", plans: ["sense"], defaultValue: 0 },
  { key: "excellentCondition", label: "絶好調", plans: ["sense"], defaultValue: 0 },

  {
    key: "goodConditionGainIncreasePercent",
    label: "好調増加(%)",
    plans: ["sense"],
    defaultValue: 0,
  },

  {
    key: "concentrationGainIncreasePercent",
    label: "集中増加(%)",
    plans: ["sense"],
    defaultValue: 0,
  },

  { key: "motivation", label: "やる気", plans: ["logic"], defaultValue: 0 },
  { key: "impression", label: "好印象", plans: ["logic"], defaultValue: 0 },

  {
    key: "hpCostReduction",
    label: "消費体力減少",
    plans: ["sense", "logic", "anomaly"],
    defaultValue: 0,
  },

  {
    key: "hpCostDiscount",
    label: "消費体力削減",
    plans: ["sense", "logic", "anomaly"],
    defaultValue: 0,
  },

  {
    key: "scoreMultiplier",
    label: "スコア倍率補正",
    plans: ["sense", "logic", "anomaly"],
    defaultValue: 1,
    step: 0.1,
  },

  //{ key: "other", label: "その他補正", plans: ["sense", "logic", "anomaly"], defaultValue: 0 },
];

function createDeckCardFromTemplate(template) {
  return {
    ...template,
    id: createId("card"),

    costs: (template.costs ?? []).map((cost) => ({
      ...cost,
      id: createId("cost"),
    })),

    attacks: (template.attacks ?? []).map((attack) => ({
      ...attack,
      id: createId("attack"),
    })),

    buffEffects: (template.buffEffects ?? []).map((effect) => ({
      ...effect,
      id: createId("buff"),
    })),
  };
}

function DeckListPage({
  decks,
  onCreateDeck,
  onEditDeck,
  onExportDeck,
  onDeleteDeck,
  onBackToPlay,
}) {

  return (
    <main className="app">
      <header className="appHeader deckHeader">
        <div>
          <h1>デッキ一覧</h1>
        </div>

        <button className="secondaryButton" onClick={onBackToPlay}>
          プレイ画面へ戻る
        </button>
      </header>

      <section className="deckListCard">
        <div className="deckListTitleRow">
          <h2>My Decks</h2>

          <button className="primaryButton" onClick={onCreateDeck}>
            ＋ 新しいデッキを作成
          </button>
        </div>

        {decks.length === 0 ? (
          <div className="emptyDeckMessage">
            <p>デッキがまだありません。</p>
            <p>「新しいデッキを作成」から追加してください。</p>
          </div>
        ) : (
          <div className="deckRows">
            {decks.map((deck) => (
              <div key={deck.id} className="deckRow">
                <div className="deckMainInfo">
                  <strong>{deck.name || "名称未設定デッキ"}</strong>
                  <span>
                    {getPlanLabel(deck.plan)} / {getDeckCardCount(deck)}枚
                  </span>
                </div>

                <div className="deckActions">
                  <button
                    type="button"
                    onClick={() => onExportDeck(deck)}
                  >
                    共有
                  </button>

                  <button onClick={() => onEditDeck(deck.id)}>編集</button>

                  <button
                    className="dangerButton"
                    onClick={() => onDeleteDeck(deck.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function InitialBuffEditor({ deck, onChangeDeck }) {
  const initialBuffs = normalizeDeckInitialBuffs(deck.initialBuffs);

  function updateInitialBuff(key, value) {
    onChangeDeck({
      ...deck,
      initialBuffs: {
        ...initialBuffs,
        [key]: value,
      },
    });
  }

  if (deck.plan !== "sense") {
    return (
      <div className="initialBuffEditor">
        <p className="smallNote">
          初期バフ量の詳細設定は、現在センスのみ対応しています。
        </p>
      </div>
    );
  }

  return (
    <div className="initialBuffEditor">
      <div className="initialBuffGrid">
        <label>
          <span>好調</span>
          <input
            type="number"
            min="0"
            value={initialBuffs.goodCondition}
            onChange={(event) =>
              updateInitialBuff("goodCondition", Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>集中</span>
          <input
            type="number"
            min="0"
            value={initialBuffs.concentration}
            onChange={(event) =>
              updateInitialBuff("concentration", Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>絶好調</span>
          <input
            type="number"
            min="0"
            value={initialBuffs.excellentCondition}
            onChange={(event) =>
              updateInitialBuff("excellentCondition", Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>消費体力減少</span>
          <input
            type="number"
            min="0"
            value={initialBuffs.hpCostReduction}
            onChange={(event) =>
              updateInitialBuff("hpCostReduction", Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>消費体力削減</span>
          <input
            type="number"
            min="0"
            value={initialBuffs.hpCostDiscount}
            onChange={(event) =>
              updateInitialBuff("hpCostDiscount", Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>スコア倍率</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={initialBuffs.scoreMultiplier}
            onChange={(event) =>
              updateInitialBuff("scoreMultiplier", Number(event.target.value))
            }
          />
        </label>
      </div>
    </div>
  );
}

function DeckEditPage({
  deck,
  onChangeDeck,
  onAddCard,
  onAddSpecialCard,
  onUpdateCard,
  onDeleteCard,
  onDone,
  onBackToList,
}) {
  const [specialCardMenuOpenPosition, setSpecialCardMenuOpenPosition] =
    useState(null);
  const [isInitialBuffEditorOpen, setIsInitialBuffEditorOpen] = useState(false);
  const [importDeckText, setImportDeckText] = useState("");

  function renderDeckEditActionButtons(position) {
    const isSpecialCardMenuOpen = specialCardMenuOpenPosition === position;

    return (
      <div className="deckEditActionButtons">
        <button
          type="button"
          className="secondaryButton"
          onClick={() => setIsInitialBuffEditorOpen((prev) => !prev)}
        >
          初期バフ量
        </button>
        <button
          type="button"
          className="primaryButton"
          onClick={onAddCard}
        >
          ＋ カードを追加
        </button>

        <div className="specialCardAddArea">
          <button
            type="button"
            className="secondaryButton"
            onClick={() =>
              setSpecialCardMenuOpenPosition((prev) =>
                prev === position ? null : position
              )
            }
          >
            ＋ 特殊なカードを追加
          </button>

          {isSpecialCardMenuOpen && (
            <div
              className={`specialCardMenu ${position === "bottom" ? "specialCardMenuUp" : ""
                }`}
            >
              {SPECIAL_CARD_TEMPLATES.map((template) => (
                <button
                  key={template.templateId}
                  type="button"
                  className="specialCardMenuItem"
                  onClick={() => {
                    onAddSpecialCard(template);
                    setSpecialCardMenuOpenPosition(null);
                  }}
                >
                  <span className="specialCardMenuName">{template.name}</span>
                  <span className="specialCardMenuMemo">{template.memo}</span>
                </button>
              ))}

              <div className="specialCardMenuPlaceholder">
                今後追加予定...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function importDeckFromText() {
    const rawText = importDeckText.trim();

    if (!rawText) {
      window.alert("インポートするデッキデータを貼り付けてください。");
      return;
    }

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      window.alert("デッキデータの読み込みに失敗しました。JSON形式を確認してください。");
      return;
    }

    const rawDeck = parsed?.deck ?? parsed;

    if (!rawDeck || typeof rawDeck !== "object" || !Array.isArray(rawDeck.cards)) {
      window.alert("デッキデータとして認識できませんでした。");
      return;
    }

    const isOk = window.confirm(
      "現在編集中のデッキ内容を、インポートした内容で上書きしますか？"
    );

    if (!isOk) return;

    const normalizedImportedDeck = normalizeDeck(rawDeck);

    onChangeDeck({
      ...normalizedImportedDeck,

      // ここは重要。
      // インポート元のIDではなく、現在編集中のデッキIDを維持する。
      id: deck.id,
    });

    setImportDeckText("");
    window.alert("デッキをインポートしました。");
  }

  if (!deck) {
    return (
      <main className="app">
        <p>デッキが見つかりません。</p>
        <button onClick={onBackToList}>デッキ一覧へ戻る</button>
      </main>
    );
  }

  return (
    <main className="app deckEditPage">
      <header className="appHeader deckHeader">
        <div>
          <h1>デッキ編集</h1>
        </div>

        <div className="headerButtonGroup">
          <button className="secondaryButton" onClick={onBackToList}>
            一覧へ戻る
          </button>
          <button className="primaryButton" onClick={onDone}>
            完了
          </button>
        </div>
      </header>

      <section className="deckEditCard">
        <div className="deckBasicFields">
          <label>
            <span>デッキ名</span>
            <input
              type="text"
              value={deck.name}
              onChange={(event) =>
                onChangeDeck({ ...deck, name: event.target.value })
              }
            />
          </label>

          <label>
            <span>プラン</span>
            <select
              className="deckPlanSelect"
              value={deck.plan}
              onChange={(event) =>
                onChangeDeck({ ...deck, plan: event.target.value })
              }
            >
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan.key} value={plan.key}>
                  {plan.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>体力</span>
            <input
              type="number"
              min="1"
              value={deck.maxHp ?? 35}
              onChange={(event) =>
                onChangeDeck({
                  ...deck,
                  maxHp: Math.max(1, Number(event.target.value) || 1),
                })
              }
            />
          </label>
        </div>



        <div className="deckEditToolbar">
          <div>
            <h2>カードリスト</h2>
            <p>
              合計: {getDeckCardCount(deck)}枚 / {deck.cards.length}種類
            </p>
          </div>
          {renderDeckEditActionButtons("top")}
        </div>

        {isInitialBuffEditorOpen && (
          <InitialBuffEditor deck={deck} onChangeDeck={onChangeDeck} />
        )}

        <DeckCardSummary cards={deck.cards} />

        <div className="deckCardEditors">
          {deck.cards.length === 0 ? (
            <div className="emptyDeckMessage">
              <p>カードがまだありません。</p>
              <p>「カードを追加」から登録してください。</p>
            </div>
          ) : (
            deck.cards.map((card, index) => (
              <DeckCardEditor
                key={card.id}
                card={card}
                index={index}
                onUpdate={(nextCard) => onUpdateCard(card.id, nextCard)}
                onDelete={() => onDeleteCard(card.id)}
              />
            ))
          )}
        </div>
        <div className="deckEditBottomToolbar">
          {renderDeckEditActionButtons("bottom")}
        </div>
        <div className="deckImportSection">
          <h2>デッキインポート</h2>

          <p className="smallNote">
            エクスポートしたデッキデータを貼り付けてください。
            実行すると、現在編集中のデッキ内容が上書きされます。
          </p>

          <textarea
            value={importDeckText}
            onChange={(event) => setImportDeckText(event.target.value)}
            placeholder="ここにエクスポートしたデッキデータを貼り付け"
            rows={8}
          />

          <div className="deckImportActionRow">
            <button
              type="button"
              className="primaryButton"
              onClick={importDeckFromText}
              disabled={!importDeckText.trim()}
            >
              このデッキにインポート
            </button>

            <button
              type="button"
              className="secondaryButton"
              onClick={() => setImportDeckText("")}
              disabled={!importDeckText.trim()}
            >
              クリア
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function DeckCardSummary({ cards }) {
  if (cards.length === 0) return null;

  return (
    <section className="deckSummarySection">
      <h2>カードリスト概要</h2>

      <div className="deckSummaryTableWrapper">
        <table className="deckSummaryTable">
          <thead>
            <tr>
              <th>枚数</th>
              <th>カード名</th>
              <th>種別</th>
              <th>攻撃数</th>
              <th>使用後</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id}>
                <td>{card.count}</td>
                <td>{card.name || "カード名未設定"}</td>
                <td>{getCardTypeLabelForDeck(card.cardType)}</td>
                <td>{card.cardType === "active" ? card.attacks.length : "-"}</td>
                <td>{getAfterUseDestinationLabel(card.afterUseDestination)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeckCardEditor({ card, index, onUpdate, onDelete }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  function updateField(fieldName, value) {
    if (fieldName === "cardType" && value === "sleepiness") {
      onUpdate({
        ...card,
        name: card.name || "眠気",
        cardType: "sleepiness",
        costs: [],
        attacks: [],
        buffEffects: [],
        afterUseDestination: "removed",
        fixedScore: 0,
        generatesSleepiness: false,
      });
      return;
    }

    if (
      fieldName === "cardType" &&
      card.cardType === "sleepiness" &&
      value !== "sleepiness"
    ) {
      onUpdate({
        ...card,
        cardType: value,
        costs: card.costs?.length > 0 ? card.costs : [createEmptyCost()],
        attacks: card.attacks?.length > 0 ? card.attacks : [createEmptyAttack()],
        buffEffects:
          card.buffEffects?.length > 0
            ? card.buffEffects
            : [createEmptyBuffEffect()],
        afterUseDestination: "trash",
        fixedScore: null,
      });
      return;
    }

    onUpdate({
      ...card,
      [fieldName]: value,
    });
  }

  function addCost() {
    onUpdate({
      ...card,
      costs: [...card.costs, createEmptyCost()],
    });
  }

  function updateCost(costId, nextCost) {
    onUpdate({
      ...card,
      costs: card.costs.map((cost) =>
        cost.id === costId ? nextCost : cost
      ),
    });
  }

  function deleteCost(costId) {
    onUpdate({
      ...card,
      costs: card.costs.filter((cost) => cost.id !== costId),
    });
  }

  function addAttack() {
    onUpdate({
      ...card,
      attacks: [...card.attacks, createEmptyAttack()],
    });
  }

  function updateAttack(attackId, nextAttack) {
    onUpdate({
      ...card,
      attacks: card.attacks.map((attack) =>
        attack.id === attackId ? nextAttack : attack
      ),
    });
  }

  function deleteAttack(attackId) {
    onUpdate({
      ...card,
      attacks: card.attacks.filter((attack) => attack.id !== attackId),
    });
  }

  function addBuffEffect() {
    onUpdate({
      ...card,
      buffEffects: [...card.buffEffects, createEmptyBuffEffect()],
    });
  }

  function updateBuffEffect(buffEffectId, nextBuffEffect) {
    onUpdate({
      ...card,
      buffEffects: card.buffEffects.map((effect) =>
        effect.id === buffEffectId ? nextBuffEffect : effect
      ),
    });
  }

  function deleteBuffEffect(buffEffectId) {
    onUpdate({
      ...card,
      buffEffects: card.buffEffects.filter(
        (effect) => effect.id !== buffEffectId
      ),
    });
  }

  return (
    <section className="deckCardEditor compactDeckCardEditor">
      <div className="deckCardEditorHeader">
        <h3>カード{index + 1}</h3>

        <button className="dangerButton" onClick={onDelete}>
          削除
        </button>
      </div>

      <div className="editSection alwaysOpenSection">
        <h4>基本情報</h4>

        <div className="compactFormGrid">
          <label>
            <span>カード名</span>
            <input
              type="text"
              value={card.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="カード名"
            />
          </label>

          <label>
            <span>枚数</span>
            <input
              type="number"
              min="0"
              value={card.count}
              onChange={(event) =>
                updateField("count", Number(event.target.value))
              }
            />
          </label>

          <label>
            <span>種別</span>
            <select
              value={card.cardType}
              onChange={(event) => updateField("cardType", event.target.value)}
            >
              {CARD_TYPE_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <button
        type="button"
        className="detailToggleButton"
        onClick={() => setIsDetailOpen((prev) => !prev)}
      >
        {isDetailOpen ? "詳細を隠す" : "詳細を表示"}
      </button>

      {isDetailOpen && (
        <div className="cardDetailArea">
          <div className="editSection">
            <div className="sectionTitleRow">
              <h4>コスト</h4>
              <button onClick={addCost}>＋ コストを追加</button>
            </div>

            {card.costs.length === 0 ? (
              <p className="smallNote">コストなし</p>
            ) : (
              <div className="repeatList">
                {card.costs.map((cost) => (
                  <CostEditor
                    key={cost.id}
                    cost={cost}
                    onUpdate={(nextCost) => updateCost(cost.id, nextCost)}
                    onDelete={() => deleteCost(cost.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {card.cardType === "active" && (
            <div className="editSection">
              <div className="sectionTitleRow">
                <h4>攻撃設定</h4>
                <button onClick={addAttack}>＋ 攻撃を追加</button>
              </div>

              {card.attacks.length === 0 ? (
                <p className="smallNote">攻撃設定がありません。</p>
              ) : (
                <div className="repeatList">
                  {card.attacks.map((attack, attackIndex) => (
                    <AttackEditor
                      key={attack.id}
                      attack={attack}
                      attackIndex={attackIndex}
                      onUpdate={(nextAttack) =>
                        updateAttack(attack.id, nextAttack)
                      }
                      onDelete={() => deleteAttack(attack.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="editSection">
            <h4>使用後の行き先</h4>

            <label className="singleField">
              <span>使用後すぐに移動する場所</span>
              <select
                value={card.afterUseDestination}
                onChange={(event) =>
                  updateField("afterUseDestination", event.target.value)
                }
              >
                {AFTER_USE_DESTINATION_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="editSection">
            <div className="sectionTitleRow">
              <h4>バフ効果</h4>
              <button onClick={addBuffEffect}>＋ バフ効果を追加</button>
            </div>

            {card.buffEffects.length === 0 ? (
              <p className="smallNote">自動バフ効果なし</p>
            ) : (
              <div className="repeatList">
                {card.buffEffects.map((effect) => (
                  <BuffEffectEditor
                    key={effect.id}
                    effect={effect}
                    onUpdate={(nextEffect) =>
                      updateBuffEffect(effect.id, nextEffect)
                    }
                    onDelete={() => deleteBuffEffect(effect.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="editSection">
            <label className="checkRow">
              <input
                type="checkbox"
                checked={Boolean(card.startInHand)}
                onChange={(event) =>
                  updateField("startInHand", event.target.checked)
                }
              />
              <span>ゲーム開始時手札に入る</span>
            </label>

           {/* {card.cardType !== "sleepiness" && (
              <label className="checkRow">
                <input
                  type="checkbox"
                  checked={Boolean(card.generatesSleepiness)}
                  onChange={(event) =>
                    updateField("generatesSleepiness", event.target.checked)
                  }
                />
                <span>使用時、眠気を山札のランダムな位置に生成する</span>
              </label>
            )}  */}
          
          </div>

          <div className="editSection">
            <h4>効果メモ</h4>

            <textarea
              value={card.memo}
              onChange={(event) => updateField("memo", event.target.value)}
              placeholder="複雑な効果や手動処理する内容をメモ"
              rows={4}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function CostEditor({ cost, onUpdate, onDelete }) {
  return (
    <div className="inlineEditorRow">
      <label>
        <span>対象</span>
        <select
          value={cost.target}
          onChange={(event) =>
            onUpdate({ ...cost, target: event.target.value })
          }
        >
          {COST_TARGET_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>数値</span>
        <input
          type="number"
          value={cost.amount}
          onChange={(event) =>
            onUpdate({ ...cost, amount: Number(event.target.value) })
          }
        />
      </label>

      <button className="dangerButton" onClick={onDelete}>
        削除
      </button>
    </div>
  );
}

function AttackEditor({ attack, attackIndex, onUpdate, onDelete }) {
  function updateField(fieldName, value) {
    onUpdate({
      ...attack,
      [fieldName]: value,
    });
  }

  const damageReservation = normalizeDamageReservation(
    attack?.damageReservation
  );

  function updateDamageReservation(nextFields) {
    updateField(
      "damageReservation",
      normalizeDamageReservation({
        ...damageReservation,
        ...nextFields,
      })
    );
  }

  return (
    <div className="attackEditor">
      <div className="attackEditorHeader">
        <strong>攻撃{attackIndex + 1}</strong>

        <button className="dangerButton" onClick={onDelete}>
          削除
        </button>
      </div>

      <div className="attackBaseRow">
        <label>
          <span>基礎打点</span>
          <input
            type="number"
            value={attack.basePower}
            onChange={(event) =>
              updateField("basePower", Number(event.target.value))
            }
          />
        </label>
      </div>

      <div className="optionBox">
        <label className="checkRow">
          <input
            type="checkbox"
            checked={attack.useSpecialBasePower}
            onChange={(event) =>
              updateField("useSpecialBasePower", event.target.checked)
            }
          />
          <span>特殊基礎打点を使う</span>
        </label>

        {attack.useSpecialBasePower && (
          <div className="inlineFormulaRow">
            <select
              value={attack.specialBaseTarget}
              onChange={(event) =>
                updateField("specialBaseTarget", event.target.value)
              }
            >
              {SPECIAL_BASE_TARGET_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>

            <span>の</span>

            <input
              type="number"
              value={attack.specialBasePercent}
              onChange={(event) =>
                updateField("specialBasePercent", Number(event.target.value))
              }
            />

            <span>%打点</span>
          </div>
        )}
      </div>

      <div className="optionBox">
        <label className="checkRow">
          <input
            type="checkbox"
            checked={attack.usePowerMultiplier}
            onChange={(event) =>
              updateField("usePowerMultiplier", event.target.checked)
            }
          />
          <span>打点倍率を使う</span>
        </label>

        {attack.usePowerMultiplier && (
          <div className="inlineFormulaRow">
            <select
              value={attack.powerMultiplierTarget}
              onChange={(event) =>
                updateField("powerMultiplierTarget", event.target.value)
              }
            >
              {POWER_MULTIPLIER_TARGET_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>

            <span>の</span>

            <input
              type="number"
              step="0.1"
              value={attack.powerMultiplierValue}
              onChange={(event) =>
                updateField("powerMultiplierValue", Number(event.target.value))
              }
            />

            <span>倍適用</span>
          </div>
        )}
      </div>
      <div className="optionBox">
        <label className="checkRow">
          <input
            type="checkbox"
            checked={damageReservation.enabled}
            onChange={(event) =>
              updateDamageReservation({
                enabled: event.target.checked,
              })
            }
          />
          <span>打点予約する</span>
        </label>

        {damageReservation.enabled && (
          <div className="damageReservationBox">
            <label className="damageReservationRow">
              <span>発動先</span>
              <select
                value={damageReservation.targetType}
                onChange={(event) =>
                  updateDamageReservation({
                    targetType: event.target.value,
                  })
                }
              >
                {DAMAGE_RESERVATION_TARGET_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {damageReservation.targetType === "afterTurns" && (
              <label className="damageReservationRow">
                <span>nターン後</span>
                <input
                  type="number"
                  min="1"
                  value={damageReservation.turnsAfter}
                  onChange={(event) =>
                    updateDamageReservation({
                      turnsAfter: event.target.value,
                    })
                  }
                />
              </label>
            )}

            <label className="damageReservationRow">
              <span>発動タイミング</span>
              <select
                value={damageReservation.triggerTiming}
                onChange={(event) =>
                  updateDamageReservation({
                    triggerTiming: event.target.value,
                  })
                }
              >
                {DAMAGE_RESERVATION_TRIGGER_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function BuffEffectEditor({ effect, onUpdate, onDelete }) {
  return (
    <div className="inlineEditorRow">
      <label>
        <span>対象</span>
        <select
          value={effect.target}
          onChange={(event) =>
            onUpdate({ ...effect, target: event.target.value })
          }
        >
          {BUFF_EFFECT_TARGET_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>変化量</span>
        <input
          type="number"
          value={effect.amount}
          onChange={(event) =>
            onUpdate({ ...effect, amount: Number(event.target.value) })
          }
        />
      </label>

      <button className="dangerButton" onClick={onDelete}>
        削除
      </button>
    </div>
  );
}

const PLAYER_STATUS_FIELDS = [
  { key: "hp", label: "体力" },
  { key: "vitality", label: "元気" },
];

function createInitialPlayerStatus(maxHp = 35) {
  const normalizedMaxHp = Math.max(1, toNumber(maxHp, 35));

  return {
    hp: normalizedMaxHp,
    maxHp: normalizedMaxHp,
    vitality: 0,
  };
}

function getVisibleBuffFields(plan) {
  return BUFF_FIELDS.filter((field) => field.plans.includes(plan));
}

function createDefaultDeckInitialBuffs() {
  return {
    goodCondition: 0,
    concentration: 0,
    excellentCondition: 0,
    hpCostReduction: 0,
    hpCostDiscount: 0,
    scoreMultiplier: 1,
  };
}

function normalizeDeckInitialBuffs(initialBuffs) {
  const defaults = createDefaultDeckInitialBuffs();

  return {
    goodCondition: Math.max(0, toNumber(initialBuffs?.goodCondition, defaults.goodCondition)),
    concentration: Math.max(0, toNumber(initialBuffs?.concentration, defaults.concentration)),
    excellentCondition: Math.max(0, toNumber(initialBuffs?.excellentCondition, defaults.excellentCondition)),
    hpCostReduction: Math.max(0, toNumber(initialBuffs?.hpCostReduction, defaults.hpCostReduction)),
    hpCostDiscount: Math.max(0, toNumber(initialBuffs?.hpCostDiscount, defaults.hpCostDiscount)),
    scoreMultiplier: Math.max(0, toNumber(initialBuffs?.scoreMultiplier, defaults.scoreMultiplier)),
  };
}

function createInitialBuffs() {
  return BUFF_FIELDS.reduce((buffs, field) => {
    buffs[field.key] = field.defaultValue ?? 0;
    return buffs;
  }, {});
}

function buildDeck() {
  const cards = [];

  INITIAL_DECK_RECIPE.forEach((recipe) => {
    const master = CARD_MASTER.find((card) => card.cardKey === recipe.cardKey);
    if (!master) return;

    for (let i = 0; i < recipe.count; i += 1) {
      cards.push({
        ...master,
        id: `${master.cardKey}_${i + 1}_${crypto.randomUUID()}`,
      });
    }
  });

  return shuffle(cards);
}

function shuffle(array) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
  }

  return copied;
}

function generateExamTurnOrder(examConfig) {
  const normalized = normalizeExamConfig(examConfig);
  const counts = normalized.counts;

  const ascendingTypes = [...EXAM_TYPE_KEYS].sort((a, b) => {
    const countDiff = counts[a] - counts[b];

    if (countDiff !== 0) return countDiff;

    return EXAM_TYPE_KEYS.indexOf(a) - EXAM_TYPE_KEYS.indexOf(b);
  });

  const descendingTypes = [...EXAM_TYPE_KEYS].sort((a, b) => {
    const countDiff = counts[b] - counts[a];

    if (countDiff !== 0) return countDiff;

    return EXAM_TYPE_KEYS.indexOf(a) - EXAM_TYPE_KEYS.indexOf(b);
  });

  // 1ターン目：審査基準のターン数が一番多いタイプ
  const firstTurnType = descendingTypes[0];

  // 最後の3ターン：一番少ない → 2番目 → 一番多い
  const lastThreeTypes = ascendingTypes;

  const remainingCounts = {
    ...counts,
  };

  remainingCounts[firstTurnType] = Math.max(
    0,
    remainingCounts[firstTurnType] - 1
  );

  lastThreeTypes.forEach((type) => {
    remainingCounts[type] = Math.max(0, remainingCounts[type] - 1);
  });

  const randomPool = [];

  EXAM_TYPE_KEYS.forEach((type) => {
    const count = Math.max(0, toNumber(remainingCounts[type], 0));

    for (let i = 0; i < count; i += 1) {
      randomPool.push(type);
    }
  });

  const baseTurnOrder = [
    firstTurnType,
    ...shuffle(randomPool),
    ...lastThreeTypes,
  ];

  const extraTurnType = getMostExamCountType(normalized);
  const extraTurns = Math.max(0, toNumber(normalized.extraTurns, 0));

  const extraTurnOrder = Array.from({ length: extraTurns }, () => extraTurnType);

  return [...baseTurnOrder, ...extraTurnOrder];
}

function drawCardsWithTrashRecycle(deck, trash, count) {
  let nextDeck = [...deck];
  let nextTrash = [...trash];
  const drawnCards = [];
  let recycledCount = 0;

  const targetDrawCount = Math.max(0, Number(count ?? 0));

  for (let i = 0; i < targetDrawCount; i += 1) {
    if (nextDeck.length === 0) {
      if (nextTrash.length === 0) {
        break;
      }

      // 捨て札を山札に戻して、山札を作り直す
      nextDeck = shuffle(nextTrash);
      recycledCount += nextTrash.length;
      nextTrash = [];
    }

    const randomIndex = Math.floor(Math.random() * nextDeck.length);
    const [drawnCard] = nextDeck.splice(randomIndex, 1);

    drawnCards.push(drawnCard);
  }

  return {
    drawnCards,
    nextDeck,
    nextTrash,
    recycledCount,
  };
}

function getCardTypeLabel(type) {
  if (type === "active") return "アクティブ";
  if (type === "mental") return "メンタル";
  if (type === "sleepiness") return "眠気";
  return "その他";
}

function formatBuffs(buffs, plan) {
  return getVisibleBuffFields(plan)
    .map((field) => {
      return `${field.label}${buffs[field.key] ?? 0}`;
    })
    .join(" / ");
}

function Zone({ title, cards, selectedCardId, onSelectCard }) {
  return (
    <section className="zone">
      <div className="zoneHeader">
        <h2>{title}</h2>
        <span>{cards.length}枚</span>
      </div>

      <div className="cardList">
        {cards.length === 0 && <p className="emptyText">カードなし</p>}

        {cards.map((card) => {
          const isSelected = card.id === selectedCardId;

          return (
            <button
              key={card.id}
              className={`cardButton ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCard(card.id)}
            >
              <strong>{card.name}</strong>
              <span>{getCardTypeLabel(card.type)}</span>
              {card.basePower > 0 && <span>基礎打点: {card.basePower}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BuffPanel({ plan, buffs, onChangeBuff }) {
  const visibleBuffFields = getVisibleBuffFields(plan);

  return (
    <section className="buffPanel">
      <h2>現在バフ</h2>

      <div className="buffGrid">
        {visibleBuffFields.map((field) => (
          <label key={field.key} className="buffInputRow">
            <span>{field.label}</span>
            <input
              type="number"
              step={field.step ?? 1}
              value={buffs[field.key] ?? field.defaultValue ?? 0}
              onChange={(event) => onChangeBuff(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function PlayerStatusPanel({ playerStatus, onChangePlayerStatus }) {
  return (
    <section className="buffPanel">
      <h2>体力・元気</h2>

      <div className="buffGrid">
        {PLAYER_STATUS_FIELDS.map((field) => (
          <label key={field.key} className="buffInputRow">
            <span>{field.label}</span>
            <input
              type="number"
              value={playerStatus[field.key] ?? 0}
              onChange={(event) =>
                onChangePlayerStatus(field.key, event.target.value)
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function ExamInfoPanel({ gameState, selectedDeck, onChangeExamConfig }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const examConfig = normalizeExamConfig(
    gameState.examConfig ?? selectedDeck?.examConfig
  );

  const examTurnOrder = Array.isArray(gameState.examTurnOrder)
    ? gameState.examTurnOrder
    : [];

  const currentTurnIndex = Math.max(0, toNumber(gameState.turn, 1) - 1);
  const currentType = examTurnOrder[currentTurnIndex] ?? null;
  const currentMultiplier = currentType
    ? toNumber(examConfig.multipliers[currentType], 0)
    : 0;
  const extraTurns = toNumber(examConfig.extraTurns, 0);
  const extraTurnType = getMostExamCountType(examConfig);

  function updateCount(type, value) {
    onChangeExamConfig({
      ...examConfig,
      counts: {
        ...examConfig.counts,
        [type]: Math.max(1, toNumber(value, 1)),
      },
    });
  }

  function updateExtraTurns(value) {
    onChangeExamConfig({
      ...examConfig,
      extraTurns: Math.max(0, Math.floor(toNumber(value, 0))),
    });
  }

  function updateMultiplier(type, value) {
    onChangeExamConfig({
      ...examConfig,
      multipliers: {
        ...examConfig.multipliers,
        [type]: Math.max(0, toNumber(value, 0)),
      },
    });
  }

  return (
    <section className="examInfoPanel">
      <div className="examInfoHeader">
        <h2>審査情報</h2>

        <button
          type="button"
          className="miniButton"
          onClick={() => setIsEditorOpen((prev) => !prev)}
        >
          編集
        </button>
      </div>

      <div className="examCurrentInfo">
        <div>
          {gameState.turn}t目{" "}
          {currentType
            ? `${getExamTypeLabel(currentType)}:${currentMultiplier}%`
            : "未設定"}
        </div>

        {extraTurns > 0 && (
          <div className="examExtraTurnText">
            追加{extraTurns}t: {getExamTypeLabel(extraTurnType)}
          </div>
        )}
      </div>

      <div className="examTurnBar">
        {examTurnOrder.map((type, index) => (
          <span
            key={`${type}_${index}`}
            className={`examTurnBlock examTurnBlock-${type} ${index === currentTurnIndex ? "currentExamTurn" : ""
              }`}
            title={`${index + 1}t目 ${getExamTypeLabel(type)}:${examConfig.multipliers[type]
              }%`}
          />
        ))}
      </div>

      {isEditorOpen && (
        <div className="examEditor">
          <div className="examEditorRow">
            <span>ターン数</span>
            <strong>{getExamTotalTurnCount(examConfig)}</strong>
          </div>

          <div className="examEditorGrid">
            <span></span>
            {EXAM_TYPE_OPTIONS.map((type) => (
              <strong key={type.key}>{type.label}</strong>
            ))}

            <span>審査基準</span>
            {EXAM_TYPE_OPTIONS.map((type) => (
              <input
                key={`${type.key}_count`}
                type="number"
                min="1"
                value={examConfig.counts[type.key]}
                onChange={(event) => updateCount(type.key, event.target.value)}
              />
            ))}

            <span>倍率</span>
            {EXAM_TYPE_OPTIONS.map((type) => (
              <input
                key={`${type.key}_multiplier`}
                type="number"
                min="0"
                value={examConfig.multipliers[type.key]}
                onChange={(event) =>
                  updateMultiplier(type.key, event.target.value)
                }
              />
            ))}

            <span>ターン追加</span>
            <input
              className="examExtraTurnsInput"
              type="number"
              min="0"
              value={examConfig.extraTurns ?? 0}
              onChange={(event) => updateExtraTurns(event.target.value)}
            />
            <span className="examExtraTurnsNote">
              追加: {getExamTypeLabel(getMostExamCountType(examConfig))}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function UsageModal({ onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <section
        className="usageModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="usageModalTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="usageModalHeader">
          <h2 id="usageModalTitle">使用方法</h2>

          <button
            type="button"
            className="modalCloseButton"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="usageModalBody">
          <section>
            <h3>基本操作</h3>
            <ul>
              <li>カードをクリックして選択し、使用・移動・ドローなどのボタンで操作します。</li>
              <li>一人回し用の検証ツールです。細かい効果は必要に応じて手動で調整してください。</li>
            </ul>
          </section>

          <section>
            <h3>デッキ編集</h3>
            <ul>
              <li>デッキ一覧からデッキを編集できます。</li>
              <li>カードの種別、コスト、打点、バフ効果、使用後の行き先などを設定できます。</li>
            </ul>
          </section>

          <section>
            <h3>注意事項</h3>
            <ul>
              <li>PC環境での利用を想定しています。</li>
              <li>プランはセンスのみ実装しています。</li>
              <li>現状はバフを盛るセンスのみを想定しています。脚光軸には対応していません。</li>
              <li>Pドリンクの実装していません。適宜手動で調整してください。</li>
              <li>「天賦の才」は実装していません。<br />SSR枚数を数えて乱数ジェネレーターを使う等で対応してください。</li>
              <li>カード効果や最終スコア等、実際のゲーム内の挙動と異なる可能性があります。</li>
            </ul>
          </section>
        </div>

        <div className="usageModalFooter">
          <button
            type="button"
            className="primaryButton"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </section>
    </div>
  );
}

function ScoreTotalPanel({ scoreTotals }) {
  const total = toNumber(scoreTotals?.total, 0);
  const vo = toNumber(scoreTotals?.vo, 0);
  const da = toNumber(scoreTotals?.da, 0);
  const vi = toNumber(scoreTotals?.vi, 0);

  return (
    <section className="scoreTotalPanel">
      <h2>現在のスコア</h2>

      <div className="scoreTotalValue">{total}点</div>

      <div className="scoreTypeTotals">
        <span>Vo: {vo}</span>
        <span>Da: {da}</span>
        <span>Vi: {vi}</span>
      </div>
    </section>
  );
}

function SpecialEffectPanel({ gameState }) {
  const rows = getSpecialEffectRows(gameState);

  return (
    <section className="specialEffectPanel">
      <h2>設置効果</h2>

      {rows.length === 0 ? (
        <p className="emptySpecialEffectText">なし</p>
      ) : (
        <div className="specialEffectTable">
          {rows.map((row) => (
            <div key={row.id} className="specialEffectRow">
              <span className="specialEffectName">{row.name}</span>
              <span className="specialEffectValue">{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [gameState, setGameState] = useState(createInitialGameState);
  const [history, setHistory] = useState([]);
  const [screen, setScreen] = useState("play");
  const [decks, setDecks] = useState(loadDecksFromStorage);
  const [selectedDeckId, setSelectedDeckId] = useState(loadSelectedDeckIdFromStorage);
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  const selectedDeck = useMemo(() => {
    return decks.find((deck) => deck.id === selectedDeckId) ?? decks[0] ?? null;
  }, [decks, selectedDeckId]);

  useEffect(() => {
    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    if (selectedDeck?.id) {
      localStorage.setItem(SELECTED_DECK_STORAGE_KEY, selectedDeck.id);
    } else {
      localStorage.removeItem(SELECTED_DECK_STORAGE_KEY);
    }
  }, [selectedDeck?.id]);

  function openDeckList() {
    setScreen("deckList");
  }

  function backToPlay() {
    setScreen("play");
  }

  function openDeckList() {
    setScreen("deckList");
  }

  function backToPlay() {
    setScreen("play");
  }

  function backToDeckList() {
    setScreen("deckList");
    setEditingDeckId(null);
  }

  function createNewDeck() {
    const newDeck = createEmptyDeck(`新規デッキ${decks.length + 1}`);

    setDecks((prev) => [newDeck, ...prev]);
    setSelectedDeckId(newDeck.id);
    setEditingDeckId(newDeck.id);
    setScreen("deckEdit");
  }

  function exportDeck(deck) {
    const normalizedDeck = normalizeDeck(deck);

    const exportData = {
      app: "gakumas-solo-simulator",
      version: 1,
      exportedAt: new Date().toISOString(),
      deck: normalizedDeck,
    };

    const text = JSON.stringify(exportData, null, 2);

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          window.alert(`「${deck.name}」のデッキデータをコピーしました。`);
        })
        .catch(() => {
          window.prompt("コピーに失敗しました。以下をコピーしてください。", text);
        });

      return;
    }

    window.prompt("以下をコピーしてください。", text);
  }

  function editDeck(deckId) {
    setEditingDeckId(deckId);
    setScreen("deckEdit");
  }

  function addSpecialCardToEditingDeck(template) {
    const newCard = createDeckCardFromTemplate(template);

    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== editingDeckId) return deck;

        return {
          ...deck,
          cards: [...deck.cards, newCard],
        };
      })
    );
  }

  function updateSelectedDeckExamConfig(nextExamConfig) {
    const normalizedExamConfig = normalizeExamConfig(nextExamConfig);
    const nextExamTurnOrder = generateExamTurnOrder(normalizedExamConfig);

    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== selectedDeckId) return deck;

        return {
          ...deck,
          examConfig: normalizedExamConfig,
        };
      })
    );

    setGameState((prev) => ({
      ...prev,
      examConfig: normalizedExamConfig,
      examTurnOrder: nextExamTurnOrder,
    }));
  }

  function updateEditingDeck(nextDeck) {
    setDecks((prev) =>
      prev.map((deck) => (deck.id === nextDeck.id ? nextDeck : deck))
    );
  }

  function addCardToEditingDeck() {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== editingDeckId) return deck;

        return {
          ...deck,
          cards: [...deck.cards, createEmptyDeckCard()],
        };
      })
    );
  }

  function updateCardInEditingDeck(cardId, nextCard) {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== editingDeckId) return deck;

        return {
          ...deck,
          cards: deck.cards.map((card) =>
            card.id === cardId ? nextCard : card
          ),
        };
      })
    );
  }

  function deleteCardFromEditingDeck(cardId) {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== editingDeckId) return deck;

        return {
          ...deck,
          cards: deck.cards.filter((card) => card.id !== cardId),
        };
      })
    );
  }

  function finishDeckEdit() {
    setScreen("deckList");
    setEditingDeckId(null);
  }

  function deleteDeck(deckId) {
    const targetDeck = decks.find((deck) => deck.id === deckId);

    if (!targetDeck) return;

    const isOk = window.confirm(`「${targetDeck.name}」を削除しますか？`);

    if (!isOk) return;

    const nextDecks = decks.filter((deck) => deck.id !== deckId);

    setDecks(nextDecks);

    if (selectedDeckId === deckId) {
      setSelectedDeckId(nextDecks[0]?.id ?? "");
    }

    if (editingDeckId === deckId) {
      setEditingDeckId(null);
      setScreen("deckList");
    }
  }

  const selectedCard = useMemo(() => {
    const allCards = [
      ...gameState.deck,
      ...gameState.hand,
      ...gameState.used,
      ...gameState.trash,
      ...gameState.removed,
    ];

    return allCards.find((card) => card.id === gameState.selectedCardId) ?? null;
  }, [gameState]);

  const selectedCardCostPreview = useMemo(() => {
    if (!selectedCard) return null;

    return calculateCostPayment(
      gameState.buffs,
      gameState.playerStatus,
      selectedCard.costs
    );
  }, [selectedCard, gameState.buffs, gameState.playerStatus]);

  const selectedCardScore = useMemo(() => {
    if (!selectedCard) return null;

    const buffsForScore = selectedCardCostPreview?.canPay
      ? selectedCardCostPreview.nextBuffs
      : gameState.buffs;

    return calculateCardScore(selectedCard, buffsForScore, gameState.plan);
  }, [selectedCard, selectedCardCostPreview, gameState.buffs, gameState.plan]);

  const selectedCardFinalScore = useMemo(() => {
    if (!selectedCardScore) return null;

    return applyCurrentExamMultiplier(selectedCardScore.score, gameState);
  }, [selectedCardScore, gameState]);

  function updateGameState(nextGameState) {
    setHistory((prev) => [...prev, gameState]);
    setGameState(nextGameState);
  }

  function addLog(state, message) {
    return {
      ...state,
      logs: [`ターン${state.turn}: ${message}`, ...state.logs],
    };
  }

  function startGame() {
    if (!selectedDeck) {
      setGameState((prev) =>
        addLog(prev, "使用するデッキがありません。デッキを作成してください。")
      );
      return;
    }

    if (getDeckCardCount(selectedDeck) <= 0) {
      setGameState((prev) =>
        addLog(prev, `「${selectedDeck.name}」にはカードが登録されていません。`)
      );
      return;
    }

    const builtDeck = buildPlayDeckFromRegisteredDeck(selectedDeck);

    const initialHand = builtDeck.filter((card) => card.startInHand);
    const deck = builtDeck.filter((card) => !card.startInHand);

    const startInHandLog =
      initialHand.length > 0
        ? ` 開始時手札: ${initialHand.map((card) => card.name).join("、")}`
        : "";

    const maxHp = Math.max(1, toNumber(selectedDeck.maxHp, 35));

    const examConfig = normalizeExamConfig(selectedDeck.examConfig);
    const examTurnOrder = generateExamTurnOrder(examConfig);

    const nextState = {
      ...createInitialGameState(
        maxHp,
        examConfig,
        examTurnOrder,
        selectedDeck.initialBuffs
      ),
      plan: selectedDeck.plan,
      deck,
      hand: initialHand,
      selectedCardId: initialHand[0]?.id ?? null,
      logs: [
        `ゲーム開始。「${selectedDeck.name}」から山札${deck.length}枚、開始時手札${initialHand.length}枚を作成しました。体力上限${maxHp}。`,
      ],
    };

    setHistory([]);
    setGameState(nextState);
  }

  function endGame() {
    const isOk = window.confirm("ゲームを終了しますか？");

    if (!isOk) return;

    setHistory([]);
    setGameState({
      ...createInitialGameState(),
      logs: ["ゲーム終了。盤面をリセットしました。"],
    });
  }

  function drawCard(count = 1) {
    if (gameState.deck.length === 0 && gameState.trash.length === 0) {
      const nextState = addLog(
        gameState,
        "山札と捨て札が空なのでドローできません。"
      );
      updateGameState(nextState);
      return;
    }

    const { drawnCards, nextDeck, nextTrash, recycledCount } =
      drawCardsWithTrashRecycle(gameState.deck, gameState.trash, count);

    if (drawnCards.length === 0) {
      const nextState = addLog(
        gameState,
        "ドローできるカードがありませんでした。"
      );
      updateGameState(nextState);
      return;
    }

    let recycleLogText = "";

    if (recycledCount > 0) {
      recycleLogText = ` 山札が空になったため、捨て札${recycledCount}枚を山札に戻しました。`;
    }

    const shortageLogText =
      drawnCards.length < count
        ? ` 指定枚数${count}枚に対して、${drawnCards.length}枚だけドローしました。`
        : "";

    let nextState = {
      ...gameState,
      deck: nextDeck,
      trash: nextTrash,
      hand: [...gameState.hand, ...drawnCards],
      selectedCardId:
        drawnCards[drawnCards.length - 1]?.id ?? gameState.selectedCardId,
    };

    nextState = addLog(
      nextState,
      `${drawnCards
        .map((card) => card.name)
        .join("、")}を山札からランダムにドローしました。${recycleLogText}${shortageLogText}`
    );

    updateGameState(nextState);
  }

  function selectCard(cardId) {
    setGameState((prev) => ({
      ...prev,
      selectedCardId: cardId,
    }));
  }

  function changePlan(nextPlan) {
    setGameState((prev) => {
      const visibleKeys = getVisibleBuffFields(nextPlan).map((field) => field.key);

      const nextBuffs = { ...prev.buffs };

      BUFF_FIELDS.forEach((field) => {
        if (!visibleKeys.includes(field.key)) {
          nextBuffs[field.key] = field.defaultValue ?? 0;
        }
      });

      return {
        ...prev,
        plan: nextPlan,
        buffs: nextBuffs,
      };
    });
  }

  function updateBuffValue(buffKey, value) {
    const numericValue = Number(value);

    setGameState((prev) => ({
      ...prev,
      buffs: {
        ...prev.buffs,
        [buffKey]: Number.isFinite(numericValue) ? numericValue : 0,
      },
    }));
  }

  function updatePlayerStatusValue(statusKey, value) {
    const numericValue = Number(value);

    setGameState((prev) => ({
      ...prev,
      playerStatus: {
        ...prev.playerStatus,
        [statusKey]: Number.isFinite(numericValue) ? numericValue : 0,
      },
    }));
  }

  function findSelectedZone(state) {
    const zoneNames = ["deck", "hand", "used", "trash", "removed"];

    return zoneNames.find((zoneName) =>
      state[zoneName].some((card) => card.id === state.selectedCardId)
    );
  }

  function moveSelectedCard(destinationZone) {
    if (!gameState.selectedCardId) return;

    const sourceZone = findSelectedZone(gameState);
    if (!sourceZone) return;

    if (sourceZone === destinationZone) {
      const nextState = addLog(gameState, "同じゾーンには移動できません。");
      updateGameState(nextState);
      return;
    }

    const movingCard = gameState[sourceZone].find(
      (card) => card.id === gameState.selectedCardId
    );

    if (!movingCard) return;

    let nextState = {
      ...gameState,
      [sourceZone]: gameState[sourceZone].filter(
        (card) => card.id !== gameState.selectedCardId
      ),
      [destinationZone]: [...gameState[destinationZone], movingCard],
      selectedCardId: movingCard.id,
    };

    nextState = addLog(
      nextState,
      `${movingCard.name}を${getZoneLabel(sourceZone)}から${getZoneLabel(
        destinationZone
      )}へ移動しました。`
    );

    updateGameState(nextState);
  }

  function addSleepinessToDeck() {
    const sleepinessCard = createSleepinessCard();
    const nextDeck = insertCardAtRandomPosition(gameState.deck, sleepinessCard);

    let nextState = {
      ...gameState,
      deck: nextDeck,

      // 山札のランダム位置に入るので、選択中カードは変えない
      selectedCardId: gameState.selectedCardId,
    };

    nextState = addLog(
      nextState,
      "眠気を山札のランダムな位置に追加しました。"
    );

    updateGameState(nextState);
  }

  function useSelectedCard() {
    if (!selectedCard) return;

    const sourceZone = findSelectedZone(gameState);
    if (!sourceZone) return;

    const movingCard = gameState[sourceZone].find(
      (card) => card.id === gameState.selectedCardId
    );

    if (!movingCard) return;

    const costPaymentResult = calculateCostPayment(
      gameState.buffs,
      gameState.playerStatus,
      movingCard.costs
    );

    if (!costPaymentResult.canPay) {
      const nextState = addLog(
        gameState,
        `${movingCard.name}を使用できません。${formatCostPaymentResult(
          costPaymentResult
        )}`
      );

      updateGameState(nextState);
      return;
    }

    const destinationZone = movingCard.afterUseDestination ?? "trash";

    const nationalIdolEffectInfo = getNationalIdolEffectInfo(
      gameState,
      movingCard
    );

    const skillEffectRepeatCount = nationalIdolEffectInfo.repeatCount;

    const nationalIdolSummaryText = nationalIdolEffectInfo.shouldApply
      ? `国民：${movingCard.name}の効果を2回発動（国民ストック${nationalIdolEffectInfo.stockCount}→${nationalIdolEffectInfo.nextStockCount}）`
      : "";

    const costAdjustedBuffDecayGrace = {
      ...(gameState.buffDecayGrace ?? {}),
    };

    ["goodCondition", "excellentCondition", "hpCostReduction"].forEach((key) => {
      if (toNumber(costPaymentResult.nextBuffs?.[key], 0) <= 0) {
        costAdjustedBuffDecayGrace[key] = 0;
      }
    });

    const wishPowerTriggerResult = resolveWishPowerActiveCardTrigger(
      gameState,
      movingCard,
      costPaymentResult.nextBuffs,
      costPaymentResult.nextPlayerStatus,
      costAdjustedBuffDecayGrace
    );

    const buffsForScore = wishPowerTriggerResult.nextBuffs;
    const playerStatusAfterUseTriggers =
      wishPowerTriggerResult.nextPlayerStatus;
    const buffDecayGraceAfterUseTriggers =
      wishPowerTriggerResult.nextBuffDecayGrace;

    const wishPowerSummaryText =
      wishPowerTriggerResult.logs.length > 0
        ? `願いの力：${wishPowerTriggerResult.logs.join("、")}`
        : "";

    // 1. コスト支払い後の状態で、カード本体と設置済み特殊効果の打点を計算する
    const immediateScoreCard = createCardForImmediateScore(movingCard);

    const scoreResult = calculateCardScore(
      immediateScoreCard,
      buffsForScore,
      gameState.plan
    );

    const supremeEntertainmentResult =
      calculateSupremeEntertainmentAdditionalAttack(
        gameState,
        movingCard,
        buffsForScore
      );

    const summerNightMemoryTrigger = resolveSummerNightMemoryTriggers(
      gameState,
      movingCard,
      buffsForScore
    );

    const mainScore =
      Number(scoreResult?.score ?? 0) * skillEffectRepeatCount;
    const supremeEntertainmentScore = Number(
      supremeEntertainmentResult?.totalScore ?? 0
    );
    const summerNightScore = Number(
      summerNightMemoryTrigger.result?.totalScore ?? 0
    );

    const totalScore =
      mainScore + supremeEntertainmentScore + summerNightScore;

    const currentExamText = formatCurrentExamMultiplier(gameState);
    const currentExamType = getCurrentExamType(gameState);
    const finalScore = applyCurrentExamMultiplier(totalScore, gameState);

    const nextScoreTotals =
      finalScore > 0
        ? addScoreToTotals(gameState.scoreTotals, finalScore, currentExamType)
        : gameState.scoreTotals;

    const reservedAttackRecords = createReservedAttackRecords(
      movingCard,
      gameState.turn,
      gameState.examTurnOrder,
      skillEffectRepeatCount
    );

    const damageReservationSummaryText =
      formatReservedAttackLog(reservedAttackRecords);

    // コスト支払いでターン減少バフが0になった場合、
    // そのバフに残っていた「減少スキップ権利」は消す
    ["goodCondition", "excellentCondition", "hpCostReduction"].forEach((key) => {
      if (toNumber(costPaymentResult.nextBuffs?.[key], 0) <= 0) {
        costAdjustedBuffDecayGrace[key] = 0;
      }
    });

    const buffEffectResult = applyBuffEffectsRepeatedly(
      buffsForScore,
      playerStatusAfterUseTriggers,
      movingCard.buffEffects,
      skillEffectRepeatCount,
      buffDecayGraceAfterUseTriggers
    );

    // 3. 特殊効果のスタックを更新する
    const currentSupremeEntertainmentStacks =
      getSupremeEntertainmentStacks(gameState);

    const currentTenshinranmanStacks =
      getTenshinranmanStacks(gameState);

    const currentWishPowerStacks =
      getWishPowerStacks(gameState);

    const nextSpecialEffects = {
      ...(gameState.specialEffects ?? {}),
      supremeEntertainmentStacks: currentSupremeEntertainmentStacks,
      summerNightMemoryStacks: summerNightMemoryTrigger.nextStacks,
      tenshinranmanStacks: currentTenshinranmanStacks,
      wishPowerStacks: currentWishPowerStacks,

      nationalIdolStockCount: nationalIdolEffectInfo.nextStockCount,
    };

    let specialEffectLogText = "";

    if (isSupremeEntertainmentCard(movingCard)) {
      const basePower = getSupremeEntertainmentBasePower(movingCard);

      const supremeEntertainmentAddedStacks = Array.from(
        { length: skillEffectRepeatCount },
        () => ({
          id: createId("supremeEntertainment"),
          name: movingCard.name,
          basePower,
        })
      );

      nextSpecialEffects.supremeEntertainmentStacks = [
        ...currentSupremeEntertainmentStacks,
        ...supremeEntertainmentAddedStacks,
      ];

      specialEffectLogText =
        ` / 特殊効果: ${movingCard.name}設置。A札使用時、+${basePower}の追加攻撃。${skillEffectRepeatCount > 1 ? `（${skillEffectRepeatCount}回分）` : ""
        }`;
    } else if (isSummerNightMemoryCard(movingCard)) {
      const basePower = getSummerNightMemoryBasePower(movingCard);
      const interval = getSummerNightMemoryInterval(movingCard);

      const summerNightAddedStacks = Array.from(
        { length: skillEffectRepeatCount },
        () => ({
          id: createId("summerNightMemory"),
          name: movingCard.name,
          basePower,
          interval,
          usedCount: 0,
        })
      );

      nextSpecialEffects.summerNightMemoryStacks = [
        ...summerNightMemoryTrigger.nextStacks,
        ...summerNightAddedStacks,
      ];

      specialEffectLogText =
        ` / 特殊効果: ${movingCard.name}設置。スキルカード${interval}回使用ごとに+${basePower}の追加攻撃。${skillEffectRepeatCount > 1 ? `（${skillEffectRepeatCount}回分）` : ""
        }`;
    } else if (isTenshinranmanCard(movingCard)) {
      const tenshinranmanAddedStacks = Array.from(
        { length: skillEffectRepeatCount },
        () => ({
          id: createId("tenshinranman"),
          name: movingCard.name,
          condition: {
            min: toNumber(movingCard?.specialEffect?.condition?.min, 3),
          },
          amount: toNumber(movingCard?.specialEffect?.buffEffect?.amount, 2),
        })
      );

      nextSpecialEffects.tenshinranmanStacks = [
        ...currentTenshinranmanStacks,
        ...tenshinranmanAddedStacks,
      ];

      specialEffectLogText =
        ` / 特殊効果: ${movingCard.name}設置。ターン終了時、集中3以上なら集中+2。${skillEffectRepeatCount > 1 ? `（${skillEffectRepeatCount}回分）` : ""
        }`;
    } else if (isWishPowerCard(movingCard)) {
      const amount = getWishPowerBuffAmount(movingCard);

      const wishPowerAddedStacks = Array.from(
        { length: skillEffectRepeatCount },
        () => ({
          id: createId("wishPower"),
          name: movingCard.name,
          amount,
        })
      );

      nextSpecialEffects.wishPowerStacks = [
        ...currentWishPowerStacks,
        ...wishPowerAddedStacks,
      ];

      specialEffectLogText =
        ` / 特殊効果: ${movingCard.name}設置。A札使用時、集中+${amount}。${skillEffectRepeatCount > 1 ? `（${skillEffectRepeatCount}回分）` : ""
        }`;
    } else if (isNationalIdolCard(movingCard)) {
      nextSpecialEffects.nationalIdolStockCount =
        toNumber(nextSpecialEffects.nationalIdolStockCount, 0) +
        skillEffectRepeatCount;

      specialEffectLogText =
        ` / 特殊効果: ${movingCard.name}。国民ストック+${skillEffectRepeatCount}。`;
    } else {
      const specialEffectLog = getSpecialEffectUseLog(movingCard);

      specialEffectLogText = specialEffectLog
        ? ` / 特殊効果: ${specialEffectLog}`
        : "";
    }


    // 4. 使用カードを移動する。同じゾーンへ戻るカードでも重複IDにならないようにする
    const nextSourceCards = gameState[sourceZone].filter(
      (card) => card.id !== gameState.selectedCardId
    );

    const destinationCards =
      sourceZone === destinationZone
        ? nextSourceCards
        : gameState[destinationZone];

    const nextZoneUpdates = {
      [sourceZone]: nextSourceCards,
      [destinationZone]: [...destinationCards, movingCard],
    };

    let nextState = {
      ...gameState,
      buffs: buffEffectResult.nextBuffs,
      buffDecayGrace: buffEffectResult.nextBuffDecayGrace,
      playerStatus: buffEffectResult.nextPlayerStatus,
      scoreTotals: nextScoreTotals,
      reservedAttacks: [
        ...(gameState.reservedAttacks ?? []),
        ...reservedAttackRecords,
      ],
      specialEffects: nextSpecialEffects,
      ...nextZoneUpdates,
      selectedCardId: movingCard.id,
    };

    // 5. 夏夜の使用時効果は、使用カードの移動後の状態に対して処理する
    let summerNightSleepinessLogText = "";

    if (isSummerNightMemoryCard(movingCard)) {
      const removalLogs = [];

      for (let i = 0; i < skillEffectRepeatCount; i += 1) {
        const removalResult = removeRandomSleepinessFromDeckOrTrash(nextState);

        nextState = removalResult.nextState;

        removalLogs.push(
          removalResult.removedCard
            ? `夏夜効果${skillEffectRepeatCount > 1 ? `${i + 1}回目` : ""}: ${getZoneLabel(
              removalResult.sourceZone
            )}の眠気1枚を除外しました。`
            : `夏夜効果${skillEffectRepeatCount > 1 ? `${i + 1}回目` : ""}: 山札・捨て札に眠気がなかったため、眠気除外は行いませんでした。`
        );
      }

      summerNightSleepinessLogText = ` / ${removalLogs.join(" / ")}`;
    }

    let generatedSleepinessSummaryText = "";

    if (movingCard.generatesSleepiness) {
      for (let i = 0; i < skillEffectRepeatCount; i += 1) {
        const sleepinessCard = createSleepinessCard();

        nextState = {
          ...nextState,
          deck: insertCardAtRandomPosition(nextState.deck, sleepinessCard),
        };
      }

      generatedSleepinessSummaryText =
        `眠気生成：山札のランダムな位置に眠気を${skillEffectRepeatCount}枚追加`;
    }

    // 6. ログを作る
    const scoreParts = [];

    if (mainScore > 0) {
      scoreParts.push(`本体${mainScore}`);
    }

    if (supremeEntertainmentScore > 0) {
      scoreParts.push(`エンタメ${supremeEntertainmentScore}`);
    }

    if (summerNightScore > 0) {
      scoreParts.push(`夏夜${summerNightScore}`);
    }

    const scoreSummaryText =
      totalScore > 0
        ? `打点：${finalScore}点（${scoreParts.join(
          " + "
        )} = ${totalScore} × ${currentExamText}）`
        : "打点：0点";

    const costSummaryText =
      costPaymentResult.costLogs.length > 0
        ? `コスト：${costPaymentResult.costLogs.join("、")}`
        : "コスト：なし";

    const buffSummaryText =
      buffEffectResult.effectLogs.length > 0
        ? `バフ効果：${buffEffectResult.effectLogs.join("、")}`
        : "";

    const supremeEntertainmentSummaryText = supremeEntertainmentResult
      ? `エンタメ：${supremeEntertainmentResult.stackResults
        .map((result) => `${result.name} ${result.score}点`)
        .join("、")}`
      : "";

    const summerNightSummaryText = summerNightMemoryTrigger.result
      ? `夏夜：${summerNightMemoryTrigger.result.triggerResults
        .map((result) => `${result.name} ${result.score}点`)
        .join("、")}`
      : "";

    const specialSummaryText = specialEffectLogText
      ? specialEffectLogText.replace(/^ \/ 特殊効果: /, "特殊効果：")
      : "";

    const summerNightSleepinessSummaryText = summerNightSleepinessLogText
      ? summerNightSleepinessLogText.replace(/^ \/ /, "")
      : "";

    const logLines = [
      `${movingCard.name}を使用 → ${getZoneLabel(destinationZone)}`,
      costSummaryText,
      nationalIdolSummaryText,
      wishPowerSummaryText,
      scoreSummaryText,
      damageReservationSummaryText,
      supremeEntertainmentSummaryText,
      summerNightSummaryText,
      buffSummaryText,
      specialSummaryText,
      summerNightSleepinessSummaryText,
      generatedSleepinessSummaryText,
    ].filter(Boolean);

    nextState = addLog(nextState, logLines.join("\n"));

    updateGameState(nextState);
  }

  function passTurn() {
    const beforeHp = toNumber(gameState.playerStatus.hp, 0);
    const maxHp = toNumber(gameState.playerStatus.maxHp, 35);
    const afterHp = Math.min(maxHp, beforeHp + 2);

    let workingState = {
      ...gameState,
      playerStatus: {
        ...gameState.playerStatus,
        hp: afterHp,
      },
    };

    // 1. 現在ターン終了時に発動する予約打点を処理
    const turnEndReservedResult = resolveReservedAttacksAtTiming(
      workingState,
      "turnEnd"
    );

    workingState = turnEndReservedResult.nextState;

    // 2. ターン終了時のバフ減少を処理
    const buffDecayResult = applyTurnEndBuffDecay(workingState);

    let nextBuffs = buffDecayResult.nextBuffs;
    let nextBuffDecayGrace = buffDecayResult.nextBuffDecayGrace;

    // 3. ターン終了時の特殊効果を処理
    // 現状の天真爛漫は集中+2なので buffDecayGrace には影響しない
    const tenshinranmanResult = resolveTenshinranmanTurnEnd({
      ...workingState,
      buffs: nextBuffs,
      buffDecayGrace: nextBuffDecayGrace,
    });

    nextBuffs = tenshinranmanResult.nextBuffs;

    const discardedHandCards = workingState.hand;
    const discardedHandText =
      discardedHandCards.length > 0
        ? `手札${discardedHandCards.length}枚を捨て札へ送りました。`
        : "手札はありません。";

    let logText = `パスしました。体力${beforeHp}→${afterHp}。次のターンへ進みました。`;

    if (turnEndReservedResult.logs.length > 0) {
      logText += `\n${turnEndReservedResult.logs.join("\n")}`;
    }

    if (workingState.plan === "sense") {
      logText += `\n好調${workingState.buffs.goodCondition ?? 0}→${nextBuffs.goodCondition
        } / 絶好調${workingState.buffs.excellentCondition ?? 0}→${nextBuffs.excellentCondition
        }`;
    }

    if (toNumber(workingState.buffs.hpCostReduction, 0) > 0) {
      logText += ` / 消費体力減少${workingState.buffs.hpCostReduction ?? 0
        }→${nextBuffs.hpCostReduction ?? 0}`;
    }

    if (tenshinranmanResult.logs.length > 0) {
      logText += `\n${tenshinranmanResult.logs.join("\n")}`;
    }

    logText += `\n${discardedHandText}`;

    // 4. 次ターンへ進める
    let nextState = {
      ...workingState,
      turn: workingState.turn + 1,
      hand: [],
      trash: [...workingState.trash, ...discardedHandCards],
      selectedCardId: null,
      buffs: nextBuffs,
      buffDecayGrace: nextBuffDecayGrace,
    };

    // 5. 次ターン開始時に発動する予約打点を処理
    const turnStartReservedResult = resolveReservedAttacksAtTiming(
      nextState,
      "turnStart"
    );

    nextState = turnStartReservedResult.nextState;

    if (turnStartReservedResult.logs.length > 0) {
      logText += `\n${turnStartReservedResult.logs.join("\n")}`;
    }

    nextState = addLog(nextState, logText);

    updateGameState(nextState);
  }

  function endTurn() {
    let workingState = gameState;

    // 1. 現在ターン終了時に発動する予約打点を処理
    const turnEndReservedResult = resolveReservedAttacksAtTiming(
      workingState,
      "turnEnd"
    );

    workingState = turnEndReservedResult.nextState;

    // 2. ターン終了時のバフ減少を処理
    // applyTurnEndBuffDecay は nextBuffs だけでなく、
    // nextBuffDecayGrace も返す形に変更済みの想定
    const buffDecayResult = applyTurnEndBuffDecay(workingState);

    let nextBuffs = buffDecayResult.nextBuffs;
    let nextBuffDecayGrace = buffDecayResult.nextBuffDecayGrace;

    // 3. ターン終了時の特殊効果を処理
    // 現状の天真爛漫は集中+2なので buffDecayGrace には影響しない
    const tenshinranmanResult = resolveTenshinranmanTurnEnd({
      ...workingState,
      buffs: nextBuffs,
      buffDecayGrace: nextBuffDecayGrace,
    });

    nextBuffs = tenshinranmanResult.nextBuffs;

    const discardedHandCards = workingState.hand;
    const discardedHandText =
      discardedHandCards.length > 0
        ? `手札${discardedHandCards.length}枚を捨て札へ送りました。`
        : "手札はありません。";

    let logText = "ターン終了。次のターンへ進みました。";

    if (turnEndReservedResult.logs.length > 0) {
      logText += `\n${turnEndReservedResult.logs.join("\n")}`;
    }

    if (workingState.plan === "sense") {
      logText += `\n好調${workingState.buffs.goodCondition ?? 0}→${nextBuffs.goodCondition
        } / 絶好調${workingState.buffs.excellentCondition ?? 0}→${nextBuffs.excellentCondition
        }`;
    }

    if (toNumber(workingState.buffs.hpCostReduction, 0) > 0) {
      logText += ` / 消費体力減少${workingState.buffs.hpCostReduction ?? 0
        }→${nextBuffs.hpCostReduction ?? 0}`;
    }

    if (tenshinranmanResult.logs.length > 0) {
      logText += `\n${tenshinranmanResult.logs.join("\n")}`;
    }

    logText += `\n${discardedHandText}`;

    // 4. 次ターンへ進める
    let nextState = {
      ...workingState,
      turn: workingState.turn + 1,
      hand: [],
      trash: [...workingState.trash, ...discardedHandCards],
      selectedCardId: null,
      buffs: nextBuffs,
      buffDecayGrace: nextBuffDecayGrace,
    };

    // 5. 次ターン開始時に発動する予約打点を処理
    const turnStartReservedResult = resolveReservedAttacksAtTiming(
      nextState,
      "turnStart"
    );

    nextState = turnStartReservedResult.nextState;

    if (turnStartReservedResult.logs.length > 0) {
      logText += `\n${turnStartReservedResult.logs.join("\n")}`;
    }

    nextState = addLog(nextState, logText);

    updateGameState(nextState);
  }

  function undo() {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    const nextHistory = history.slice(0, -1);

    setGameState(previousState);
    setHistory(nextHistory);
  }

  const editingDeck =
    decks.find((deck) => deck.id === editingDeckId) ?? null;

  if (screen === "deckList") {
    return (
      <DeckListPage
        decks={decks}
        onCreateDeck={createNewDeck}
        onEditDeck={editDeck}
        onExportDeck={exportDeck}
        onDeleteDeck={deleteDeck}
        onBackToPlay={backToPlay}
      />
    );
  }

  if (screen === "deckEdit") {
    return (
      <DeckEditPage
        deck={editingDeck}
        onChangeDeck={updateEditingDeck}
        onAddCard={addCardToEditingDeck}
        onAddSpecialCard={addSpecialCardToEditingDeck}
        onUpdateCard={updateCardInEditingDeck}
        onDeleteCard={deleteCardFromEditingDeck}
        onDone={finishDeckEdit}
        onBackToList={backToDeckList}
      />
    );
  }

  return (
    <main className="app">
      <header className="appHeader deckHeader">
        <div>
          <h1>センス 一人回し</h1>
        </div>

        <div className="headerButtonGroup">
          <a
            className="secondaryButton headerLinkButton"
            href={X_TWITTER_URL}
            target="_blank"
            rel="noreferrer"
          >
            X(Twitter)
          </a>

          <button
            type="button"
            className="secondaryButton"
            onClick={() => setIsUsageModalOpen(true)}
          >
            使用方法
          </button>

          <button
            type="button"
            className="secondaryButton"
            onClick={openDeckList}
          >
            デッキ一覧
          </button>
        </div>
      </header>

      <section className="topPanel">
        <div>
          <strong>使用デッキ:</strong>{" "}
          <select
            className="deckSelect"
            value={selectedDeck?.id ?? ""}
            onChange={(event) => setSelectedDeckId(event.target.value)}
          >
            {decks.length === 0 ? (
              <option value="">デッキなし</option>
            ) : (
              decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {truncateText(deck.name || "名称未設定デッキ", 7)} /{" "}
                  {getPlanLabel(deck.plan)} / {getDeckCardCount(deck)}枚
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <strong>現在ターン:</strong> {gameState.turn}
        </div>
        <div>
          <strong>プラン:</strong>{" "}
          <select
            value={gameState.plan}
            onChange={(event) => changePlan(event.target.value)}
          >
            {PLAN_OPTIONS.map((plan) => (
              <option key={plan.key} value={plan.key}>
                {plan.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <strong>体力・元気:</strong> {formatPlayerStatus(gameState.playerStatus)}
        </div>
        <div title={selectedCard ? selectedCard.name : "なし"}>
          <strong>選択中:</strong>{" "}
          {selectedCard ? truncateText(selectedCard.name, 7) : "なし"}
        </div>
      </section>

      <section className="controls">
        <button onClick={startGame}>ゲーム開始</button>
        <button onClick={endGame}>ゲーム終了</button>
        <button onClick={() => drawCard(1)}>1枚ドロー</button>
        <button onClick={() => drawCard(3)}>3枚ドロー</button>
        <button onClick={useSelectedCard} disabled={!selectedCard}>
          使用する
        </button>
        <button onClick={() => moveSelectedCard("hand")} disabled={!selectedCard}>
          手札へ
        </button>
        <button onClick={() => moveSelectedCard("trash")} disabled={!selectedCard}>
          捨て札へ
        </button>
        <button onClick={() => moveSelectedCard("removed")} disabled={!selectedCard}>
          除外へ
        </button>
        <button onClick={addSleepinessToDeck}>
          眠気追加
        </button>
        <button onClick={passTurn}>パス</button>
        <button onClick={endTurn}>ターン終了</button>
        <button onClick={undo} disabled={history.length === 0}>
          Undo
        </button>
      </section>

      <section className="mainLayout">
        <aside className="leftPanel">
          <ScoreTotalPanel scoreTotals={gameState.scoreTotals} />
          <section className="scoreSummaryPanel">
            <h2>簡易打点</h2>

            {selectedCard ? (
              selectedCard.type === "active" ? (
                <>
                  <p>
                    <strong>{selectedCard.name}</strong>
                  </p>

                  <p className="scoreSummaryValue">
                    {selectedCardFinalScore ?? 0}点
                  </p>

                  {selectedCardScore && (
                    <p className="smallNote">
                      審査前: {selectedCardScore.score}点 / {formatCurrentExamMultiplier(gameState)}
                    </p>
                  )}

                  <p>{formatScoreCalculation(selectedCardScore)}</p>

                  {selectedCardScore?.attackResults?.length > 0 && (
                    <details className="scoreDetailBox">
                      <summary>計算詳細</summary>

                      {selectedCardScore.attackResults.map((attackResult) => (
                        <p key={`${selectedCard.id}_${attackResult.attackIndex}`}>
                          {formatAttackCalculation(attackResult)}
                        </p>
                      ))}
                    </details>
                  )}
                </>
              ) : (
                <p>打点なし</p>
              )
            ) : (
              <p>カードが選択されていません。</p>
            )}
          </section>

          <section className="logPanel">
            <details open>
              <summary>操作ログ</summary>

              <div className="logs">
                {gameState.logs.map((log, index) => (
                  <p key={`${log}_${index}`}>{log}</p>
                ))}
              </div>
            </details>
          </section>
        </aside>

        <div className="zones">
          <Zone
            title="手札"
            cards={gameState.hand}
            selectedCardId={gameState.selectedCardId}
            onSelectCard={selectCard}
          />
          <Zone
            title="山札"
            cards={gameState.deck}
            selectedCardId={gameState.selectedCardId}
            onSelectCard={selectCard}
          />
          <Zone
            title="捨て札"
            cards={gameState.trash}
            selectedCardId={gameState.selectedCardId}
            onSelectCard={selectCard}
          />
          <Zone
            title="除外"
            cards={gameState.removed}
            selectedCardId={gameState.selectedCardId}
            onSelectCard={selectCard}
          />
        </div>

        <aside className="rightPanel">
          <ExamInfoPanel
            gameState={gameState}
            selectedDeck={selectedDeck}
            onChangeExamConfig={updateSelectedDeckExamConfig}
          />

          <BuffPanel
            plan={gameState.plan}
            buffs={gameState.buffs}
            onChangeBuff={updateBuffValue}
          />

          <PlayerStatusPanel
            playerStatus={gameState.playerStatus}
            onChangePlayerStatus={updatePlayerStatusValue}
          />

          <SpecialEffectPanel gameState={gameState} />
        </aside>
      </section>

      {isUsageModalOpen && (
        <UsageModal onClose={() => setIsUsageModalOpen(false)} />
      )}
    </main>
  );
}

function getZoneLabel(zoneName) {
  const labels = {
    deck: "山札",
    hand: "手札",
    used: "使用済み",
    trash: "捨て札",
    removed: "除外",
  };

  return labels[zoneName] ?? zoneName;
}