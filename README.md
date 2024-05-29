# HookGen

HookGen is a powerful tool designed to generate TypeScript types and code for Angular, React, and Next.js applications. It streamlines the development process by automating the creation of hooks and related types.

## Features

- Generates TypeScript types for your project.
- Supports Angular, React, and Next.js frameworks.
- Simplifies the creation of hooks and other reusable code.
- Enhances code consistency and reduces boilerplate.

## Installation

To install HookGen, you can use npm or yarn:

```bash
npm install hook-gen --save-dev
```

or

```bash
yarn add hook-gen --dev
```

## Configuration

HookGen can be configured using a \`.hookgenrc\` file. Below is an example configuration:

```json
{
  "baseUrl": "openapi url",
  "outDir": "./out",
  "singleJson": true,
  "hook": "ReactQuery", // SWR - ReactQuery -  NG
  "archive": true,
  "fileTypes": {
    "enums": "ts",
    "types": "d.ts",
    "client": "ts",
    "api": "ts",
    "hook": "ts"
  },
  "prettier": {
    "singleQuote": false,
    "useTabs": true,
    "tabWidth": 4,
    "printWidth": 200,
    "parser": "typescript"
  }
}
```

## Usage

Add following line to your package.json file at script section:

```json
{
  "scripts": {
    "hook-gen": "hook-gen",
    "start": "***",
    "lint": "***",
    "test": "***"
  }
}
```

After installing HookGen, you can use it in your project to generate TypeScript types and hooks.

### Basic Command

```bash
npm run hook-gen
```

### Options

- `"baseUrl": <url>`: Set base url of open api.
- `"hook": <library>`: Specify the library (SWR, ReactQuery, NG).
- `"outDir": <directory>`: Specify the output directory for the generated files.
- `"archive": <boolean>`: download a copy from current version of swagger json.
- `"singleJson": <boolean>`: If it's 'true' base url must be end in .json file otherwise base url must be your openapi root url

## Contributing

We welcome contributions to HookGen! If you have suggestions or bug reports, please open an issue or submit a pull request.

### Running Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/MajidAlinejad/hookgen.git
cd hookgen
npm install
```

Run the project locally:

```bash
npm start
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

We appreciate the contributions of the open-source community and the developers who have helped make this project possible.

## Contributors

<a href="https://github.com/MajidAlinejad"  >
<img style="border-radius:100%" width="40" alt="Majid Alinejad" src="https://avatars.githubusercontent.com/u/25850003?s=400&u=bd3ade163371339aca49cb094759232a416077d4&v=4">
</a>
<a href="https://github.com/farhadrezvani"  >
<img style="border-radius:100%" width="40" alt="Farhad Rezvani" src="https://avatars.githubusercontent.com/u/10855997?v=4">
</a>

## Contact

For any inquiries or support, please contact Majid Alinejad at majid.alinejad@example.com.

---

Happy coding!
