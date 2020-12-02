const { userService } = require('../services');
const { findAssignmentFlow } = require('./assignment/assignmentFlows');
const { messageDefaultAction } = require('../actions/commonActions');

const flowStateManager = async (request) => {
  const result = await userService.getOne({ telegramId: request.from.id, params: ['state'] });
  if (!result.succeeded) return messageDefaultAction();

  const { state } = result.model;

  let flowResult;

  if (state.flowName === 'findAssignmentFlow') {
    flowResult = await findAssignmentFlow(request, state);
    return flowResult;
  }

  return messageDefaultAction();
};

module.exports = flowStateManager;
