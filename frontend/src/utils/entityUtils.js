export const getEntityIds = (entityList) =>
  entityList.map((entity) => entity._id || entity.id);
