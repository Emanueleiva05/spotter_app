"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineApplicationDockerfileFactory = exports.DEFAULT_ENTRY_FILE = exports.DEFAULT_IMAGE = void 0;
exports.DEFAULT_IMAGE = 'node:24.18.0-bullseye-slim';
exports.DEFAULT_ENTRY_FILE = 'dist/main.js';
class InlineApplicationDockerfileFactory {
    static create(options) {
        options.image ??= 'node:24.18.0-bullseye-slim';
        let entryFile;
        if (options.entryFile) {
            entryFile = options.entryFile.replace(/\\/g, '/');
        }
        else {
            entryFile = 'dist/main.js';
        }
        const platform = options.cpuArchitecture === 'arm64' ? 'linux/arm64' : 'linux/amd64';
        return `FROM --platform=${platform} ${options.image}
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y curl
RUN npm install --no-audit --legacy-peer-deps
COPY . .
RUN npm run build ${options.applicationName || ''}
RUN if [ ! -f "${entryFile}.js" ]; then \
      echo "ERROR: File '${entryFile}.js' not found." >&2; \
      echo "Please ensure the entry file exists or adjust the path according to your 'nest-cli.json' configuration." >&2; \
      echo "Expected default entry files are:" >&2; \
      echo "  - dist/main.js" >&2; \
      echo "  - dist/apps/<name>/main.js" >&2; \
      echo "If you are using a custom entry file, use the '--entry-file' flag to specify it, or use a custom 'Dockerfile' (--dockerfile flag)." >&2; \
      exit 1; \
    fi
CMD [ "node", "${entryFile}" ]`;
    }
}
exports.InlineApplicationDockerfileFactory = InlineApplicationDockerfileFactory;
