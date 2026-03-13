/**
 * 彈窗提示文案常量
 * 用于统一管理各种確認彈窗、警告提示的文案內容
 */

/**
 * 智慧拆分確認彈窗文案
 */
export const SMART_SPLIT_CONFIRM_MESSAGE = {
  cn: `智慧拆分將根據目前內容自動潤色、結構化並提取變數，
這將重寫目前模板內容並可能建立新詞庫。

【Beta 測試版限制】
  AI 理解能力有限，可能無法準確識別變數
  拆分結果不穩定，建議手動調整
  可能產生錯誤或意外的結果
  建議在測試模板上使用，避免影響重要內容

確定繼續嗎？`,

  en: `Smart Split will polish, structure and extract variables based on
current content. This will rewrite current template and may create new banks.

[Beta Limitations]
  Limited AI understanding, variable extraction may be inaccurate
  Unstable results, manual adjustment recommended
  May produce errors or unexpected results
  Recommended for testing only, avoid using on important templates

Continue?`
};

/**
 * 智慧拆分标题
 */
export const SMART_SPLIT_CONFIRM_TITLE = {
  cn: '智慧拆分 (Beta)',
  en: 'Smart Split (Beta)'
};

/**
 * 智慧拆分按钮文案
 */
export const SMART_SPLIT_BUTTON_TEXT = {
  confirm: {
    cn: '確定拆分',
    en: 'Confirm Split'
  },
  cancel: {
    cn: '取消',  // same in Traditional Chinese
    en: 'Cancel'
  }
};
