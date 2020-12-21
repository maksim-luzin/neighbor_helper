const chooseCategoryKeyboardTemplate = require('../../templates/categoryTemplates');

const validationInputCategory = (text) => {
  const { length } = chooseCategoryKeyboardTemplate;
  const response = chooseCategoryKeyboardTemplate.some((row, rowKey) => (
    rowKey < (length - 1) && row.some((cell) => cell === text)
  ));
  return response;
};

module.expors = validationInputCategory;
