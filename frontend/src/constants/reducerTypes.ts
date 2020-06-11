// Redux reducers

// Parcels
export const PARCEL = 'parcel';

// Lookup Codes
export const LOOKUP_CODE = 'lookupCode';

// access requests
export const ACCESS_REQUEST = 'accessRequest';

// Users
export const USERS = 'users';

export const NETWORK = 'network';

export const APP_ERRORS = 'appErrors';
export const ADD_ACTIVATE_USER = 'activateUser';
export const GET_USERS = 'getUsers';

// Access Requests
export const UPDATE_REQUEST_ACCESS_ADMIN = 'updateRequestAccessAdmin';

export const GET_REQUEST_ACCESS = 'getRequestAccess';
export const ADD_REQUEST_ACCESS = 'addRequestAccess';

export const JWT = 'jwt';
export const KEYCLOAK_READY = 'keycloakReady';
export const MAP_VIEW_ZOOM = 'mapViewZoom';
export const LEAFLET_CLICK_EVENT = 'leafletClickEvent';
export const GET_USER_DETAIL = 'GET_USER_DETAIL';
export const PUT_USER_DETAIL = 'PUT_USER_DETAIL';

// Projects
export enum ProjectReducers {
  WORKFLOW = 'projectWorkflow',
  WORKFLOW_TASKS = 'projectWorkflowTasks',
  PROJECT = 'project',
  TASKS = 'tasks',
}
