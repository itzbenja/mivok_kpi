import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddCommentToDashboardData {
  comment_insert: Comment_Key;
}

export interface AddCommentToDashboardVariables {
  dashboardId: UUIDString;
  content: string;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface Dashboard_Key {
  id: UUIDString;
  __typename?: 'Dashboard_Key';
}

export interface Dataset_Key {
  id: UUIDString;
  __typename?: 'Dataset_Key';
}

export interface GetMyDatasetsData {
  datasets: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Dataset_Key)[];
}

export interface ListPublicDashboardsData {
  dashboards: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Dashboard_Key)[];
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Visualization_Key {
  id: UUIDString;
  __typename?: 'Visualization_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListPublicDashboardsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicDashboardsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicDashboardsData, undefined>;
  operationName: string;
}
export const listPublicDashboardsRef: ListPublicDashboardsRef;

export function listPublicDashboards(): QueryPromise<ListPublicDashboardsData, undefined>;
export function listPublicDashboards(dc: DataConnect): QueryPromise<ListPublicDashboardsData, undefined>;

interface AddCommentToDashboardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToDashboardVariables): MutationRef<AddCommentToDashboardData, AddCommentToDashboardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentToDashboardVariables): MutationRef<AddCommentToDashboardData, AddCommentToDashboardVariables>;
  operationName: string;
}
export const addCommentToDashboardRef: AddCommentToDashboardRef;

export function addCommentToDashboard(vars: AddCommentToDashboardVariables): MutationPromise<AddCommentToDashboardData, AddCommentToDashboardVariables>;
export function addCommentToDashboard(dc: DataConnect, vars: AddCommentToDashboardVariables): MutationPromise<AddCommentToDashboardData, AddCommentToDashboardVariables>;

interface GetMyDatasetsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyDatasetsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyDatasetsData, undefined>;
  operationName: string;
}
export const getMyDatasetsRef: GetMyDatasetsRef;

export function getMyDatasets(): QueryPromise<GetMyDatasetsData, undefined>;
export function getMyDatasets(dc: DataConnect): QueryPromise<GetMyDatasetsData, undefined>;

