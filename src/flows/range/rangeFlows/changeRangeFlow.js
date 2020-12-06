const { showRangeValueFlowStep } = require('../rangeFlowSteps');
const { changeRangeValueFlowStep } = require('../rangeFlowSteps');

const changeRangeFlow = async (request, state) => {
  const flow = {
    showRangeValueFlowStep: 0,
    changeRangeValueFlowStep: 1,
  };

  let flowStepResult;

  flowStepResult = await showRangeValueFlowStep(request, state, flow);
  if (flowStepResult) return flowStepResult;

  flowStepResult = await changeRangeValueFlowStep(request, state, flow);
  if (flowStepResult) return flowStepResult;

  return flowStepResult;
};

module.exports = changeRangeFlow;
