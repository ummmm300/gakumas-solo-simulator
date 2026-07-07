export const DEFAULT_VISITOR_DECK_EXPORT =
{
    "app": "gakumas-solo-simulator",
    "version": 1,
    "exportedAt": "2026-07-07T17:41:15.020Z",
    "deck": {
        "id": "deck_515fd1d4-daed-4920-9bc6-541fa02a1f84",
        "name": "Cm星南",
        "plan": "sense",
        "maxHp": 35,
        "examConfig": {
            "counts": {
                "vo": 4,
                "da": 3,
                "vi": 5
            },
            "multipliers": {
                "vo": 2500,
                "da": 3800,
                "vi": 3700
            },
            "extraTurns": 2
        },
        "initialBuffs": {
            "goodCondition": 6,
            "concentration": 6,
            "excellentCondition": 0,
            "hpCostReduction": 0,
            "hpCostDiscount": 0,
            "scoreMultiplier": 1
        },
        "cards": [
            {
                "id": "deckCard_21758329-cb86-4ffe-ae09-007d0bf9042a",
                "name": "夢はまだ続く+",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_05e9b329-0a34-4bf3-87d3-ecbfc9885abd",
                        "target": "hp",
                        "amount": 4
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_12bcf1e7-e9da-4568-89a7-e42649bb9b66",
                        "basePower": 0,
                        "useSpecialBasePower": true,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "trash",
                "buffEffects": [
                    {
                        "id": "buff_033cde7a-3bfb-41e9-a0ae-e7598adaa28b",
                        "target": "goodCondition",
                        "amount": 3
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_31749429-60bb-483f-ac31-2514cf265fe9",
                "name": "道筋",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_c70e3e58-d3fb-4bc8-bb10-50f24e6dd154",
                        "target": "goodCondition",
                        "amount": 1
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_b50b3cd0-62ec-487d-901d-7ba6c68e2ee2",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_a6c8fa96-2cde-43c7-86b2-5aaa78141733",
                        "target": "concentration",
                        "amount": 7
                    },
                    {
                        "id": "buff_e8c65839-2c2e-4560-8a3d-f757c2ccbd19",
                        "target": "vitality",
                        "amount": 5
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_d6f360b6-ede4-4985-a4e7-74a678a70566",
                "name": "カスタムシュプ",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_c4e2896a-7c25-49d8-a7e7-a2de7b829bb5",
                        "target": "concentration",
                        "amount": 1
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_153f47df-1fb1-4033-bef6-5f1ca991a51f",
                        "basePower": 6,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "trash",
                "buffEffects": [
                    {
                        "id": "buff_9091e38a-7468-40ec-bb8f-845ee2ee62ba",
                        "target": "goodCondition",
                        "amount": 3
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_dfef2f7b-e1b0-4acc-97bd-d86932c1efd7",
                "name": "ファンサ2カス",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_f97b664e-70f2-4819-9506-a7b555daad74",
                        "target": "hp",
                        "amount": 2
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_b6bb9c38-4d2e-4d8a-8cfc-9c3cfbe33998",
                        "basePower": 16,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "trash",
                "buffEffects": [
                    {
                        "id": "buff_6db6893a-6342-4932-93f3-f0dfd7cb14cd",
                        "target": "goodCondition",
                        "amount": 2
                    },
                    {
                        "id": "buff_a5824db4-fce0-45bd-8a22-5d60f636026f",
                        "target": "excellentCondition",
                        "amount": 2
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "card_25f7c720-fff2-40d1-92f2-baf716167d73",
                "name": "至高のエンタメ+",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_cec42e92-718b-4be9-ac61-2a43029915a3",
                        "target": "concentration",
                        "amount": 2
                    }
                ],
                "attacks": [],
                "afterUseDestination": "removed",
                "buffEffects": [],
                "memo": "以降、A札使用時、パラメータ+5",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": 0,
                "specialEffectId": "supreme_entertainment",
                "automationLevel": "partial",
                "specialEffect": {
                    "type": "persistent_additional_attack",
                    "duration": "battle",
                    "stackable": true,
                    "trigger": "after_active_card_used",
                    "targetCardType": "active",
                    "excludesSelf": true,
                    "additionalAttack": {
                        "basePower": 5,
                        "useNormalScoreCalculation": true,
                        "affectedByConcentration": true,
                        "affectedByGoodCondition": true,
                        "affectedByExcellentCondition": true,
                        "affectedByScoreMultiplier": true
                    }
                },
                "templateId": "supreme_entertainment_plus"
            },
            {
                "id": "deckCard_34131fad-72e2-4b5f-acac-599a2e557610",
                "name": "スポラ2カス",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_7dfb71d7-b466-4850-9435-97c7f1a379c6",
                        "target": "redHp",
                        "amount": 3
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_fe5e0be7-a6a2-47cf-bd06-4e90dc7d6d35",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "trash",
                "buffEffects": [
                    {
                        "id": "buff_02df2244-ea75-45c6-acdc-afde71b2a1b0",
                        "target": "goodCondition",
                        "amount": 9
                    },
                    {
                        "id": "buff_0848649a-88a4-4bb4-b979-289ef903a626",
                        "target": "vitality",
                        "amount": 9
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_43d1a682-8b41-40ee-99a7-1f9140b50711",
                "name": "テレビ出演+",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_132aa915-83fb-4a8a-8638-fd53a92189e2",
                        "target": "hp",
                        "amount": 1
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_51689416-ae6a-4263-b02e-4b5bf3cb9ad1",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_899ddb0d-fa32-4353-a525-b3bfa35f1d62",
                        "target": "hpCostReduction",
                        "amount": 5
                    },
                    {
                        "id": "buff_22a136d6-6de6-4299-a6a0-e3c6c6ceaf10",
                        "target": "vitality",
                        "amount": 5
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_3c950e86-85ae-4773-8b4e-d03cc481a0ea",
                "name": "スリリング",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_a55be2ca-60cc-47e8-8f2a-2b58c65883db",
                        "target": "hp",
                        "amount": 2
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_3c2d745a-6404-4920-a5f0-e061e5330dfa",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_f9da25a3-5acf-4617-94a5-8894293182ad",
                        "target": "goodCondition",
                        "amount": 5
                    }
                ],
                "memo": "(使用するときは「1ドロー」と「眠気追加」を押してください)",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "card_dfd78681-5e95-4748-856e-4f4711cea3fa",
                "name": "夏夜に咲く思い出",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_8ef2f56b-f747-47ca-9558-ca38bb5babd2",
                        "target": "hp",
                        "amount": 7
                    }
                ],
                "attacks": [],
                "afterUseDestination": "removed",
                "buffEffects": [],
                "memo": "使用時、ランダムな山札または捨て札の眠気1枚を除外へ移動する\n以降、スキルカードを5回使用するごとに、パラメータ+4",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": 0,
                "specialEffectId": "summer_night_memory",
                "automationLevel": "partial",
                "specialEffect": {
                    "type": "persistent_every_n_skill_cards",
                    "duration": "battle",
                    "stackable": true,
                    "onUse": {
                        "removeRandomSleepinessFrom": [
                            "deck",
                            "trash"
                        ],
                        "destination": "removed"
                    },
                    "trigger": "every_n_skill_cards_used",
                    "interval": 5,
                    "additionalAttack": {
                        "basePower": 4,
                        "useNormalScoreCalculation": true,
                        "affectedByConcentration": true,
                        "affectedByGoodCondition": true,
                        "affectedByExcellentCondition": true,
                        "affectedByScoreMultiplier": true
                    }
                },
                "templateId": "summer_night_memory_minus"
            },
            {
                "id": "deckCard_17cd51ee-dc68-41db-b0bf-12dcbb55b9a6",
                "name": "カスタム仕切り直し",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_6960ce13-c7fa-4a86-95b1-6d2a2cb77ff1",
                        "target": "hp",
                        "amount": 2
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_beddf09e-47b4-44ea-9be8-cab10efd713d",
                        "basePower": 40,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": true,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 2,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    },
                    {
                        "id": "attack_c3f56a6f-5b07-4a60-bcc1-51ce54f0e906",
                        "basePower": 40,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": true,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 2,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_a4e9eca2-1a02-4579-b925-9d300f0960df",
                        "target": "hpCostReduction",
                        "amount": 6
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_5dd57164-ee9f-4944-a55a-dc0676d293c1",
                "name": "視線+",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_6539167a-8338-4487-be75-6f23ca47cf8b",
                        "target": "concentration",
                        "amount": 3
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_a3ad672a-b8b4-48fb-8ff2-ed299eb164ad",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_76b91972-719a-4743-a07e-867a4bb83b6f",
                        "target": "excellentCondition",
                        "amount": 5
                    },
                    {
                        "id": "buff_82d7a0b6-f271-4aa4-9653-c5cc7eba3f5a",
                        "target": "hpCostReduction",
                        "amount": 5
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_043b9fe7-b03a-4a97-a5f1-0f8899e6a67e",
                "name": "始まりの合図",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_9d6bc545-1006-4136-b257-ef6b85a50f7f",
                        "target": "hp",
                        "amount": 3
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_653ac39e-fb6d-4564-966d-c5eac6019a7f",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_1867c6d2-9060-42bf-8c3c-7eb4414a0a6f",
                        "target": "goodCondition",
                        "amount": 5
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_438ee4be-cf5c-4e8c-aef4-b4f144a23ac2",
                "name": "脚光",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_03f747c9-1912-4b86-b9e9-f77d9096d46e",
                        "target": "goodCondition",
                        "amount": 2
                    }
                ],
                "attacks": [],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_ee429dd6-e2a3-4c48-8962-f1d72f13b792",
                        "target": "concentration",
                        "amount": 7
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_23c4f4ea-c770-4cdb-92c6-db9efa8c55ca",
                "name": "天賦の才",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_0da4721f-4ca9-4d00-9067-6da92ccc6b49",
                        "target": "redHp",
                        "amount": 5
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_8128429b-9953-4be3-af48-fcb356e6e7c6",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_0ee9680a-4846-4084-91fa-baf78236f4ea",
                        "target": "goodCondition",
                        "amount": 3
                    },
                    {
                        "id": "buff_c9abb1fd-e7d8-47fc-bb2a-4cd504553a79",
                        "target": "concentration",
                        "amount": 2
                    }
                ],
                "memo": "(使用するときは乱数ジェネレーター等を併用してください)",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_91b7d4b2-a27d-4857-bbd6-66bb14885ac6",
                "name": "カスタム存在感",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_88ffba74-5be8-46a6-ad57-6fcda512ef02",
                        "target": "hp",
                        "amount": 0
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_4e7e72e4-04ba-4952-8c88-fa1cd9c10451",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "trash",
                "buffEffects": [
                    {
                        "id": "buff_0ac611b7-8daf-4428-abe2-d8c9d4edfc33",
                        "target": "concentration",
                        "amount": 5
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_47b57398-3f32-4a7b-b755-e9068fb0d70d",
                "name": "拍手",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_5dcf1c36-c5a7-462d-991e-cf5bf69277e2",
                        "target": "hp",
                        "amount": 5
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_c09a6fb4-901b-494f-af7e-fa896f6a9aef",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_eb80f181-502d-488a-a4b4-13bd49e4fde2",
                        "target": "goodCondition",
                        "amount": 2
                    },
                    {
                        "id": "buff_12431a61-5475-44d5-a74c-bb6cd93f263f",
                        "target": "concentration",
                        "amount": 4
                    },
                    {
                        "id": "buff_543fb069-575c-4cfc-8c7d-682f7cf785a0",
                        "target": "hpCostReduction",
                        "amount": 2
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_343888c2-ac7e-4b05-92ff-9c82046ed935",
                "name": "ひと呼吸3カス",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_988e2d1c-9e9a-4e80-9f71-9544050226e6",
                        "target": "hp",
                        "amount": 5
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_7805a41d-eda1-4943-adca-41bb6055c620",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_c17540e0-13b0-434b-bcf9-0316b21cca38",
                        "target": "goodCondition",
                        "amount": 4
                    },
                    {
                        "id": "buff_49f93ceb-d659-43ff-8a37-0df3ef5bcfcd",
                        "target": "concentration",
                        "amount": 7
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_55e47ea9-8469-42a4-803f-fc97a404e815",
                "name": "叶えたい夢",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_c27e593c-9812-4f51-9d3b-d73a38e63139",
                        "target": "redHp",
                        "amount": 1
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_8a4309a0-ae65-4edf-a86d-8c0ff92c1179",
                        "basePower": 0,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": false,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_c1add03a-162b-4fe2-adfe-d96e0d903806",
                        "target": "vitality",
                        "amount": 8
                    },
                    {
                        "id": "buff_5ac4c3ae-6292-469a-b389-de2067b8e788",
                        "target": "hpCostDiscount",
                        "amount": 1
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_988e50ad-bc4d-4ed0-bbb0-105b32bcf23d",
                "name": "眠気",
                "count": 1,
                "cardType": "sleepiness",
                "costs": [],
                "attacks": [],
                "afterUseDestination": "removed",
                "buffEffects": [],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": 0,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "deckCard_eb8a391d-75d8-4544-ac89-5070b9c28259",
                "name": "破竹+",
                "count": 1,
                "cardType": "active",
                "costs": [
                    {
                        "id": "cost_2bc14a77-c496-45a7-a6c0-86687949f692",
                        "target": "hp",
                        "amount": 2
                    }
                ],
                "attacks": [
                    {
                        "id": "attack_d907eb1f-8d2a-4543-b050-3ca5732ab2bd",
                        "basePower": 5,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": true,
                            "targetType": "afterTurns",
                            "turnsAfter": 1,
                            "triggerTiming": "turnStart"
                        }
                    },
                    {
                        "id": "attack_e0242916-599c-4e5b-8e03-23e85d7071d0",
                        "basePower": 5,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": true,
                            "targetType": "afterTurns",
                            "turnsAfter": 2,
                            "triggerTiming": "turnStart"
                        }
                    },
                    {
                        "id": "attack_49c64450-5f89-4a88-9711-bc250db9bfac",
                        "basePower": 5,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": true,
                            "targetType": "afterTurns",
                            "turnsAfter": 3,
                            "triggerTiming": "turnStart"
                        }
                    },
                    {
                        "id": "attack_fef1b197-b36c-427a-9363-d476cc2b7fd9",
                        "basePower": 5,
                        "useSpecialBasePower": false,
                        "specialBaseTarget": "goodCondition",
                        "specialBasePercent": 150,
                        "usePowerMultiplier": false,
                        "powerMultiplierTarget": "goodCondition",
                        "powerMultiplierValue": 1.5,
                        "damageReservation": {
                            "enabled": true,
                            "targetType": "afterTurns",
                            "turnsAfter": 4,
                            "triggerTiming": "turnStart"
                        }
                    }
                ],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_af3efe88-cc61-482f-9fff-5ac40f2da182",
                        "target": "concentration",
                        "amount": 7
                    }
                ],
                "memo": "",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": null,
                "specialEffectId": "",
                "automationLevel": "manual",
                "specialEffect": null,
                "templateId": ""
            },
            {
                "id": "card_f4cce7ac-1a67-419d-aee8-46a8a90c595c",
                "name": "国民的アイドル",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_4d6c23c2-1708-4cd3-a54b-4d0aef658742",
                        "target": "goodCondition",
                        "amount": 1
                    }
                ],
                "attacks": [],
                "afterUseDestination": "removed",
                "buffEffects": [],
                "memo": "次に使用するスキルカードの効果をもう1回発動する。",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": 0,
                "specialEffectId": "national_idol",
                "automationLevel": "partial",
                "specialEffect": {
                    "type": "one_shot_repeat_next_skill_effect",
                    "duration": "next_skill_card",
                    "stackable": true
                },
                "templateId": "national_idol"
            },
            {
                "id": "card_cd94b131-aba5-4f1d-b450-1df0f50abeee",
                "name": "カスタム天真爛漫",
                "count": 1,
                "cardType": "mental",
                "costs": [
                    {
                        "id": "cost_974cda63-ba97-4179-91af-fbecdc48ef93",
                        "target": "hp",
                        "amount": 1
                    }
                ],
                "attacks": [],
                "afterUseDestination": "removed",
                "buffEffects": [
                    {
                        "id": "buff_0ee50e02-8444-45cc-990d-a574676cbbd0",
                        "target": "concentration",
                        "amount": 1
                    }
                ],
                "memo": "集中+1\n以降、ターン終了時集中3以上の場合、集中+2",
                "startInHand": false,
                "generatesSleepiness": false,
                "fixedScore": 0,
                "specialEffectId": "tenshinranman",
                "automationLevel": "partial",
                "specialEffect": {
                    "type": "persistent_turn_end_buff",
                    "duration": "battle",
                    "stackable": true,
                    "trigger": "turn_end",
                    "condition": {
                        "target": "concentration",
                        "min": 3
                    },
                    "buffEffect": {
                        "target": "concentration",
                        "amount": 2
                    }
                },
                "templateId": "tenshinranman"
            }
        ]
    }
}