export type TDStorageLocalValue = string;

export type IDStorageLocalDTO = { [key: string]: TDStorageLocalValue | undefined }

export enum EDStorageLocalKey {
  AppInstanceId = 'app.instanceId',
  AppFirstLaunchDate = 'App.firstLaunchDate',
  AppUrl = 'app.url',
  AppManualSeen = 'app.manualSeen',
  Theme = 'theme',

  // наличие доступа к защищенному хранилищу
  SecurityCodeGranted = 'security.code',
  SecurityBiometryGranted = 'security.biometry',

  // Интервал автоблокировки приложения в фоне
  SecurityBlockingTimeout = 'security.blockTimeout',
  NotificationPushShow = 'notification.push.show',
}

export const DStorageLocalNoAuthKey = [
  EDStorageLocalKey.AppFirstLaunchDate,
  EDStorageLocalKey.AppInstanceId,
  EDStorageLocalKey.AppManualSeen,
  EDStorageLocalKey.NotificationPushShow,
  EDStorageLocalKey.Theme,
];
