require('./setting/env.platform');
const axios  = require('axios');
const cheerio = require('cheerio');


/** 초기회차와 마지막 회차를 반환하는 함수
 * @returns {minRound, maxRound} 초기회차 및 마지막 회차
 */
const getRound = async () => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  const minRound = 733;
  
  const html = await axios.get('https://dhlottery.co.kr/gameResult.do?method=byWin');
  
  const data = cheerio.load(html.data);

  const maxRound = parseInt(data('.win_result h4 strong').text().replace(/[^0-9]/g,''))+1;
  
  console.log('Finish get min, max lottoRound');
  return {minRound, maxRound};
}

const executeSync = async ()=> {
  const { minRound, maxRound } = await getRound();

  console.log(`Wait for second...`);
  console.log(`minRound: ${minRound}, maxRound: ${maxRound}`);

  for(let idx = minRound; idx < maxRound; idx++){
    try {
      await axios.get(`${process.env.API_URL}/api/lotto?key=${process.env.API_KEY}`); //로또번호 수집
    } catch (error) {
      console.log(`처음 한번은 에러가 나는것이 정상입니다.\n 예상된 로또번호가 없기 떄문입니다.`);
    }
    await axios.get(`${process.env.API_URL}/api/lotto/calculator?key=${process.env.API_KEY}`); //로또 알고리즘 계산
    await axios.get(`${process.env.API_URL}/api/lotto/predict/assign?key=${process.env.API_KEY}`); //로또 결과 계산 및 유저에게 바인딩
  }
  console.log('Finish Lotto Server Syncronized!');
}

executeSync();