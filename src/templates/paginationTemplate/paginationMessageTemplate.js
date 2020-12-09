const paginationMessageTemplate = (pagingData) => (`${pagingData.currentPage + 1}/${pagingData.totalPages}`);

module.exports = paginationMessageTemplate;
