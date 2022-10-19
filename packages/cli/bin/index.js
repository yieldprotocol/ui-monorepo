"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('yield')
    .description('CLI to Yield Protocol')
    .version('0.8.0');
program.command('inspect')
    .description('Inspect the Yield Protocol')
    .argument('<string>', 'string to split')
    .option('--first', 'display just the first substring')
    .option('-s, --separator <char>', 'separator character', ',')
    .action((str, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    // store.subscribe( () => console.log('GLOBAL STATE: ', store.getState() ));
    // console.log('state in call :', store.getState() );
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
}));
program.parse();
//# sourceMappingURL=index.js.map