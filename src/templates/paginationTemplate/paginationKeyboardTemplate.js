const paginationKeyboardTemplate = ({ currentPage, totalPages }) => {
  const previousPage = (currentPage === 0) ? totalPages - 1 : currentPage - 1;
  const nextPage = (currentPage === totalPages - 1) ? 0 : currentPage + 1;

  return [
    [
      { text: '<<', callback_data: `paginationAction.${previousPage}` },
      { text: '>>', callback_data: `paginationAction.${nextPage}` },
    ],
  ];
};

module.exports = paginationKeyboardTemplate;
