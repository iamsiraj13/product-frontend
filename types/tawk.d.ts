declare module "@tawk.to/tawk-messenger-react" {
  import { Component } from "react";

  export interface TawkMessengerProps {
    propertyId: string;
    widgetId: string;
    ref?: any;
    onLoad?: () => void;
    onStatusChange?: (status: string) => void;
    onBeforeLoaded?: () => void;
    onChatMessageVisitor?: (message: any) => void;
    onChatMessageAgent?: (message: any) => void;
    onChatMessageSystem?: (message: any) => void;
    onAgentJoinChat?: (data: any) => void;
    onAgentLeaveChat?: (data: any) => void;
    onChatMinimized?: () => void;
    onChatMaximized?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
    onPrechatSubmit?: (data: any) => void;
    onOfflineSubmit?: (data: any) => void;
    customStyle?: Record<string, any>;
    [key: string]: any;
  }

  export default class TawkMessengerReact extends Component<TawkMessengerProps> {
    maximize: () => void;
    minimize: () => void;
    toggle: () => void;
    popup: () => void;
    getWindowType: () => string;
    showWidget: () => void;
    hideWidget: () => void;
    toggleVisibility: () => void;
    getStatus: () => string;
    isChatOngoing: () => boolean;
    isChatMaximized: () => boolean;
    isChatMinimized: () => boolean;
    isChatHidden: () => boolean;
    isVisitorEngaged: () => boolean;
    setAttributes: (
      attributes: Record<string, any>,
      callback?: (error?: any) => void
    ) => void;
    addEvent: (
      event: string,
      metadata?: Record<string, any>,
      callback?: (error?: any) => void
    ) => void;
    addTags: (tags: string[], callback?: (error?: any) => void) => void;
    removeTags: (tags: string[], callback?: (error?: any) => void) => void;
  }
}

interface Window {
  Tawk_API?: {
    toggle?: () => void;
    maximize?: () => void;
    minimize?: () => void;
    popup?: () => void;
    showWidget?: () => void;
    hideWidget?: () => void;
    setAttributes?: (attributes: Record<string, any>, callback?: (err?: any) => void) => void;
    [key: string]: any;
  };
}
