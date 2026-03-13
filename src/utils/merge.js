// 合并策略函数
import { INITIAL_TEMPLATES_CONFIG } from '../data/templates';
import { INITIAL_BANKS, INITIAL_DEFAULTS } from '../data/banks';
import { deepClone, makeUniqueKey } from './helpers';

// 合并系統模板，系統模板强制更新，用户改动備份
export const mergeTemplatesWithSystem = (currentTemplates, { backupSuffix }) => {
  const systemMap = new Map(INITIAL_TEMPLATES_CONFIG.map(t => [t.id, deepClone(t)]));
  const merged = INITIAL_TEMPLATES_CONFIG.map(t => deepClone(t));
  const notes = [];
  const existingIds = new Set(merged.map(t => t.id));

  currentTemplates.forEach(t => {
    if (systemMap.has(t.id)) {
      const sys = systemMap.get(t.id);
      
      // 比较名称和內容（忽略 selections 等交互状态）
      const isDifferent = JSON.stringify(t.name) !== JSON.stringify(sys.name) || 
                          JSON.stringify(t.content) !== JSON.stringify(sys.content);
      
      // 在 merged 列表中找到对应的系統模板进行状态合并
      const targetInMerged = merged.find(m => m.id === t.id);
      if (targetInMerged && t.selections) {
        // 迁移用户的填空選擇 (selections)，保留用户已填的內容
        targetInMerged.selections = { 
          ...(targetInMerged.selections || {}), 
          ...t.selections 
        };
      }

      if (isDifferent) {
        const backupId = makeUniqueKey(t.id, existingIds, "user");
        existingIds.add(backupId);
        
        const duplicateName = (name) => {
          if (typeof name === 'string') return `${name}${backupSuffix || ""}`;
          const newName = { ...name };
          Object.keys(newName).forEach(lang => {
            newName[lang] = `${newName[lang]}${backupSuffix || ""}`;
          });
          return newName;
        };

        merged.push({ ...deepClone(t), id: backupId, name: duplicateName(t.name) });
        notes.push(`模板 ${t.id} 已更新，旧版備份为 ${backupId}`);
      }
    } else {
      let newId = t.id;
      if (existingIds.has(newId)) {
        newId = makeUniqueKey(newId, existingIds, "custom");
        notes.push(`自訂模板 ${t.id} 与系统冲突，已重命名为 ${newId}`);
      }
      existingIds.add(newId);
      merged.push({ ...deepClone(t), id: newId });
    }
  });

  return { templates: merged, notes };
};

// 合并系统詞庫与默认值，系统詞庫强制更新，用户改动內容合并
export const mergeBanksWithSystem = (currentBanks, currentDefaults, { backupSuffix }) => {
  const mergedBanks = deepClone(INITIAL_BANKS);
  const mergedDefaults = { ...INITIAL_DEFAULTS };
  const notes = [];
  const existingKeys = new Set(Object.keys(mergedBanks));

  Object.entries(currentBanks || {}).forEach(([key, bank]) => {
    if (INITIAL_BANKS[key]) {
      const sysBank = INITIAL_BANKS[key];
      
      // 检查是否有自訂选项（即不在系统预设中的选项）
      const sysOptionsSet = new Set(sysBank.options.map(opt => 
        typeof opt === 'string' ? opt : JSON.stringify(opt)
      ));
      
      const customOptions = (bank.options || []).filter(opt => {
        const optKey = typeof opt === 'string' ? opt : JSON.stringify(opt);
        return !sysOptionsSet.has(optKey);
      });

      // 如果有自訂选项，合并到系统詞庫中，而不是触发整体備份
      if (customOptions.length > 0) {
        mergedBanks[key].options = [...mergedBanks[key].options, ...customOptions];
        notes.push(`詞庫 ${key} 已同步系统更新，并保留了您的自訂选项`);
      }
      
      // 如果詞庫的其他属性（如分類）发生变化，仍可考虑是否備份，但通常以系统为准
    } else {
      let newKey = key;
      if (existingKeys.has(newKey)) {
        newKey = makeUniqueKey(newKey, existingKeys, "custom");
        notes.push(`自訂詞庫 ${key} 与系统冲突，已重命名为 ${newKey}`);
      }
      existingKeys.add(newKey);
      mergedBanks[newKey] = deepClone(bank);
      if (currentDefaults && key in currentDefaults) mergedDefaults[newKey] = currentDefaults[key];
    }
  });

  Object.entries(currentDefaults || {}).forEach(([key, val]) => {
    if (!(key in mergedDefaults) && mergedBanks[key]) {
      mergedDefaults[key] = val;
    }
  });

  return { banks: mergedBanks, defaults: mergedDefaults, notes };
};
