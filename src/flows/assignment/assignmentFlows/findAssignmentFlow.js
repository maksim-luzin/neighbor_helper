const { chooseAssignmentCategoryFlowStep } = require('../assignmentFlowSteps');
const { chooseAssignmentLocationFlowStep } = require('../assignmentFlowSteps');
const { getNearbyAssignmentsFlowStep } = require('../assignmentFlowSteps');

const findAssignmentFlow = async (request, state) => {
  const flow = [
    chooseAssignmentCategoryFlowStep.name,
    chooseAssignmentLocationFlowStep.name,
    getNearbyAssignmentsFlowStep.name,
  ];

  let flowStepResult;

  flowStepResult = chooseAssignmentCategoryFlowStep(request, state, flow);
  if (flowStepResult) return flowStepResult;

  flowStepResult = await chooseAssignmentLocationFlowStep(request, state, flow);
  if (flowStepResult) return flowStepResult;

  flowStepResult = await getNearbyAssignmentsFlowStep(request, state, flow);
  if (flowStepResult) return flowStepResult;

  return flowStepResult;
};

module.exports = findAssignmentFlow;
