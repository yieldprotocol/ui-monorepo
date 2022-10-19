import { Command } from 'commander';
import { store } from '@yield-protocol/ui-redux';

const program = new Command();

program
  .name('yield')
  .description('CLI to Yield Protocol')
  .version('0.8.0');

program.command('inspect')
  .description('Inspect the Yield Protocol')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action(async (str, options) => {
    // store.subscribe( () => console.log('GLOBAL STATE: ', store.getState() ));
    // console.log('state in call :', store.getState() );
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();