const { findAssignmentFlow } = require('./assignment/assignmentFlows');
const { changeRangeFlow } = require('./range/rangeFlows');
const { messageDefaultAction } = require('../actions/commonActions');

const flowStateManager = async (request, state) => {
  let flowResult;

  switch (state.flowName) {
    case 'findAssignmentFlow':
      flowResult = await findAssignmentFlow(request, state);
      return flowResult;

    case 'changeRangeFlow':
      flowResult = await changeRangeFlow(request, state);
      return flowResult;

    default:
      return messageDefaultAction();
  }
};

module.exports = flowStateManager;
