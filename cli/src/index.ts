#!/usr/bin/env node

/**
 * figma-bridge CLI
 *
 * Usage:
 *   figma-bridge serve                        Start the bridge server
 *   figma-bridge status                       Check connection health
 *   figma-bridge <command> [json-args]         Send a command to Figma
 *   figma-bridge help                         Show available commands
 */

import { serve } from './server.js';
import { status, runCommand } from './client.js';
import { commands, printHelp } from './commands.js';

const args = process.argv.slice(2);
const subcommand = args[0];

if (!subcommand || subcommand === 'help' || subcommand === '--help' || subcommand === '-h') {
  printHelp();
  process.exit(0);
}

if (subcommand === 'serve') {
  serve().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
} else if (subcommand === 'status') {
  status().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  // Treat as a Figma command
  const command = subcommand;
  let commandArgs: Record<string, any> = {};

  // Parse JSON args (positional or --json flag)
  const jsonArg = args[1];
  if (jsonArg) {
    try {
      commandArgs = JSON.parse(jsonArg);
    } catch {
      console.error(`Invalid JSON argument: ${jsonArg}`);
      console.error('Usage: figma-bridge <command> \'{"key": "value"}\'');
      process.exit(1);
    }
  }

  // Validate command exists (warn but don't block — plugin may have newer commands)
  const known = commands.find(c => c.type === command);
  if (!known) {
    console.error(`Warning: Unknown command "${command}". Sending anyway.\n`);
  }

  runCommand(command, commandArgs).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
