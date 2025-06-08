/**
 * Telegram Widget API Type Definitions
 * Based on official Telegram Widget JavaScript API
 */
declare namespace Telegram {

  /**
   * User data structure returned by Telegram Login Widget
   */
  interface TelegramUser {
    /** Unique identifier for this user */
    id: number;
    /** User's first name */
    first_name: string;
    /** User's last name (optional) */
    last_name?: string;
    /** User's username (optional) */
    username?: string;
    /** URL of the user's profile photo (optional) */
    photo_url?: string;
    /** Date the authentication was performed (Unix timestamp) */
    auth_date: number;
    /** Data-check-string hash for verification */
    hash: string;
  }

  /**
   * Login widget options
   */
  interface TelegramLoginOptions {
    /** Bot ID (required) */
    bot_id: string | number;
    /** Request write access permission */
    request_access?: boolean | string;
    /** Language code (e.g., 'en', 'ru') */
    lang?: string;
  }

  /**
   * Widget options for setWidgetOptions
   */
  interface TelegramWidgetOptions {
    /** Widget height */
    height?: number;
    /** Widget width */
    width?: number;
    /** Color scheme */
    color?: string;
    /** Dark mode */
    dark?: boolean;
    /** Dark color scheme */
    dark_color?: string;
  }

  /**
   * Widget info callback data
   */
  interface TelegramWidgetInfo {
    /** Widget height */
    height?: number;
    /** Widget width */
    width?: number;
    /** Widget type */
    type?: string;
  }

  /**
   * Element identifier type (can be string ID or HTMLElement)
   */
  type ElementIdentifier = string | HTMLElement;

  /**
   * Auth callback type - receives user data or false on failure
   */
  type TelegramAuthCallback = (user: TelegramUser | false) => void;

  /**
   * Widget info callback type
   */
  type TelegramWidgetInfoCallback = (info: TelegramWidgetInfo) => void;

  /**
   * GetAuthData callback type
   */
  type TelegramGetAuthDataCallback = (origin: string, user: TelegramUser | false) => void;

  /**
   * Get information about a widget
   * @param el_or_id Element or element ID
   * @param callback Callback function to receive widget info
   */
  function getWidgetInfo(el_or_id: ElementIdentifier, callback: TelegramWidgetInfoCallback): void;

  /**
   * Set options for widgets
   * @param options Widget options to set
   * @param el_or_id Optional element or element ID (if not provided, applies to all widgets)
   */
  function setWidgetOptions(options: TelegramWidgetOptions, el_or_id?: ElementIdentifier): void;

  namespace Login {
    /** Origin URL for Telegram Login widgets */
    const widgetsOrigin: string;

    /**
     * Authenticate user via popup window
     * @param options Login options including bot_id
     * @param callback Callback function called with user data or false
     */
    function auth(options: TelegramLoginOptions, callback: TelegramAuthCallback): void;

    /**
     * Initialize login widget with options and callback
     * @param options Login options including bot_id
     * @param auth_callback Callback function for authentication events
     */
    function init(options: TelegramLoginOptions, auth_callback: TelegramAuthCallback): void;

    /**
     * Open login popup with callback
     * @param callback Callback function called with user data or false
     */
    function open(callback: TelegramAuthCallback): void;

    /**
     * Get authentication data via XHR request
     * @param options Login options including bot_id
     * @param callback Callback function called with origin and user data
     */
    function getAuthData(options: TelegramLoginOptions, callback: TelegramGetAuthDataCallback): void;
  }
}

declare global {
  interface Window {
    Telegram: typeof Telegram;
  }
}

