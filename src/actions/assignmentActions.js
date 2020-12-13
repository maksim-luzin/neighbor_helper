/* eslint-disable no-return-await */
const { telegramTemplate } = require('claudia-bot-builder');
const { locationService, assignmentService } = require('../services');

const {
  assignmentMessageTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
  findAssignmentsMessageTemplate,
  findAssignmentsKeyboardTemplate,
  favoriteAssignmentsMessageTemplate,
  createdAssignmentsMessageTemplate,
} = require('../templates/assignmentTemplate');

const {
  addAssignmentLocationMessageTemplate,
  addAssignmentLocationKeyboardTemplate,
} = require('../templates/locationTemplates');

const {
  BUTTON_BACK,
} = require('../constants/button.text').COMMON;

const findAssignmentsFlowSteps = require('../constants/flow.step').FIND_ASSIGNMENTS;
const myAssignmentsFlowSteps = require('../constants/flow.step').MY_ASSIGNMENTS;

const setState = require('../helpers/setState');

const { deleteMessage, editMessageReplyMarkup } = require('../helpers/telegram');

const { paginationKeyboardTemplate, paginationMessageTemplate } = require('../templates/paginationTemplate');
const { PAGE_SIZE } = require('../constants/pageSize');
const { getPagination } = require('../helpers/pagination');

const favoriteAssignmentsAction = async (request, page = 0) => {
  const result = await assignmentService.getAllFavorites({
    telegramId: request.from.id,
    pagination: getPagination(page, PAGE_SIZE),
    page,
  });

  if (!result.succeeded) throw Error(result.message);

  await setState(request.from.id, myAssignmentsFlowSteps.GET_FAVORITE_ASSIGNMENTS);

  const { pagingData } = result;
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

  const paginationResponse = [
    new telegramTemplate.Text(paginationMessageTemplate(pagingData))
      .addInlineKeyboard(paginationKeyboardTemplate(pagingData))
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

  if (pagingData.totalPages === 1) return basicResponse.concat(assignmentsResponse);

  return basicResponse.concat(assignmentsResponse, paginationResponse);
};

const createdAssignmentsAction = async (request, page = 0) => {
  const result = await assignmentService.getCreated({
    telegramId: request.from.id,
    pagination: getPagination(page, PAGE_SIZE),
    page,
  });

  if (!result.succeeded) throw Error(result.message);

  await setState(request.from.id, myAssignmentsFlowSteps.GET_CREATED_ASSIGNMENTS);

  const { pagingData } = result;
  const assignments = result.model;

  if (assignments.length === 0) {
    return new telegramTemplate.Text(
      createdAssignmentsMessageTemplate.noCreatedAssignmentsMessageTemplate,
    )
      .get();
  }

  const basicResponse = [
    new telegramTemplate.Text(
      createdAssignmentsMessageTemplate.createdAssignmentsMessageTemplate,
    )
      .get(),
  ];

  const paginationResponse = [
    new telegramTemplate.Text(paginationMessageTemplate(pagingData))
      .addInlineKeyboard(paginationKeyboardTemplate(pagingData))
      .get(),
  ];

  const assignmentsResponse = assignments.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate
        .Photo(assignment.pictureUrl, assignmentMessageTemplate(assignment))
        .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate({
          status: assignment.status,
          assignmentId: assignment.id,
        }))
        .get();
    }

    return new telegramTemplate.Text(assignmentMessageTemplate(assignment))
      .addInlineKeyboard(ownAssignmentInlineKeyboardTemplate({
        status: assignment.status,
        assignmentId: assignment.id,
      }))
      .get();
  });

  if (pagingData.totalPages === 1) return basicResponse.concat(assignmentsResponse);

  return basicResponse.concat(assignmentsResponse, paginationResponse);
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

const addFoundAssignmentLocationAction = async ({ request, state, page = 0 }) => {
  const locationId = state.data.locationId
    ? state.data.locationId
    : state.cache.find((elem) => elem.localName === request.text).id;

  const result = await assignmentService.getAllNearby({
    telegramId: request.from.id,
    category: state.data.foundAssignmentChosenCategory,
    locationId,
    pagination: getPagination(page, PAGE_SIZE),
    page,
  });

  if (!result.succeeded) throw Error(result.request);

  const { pagingData } = result;
  const assignments = result.model;

  await setState(
    request.from.id,
    findAssignmentsFlowSteps.GET_ASSIGNMENTS,
    {
      ...state.data,
      locationId,
    },
    [
      ...state.cache,
    ],
  );

  if (assignments.length === 0) {
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

  const paginationResponse = [
    new telegramTemplate.Text(paginationMessageTemplate(pagingData))
      .addInlineKeyboard(paginationKeyboardTemplate(pagingData))
      .get(),
  ];

  const assignmentsResponse = assignments.map((assignment) => {
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

  if (pagingData.totalPages === 1) return basicResponse.concat(assignmentsResponse);

  return basicResponse.concat(assignmentsResponse, paginationResponse);
};

const removeFromFavoritesAction = async ({ request, assignmentId, fromFavorites }) => {
  const result = await assignmentService.removeFromFavorites({
    telegramId: request.from.id,
    assignmentId,
  });

  if (!result.succeeded) throw Error(result.message);

  if (fromFavorites === 'false') {
    return editMessageReplyMarkup(request, {
      inline_keyboard: publicAssignmentInlineKeyboardTemplate(
        {
          isFavorite: false,
          assignmentId,
        },
      ),
    });
  }

  const response = await favoriteAssignmentsAction(request);

  return response.concat(await deleteMessage(request));
};

const addToFavoritesAction = async (request, assignmentId) => {
  const result = await assignmentService.addToFavorites({
    telegramId: request.from.id,
    assignmentId,
  });

  if (!result.succeeded) throw Error(result.message);

  return editMessageReplyMarkup(request, {
    inline_keyboard: publicAssignmentInlineKeyboardTemplate(
      {
        isFavorite: true,
        assignmentId,
      },
    ),
  });
};

const markAssignmentAsCompletedAction = async ({ request, assignmentId }) => {
  const result = await assignmentService.update({
    telegramId: request.from.id,
    assignmentId,
    status: 'done',
  });

  if (!result.succeeded) throw Error(result.message);

  return editMessageReplyMarkup(request, {
    inline_keyboard: ownAssignmentInlineKeyboardTemplate(
      {
        assignmentId,
        status: 'done',
      },
    ),
  });
};

const markAssignmentAsNotCompletedAction = async ({ request, assignmentId }) => {
  const result = await assignmentService.update({
    telegramId: request.from.id,
    assignmentId,
    status: 'notDone',
  });

  if (!result.succeeded) throw Error(result.message);

  return editMessageReplyMarkup(request, {
    inline_keyboard: ownAssignmentInlineKeyboardTemplate(
      {
        assignmentId,
        status: 'notDone',
      },
    ),
  });
};

const removeAssignmentAction = async (request, assignmentId) => {
  const result = await assignmentService.delete({
    telegramId: request.from.id,
    assignmentId,
  });
  if (!result.succeeded) throw Error(result.message);

  const response = await createdAssignmentsAction(request);

  return response.concat(await deleteMessage(request));
};

module.exports = {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
  addFoundAssignmentCategoryAction,
  addFoundAssignmentLocationAction,
  removeFromFavoritesAction,
  addToFavoritesAction,
  removeAssignmentAction,
  markAssignmentAsNotCompletedAction,
  markAssignmentAsCompletedAction,
};
