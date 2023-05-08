export function noop(): void;

// #region dom
export function $find<K extends keyof HTMLElementTagNameMap>(el: HTMLElement, selectors: K): HTMLElementTagNameMap[K] | null;
export function $findAll(el: HTMLElement, selectors: string): HTMLElement[];
export function $(selectors: string): HTMLElement | null;
export function $$(selectors: string): HTMLElement[];
export function $html(htmlText: string): HTMLElement;
export function $style(stylesheet: string): HTMLStyleElement;
export function $el<K extends string>(
  tag: K,
  attr?: Record<string, unknown> | string,
  cb?: (el: K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : HTMLElement) => void
): K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : HTMLElement;
// #endregion dom

export function $getValue<T, D>(key: string, defaultValue: D): Promise<T|D>;
export function $setValue<T>(key: string, value: T): Promise<void>;
export function $getResourceText(key: string): string;
export function $xhr(details: GmXhrDetails): { abort: () => void };

interface GmXhrDetails {
  url: string | URL;
  method: 'GET' | 'HEAD' | 'POST';
  headers?: Record<string, unknown>;
  data?: string;
  binary?: boolean;
  /** milliseconds */
  timeout?: number;
  /**  This object will also be the context property of the #Response Object. */
  context?: Record<string, unknown>;
  responseType?: 'arraybuffer' | 'blob' | 'json';
  overrideMimeType?: string;
  user?: string;
  password?: string;
  onabort?(response: GmXhrResponse): void;
  onerror?(response: GmXhrResponse): void;
  onprogress?(response: GmXhrResponse): void;
  onreadystatechange?(response: GmXhrResponse): void;
  ontimeout?(response: GmXhrResponse): void;
  onload?(response: GmXhrResponse): void;
}

interface GmXhrResponse {
  finalUrl: string;
  readyState: XMLHttpRequest['readyState'];
  status: XMLHttpRequest['status'];
  statusText: XMLHttpRequest['statusText'];
  responseHeaders: string;
  response: XMLHttpRequest['response'];
  responseXML: XMLHttpRequest['responseXML'];
  responseText: XMLHttpRequest['responseText'];
  context: Record<string, unknown>;
}

export function throttle<F extends Function>(fn: F, timeout?: number): F;
