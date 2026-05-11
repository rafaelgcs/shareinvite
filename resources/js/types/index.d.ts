import { User } from './models';

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    auth: {
        user: User;
    };
    flash: {
        message: string | null;
        error: string | null;
    };
    [key: string]: unknown;
}

export type { User, Event, Guest, Plan, EventLocation, EventNotice } from './models';

import { Config, RouteParam, RouteParamsWithQueryOverload } from 'ziggy-js';

declare global {
    var route: ((
        name?: string,
        params?: RouteParamsWithQueryOverload | RouteParam,
        absolute?: boolean,
        config?: Config
    ) => string) & {
        current: (name?: string, params?: RouteParamsWithQueryOverload | RouteParam, config?: Config) => boolean;
        check: (name?: string, params?: RouteParamsWithQueryOverload | RouteParam, config?: Config) => boolean;
    };
}
