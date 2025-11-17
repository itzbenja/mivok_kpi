const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'mivokkpi',
  location: 'us-east1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const listPublicDashboardsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicDashboards');
}
listPublicDashboardsRef.operationName = 'ListPublicDashboards';
exports.listPublicDashboardsRef = listPublicDashboardsRef;

exports.listPublicDashboards = function listPublicDashboards(dc) {
  return executeQuery(listPublicDashboardsRef(dc));
};

const addCommentToDashboardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToDashboard', inputVars);
}
addCommentToDashboardRef.operationName = 'AddCommentToDashboard';
exports.addCommentToDashboardRef = addCommentToDashboardRef;

exports.addCommentToDashboard = function addCommentToDashboard(dcOrVars, vars) {
  return executeMutation(addCommentToDashboardRef(dcOrVars, vars));
};

const getMyDatasetsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyDatasets');
}
getMyDatasetsRef.operationName = 'GetMyDatasets';
exports.getMyDatasetsRef = getMyDatasetsRef;

exports.getMyDatasets = function getMyDatasets(dc) {
  return executeQuery(getMyDatasetsRef(dc));
};
