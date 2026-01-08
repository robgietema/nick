const path = require('path');
const Generator = require('yeoman-generator');
const { exec } = require('child_process');

const currentDir = path.basename(process.cwd());

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('projectName', {
      type: String,
      default: currentDir,
    });
    this.option('description', {
      type: String,
      desc: 'Project description',
    });

    this.args = args;
    this.opts = opts;
  }

  async prompting() {
    const updateNotifier = require('update-notifier');
    const pkg = require('../../package.json');
    const notifier = updateNotifier({
      pkg,
      shouldNotifyInNpmScript: true,
      updateCheckInterval: 0,
    });
    notifier.notify({
      defer: false,
      message: `Update available: {currentVersion} -> {latestVersion}

It's important to have the generators updated!

Run "npm install -g @robgietema/generator-nick" to update.`,
    });

    let props;

    this.globals = {};

    // Project name
    if (this.args[0]) {
      this.globals.projectName = this.args[0];
    } else {
      if (this.opts['interactive']) {
        props = await this.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'Project name (e.g. my-nick-project)',
            default: path.basename(process.cwd()),
          },
        ]);
        this.globals.projectName = props.projectName;
      } else {
        this.globals.projectName = path.basename(process.cwd());
      }
    }

    // Description
    if (this.opts.description) {
      this.globals.projectDescription = this.opts.description;
    } else {
      this.globals.projectDescription = 'A Nick-powered Backend';
    }
  }

  writing() {
    const base =
      currentDir === this.globals.projectName ? '.' : this.globals.projectName;
    this.fs.copyTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath(base, 'package.json'),
      this.globals,
    );
    this.fs.copyTpl(
      this.templatePath('config.js.tpl'),
      this.destinationPath(base, 'config.js'),
      this.globals,
    );

    this.fs.copy(this.templatePath(), this.destinationPath(base), {
      globOptions: {
        ignore: ['**/*.tpl', '**/*~'],
        dot: true,
      },
    });

    this.fs.copyTpl(
      this.templatePath('src/profiles/default/metadata.json.tpl'),
      this.destinationPath(base, 'src/profiles/default/metadata.json'),
      this.globals,
    );

    this.fs.copyTpl(
      this.templatePath('.gitignorefile'),
      this.destinationPath(base, '.gitignore'),
      this.globals,
    );

    this.fs.delete(this.destinationPath(base, 'config.js.tpl'));
    this.fs.delete(this.destinationPath(base, 'package.json.tpl'));
    this.fs.delete(this.destinationPath(base, '.gitignorefile'));
  }

  async install() {
    if (!this.opts['skip-install']) {
      const base =
        currentDir === this.globals.projectName
          ? '.'
          : this.globals.projectName;
      await exec(`pnpm install --cwd ${base}`);
    }
  }

  end() {
    if (!this.opts['skip-install']) {
      this.log(
        `
Done.

Now install and run Postgres and setup the database by entering the following in your Postgres console:

$ CREATE DATABASE "${this.globals.projectName}";
$ CREATE USER "${this.globals.projectName}" WITH ENCRYPTED PASSWORD '${this.globals.projectName}';
$ GRANT ALL PRIVILEGES ON DATABASE "${this.globals.projectName}" TO "${this.globals.projectName}";

Now go to the ${this.globals.projectName} folder and run:

pnpm bootstrap
pnpm start
`,
      );
    } else {
      this.log(`
Done.

Now install and run Postgres and setup the database by entering the following in your Postgres console:

$ CREATE DATABASE "${this.globals.projectName}";
$ CREATE USER "${this.globals.projectName}" WITH ENCRYPTED PASSWORD '${this.globals.projectName}';
$ GRANT ALL PRIVILEGES ON DATABASE "${this.globals.projectName}" TO "${this.globals.projectName}";

Now go to the ${this.globals.projectName} folder and run:

pnpm install
pnpm bootstrap
pnpm start
`);
    }
  }
};
