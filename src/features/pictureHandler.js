const {
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
} = require('../constants/flow.step');

const { addPictureForAddAssignmentAction } = require('../actions/addAssignmentAction');
const { editPictureForEditAssignmentAction } = require('../actions/editAssignmentAction');

const pictureHandler = (message, state) => {
  const { step } = state;

  switch (step) {
    case ADD_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT:
      return addPictureForAddAssignmentAction(message, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT:
      return editPictureForEditAssignmentAction(message, state);

    default:
      throw Error('Unplanned image.');
  }
};

module.exports = pictureHandler;
