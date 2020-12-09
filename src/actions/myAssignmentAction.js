const { telegramTemplate } = require('claudia-bot-builder');
const { assignmentService } = require('../services');
const {
  asignmentTextTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
} = require('../templates/assignmentTemplate');

const { paginationKeyboardTemplate, paginationMessageTemplate } = require('../templates/paginationTemplate');

const favoriteAssignmentsAction = async (request) => {
  const result = await assignmentService.getAllFavorites({
    telegramId: request.from.id,
  });

  const assignments = result.model;

  return assignments.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate.Photo(assignment.pictureUrl, asignmentTextTemplate(assignment))
        .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({ isFavorite: true }))
        .get();
    }

    return new telegramTemplate.Text(asignmentTextTemplate(assignment))
      .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({ isFavorite: true }))
      .get();
  });
};

const createdAssignmentsAction = async (request, page = 0, size = 1) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  const result = await assignmentService.getCreated({
    telegramId: request.from.id,
    limit,
    offset,
    page,
  });

  const { pagingData } = result;
  const assignments = result.model;

  const assignmentsView = assignments.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate.Photo(assignment.pictureUrl, asignmentTextTemplate(assignment))
        .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate(assignment.status))
        .get();
    }

    return new telegramTemplate.Text(asignmentTextTemplate(assignment))
      .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate(assignment.status))
      .get();
  });

  assignmentsView.push(
    new telegramTemplate.Text(paginationMessageTemplate(pagingData))
      .addInlineKeyboard(paginationKeyboardTemplate(pagingData))
      .get(),
  );

  return assignmentsView;
};

module.exports = {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
};
