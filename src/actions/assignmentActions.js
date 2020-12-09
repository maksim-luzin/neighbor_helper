const { telegramTemplate } = require('claudia-bot-builder');
const { locationService, assignmentService } = require('../services');

const {
  assignmentMessageTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
  findAssignmentsMessageTemplate,
  findAssignmentsKeyboardTemplate,
  favoriteAssignmentsMessageTemplate,
} = require('../templates/assignmentTemplate');

const {
  addAssignmentLocationMessageTemplate,
  addAssignmentLocationKeyboardTemplate,
} = require('../templates/locationTemplates');

const {
  BUTTON_BACK,
} = require('../constants/button.text').COMMON;

const findAssignmentsFlowSteps = require('../constants/flow.step').FIND_ASSIGNMENTS;

const setState = require('../helpers/setState');

const { paginationKeyboardTemplate, paginationMessageTemplate } = require('../templates/paginationTemplate');
const { PAGE_SIZE } = require('../constants/pageSize');

const favoriteAssignmentsAction = async (request) => {
  const result = await assignmentService.getAllFavorites({
    telegramId: request.from.id,
  });

  const assignments = result.model;

  if (assignments.length === 0) {
    return new telegramTemplate.Text(
      favoriteAssignmentsMessageTemplate.noFavoriteAssignmentsMessageTemplate,
    )
      .get();
  }

  const basicResponse = [
    new telegramTemplate.Text(
      favoriteAssignmentsMessageTemplate.favoriteAssignmentsMessageTemplate,
    )
      .get(),
  ];

  const assignmentsResponse = assignments.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate
        .Photo(assignment.pictureUrl, assignmentMessageTemplate(assignment))
        .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({
          isFavorite: true,
          assignmentId: assignment.id,
          fromFavorites: true,
        }))
        .get();
    }

    return new telegramTemplate.Text(assignmentMessageTemplate(assignment))
      .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({
        isFavorite: true,
        assignmentId: assignment.id,
        fromFavorites: true,
      }))
      .get();
  });

  return basicResponse.concat(assignmentsResponse);
};

const createdAssignmentsAction = async (request, page = 0) => {
  const limit = PAGE_SIZE ? +PAGE_SIZE : 3;
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
      return new telegramTemplate
        .Photo(assignment.pictureUrl, assignmentMessageTemplate(assignment))
        .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate(assignment.status))
        .get();
    }

    return new telegramTemplate.Text(assignmentMessageTemplate(assignment))
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

const addFoundAssignmentCategoryAction = async (message, state) => {
  const result = await locationService.getAllByTelegramId({ telegramId: message.from.id });

  if (!result.succeeded) throw Error(result.message);

  await setState(
    message.from.id,
    findAssignmentsFlowSteps.CHOOSE_LOCATION,
    {
      ...state.data,
      telegramId: message.from.id,
      // TODO: заменить, когда будет локализация
      foundAssignmentChosenCategory: message.text !== BUTTON_BACK
        ? message.text : state.data.foundAssignmentChosenCategory,
    },
    result.model,
  );

  return (
    new telegramTemplate.Text(addAssignmentLocationMessageTemplate)
      .addReplyKeyboard(
        addAssignmentLocationKeyboardTemplate(result.model.map((elem) => [elem.localName])),
      )
      .get());
};

const addFoundAssignmentLocationAction = async (message, state) => {
  const result = await assignmentService.getAllNearby({
    telegramId: message.from.id,
    category: state.data.foundAssignmentChosenCategory,
    locationId: state.cache.find((elem) => elem.localName === message.text).id,
  });

  if (!result.succeeded) throw Error(result.message);

  await setState(
    message.from.id,
    findAssignmentsFlowSteps.GET_ASSIGNMENTS,
    {
      ...state.data,
    },
    {
      ...state.cache,
    },
  );

  if (result.model.length === 0) {
    return (
      new telegramTemplate
        .Text(findAssignmentsMessageTemplate.notFoundAssignmentsMessageTemplate)
        .addReplyKeyboard(findAssignmentsKeyboardTemplate)
        .get()
    );
  }

  const basicResponse = [
    new telegramTemplate.Text(findAssignmentsMessageTemplate.foundAssignmentsMessageTemplate)
      .addReplyKeyboard(findAssignmentsKeyboardTemplate)
      .get(),
  ];

  const assignmentsResponse = result.model.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate.Photo(assignment.pictureUrl,
        assignmentMessageTemplate({ ...assignment, locationName: assignment.globalName }))
        .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: assignment.isFavorite,
            assignmentId: assignment.id,
          },
        ))
        .get();
    }

    return new telegramTemplate.Text(
      assignmentMessageTemplate({ ...assignment, locationName: assignment.globalName }),
    )
      .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate(
        {
          isFavorite: assignment.isFavorite,
          assignmentId: assignment.id,
        },
      ))
      .get();
  });

  return basicResponse.concat(assignmentsResponse);
};

const removeFromFavoritesAction = async ({ request, assignmentId, fromFavorites }) => {
  const result = await assignmentService.removeFromFavorites({
    telegramId: request.from.id,
    assignmentId,
  });

  if (!result.succeeded) throw Error(result.message);

  if (fromFavorites === 'false') {
    return {
      method: 'editMessageText',
      body: {
        chat_id: request.message.chat.id,
        message_id: request.message.message_id,
        text: request.message.text,
        reply_markup: {
          inline_keyboard: publicAssignmentInlineKeyboardTemplate(
            {
              isFavorite: false,
              assignmentId,
            },
          ),
        },
      },
    };
  }

  return {
    method: 'deleteMessage',
    body: {
      chat_id: request.message.chat.id,
      message_id: request.message.message_id,
    },
  };
};

const addToFavoritesAction = async (request, assignmentId) => {
  const result = await assignmentService.addToFavorites({
    telegramId: request.from.id,
    assignmentId,
  });

  if (!result.succeeded) throw Error(result.message);

  return {
    method: 'editMessageText',
    body: {
      chat_id: request.message.chat.id,
      message_id: request.message.message_id,
      text: request.message.text,
      reply_markup: {
        inline_keyboard: publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: true,
            assignmentId,
          },
        ),
      },
    },
  };
};

module.exports = {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
  addFoundAssignmentCategoryAction,
  addFoundAssignmentLocationAction,
  removeFromFavoritesAction,
  addToFavoritesAction,
};
