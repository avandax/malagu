import { ConfigProvider } from './config-protocol';
import { ContainerUtil } from '../container';
import { config } from './dynamic-config';
import { globalThis } from '../utils';

export namespace ConfigUtil {
    export function get<T>(key: string, defaultValue?: T): T {
        return ContainerUtil.get<ConfigProvider>(ConfigProvider).get(key, defaultValue);
    }

    export function getRaw() {
        return globalThis.malaguProps || config;
    }
}
