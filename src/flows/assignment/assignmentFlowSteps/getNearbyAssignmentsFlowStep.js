const { assignmentService } = require('../../../services');
const { messageDefaultAction } = require('../../../actions/commonActions');

const getNearbyAssignmentsFlowStep = async (request, state, flow) => {
  const result = await assignmentService.getAllNearby({
    telegramId: request.from.id,
    locationId: state.data.chosenLocationId,
    category: state.data.chosenCategory,
  });
  if (!result.succeeded) return messageDefaultAction();

  return null; // заменить на темплейт объявлений
};

module.exports = getNearbyAssignmentsFlowStep;
