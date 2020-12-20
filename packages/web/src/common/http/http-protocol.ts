export enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    VARIANT_ALSO_NEGOTIATES = 506,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508,
    BANDWIDTH_LIMIT_EXCEEDED = 509,
    NOT_EXTENDED = 510,
    NETWORK_AUTHENTICATION_REQUIRED = 511,

    CONTINUE_REASON_PHRASE = 'Continue',
    SWITCHING_PROTOCOLS_REASON_PHRASE = 'Switching Protocols',
    PROCESSING_REASON_PHRASE = 'Processing',
    CHECKPOINT_REASON_PHRASE = 'Checkpoint',

    // 2xx Success
    OK_REASON_PHRASE = 'OK',
    CREATED_REASON_PHRASE = 'Created',
    ACCEPTED_REASON_PHRASE = 'Accepted',
    NON_AUTHORITATIVE_INFORMATION_REASON_PHRASE = 'Non-Authoritative Information',
    NO_CONTENT_REASON_PHRASE = 'No Content',
    RESET_CONTENT_REASON_PHRASE = 'Reset Content',
    PARTIAL_CONTENT_REASON_PHRASE = 'Partial Content',
    MULTI_STATUS_REASON_PHRASE = 'Multi-Status',
    ALREADY_REPORTED_REASON_PHRASE = 'Already Reported',
    IM_USED_REASON_PHRASE = 'IM Used',

    // 3xx Redirection
    MULTIPLE_CHOICES_REASON_PHRASE = 'Multiple Choices',
    MOVED_PERMANENTLY_REASON_PHRASE = 'Moved Permanently',
    FOUND_REASON_PHRASE = 'Found',
    MOVED_TEMPORARILY_REASON_PHRASE = 'Moved Temporarily',
    SEE_OTHER_REASON_PHRASE = 'See Other',
    NOT_MODIFIED_REASON_PHRASE = 'Not Modified',
    USE_PROXY_REASON_PHRASE = 'Use Proxy',
    TEMPORARY_REDIRECT_REASON_PHRASE = 'Temporary Redirect',
    PERMANENT_REDIRECT_REASON_PHRASE = 'Permanent Redirect',

    // --- 4xx Client Error ---
    BAD_REQUEST_REASON_PHRASE = 'Bad Request',
    UNAUTHORIZED_REASON_PHRASE = 'Unauthorized',
    PAYMENT_REQUIRED_REASON_PHRASE = 'Payment Required',
    FORBIDDEN_REASON_PHRASE = 'Forbidden',
    NOT_FOUND_REASON_PHRASE = 'Not Found',
    METHOD_NOT_ALLOWED_REASON_PHRASE = 'Method Not Allowed',
    NOT_ACCEPTABLE_REASON_PHRASE = 'Not Acceptable',
    PROXY_AUTHENTICATION_REQUIRED_REASON_PHRASE = 'Proxy Authentication Required',
    REQUEST_TIMEOUT_REASON_PHRASE = 'Request Timeout',
    CONFLICT_REASON_PHRASE = 'Conflict',
    GONE_REASON_PHRASE = 'Gone',
    LENGTH_REQUIRED_REASON_PHRASE = 'Length Required',
    PRECONDITION_FAILED_REASON_PHRASE = 'Precondition Failed',
    PAYLOAD_TOO_LARGE_REASON_PHRASE = 'Payload Too Large',
    REQUEST_ENTITY_TOO_LARGE_REASON_PHRASE = 'Request Entity Too Large',
    URI_TOO_LONG_REASON_PHRASE = 'URI Too Long',
    REQUEST_URI_TOO_LONG_REASON_PHRASE = 'Request-URI Too Long',
    UNSUPPORTED_MEDIA_TYPE_REASON_PHRASE = 'Unsupported Media Type',
    REQUESTED_RANGE_NOT_SATISFIABLE_REASON_PHRASE = 'Requested range not satisfiable',
    EXPECTATION_FAILED_REASON_PHRASE = 'Expectation Failed',
    I_AM_A_TEAPOT_REASON_PHRASE = 'I\'m a teapot',
    INSUFFICIENT_SPACE_ON_RESOURCE_REASON_PHRASE = 'Insufficient Space On Resource',
    METHOD_FAILURE_REASON_PHRASE = 'Method Failure',
    DESTINATION_LOCKED_REASON_PHRASE = 'Destination Locked',
    UNPROCESSABLE_ENTITY_REASON_PHRASE = 'Unprocessable Entity',
    LOCKED_REASON_PHRASE = 'Locked',
    FAILED_DEPENDENCY_REASON_PHRASE = 'Failed Dependency',
    UPGRADE_REQUIRED_REASON_PHRASE = 'Upgrade Required',
    PRECONDITION_REQUIRED_REASON_PHRASE = 'Precondition Required',
    TOO_MANY_REQUESTS_REASON_PHRASE = 'Too Many Requests',
    REQUEST_HEADER_FIELDS_TOO_LARGE_REASON_PHRASE = 'Request Header Fields Too Large',
    UNAVAILABLE_FOR_LEGAL_REASONS_REASON_PHRASE = 'Unavailable For Legal Reasons',

    // --- 5xx Server Error ---
    INTERNAL_SERVER_ERROR_REASON_PHRASE = 'Internal Server Error',
    NOT_IMPLEMENTED_REASON_PHRASE = 'Not Implemented',
    BAD_GATEWAY_REASON_PHRASE = 'Bad Gateway',
    SERVICE_UNAVAILABLE_REASON_PHRASE = 'Service Unavailable',
    GATEWAY_TIMEOUT_REASON_PHRASE = 'Gateway Timeout',
    HTTP_VERSION_NOT_SUPPORTED_REASON_PHRASE = 'HTTP Version not supported',
    VARIANT_ALSO_NEGOTIATES_REASON_PHRASE = 'Variant Also Negotiates',
    INSUFFICIENT_STORAGE_REASON_PHRASE = 'Insufficient Storage',
    LOOP_DETECTED_REASON_PHRASE = 'Loop Detected',
    BANDWIDTH_LIMIT_EXCEEDED_REASON_PHRASE = 'Bandwidth Limit Exceeded',
    NOT_EXTENDED_REASON_PHRASE = 'Not Extended',
}

