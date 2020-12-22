const { telegramTemplate } = require('claudia-bot-builder');
const { locationService, assignmentService } = require('../services');

const {
  assignmentMessageTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
  findAssignmentsMessageTemplate,
  findAssignmentsKeyboardTemplate,
  favoriteAssignmentsMessageTemplate,
  markAssignmentAsSpamMessageTemplate,
  markAssignmentAsSpamKeyboardTemplate,
  markAssignmentAsSpamAlertTemplate,
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

const {
  deleteMessage,
  editMessageReplyMarkup,
  sendPhoto,
  sendMessage,
  editMessageCaption,
  editMessageText,
  answerCallbackQuery,
} = require('../helpers/telegram');

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

  if (!assignments.length) {
    return [
      new telegramTemplate.Text(
        favoriteAssignmentsMessageTemplate.noFavoriteAssignmentsMessageTemplate,
      )
        .get(),
    ];
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
      return sendPhoto(
        request,
        {
          inline_keyboard: publicAssignmentInlineKeyboardTemplate(
            {
              isFavorite: true,
              assignmentId: assignment.id,
              fromFavorites: true,
            },
          ),
        },
        assignmentMessageTemplate(assignment),
        assignment.pictureUrl,
        'Markdown',
      );
    }

    return sendMessage(
      request,
      {
        inline_keyboard: publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: true,
            assignmentId: assignment.id,
            fromFavorites: true,
          },
        ),
      },
      assignmentMessageTemplate(assignment),
      'Markdown',
    );
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

  if (!assignments.length) {
    return [
      new telegramTemplate.Text(
        createdAssignmentsMessageTemplate.noCreatedAssignmentsMessageTemplate,
      )
        .get(),
    ];
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
      return sendPhoto(
        request,
        {
          inline_keyboard: ownAssignmentInlineKeyboardTemplate({
            status: assignment.status,
            assignmentId: assignment.id,
          }),
        },
        assignmentMessageTemplate(assignment),
        assignment.pictureUrl,
        'Markdown',
      );
    }

    return sendMessage(
      request,
      {
        inline_keyboard: ownAssignmentInlineKeyboardTemplate({
          status: assignment.status,
          assignmentId: assignment.id,
        }),
      },
      assignmentMessageTemplate(assignment),
      'Markdown',
    );
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
      state.cache,
    ],
  );

  if (!assignments.length) {
    return [
      new telegramTemplate
        .Text(findAssignmentsMessageTemplate.notFoundAssignmentsMessageTemplate)
        .addReplyKeyboard(findAssignmentsKeyboardTemplate)
        .get(),
    ];
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
      return sendPhoto(
        request,
        {
          inline_keyboard: publicAssignmentInlineKeyboardTemplate(
            {
              isFavorite: assignment.isFavorite,
              assignmentId: assignment.id,
            },
          ),
        },
        assignmentMessageTemplate({
          ...assignment,
          locationName: assignment.globalName,
        }),
        assignment.pictureUrl,
        'Markdown',
      );
    }

    return sendMessage(
      request,
      {
        inline_keyboard: publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: assignment.isFavorite,
            assignmentId: assignment.id,
          },
        ),
      },
      assignmentMessageTemplate({ ...assignment, locationName: assignment.globalName }),
      'Markdown',
    );
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
    if (!request.message.photo) {
      return editMessageReplyMarkup(request, {
        inline_keyboard: publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: false,
            assignmentId,
          },
        ),
      });
    }

    return editMessageReplyMarkup(
      request,
      {
        inline_keyboard: publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: false,
            assignmentId,
          },
        ),
      },
    );
  }

  const response = await favoriteAssignmentsAction(request);

  return [
    ...response,
    deleteMessage(request, 1),
    deleteMessage(request),
    deleteMessage(request, -1),
  ];
};

const addToFavoritesAction = async (request, assignmentId) => {
  const result = await assignmentService.addToFavorites({
    telegramId: request.from.id,
    assignmentId,
  });

  if (!result.succeeded) throw Error(result.message);

  if (!request.message.photo) {
    return editMessageReplyMarkup(request, {
      inline_keyboard: publicAssignmentInlineKeyboardTemplate(
        {
          isFavorite: true,
          assignmentId,
        },
      ),
    });
  }

  return editMessageReplyMarkup(
    request,
    {
      inline_keyboard: publicAssignmentInlineKeyboardTemplate(
        {
          isFavorite: true,
          assignmentId,
        },
      ),
    },
  );
};

const removeAssignmentAction = async (request, assignmentId) => {
  const result = await assignmentService.delete({
    telegramId: request.from.id,
    assignmentId,
  });
  if (!result.succeeded) throw Error(result.message);

  const response = await createdAssignmentsAction(request);

  return [
    ...response,
    deleteMessage(request, 1),
    deleteMessage(request),
    deleteMessage(request, -1),
  ];
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

const markAssignmentAsSpamAction = (request, assignmentId) => {
  if (!request.message.photo) {
    return editMessageText(
      request,
      {
        inline_keyboard: markAssignmentAsSpamKeyboardTemplate(assignmentId),
      },
      markAssignmentAsSpamMessageTemplate,
    );
  }

  return editMessageCaption(
    request,
    {
      inline_keyboard: markAssignmentAsSpamKeyboardTemplate(assignmentId),
    },
    markAssignmentAsSpamMessageTemplate,
  );
};

const confirmAssignmentAsSpamAction = async (request, assignmentId) => {
  const result = await assignmentService.markAsSpam({ telegramId: request.from.id, assignmentId });

  if (!result.succeeded) throw Error(result.message);

  const deleteResponse = deleteMessage(request);
  const alertResponse = answerCallbackQuery(request, markAssignmentAsSpamAlertTemplate, true);

  return [deleteResponse, alertResponse];
};

const backFromConfirmAssignmentAsSpamAction = async (request, assignmentId) => {
  const result = await assignmentService.get({
    telegramId: request.from.id,
    assignmentId,
  });

  if (!result.succeeded) throw Error(result.message);

  if (result.model) {
    const assignment = result.model;

    if (!request.message.photo) {
      return editMessageText(
        request,
        {
          inline_keyboard: publicAssignmentInlineKeyboardTemplate(
            {
              isFavorite: assignment.isFavorite,
              assignmentId: assignment.id,
            },
          ),
        },
        assignmentMessageTemplate({
          ...assignment,
          locationName: assignment.locationName,
        }),
        'Markdown',
      );
    }

    return editMessageCaption(
      request,
      {
        inline_keyboard: publicAssignmentInlineKeyboardTemplate(
          {
            isFavorite: assignment.isFavorite,
            assignmentId: assignment.id,
          },
        ),
      },
      assignmentMessageTemplate({
        ...assignment,
        locationName: assignment.locationName,
      }),
      'Markdown',
    );
  }

  return deleteMessage(request);
};

module.exports = {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
  addFoundAssignmentCategoryAction,
  addFoundAssignmentLocationAction,
  removeFromFavoritesAction,
  addToFavoritesAction,
  markAssignmentAsSpamAction,
  confirmAssignmentAsSpamAction,
  backFromConfirmAssignmentAsSpamAction,
  removeAssignmentAction,
  markAssignmentAsNotCompletedAction,
  markAssignmentAsCompletedAction,
};
