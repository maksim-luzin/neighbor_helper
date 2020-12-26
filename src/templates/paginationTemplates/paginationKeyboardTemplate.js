const { COMMON_ACTIONS } = require('../../constants/actions');

const paginationKeyboardTemplate = ({ currentPage, totalPages }) => {
  const nextPage = (currentPage === totalPages - 1) ? 0 : currentPage + 1;

  return [
    [
      { text: 'Показать еще', callback_data: `${COMMON_ACTIONS.PAGINATION}.${nextPage}` },
    ],
  ];
};

module.exports = paginationKeyboardTemplate;
