import { Quest } from '../types/game';

// Generate 100 progressive levels with rewarding challenges and non-repeatable rewards
export function generateCoachQuests(): Quest[] {
  const quests: Quest[] = [];

  const questTemplates = [
    { titleAr: 'تثبيت التشكيلة الأساسية', titleEn: 'Set Starting XI', descAr: 'قم بضبط خطة الفريق وتعيين القائد', descEn: 'Configure team formation and assign captain' },
    { titleAr: 'خوض أول مباراة في الدوري', titleEn: 'Play First Match', descAr: 'قد الفريق في مباراتك الرسمية الأولى', descEn: 'Lead the team in your first official league match' },
    { titleAr: 'تحقيق أول فوز تاريخي', titleEn: 'Secure First Win', descAr: 'احصد أول 3 نقاط تحت قيادتك التدريبية', descEn: 'Collect your first 3 points under your management' },
    { titleAr: 'تطوير مهارة لاعب فردياً', titleEn: 'Train a Player', descAr: 'اختر مهارة وطورها للاعب في التدريب', descEn: 'Select and train an attribute in individual training' },
    { titleAr: 'إبرام أول صفقة انتقال', titleEn: 'Sign a Player', descAr: 'تعاقد مع لاعب جديد من سوق الانتقالات', descEn: 'Complete a signing from the transfer market' },
    { titleAr: 'استقطاب ناشئ من الأكاديمية', titleEn: 'Scout a Wonderkid', descAr: 'استخدم عملات الكورو لضم ناشئ موهوب', descEn: 'Spend KORO coins to scout a youth prospect' },
    { titleAr: 'تطوير أول مرفق في النادي', titleEn: 'Upgrade Facility', descAr: 'قم بترقية أحد مرافق النادي العشرة', descEn: 'Upgrade one of the 10 club infrastructure facilities' },
    { titleAr: 'تسجيل 5 أهداف في الدوري', titleEn: 'Score 5 Goals', descAr: 'أظهر شراسة هجومية وسجل 5 أهداف', descEn: 'Show attacking flair and score 5 league goals' },
    { titleAr: 'تحقيق فوزين متتاليين', titleEn: 'Win 2 in a Row', descAr: 'اصنع سلسلة انتصارات وثبات في الأداء', descEn: 'Build a winning streak of 2 consecutive matches' },
    { titleAr: 'الحفاظ على نظافة الشباك', titleEn: 'Keep a Clean Sheet', descAr: 'أنهِ مباراة دون أن تستقبل شباكك أي هدف', descEn: 'Finish a match without conceding any goals' },
  ];

  for (let lvl = 1; lvl <= 100; lvl++) {
    const template = questTemplates[(lvl - 1) % questTemplates.length];
    
    // Tiered Rewards (Scale generously with level)
    let rewardType: Quest['rewardType'] = 'dollars';
    let rewardValue = 0;
    let rewardLabelAr = '';
    let rewardLabelEn = '';

    if (lvl % 5 === 0 && lvl % 10 !== 0) {
      rewardType = 'koro';
      rewardValue = 75 + Math.floor(lvl * 7.5);
      rewardLabelAr = `+${rewardValue} عملة كورو (KORO)`;
      rewardLabelEn = `+${rewardValue} KORO Tokens`;
    } else if (lvl % 10 === 0) {
      rewardType = 'wonderkid';
      rewardValue = lvl;
      rewardLabelAr = `صفقة نجم واعد بموهبة ${80 + Math.min(18, Math.floor(lvl / 6))}+`;
      rewardLabelEn = `Wonderkid Prospect (${80 + Math.min(18, Math.floor(lvl / 6))}+ POT)`;
    } else if (lvl % 3 === 0) {
      rewardType = 'contract';
      rewardValue = 1;
      rewardLabelAr = `تجديد عقود مجاني + ${lvl * 3}% معنويات`;
      rewardLabelEn = `Free Contract Extension + ${lvl * 3}% Morale`;
    } else {
      rewardType = 'dollars';
      rewardValue = 25000 + (lvl * 12000);
      rewardLabelAr = `+$${rewardValue.toLocaleString()} ميزانية النادي`;
      rewardLabelEn = `+$${rewardValue.toLocaleString()} Club Budget`;
    }

    const multiplierTextAr = lvl > 10 ? ` (المرحلة ${Math.ceil(lvl / 10)})` : '';
    const multiplierTextEn = lvl > 10 ? ` (Stage ${Math.ceil(lvl / 10)})` : '';

    quests.push({
      id: `quest_lvl_${lvl}`,
      level: lvl,
      titleAr: `${template.titleAr}${multiplierTextAr}`,
      titleEn: `${template.titleEn}${multiplierTextEn}`,
      descAr: `${template.descAr} لفتح المستوى التالي وجائزته الكبرى.`,
      descEn: `${template.descEn} to unlock the next level and rewards.`,
      rewardType,
      rewardValue,
      rewardLabelAr,
      rewardLabelEn,
      isCompleted: lvl === 1, // First level starts completed so user can immediately claim their welcome reward!
      isClaimed: false,
    });
  }

  return quests;
}
