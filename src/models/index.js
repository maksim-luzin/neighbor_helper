import orm from '../db/connection';
import associate from '../db/associations';

const User = orm.import('./user');
const Assignment = orm.import('./assignment');
const FavoriteAssignment = orm.import('./favoriteAssignment');
const Location = orm.import('./location');

associate({
  User,
  Assignment,
  FavoriteAssignment,
  Location
});

export {
  User as UserModel,
  Assignment as AssignmentModel,
  FavoriteAssignment as FavoriteAssignmentModel,
  Location as LocationModel
};
