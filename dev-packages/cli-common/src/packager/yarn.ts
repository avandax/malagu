import { spawnProcess, SpawnError } from './utils';
import { readFile, writeFile } from 'fs-extra';
import { Packager , InstallOptions, PruneOptions, AddOptions} from './packager-protocol';

export class Yarn implements Packager {
    get lockfileName() {
        return 'yarn.lock';
    }

    get copyPackageSectionNames() {
        return ['resolutions'];
    }

    get mustCopyModules() {
        return false;
    }

    async getProdDependencies(depth: number, cwd = process.cwd()) {
        const command = /^win/.test(process.platform) ? 'yarn.cmd' : 'yarn';
        const args = ['list', `--depth=${depth || 1}`, '--json', '--production'];
        // If we need to ignore some errors add them here
        const ignoredYarnErrors: any[] = [];
        let processOutput: any;
        try {
            processOutput = await spawnProcess(command, args, { cwd: cwd });
        } catch (err) {
            if (err instanceof SpawnError) {
                // Only exit with an error if we have critical npm errors for 2nd level inside
                const errors = err.stderr ? err.stderr.split('\n') : [];
                const failed = errors.reduce((f: boolean, error: any) => {
                    if (f) {
                        return true;
                    }
                    return (
                        error &&
                        !ignoredYarnErrors.some(ignoredError => error.startsWith(error, `npm ERR! ${ignoredError.npmError}`))
                    );
                },
                false
                );

                if (!failed && !err.stdout) {
                    processOutput = { stdout: err.stdout };
                }
            } else {
                throw err;
            }

        }
        const parsedTree = JSON.parse(processOutput?.stdout);
        const convertTrees = (trees: any) =>
            trees.reduce((accumulator: any, tree: any) => {
                const splitModule = tree.name.split('@');
                if (tree.name.startsWith('@')) {
                    splitModule.splice(0, 1);
                    splitModule[0] = '@' + splitModule[0];
                }
                accumulator[splitModule[0]] = {
                    version: splitModule.slice(1).join('@'),
                    dependencies: convertTrees(tree.children)
                };
                return accumulator;

            }, {});

        return {
            problems: [],
            dependencies: convertTrees(parsedTree.data.trees || [])
        };
    }

    readLockfile(lockfilePath: string) {
        return readFile(lockfilePath, 'utf8');
    }

    writeLockfile(lockfilePath: string, content: string) {
        return writeFile(lockfilePath, content, 'utf8');
    }

    rebaseLockfile(pathToPackageRoot: string, lockfile: string) {
        const fileVersionMatcher = /[^"/]@(?:file:)?((?:\.\/|\.\.\/).*?)[":,]/gm;
        const replacements = [];
        let match;

        // Detect all references and create replacement line strings
        // eslint-disable-next-line no-null/no-null
        while ((match = fileVersionMatcher.exec(lockfile)) !== null) {
            replacements.push({
                oldRef: match[1],
                newRef: `${pathToPackageRoot}/${match[1]}`.replace(/\\/g, '/')
            });
        }

        // Replace all lines in lockfile
        return replacements.reduce((__, replacement) => __.replace(replacement.oldRef, replacement.newRef), lockfile);
    }

    install(opts?: InstallOptions, cwd = process.cwd()) {
        const command = /^win/.test(process.platform) ? 'yarn.cmd' : 'yarn';
        const args = ['install'];

        // Convert supported packagerOptions
        if (opts?.ignoreScripts) {
            args.push('--ignore-scripts');
        }
        if (opts?.frozenLockfile) {
            args.push('--frozen-lockfile');
        }
        if (opts?.nonInteractive) {
            args.push('--non-interactive');
        }
        if (opts?.ignoreOptional) {
            args.push('--ignore-optional');
        }
        if (opts?.networkConcurrency) {
            args.push(`--network-concurrency ${opts.networkConcurrency}`);
          }
        return spawnProcess(command, args, { cwd, stdio: opts?.stdio || 'inherit' });
    }

    add(packages: string[], opts?: AddOptions, cwd = process.cwd()) {
        const command = /^win/.test(process.platform) ? 'yarn.cmd' : 'yarn';
        const args = opts?.global ? [ 'global' ] : [];
        args.push(...[ 'add', ...packages ]);
        if (opts?.exact) {
            args.push('--exact');
        }
        if (opts?.dev) {
            args.push('--dev');
        }
        return spawnProcess(command, args, { cwd, stdio: opts?.stdio || 'inherit' });
    }

    // "Yarn install" prunes automatically
    prune(opts?: PruneOptions, cwd = process.cwd()) {
        return this.install(opts, cwd);
    }

    runScripts(scriptNames: string[], cwd = process.cwd()) {
        const command = /^win/.test(process.platform) ? 'yarn.cmd' : 'yarn';
        const promises = scriptNames.map(scriptName => {
            const args = ['run', scriptName];
            return spawnProcess(command, args, { cwd });
        });
        return Promise.all(promises);
    }
}
