import chalk from 'chalk';

export function warnComponent(name: string) {
  console.warn(
    chalk.yellow(
      ' └ "' +
        name +
        '" dose not have any type! typescript may have problem with this! we set it to "unknown"'
    )
  );
}