export enum MediaType {

    ALL = '*/*',
    APPLICATION_ATOM_XML = 'application/atom+xml',
    APPLICATION_FORM_URLENCODED = 'application/x-www-form-urlencoded',
    APPLICATION_JSON = 'application/json',
    APPLICATION_JSON_UTF8 = 'application/json;charset=UTF-8',
    APPLICATION_OCTET_STREAM = 'application/octet-stream',
    APPLICATION_PDF = 'application/pdf',
    APPLICATION_PROBLEM_JSON = 'application/problem+json',
    APPLICATION_PROBLEM_JSON_UTF8 = 'application/problem+json;charset=UTF-8',
    APPLICATION_PROBLEM_XML = 'application/problem+xml',
    APPLICATION_RSS_XML = 'application/rss+xml',
    APPLICATION_STREAM_JSON = 'application/stream+json',
    APPLICATION_XHTML_XML = 'application/xhtml+xml',
    APPLICATION_XML = 'application/xml',
    IMAGE_GIF = 'image/gif',
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    MULTIPART_FORM_DATA = 'multipart/form-data',
    TEXT_EVENT_STREAM = 'text/event-stream',
    TEXT_HTML = 'text/html',
    TEXT_MARKDOWN = 'text/markdown',
    TEXT_PLAIN = 'text/plain',
    TEXT_XML = 'text/xml'
}

export enum HttpMethod {

    GET = 'GET',
    HEAD = 'HEAD',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE'
}

export const XML_HTTP_REQUEST = 'XMLHttpRequest';
