const paginationKeyboardTemplate = ({ currentPage, totalPages }) => {
  const nextPage = (currentPage === totalPages - 1) ? 0 : currentPage + 1;

  return [
    [
      { text: 'Показать еще', callback_data: `paginationAction.${nextPage}` },
    ],
  ];
};

module.exports = paginationKeyboardTemplate;
