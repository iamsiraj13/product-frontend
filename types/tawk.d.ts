interface Window {
  Tawk_API?: {
    toggle?: () => void;
    maximize?: () => void;
    minimize?: () => void;
    popup?: () => void;
    showWidget?: () => void;
    hideWidget?: () => void;
    setAttributes?: (attributes: Record<string, any>, callback?: (err?: any) => void) => void;
    onLoad?: () => void;
    [key: string]: any;
  };
  Tawk_LoadStart?: Date;
}

