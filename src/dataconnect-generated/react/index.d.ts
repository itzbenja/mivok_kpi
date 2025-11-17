import { CreateUserData, ListPublicDashboardsData, AddCommentToDashboardData, AddCommentToDashboardVariables, GetMyDatasetsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListPublicDashboards(options?: useDataConnectQueryOptions<ListPublicDashboardsData>): UseDataConnectQueryResult<ListPublicDashboardsData, undefined>;
export function useListPublicDashboards(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicDashboardsData>): UseDataConnectQueryResult<ListPublicDashboardsData, undefined>;

export function useAddCommentToDashboard(options?: useDataConnectMutationOptions<AddCommentToDashboardData, FirebaseError, AddCommentToDashboardVariables>): UseDataConnectMutationResult<AddCommentToDashboardData, AddCommentToDashboardVariables>;
export function useAddCommentToDashboard(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentToDashboardData, FirebaseError, AddCommentToDashboardVariables>): UseDataConnectMutationResult<AddCommentToDashboardData, AddCommentToDashboardVariables>;

export function useGetMyDatasets(options?: useDataConnectQueryOptions<GetMyDatasetsData>): UseDataConnectQueryResult<GetMyDatasetsData, undefined>;
export function useGetMyDatasets(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyDatasetsData>): UseDataConnectQueryResult<GetMyDatasetsData, undefined>;
