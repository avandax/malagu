import { CliContext, ContextUtils } from '@malagu/cli-common/lib/context/context-protocol';
import { HookExecutor, HookStage } from '@malagu/cli-common/lib/hook/hook-executor';
import { LoggerUtil } from '@malagu/cli-common/lib/utils/logger-util';

export interface InfoOptions {}

export default async (cliContext: CliContext, options: InfoOptions) => {
    try {
        cliContext.options = options;
        const ctx = await ContextUtils.createInfoContext(cliContext);
        const hookExecutor = new HookExecutor();
        await hookExecutor.executeInfoHooks(ctx, HookStage.before);

        LoggerUtil.printStage(ctx);
        LoggerUtil.printMode(ctx);
        LoggerUtil.printTargets(ctx);
        LoggerUtil.printComponents(ctx);

        await hookExecutor.executeInfoHooks(ctx);
    } catch (error) {
        console.error(error);
        process.exit(-1);
    }
};
