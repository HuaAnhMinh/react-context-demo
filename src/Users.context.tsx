import User from "./User";
import {createContext, ReactNode, useCallback, useContext, useReducer} from "react";
import {getUsersApi} from "./users.mock";

export const usersReducer = (state: UsersState, action: UsersAction) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export type UsersState = {
  users: User[],
  loading: boolean,
  error: string | null,
};

export type UsersActionsMap = {
  SET_USERS: User[],
  SET_LOADING: boolean,
  SET_ERROR: string | null,
};

export type UsersAction = {
  [Key in keyof UsersActionsMap]: {
    type: Key;
    payload: UsersActionsMap[Key];
  }
}[keyof UsersActionsMap];

export type UsersDispatcher = <Type extends UsersAction['type'], Payload extends UsersActionsMap[Type]>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined] : [Payload]
) => void;

type UsersContextInterface = readonly [UsersState, UsersDispatcher];

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const UsersContext = createContext<UsersContextInterface>([initialState, () => {}]);

export const UsersProvider = ({children}: {children: ReactNode}) => {
  const [state, _dispatch] = useReducer(usersReducer, initialState);

  const dispatch: UsersDispatcher = useCallback((type, ...payload) => {
    _dispatch({ type, payload: payload[0]} as UsersAction);
  }, []);

  return (
    <UsersContext.Provider value={[state, dispatch]}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const [{ users, loading, error }, dispatch] = useContext(UsersContext);
  
  const fetchUsers = useCallback(async () => {
    dispatch('SET_LOADING', true);
    dispatch('SET_ERROR', null);

    try {
      const response = await getUsersApi();
      dispatch('SET_USERS', response.users);
    } catch (e) {
      dispatch('SET_ERROR', (e as Error).message);
    } finally {
      dispatch('SET_LOADING', false);
    }
  }, [dispatch]);
  
  return {
    users,
    loading,
    error,
    fetchUsers,
  }
};