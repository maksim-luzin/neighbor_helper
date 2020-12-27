const i18n = require('../helpers/localization');

exports.MAIN_MENU_BUTTONS = {
  ABOUT_US: i18n.t('mainMenu.about'),
  CHANGE_RANGE: i18n.t('mainMenu.changeRange'),
  MY_ASSIGNMENT: i18n.t('mainMenu.myAssignments'),
  FIND_ASSIGNMENTS: i18n.t('mainMenu.findAssignment'),
  ADD_ASSIGNMENT: i18n.t('mainMenu.submitAssignment'),
  LANGUAGE: i18n.t('mainMenu.language'),
};

exports.COMMON_BUTTONS = {
  BACK: i18n.t('common.back'),
  HOME: i18n.t('common.home'),
  CONFIRM: i18n.t('common.confirm'),
  SKIP: i18n.t('common.skip'),
  EDIT_ASSIGNMENT: i18n.t('assignment.button.editAssignment'),
  DELETE: i18n.t('common.delete'),
  ADD_LOCATION: i18n.t('mainMenu.addLocation'),
};

exports.CATEGORY_BUTTONS = {
  BARTER: i18n.t('category.barter'),
  EDUCATION: i18n.t('category.education'),
  HELP: i18n.t('category.help'),
  REPAIR: i18n.t('category.repair'),
  OTHER: i18n.t('category.other'),
};

exports.MY_ASSIGNMENTS_MENU_BUTTONS = {
  FAVORITE_ASSIGNMENTS: i18n.t('common.favoriteAssignments'),
  CREATED_ASSIGNMENTS: i18n.t('common.submittedAssignments'),
};

exports.ADD_LOCATIONS_MENU_BUTTONS = {
  ADD_CURRENT_LOCATION: i18n.t('location.current'),
};

exports.ADD_ASSIGNMENT_BUTTONS = {
  PUBLISH_ASSIGNMENT: i18n.t('assignment.button.publishAssignment'),
};
