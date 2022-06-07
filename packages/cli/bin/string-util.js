"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const ui_redux_1 = require("@yield-protocol/ui-redux");
const program = new commander_1.Command();
program
    .name('string-util')
    .description('CLI to some JavaScript string utilities')
    .version('0.8.0');
ui_redux_1.store.subscribe(() => console.log('werwerwe'));
program.command('split')
    .description('Split a string into substrings and display as an array')
    .argument('<string>', 'string to split')
    .option('--first', 'display just the first substring')
    .option('-s, --separator <char>', 'separator character', ',')
    .action((str, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log(ui_redux_1.store.getState());
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
}));
program.parse();
//# sourceMappingURL=string-util.js.map