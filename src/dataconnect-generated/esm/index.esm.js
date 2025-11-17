import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'mivokkpi',
  location: 'us-east1'
};

export const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';

export function createUser(dc) {
  return executeMutation(createUserRef(dc));
}

export const listPublicDashboardsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicDashboards');
}
listPublicDashboardsRef.operationName = 'ListPublicDashboards';

export function listPublicDashboards(dc) {
  return executeQuery(listPublicDashboardsRef(dc));
}

export const addCommentToDashboardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToDashboard', inputVars);
}
addCommentToDashboardRef.operationName = 'AddCommentToDashboard';

export function addCommentToDashboard(dcOrVars, vars) {
  return executeMutation(addCommentToDashboardRef(dcOrVars, vars));
}

export const getMyDatasetsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyDatasets');
}
getMyDatasetsRef.operationName = 'GetMyDatasets';

export function getMyDatasets(dc) {
  return executeQuery(getMyDatasetsRef(dc));
}

