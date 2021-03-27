const axios  = require('axios');
const cheerio = require('cheerio');

/** 초기회차와 마지막 회차를 반환하는 함수
 * @returns {minRound, maxRound} 초기회차 및 마지막 회차
 */
const getRound = async () => {
    const minRound = 733;
  
  const html = await axios.get('https://dhlottery.co.kr/gameResult.do?method=byWin');
  
  const data = cheerio.load(html.data);
  
  const maxRound = data('.win_result h4 strong').text().replace(/[^0-9]/g,'');
  
  console.log('Finish get min, max lottoRound');
  return {minRound, maxRound};
}

const executeSync = async ()=> {
  const { minRound, maxRound } = await getRound();

  for(let idx = minRound; idx < maxRound; idx++){
    try {
      await axios.get('http://localhost:8080/api/lotto'); //로또번호 수집
    } catch (error) {
      console.log(error.message());
    }
    await axios.get('http://localhost:8080/api/lotto/calculator'); //로또 알고리즘 계산
    await axios.get('http://localhost:8080/api/lotto/predict/assign'); //로또 결과 계산 및 유저에게 바인딩
  }
  console.log('Finish Lotto Server Syncronized!');
}

executeSync();