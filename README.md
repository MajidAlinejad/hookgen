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
npm install -g hookgen
```

or

```bash
yarn global add hookgen
```

## Configuration

HookGen can be configured using a \`.hookgenrc\` file. Below is an example configuration:

```json
{
  "baseUrl": "openapi url",
  "outDir": "./out",
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

After installing HookGen, you can use it in your project to generate TypeScript types and hooks.

### Basic Command

```bash
npm run hookgen
```

### Options

- `"hook": <library>`: Specify the library (SWR, ReactQuery, NG).
- `"outDir": <directory>`: Specify the output directory for the generated files.
- `"archive": <boolean>`: download a copy from current version of swagger json.

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

## Contact

For any inquiries or support, please contact Majid Alinejad at majid.alinejad@example.com.

---

Happy coding!
