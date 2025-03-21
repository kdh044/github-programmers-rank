"use strict";
const { useAxios } = require("./utils/axios");
const fs = require("fs");
const path = require("path");

const PROGRAMMERS_SIGN_IN = 'https://programmers.co.kr/api/v1/account/sign-in';
const PROGRAMMERS_USER_RECORD = 'https://programmers.co.kr/api/v1/users/record';

async function main() {
    // 환경변수 받아오기
    const id = process.env.PROGRAMMERS_TOKEN_ID || '';
    const pw = process.env.PROGRAMMERS_TOKEN_PW || '';
    let my_data = null;

    console.log(`프로그램 시작. ID: ${id}`);

    // 프로그래머스 로그인 및 데이터 받아오기
    try {
        let res = await useAxios(PROGRAMMERS_SIGN_IN, "POST", { "user": { "email": id, "password": pw } });
        if (res.data) {
            res = await useAxios(PROGRAMMERS_USER_RECORD, "GET", undefined, res.headers["set-cookie"]);
            my_data = res.data;
        }
    } catch (e) {
        console.error('axios error:', e);
        return;
    }

    // svg 파일 생성
    if (my_data) {
        const str = `
            <text text-anchor="middle" x="80" y="45" class="title" style="fill:#0078ff;" stroke="none" stroke-width="1">정복 중인 레벨</text>
            <text text-anchor="middle" x="40" y="85" class="desc" stroke="none" stroke-width="1">${my_data.skillCheck.level}</text>
            <text text-anchor="middle" x="70" y="85" class="desc-2" stroke="none" stroke-width="1">레벨</text>
            <text text-anchor="middle" x="340" y="45" class="title" style="fill:#0078ff;" stroke="none" stroke-width="1">현재 점수</text>
            <text text-anchor="middle" x="360" y="85" class="desc" stroke="none" stroke-width="1">${my_data.ranking.score.toLocaleString('ko-KR')}</text>
            <text text-anchor="middle" x="100" y="150" class="title" style="fill:#0078ff;" stroke="none" stroke-width="1">해결한 코딩 테스트</text>
            <text text-anchor="middle" x="65" y="190" class="desc" stroke="none" stroke-width="1">${my_data.codingTest.solved}</text>
            <text text-anchor="middle" x="120" y="190" class="desc-2" stroke="none" stroke-width="1">문제</text>
            <text text-anchor="middle" x="340" y="150" class="title" style="fill:#0078ff;" stroke="none" stroke-width="1">나의 랭킹</text>
            <text text-anchor="middle" x="370" y="190" class="desc" stroke="none" stroke-width="1">${my_data.ranking.rank.toLocaleString('ko-KR')}</text>
            <text text-anchor="middle" x="450" y="190" class="desc-2" stroke="none" stroke-width="1">위</text>
        </svg>
        `;

        const fileDirectory = path.join(__dirname, '..', 'lib'); // ⬅ dist → lib으로 저장 위치 조정
        const template = fs.readFileSync(path.join(fileDirectory, 'template.svg'), 'utf-8'); // 템플릿 파일로 수정 권장
        const finalSVG = template + str;

        fs.writeFileSync(path.join(fileDirectory, 'result.svg'), finalSVG);
        console.log('✅ result.svg 저장 성공');
    }
}

main();
