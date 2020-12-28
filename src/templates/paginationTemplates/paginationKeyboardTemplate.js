const { COMMON_ACTIONS } = require('../../constants/actions');
const i18n = require('../../helpers/localization');

const paginationKeyboardTemplate = ({ currentPage, totalPages }) => {
  const nextPage = (currentPage === totalPages - 1) ? 0 : currentPage + 1;

  return [
    [
      { text: i18n.t('pagination.showMore'), callback_data: `${COMMON_ACTIONS.PAGINATION}.${nextPage}` },
    ],
  ];
};

module.exports = paginationKeyboardTemplate;
