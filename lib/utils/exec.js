"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitFile = exports.execCmd = void 0;

const { spawn } = require("child_process");

// 명령어 실행 함수
const execCmd = (cmd, args = []) => new Promise((resolve, reject) => {
    const app = spawn(cmd, args, { stdio: 'pipe' });
    let stdout = '';

    app.stdout.on('data', (data) => {
        stdout += data;
    });

    app.on('close', (code) => {
        if (code !== 0 && !stdout.includes('nothing to commit')) {
            const err = new Error(`${cmd} ${args} \n ${stdout} \n Invalid status code: ${code}`);
            return reject(err);
        }
        return resolve(code);
    });

    app.on('error', reject);
});
exports.execCmd = execCmd;

// git 커밋만 수행 (push 제거)
const commitFile = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.execCmd)('git', ['config', '--global', 'user.email', 'github-programmers-rank@example.com']);
    yield (0, exports.execCmd)('git', ['config', '--global', 'user.name', 'github-programmers-rank[bot]']);
    yield (0, exports.execCmd)('git', ['add', '.']);
    yield (0, exports.execCmd)('git', ['commit', '-m', '프로그래머스 순위 SVG 업데이트']);
});
exports.commitFile = commitFile;
