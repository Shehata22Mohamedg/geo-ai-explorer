type RuntimeErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

declare global {
  interface Window {
    __shExplorerReportRuntimeError?: (payload: {
      message: string;
      stack?: string;
      filename?: string;
      context?: Record<string, unknown>;
      options?: RuntimeErrorOptions;
    }) => void;
  }
}

export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  console.error("[geo-ai-explorer]", message, error);
  window.__shExplorerReportRuntimeError?.({
    message,
    ...(stack !== undefined && { stack }),
    filename: window.location.pathname,
    context: { source: "react_error_boundary", route: window.location.pathname, ...context },
    options: { mechanism: "react_error_boundary", handled: false, severity: "error" },
  });
}
