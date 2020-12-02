const { telegramTemplate } = require('claudia-bot-builder');
const { assignmentService } = require('../services');
const {
  asignmentTextTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
} = require('../templates/assignmentTemplate');

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

const createdAssignmentsAction = async (request) => {
  const result = await assignmentService.getCreated({
    telegramId: request.from.id,
  });

  const assignments = result.model;

  return assignments.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate.Photo(assignment.pictureUrl, asignmentTextTemplate(assignment))
        .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate(assignment.status))
        .get();
    }

    return new telegramTemplate.Text(asignmentTextTemplate(assignment))
      .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate(assignment.status))
      .get();
  });
};

module.exports = {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
};
