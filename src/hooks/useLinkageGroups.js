import { useState, useCallback, useRef } from 'react';

/**
 * 變數名解析工具函数
 * 从變數名中提取 baseKey 和 groupId
 * 例如: "fruit_1" -> { baseKey: "fruit", groupId: "1" }
 *       "fruit" -> { baseKey: "fruit", groupId: null }
 *
 * @param {string} varName - 變數名
 * @returns {Object} { baseKey, groupId }
 */
export const parseVariableName = (varName) => {
  const match = varName.match(/^(.+?)(?:_(\d+))?$/);
  if (match) {
    return {
      baseKey: match[1],
      groupId: match[2] || null
    };
  }
  return { baseKey: varName, groupId: null };
};

/**
 * 聯動組管理 Hook
 * 提供變數聯動組的功能，支持相同 baseKey 和 groupId 的變數同步更新
 *
 * @param {string} activeTemplateId - 当前激活的模板 ID
 * @param {Array} templates - 所有模板
 * @param {Function} setTemplates - 更新模板的函数
 * @param {Object} banks - 詞庫对象
 * @param {Function} handleAddOption - 添加选项的函数
 * @returns {Object} 聯動組相关的函数和状态
 */
export const useLinkageGroups = (
  activeTemplateId,
  templates,
  setTemplates,
  banks,
  handleAddOption
) => {
  // 游標在變數内的状态
  const [cursorInVariable, setCursorInVariable] = useState(false);
  const [currentVariableName, setCurrentVariableName] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  /**
   * 查找模板中所有需要聯動的變數
   * 规则：相同 baseKey 且相同 groupId 的變數聯動
   *
   * @param {Object} template - 模板对象
   * @param {string} baseKey - 變數的基础键名
   * @param {string|null} groupId - 组 ID
   * @returns {Array} 聯動變數的 uniqueKey 数组
   */
  const findLinkedVariables = useCallback((template, baseKey, groupId) => {
    if (!groupId) return []; // 没有 groupId 的變數不聯動

    const linkedKeys = new Set();
    
    // 获取模板的所有內容（可能是对象或字符串）
    const contentData = template.content;
    const contents = typeof contentData === 'object' 
      ? Object.values(contentData) 
      : [contentData || ''];

    // 分別处理每段內容，以确保索引计算逻辑与渲染时保持一致
    contents.forEach(content => {
      if (!content) return;
      
      const allMatches = content.matchAll(/\{\{([^}]+)\}\}/g);
      const counters = {};

      for (const match of allMatches) {
        const fullKey = match[1].trim();
        const parsed = parseVariableName(fullKey);

        // 匹配相同 baseKey 且相同 groupId 的變數
        if (parsed.baseKey === baseKey && parsed.groupId === groupId) {
          const idx = counters[fullKey] || 0;
          counters[fullKey] = idx + 1;
          linkedKeys.add(`${fullKey}-${idx}`);
        }
      }
    });

    return Array.from(linkedKeys);
  }, []);

  /**
   * 更新模板的選擇值，并同步更新所有聯動的變數
   *
   * @param {string} uniqueKey - 變數的唯一鍵
   * @param {*} value - 要設定的值
   * @param {Array} linkedKeys - 需要聯動的變數键数组
   */
  const updateActiveTemplateSelection = useCallback((uniqueKey, value, linkedKeys = []) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === activeTemplateId) {
        const newSelections = { ...t.selections, [uniqueKey]: value };

        // 同步更新所有聯動的變數
        linkedKeys.forEach(linkedKey => {
          if (linkedKey !== uniqueKey) {
            newSelections[linkedKey] = value;
          }
        });

        return {
          ...t,
          selections: newSelections
        };
      }
      return t;
    }));
  }, [activeTemplateId, setTemplates]);

  /**
   * 处理變數選擇
   * 自动处理聯動組的同步更新
   *
   * @param {string} key - 變數键名
   * @param {number} index - 變數索引
   * @param {*} value - 选中的值
   * @param {Function} setActivePopover - 关闭弹出层的函数
   */
  const handleSelect = useCallback((key, index, value, setActivePopover) => {
    const uniqueKey = `${key}-${index}`;

    // 解析變數名，检查是否有聯動組
    const parsed = parseVariableName(key);

    // 如果有关联组，找到所有需要聯動的變數
    let linkedKeys = [];
    if (parsed.groupId) {
      const activeTemplate = templates.find(t => t.id === activeTemplateId);
      if (activeTemplate) {
        linkedKeys = findLinkedVariables(activeTemplate, parsed.baseKey, parsed.groupId);
      }
    }

    updateActiveTemplateSelection(uniqueKey, value, linkedKeys);
    if (setActivePopover) {
      setActivePopover(null);
    }
  }, [parseVariableName, findLinkedVariables, updateActiveTemplateSelection, templates, activeTemplateId]);

  /**
   * 添加自訂选项并选中
   * 同时会添加到詞庫中（如果不存在）
   *
   * @param {string} key - 變數键名
   * @param {number} index - 變數索引
   * @param {string} newValue - 新选项的值
   * @param {Function} setActivePopover - 关闭弹出层的函数
   */
  const handleAddCustomAndSelect = useCallback((key, index, newValue, setActivePopover) => {
    if (!newValue || !newValue.trim()) return;

    // 解析變數名，获取 baseKey（詞庫的 key）
    const parsed = parseVariableName(key);
    const baseKey = parsed.baseKey;

    // 1. Add to bank if not exists (使用 baseKey)
    if (banks[baseKey] && !banks[baseKey].options.includes(newValue)) {
      handleAddOption(baseKey, newValue);
    }

    // 2. Select it (使用完整的 key，可能包含 groupId)
    handleSelect(key, index, newValue, setActivePopover);
  }, [banks, handleSelect, handleAddOption]);

  return {
    parseVariableName,
    cursorInVariable,
    setCursorInVariable,
    currentVariableName,
    setCurrentVariableName,
    currentGroupId,
    setCurrentGroupId,
    findLinkedVariables,
    updateActiveTemplateSelection,
    handleSelect,
    handleAddCustomAndSelect,
  };
};
