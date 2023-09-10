/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// ESM-comment-begin
import * as electron from 'electron';
// ESM-comment-end
// ESM-uncomment-begin
// const { createRequire } = globalThis._VSCODE_NODE_MODULES['node:module'];
// import type * as Electron from 'electron';
// const require = createRequire(new URL(import.meta.url).pathname);
// const electron = require('electron/main') as typeof Electron;
// ESM-uncomment-end

export const app = electron.app;
export type App = Electron.App;
export const autoUpdater = electron.autoUpdater;
export type AutoUpdater = Electron.AutoUpdater;
export const BrowserView = electron.BrowserView;
export type BrowserView = Electron.BrowserView;
export const BrowserWindow = electron.BrowserWindow;
export type BrowserWindow = Electron.BrowserWindow;
export type ClientRequest = Electron.ClientRequest;
export const clipboard = electron.clipboard;
export type Clipboard = Electron.Clipboard;
export type CommandLine = Electron.CommandLine;
export const contentTracing = electron.contentTracing;
export type ContentTracing = Electron.ContentTracing;
export const contextBridge = electron.contextBridge;
export type ContextBridge = Electron.ContextBridge;
export type Cookies = Electron.Cookies;
export const crashReporter = electron.crashReporter;
export type CrashReporter = Electron.CrashReporter;
export type Debugger = Electron.Debugger;
export const desktopCapturer = electron.desktopCapturer;
export type DesktopCapturer = Electron.DesktopCapturer;
export const dialog = electron.dialog;
export type Dialog = Electron.Dialog;
export type Dock = Electron.Dock;
export type DownloadItem = Electron.DownloadItem;
export const globalShortcut = electron.globalShortcut;
export type GlobalShortcut = Electron.GlobalShortcut;
export const inAppPurchase = electron.inAppPurchase;
export type InAppPurchase = Electron.InAppPurchase;
export type IncomingMessage = Electron.IncomingMessage;
export const ipcMain = electron.ipcMain;
export type IpcMain = Electron.IpcMain;
export const ipcRenderer = electron.ipcRenderer;
export type IpcRenderer = Electron.IpcRenderer;
export const Menu = electron.Menu;
export type Menu = Electron.Menu;
export const MenuItem = electron.MenuItem;
export type MenuItem = Electron.MenuItem;
export const MessageChannelMain = electron.MessageChannelMain;
export type MessageChannelMain = Electron.MessageChannelMain;
export type MessagePortMain = Electron.MessagePortMain;
export const nativeImage = electron.nativeImage;
export type NativeImage = Electron.NativeImage;
export const nativeTheme = electron.nativeTheme;
export type NativeTheme = Electron.NativeTheme;
export const net = electron.net;
export type Net = Electron.Net;
export const netLog = electron.netLog;
export type NetLog = Electron.NetLog;
export const Notification = electron.Notification;
export type Notification = Electron.Notification;
export const powerMonitor = electron.powerMonitor;
export type PowerMonitor = Electron.PowerMonitor;
export const powerSaveBlocker = electron.powerSaveBlocker;
export type PowerSaveBlocker = Electron.PowerSaveBlocker;
export const protocol = electron.protocol;
export type Protocol = Electron.Protocol;
export const safeStorage = electron.safeStorage;
export type SafeStorage = Electron.SafeStorage;
export const screen = electron.screen;
export type Screen = Electron.Screen;
export type ServiceWorkers = Electron.ServiceWorkers;
export const session = electron.session;
export type Session = Electron.Session;
export const ShareMenu = electron.ShareMenu;
export type ShareMenu = Electron.ShareMenu;
export const shell = electron.shell;
export type Shell = Electron.Shell;
export const systemPreferences = electron.systemPreferences;
export type SystemPreferences = Electron.SystemPreferences;
export const TouchBar = electron.TouchBar;
export type TouchBar = Electron.TouchBar;
export type TouchBarButton = Electron.TouchBarButton;
export type TouchBarColorPicker = Electron.TouchBarColorPicker;
export type TouchBarGroup = Electron.TouchBarGroup;
export type TouchBarLabel = Electron.TouchBarLabel;
export type TouchBarOtherItemsProxy = Electron.TouchBarOtherItemsProxy;
export type TouchBarPopover = Electron.TouchBarPopover;
export type TouchBarScrubber = Electron.TouchBarScrubber;
export type TouchBarSegmentedControl = Electron.TouchBarSegmentedControl;
export type TouchBarSlider = Electron.TouchBarSlider;
export type TouchBarSpacer = Electron.TouchBarSpacer;
export const Tray = electron.Tray;
export type Tray = Electron.Tray;
export const webContents = electron.webContents;
export type WebContents = Electron.WebContents;
export const webFrame = electron.webFrame;
export type WebFrame = Electron.WebFrame;
export const webFrameMain = electron.webFrameMain;
export type WebFrameMain = Electron.WebFrameMain;
export type WebRequest = Electron.WebRequest;
export type AboutPanelOptionsOptions = Electron.AboutPanelOptionsOptions;
export type AddRepresentationOptions = Electron.AddRepresentationOptions;
export type AnimationSettings = Electron.AnimationSettings;
export type AppDetailsOptions = Electron.AppDetailsOptions;
export type ApplicationInfoForProtocolReturnValue = Electron.ApplicationInfoForProtocolReturnValue;
export type AuthenticationResponseDetails = Electron.AuthenticationResponseDetails;
export type AuthInfo = Electron.AuthInfo;
export type AutoResizeOptions = Electron.AutoResizeOptions;
export type BeforeSendResponse = Electron.BeforeSendResponse;
export type BitmapOptions = Electron.BitmapOptions;
export type BlinkMemoryInfo = Electron.BlinkMemoryInfo;
export type BrowserViewConstructorOptions = Electron.BrowserViewConstructorOptions;
export type BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
export type CertificateTrustDialogOptions = Electron.CertificateTrustDialogOptions;
export type ClearCodeCachesOptions = Electron.ClearCodeCachesOptions;
export type ClearStorageDataOptions = Electron.ClearStorageDataOptions;
export type ClientRequestConstructorOptions = Electron.ClientRequestConstructorOptions;
export type Config = Electron.Config;
export type ConfigureHostResolverOptions = Electron.ConfigureHostResolverOptions;
export type ConsoleMessageEvent = Electron.ConsoleMessageEvent;
export type ContextMenuEvent = Electron.ContextMenuEvent;
export type ContextMenuParams = Electron.ContextMenuParams;
export type ContinueActivityDetails = Electron.ContinueActivityDetails;
export type CookiesGetFilter = Electron.CookiesGetFilter;
export type CookiesSetDetails = Electron.CookiesSetDetails;
export type CrashReporterStartOptions = Electron.CrashReporterStartOptions;
export type CreateFromBitmapOptions = Electron.CreateFromBitmapOptions;
export type CreateFromBufferOptions = Electron.CreateFromBufferOptions;
export type CreateInterruptedDownloadOptions = Electron.CreateInterruptedDownloadOptions;
export type Data = Electron.Data;
export type Details = Electron.Details;
export type DevicePermissionHandlerHandlerDetails = Electron.DevicePermissionHandlerHandlerDetails;
export type DidChangeThemeColorEvent = Electron.DidChangeThemeColorEvent;
export type DidCreateWindowDetails = Electron.DidCreateWindowDetails;
export type DidFailLoadEvent = Electron.DidFailLoadEvent;
export type DidFrameFinishLoadEvent = Electron.DidFrameFinishLoadEvent;
export type DidFrameNavigateEvent = Electron.DidFrameNavigateEvent;
export type DidNavigateEvent = Electron.DidNavigateEvent;
export type DidNavigateInPageEvent = Electron.DidNavigateInPageEvent;
export type DidRedirectNavigationEvent = Electron.DidRedirectNavigationEvent;
export type DidStartNavigationEvent = Electron.DidStartNavigationEvent;
export type DisplayBalloonOptions = Electron.DisplayBalloonOptions;
export type EnableNetworkEmulationOptions = Electron.EnableNetworkEmulationOptions;
export type FeedURLOptions = Electron.FeedURLOptions;
export type FileIconOptions = Electron.FileIconOptions;
export type FindInPageOptions = Electron.FindInPageOptions;
export type FocusOptions = Electron.FocusOptions;
export type FoundInPageEvent = Electron.FoundInPageEvent;
export type FrameCreatedDetails = Electron.FrameCreatedDetails;
export type FromPartitionOptions = Electron.FromPartitionOptions;
export type HandlerDetails = Electron.HandlerDetails;
export type HeadersReceivedResponse = Electron.HeadersReceivedResponse;
export type HeapStatistics = Electron.HeapStatistics;
export type HidDeviceAddedDetails = Electron.HidDeviceAddedDetails;
export type HidDeviceRemovedDetails = Electron.HidDeviceRemovedDetails;
export type IgnoreMouseEventsOptions = Electron.IgnoreMouseEventsOptions;
export type ImportCertificateOptions = Electron.ImportCertificateOptions;
export type Info = Electron.Info;
export type Input = Electron.Input;
export type InsertCSSOptions = Electron.InsertCSSOptions;
export type IpcMessageEvent = Electron.IpcMessageEvent;
export type Item = Electron.Item;
export type JumpListSettings = Electron.JumpListSettings;
export type LoadCommitEvent = Electron.LoadCommitEvent;
export type LoadExtensionOptions = Electron.LoadExtensionOptions;
export type LoadFileOptions = Electron.LoadFileOptions;
export type LoadURLOptions = Electron.LoadURLOptions;
export type LoginItemSettings = Electron.LoginItemSettings;
export type LoginItemSettingsOptions = Electron.LoginItemSettingsOptions;
export type MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
export type MessageBoxOptions = Electron.MessageBoxOptions;
export type MessageBoxReturnValue = Electron.MessageBoxReturnValue;
export type MessageBoxSyncOptions = Electron.MessageBoxSyncOptions;
export type MessageDetails = Electron.MessageDetails;
export type MessageEvent = Electron.MessageEvent;
export type MoveToApplicationsFolderOptions = Electron.MoveToApplicationsFolderOptions;
// export type NewWindowEvent = Electron.NewWindowEvent;
export type NotificationConstructorOptions = Electron.NotificationConstructorOptions;
export type OnBeforeRedirectListenerDetails = Electron.OnBeforeRedirectListenerDetails;
export type OnBeforeRequestListenerDetails = Electron.OnBeforeRequestListenerDetails;
export type OnBeforeSendHeadersListenerDetails = Electron.OnBeforeSendHeadersListenerDetails;
export type OnCompletedListenerDetails = Electron.OnCompletedListenerDetails;
export type OnErrorOccurredListenerDetails = Electron.OnErrorOccurredListenerDetails;
export type OnHeadersReceivedListenerDetails = Electron.OnHeadersReceivedListenerDetails;
export type OnResponseStartedListenerDetails = Electron.OnResponseStartedListenerDetails;
export type OnSendHeadersListenerDetails = Electron.OnSendHeadersListenerDetails;
export type OpenDevToolsOptions = Electron.OpenDevToolsOptions;
export type OpenDialogOptions = Electron.OpenDialogOptions;
export type OpenDialogReturnValue = Electron.OpenDialogReturnValue;
export type OpenDialogSyncOptions = Electron.OpenDialogSyncOptions;
export type OpenExternalOptions = Electron.OpenExternalOptions;
export type Options = Electron.Options;
export type PageFaviconUpdatedEvent = Electron.PageFaviconUpdatedEvent;
export type PageTitleUpdatedEvent = Electron.PageTitleUpdatedEvent;
export type Parameters = Electron.Parameters;
export type Payment = Electron.Payment;
export type PermissionCheckHandlerHandlerDetails = Electron.PermissionCheckHandlerHandlerDetails;
export type PermissionRequestHandlerHandlerDetails = Electron.PermissionRequestHandlerHandlerDetails;
export type PluginCrashedEvent = Electron.PluginCrashedEvent;
export type PopupOptions = Electron.PopupOptions;
export type PreconnectOptions = Electron.PreconnectOptions;
export type PrintToPDFOptions = Electron.PrintToPDFOptions;
export type Privileges = Electron.Privileges;
export type ProgressBarOptions = Electron.ProgressBarOptions;
export type Provider = Electron.Provider;
export type ReadBookmark = Electron.ReadBookmark;
export type RegistrationCompletedDetails = Electron.RegistrationCompletedDetails;
export type RelaunchOptions = Electron.RelaunchOptions;
export type RenderProcessGoneDetails = Electron.RenderProcessGoneDetails;
export type Request = Electron.Request;
export type ResizeOptions = Electron.ResizeOptions;
export type ResourceUsage = Electron.ResourceUsage;
export type Response = Electron.Response;
export type Result = Electron.Result;
export type SaveDialogOptions = Electron.SaveDialogOptions;
export type SaveDialogReturnValue = Electron.SaveDialogReturnValue;
export type SaveDialogSyncOptions = Electron.SaveDialogSyncOptions;
export type SelectHidDeviceDetails = Electron.SelectHidDeviceDetails;
export type Settings = Electron.Settings;
export type SourcesOptions = Electron.SourcesOptions;
export type SSLConfigConfig = Electron.SSLConfigConfig;
export type StartLoggingOptions = Electron.StartLoggingOptions;
export type SystemMemoryInfo = Electron.SystemMemoryInfo;
export type TitleBarOverlayOptions = Electron.TitleBarOverlayOptions;
export type TitleOptions = Electron.TitleOptions;
export type ToBitmapOptions = Electron.ToBitmapOptions;
export type ToDataURLOptions = Electron.ToDataURLOptions;
export type ToPNGOptions = Electron.ToPNGOptions;
export type TouchBarButtonConstructorOptions = Electron.TouchBarButtonConstructorOptions;
export type TouchBarColorPickerConstructorOptions = Electron.TouchBarColorPickerConstructorOptions;
export type TouchBarConstructorOptions = Electron.TouchBarConstructorOptions;
export type TouchBarGroupConstructorOptions = Electron.TouchBarGroupConstructorOptions;
export type TouchBarLabelConstructorOptions = Electron.TouchBarLabelConstructorOptions;
export type TouchBarPopoverConstructorOptions = Electron.TouchBarPopoverConstructorOptions;
export type TouchBarScrubberConstructorOptions = Electron.TouchBarScrubberConstructorOptions;
export type TouchBarSegmentedControlConstructorOptions = Electron.TouchBarSegmentedControlConstructorOptions;
export type TouchBarSliderConstructorOptions = Electron.TouchBarSliderConstructorOptions;
export type TouchBarSpacerConstructorOptions = Electron.TouchBarSpacerConstructorOptions;
export type TraceBufferUsageReturnValue = Electron.TraceBufferUsageReturnValue;
export type UpdateTargetUrlEvent = Electron.UpdateTargetUrlEvent;
export type UploadProgress = Electron.UploadProgress;
export type VisibleOnAllWorkspacesOptions = Electron.VisibleOnAllWorkspacesOptions;
export type WebContentsPrintOptions = Electron.WebContentsPrintOptions;
export type WebviewTagPrintOptions = Electron.WebviewTagPrintOptions;
export type WillNavigateEvent = Electron.WillNavigateEvent;
export type WillResizeDetails = Electron.WillResizeDetails;
export type EditFlags = Electron.EditFlags;
export type FoundInPageResult = Electron.FoundInPageResult;
export type LaunchItems = Electron.LaunchItems;
export type Margins = Electron.Margins;
export type MediaFlags = Electron.MediaFlags;
export type PageRanges = Electron.PageRanges;
export type Params = Electron.Params;
export type TitleBarOverlay = Electron.TitleBarOverlay;
export type WebPreferences = Electron.WebPreferences;
export type DefaultFontFamily = Electron.DefaultFontFamily;
export type BluetoothDevice = Electron.BluetoothDevice;
export type Certificate = Electron.Certificate;
export type CertificatePrincipal = Electron.CertificatePrincipal;
export type Cookie = Electron.Cookie;
export type CPUUsage = Electron.CPUUsage;
export type CrashReport = Electron.CrashReport;
export type CustomScheme = Electron.CustomScheme;
export type DesktopCapturerSource = Electron.DesktopCapturerSource;
export type Display = Electron.Display;
export type Event = Electron.Event;
export type Extension = Electron.Extension;
export type ExtensionInfo = Electron.ExtensionInfo;
export type FileFilter = Electron.FileFilter;
export type FilePathWithHeaders = Electron.FilePathWithHeaders;
export type GPUFeatureStatus = Electron.GPUFeatureStatus;
export type HIDDevice = Electron.HIDDevice;
export type InputEvent = Electron.InputEvent;
export type IOCounters = Electron.IOCounters;
export type IpcMainEvent = Electron.IpcMainEvent;
export type IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
export type IpcRendererEvent = Electron.IpcRendererEvent;
export type JumpListCategory = Electron.JumpListCategory;
export type JumpListItem = Electron.JumpListItem;
export type KeyboardEvent = Electron.KeyboardEvent;
export type KeyboardInputEvent = Electron.KeyboardInputEvent;
export type MemoryInfo = Electron.MemoryInfo;
export type MemoryUsageDetails = Electron.MemoryUsageDetails;
export type MimeTypedBuffer = Electron.MimeTypedBuffer;
export type MouseInputEvent = Electron.MouseInputEvent;
export type MouseWheelInputEvent = Electron.MouseWheelInputEvent;
// export type NewWindowWebContentsEvent = Electron.NewWindowWebContentsEvent;
export type NotificationAction = Electron.NotificationAction;
export type NotificationResponse = Electron.NotificationResponse;
export type PaymentDiscount = Electron.PaymentDiscount;
export type Point = Electron.Point;
export type PostBody = Electron.PostBody;
export type PrinterInfo = Electron.PrinterInfo;
export type ProcessMemoryInfo = Electron.ProcessMemoryInfo;
export type ProcessMetric = Electron.ProcessMetric;
export type Product = Electron.Product;
export type ProductDiscount = Electron.ProductDiscount;
export type ProductSubscriptionPeriod = Electron.ProductSubscriptionPeriod;
export type ProtocolRequest = Electron.ProtocolRequest;
export type ProtocolResponse = Electron.ProtocolResponse;
export type ProtocolResponseUploadData = Electron.ProtocolResponseUploadData;
export type Rectangle = Electron.Rectangle;
export type Referrer = Electron.Referrer;
export type ScrubberItem = Electron.ScrubberItem;
export type SegmentedControlSegment = Electron.SegmentedControlSegment;
export type SerialPort = Electron.SerialPort;
export type ServiceWorkerInfo = Electron.ServiceWorkerInfo;
export type SharedWorkerInfo = Electron.SharedWorkerInfo;
export type SharingItem = Electron.SharingItem;
export type ShortcutDetails = Electron.ShortcutDetails;
export type Size = Electron.Size;
export type Task = Electron.Task;
export type ThumbarButton = Electron.ThumbarButton;
export type TraceCategoriesAndOptions = Electron.TraceCategoriesAndOptions;
export type TraceConfig = Electron.TraceConfig;
export type Transaction = Electron.Transaction;
export type UploadData = Electron.UploadData;
export type UploadFile = Electron.UploadFile;
export type UploadRawData = Electron.UploadRawData;
export type UserDefaultTypes = Electron.UserDefaultTypes;
export type UtilityProcess = Electron.UtilityProcess;
export const utilityProcess = electron.utilityProcess;
export type ForkOptions = Electron.ForkOptions;
export type WebRequestFilter = Electron.WebRequestFilter;
export type WebSource = Electron.WebSource;
