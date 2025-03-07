export type RootStackParamList = {
  Home: undefined;
  TaskDetails: { taskId: string };
  TaskForm: { taskId?: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}