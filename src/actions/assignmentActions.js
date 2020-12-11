const { telegramTemplate } = require('claudia-bot-builder');
const { locationService, assignmentService } = require('../services');

const {
  assignmentMessageTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
  findAssignmentsMessageTemplate,
  findAssignmentsKeyboardTemplate,
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

const { paginationKeyboardTemplate, paginationMessageTemplate } = require('../templates/paginationTemplate');
const { PAGE_SIZE } = require('../constants/pageSize');
const { getPagination } = require('../helpers/pagination');

const favoriteAssignmentsAction = async (request, page = 0) => {
  const result = await assignmentService.getAllFavorites({
    telegramId: request.from.id,
    pagination: getPagination(page, PAGE_SIZE),
    page,
  });

  await setState(request.from.id, myAssignmentsFlowSteps.GET_FAVORITE_ASSIGNMENTS);

  const { pagingData } = result;
  const assignments = result.model;

  const assignmentsView = assignments.map((assignment) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate
        .Photo(assignment.pictureUrl, assignmentMessageTemplate(assignment))
        .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({ isFavorite: true }))
        .get();
    }

    return new telegramTemplate.Text(assignmentMessageTemplate(assignment))
      .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({ isFavorite: true }))
      .get();
  });

  assignmentsView.push(
    new telegramTemplate.Text(paginationMessageTemplate(pagingData))
      .addInlineKeyboard(paginationKeyboardTemplate(pagingData))
      .get(),
  );

  return assignmentsView;
};

const createdAssignmentsAction = async (request, page = 0) => {
  await setState(request.from.id, myAssignmentsFlowSteps.GET_CREATED_ASSIGNMENTS);

  const result = await assignmentService.getCreated({
    telegramId: request.from.id,
    pagination: getPagination(page, PAGE_SIZE),
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

  const assignmentsResponse = result.model.map((assignment, index) => {
    if (assignment.pictureUrl) {
      return new telegramTemplate.Photo(assignment.pictureUrl,
        assignmentMessageTemplate({ ...assignment, locationName: assignment.globalName }))
        .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate(false))
        .get();
    }

    return new telegramTemplate.Text(
      assignmentMessageTemplate({ ...assignment, locationName: assignment.globalName }),
    )
      .addInlineKeyboard(publicAssignmentInlineKeyboardTemplate(false))
      .get();
  });

  return basicResponse.concat(assignmentsResponse);
};

module.exports = {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
  addFoundAssignmentCategoryAction,
  addFoundAssignmentLocationAction,
};
