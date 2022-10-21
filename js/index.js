const wrap = document.querySelector('.wrapToday');
const dateElm = document.querySelector('.dateElm');
const timeElm = document.querySelector('.timeElm');
const nowCode = document.querySelector('.code');
const degree = document.querySelector('.degree');
const middleBlock = document.querySelector('.middleBlock');
const modalBg = document.querySelector('.modalBg');
const modalBox = document.querySelector('.modal-box');
let weekHourlyHtml = '';
let detailHtml = '';
let dayOfWeek;
let weatherCodeObject = {};
let modalTextObject = {};

let animationFlag = false;

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const date = new Date();
let year;
let month;
let day;

function strDate() {
    const nowDate = new Date();
    year = nowDate.getFullYear();
    month = nowDate.getMonth() + 1;
    day = nowDate.getDate();
    const todayOfWeek = week[nowDate.getDay()];
    const hours = nowDate.getHours();
    const minutes = nowDate.getMinutes();
    const seconds = nowDate.getSeconds();

    const dateText = `${year}.${month}.${day}.${todayOfWeek}`;
    const timeText = `${hours.toString().padStart('2', '0')}.${minutes.toString().padStart('2', '0')}.${seconds.toString().padStart('2', '0')}`;

    dateElm.textContent = dateText;
    timeElm.textContent = timeText;
}

setInterval(strDate, 1000);


function request() {
    return new Promise(function (resolve) {//天気予報のデータをリクエスト
        fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo')
            .then(function (response) {
                if (response.ok) {//レスポンスがokだったらJSON形式に変換
                    return response.json();
                } else {
                    console.log('通信エラー');
                }
            }).then(function (data) {//変換が出来たら1時間事の天気予報（hourly）と、週間天気予報（daily）のデータを配列にする
                resolve([data['hourly'], data['daily']]);
            });
    })
}

// function modalBgColor(name) {
//     switch (name) {
//         case "fineWeather":
//             modalBox.style.backgroundColor = "rgba(238, 99, 0, 0.9)";
//             modalTextObject.color = "rgba(238, 99, 0, 0.9)";
//             break;
//         case "sunny":
//             modalBox.style.backgroundColor = "rgba(238, 99, 0, 0.9)";
//             break;
//         case "partlyCloudy":
//             modalBox.style.backgroundColor = "rgba(214, 93, 0, 0.9)";
//             break;
//         case "cloudy":
//             modalBox.style.backgroundColor = "rgba(77, 77, 77, 0.9)";
//             break;
//         case "fog":
//             modalBox.style.backgroundColor = "rgba(112, 128, 144, 0.9)";
//             break;
//         case "drizzle":
//             modalBox.style.backgroundColor = "rgba(22, 94, 131, 0.9)";
//             break;
//         case "rain":
//             modalBox.style.backgroundColor = "rgba(65, 105, 225, 0.9)";
//             break;
//         case "snow":
//             modalBox.style.backgroundColor = "rgba(25, 0, 99, 0.9)";
//             break;
//         case "shower":
//             modalBox.style.backgroundColor = "rgba(106, 90, 205, 0.9)";
//             break;
//         case "hail":
//             modalBox.style.backgroundColor = "rgba(77, 77, 77, 0.9)";
//             break;
//         case "thunderstorm":
//             modalBox.style.backgroundColor = "rgba(248, 180, 0, 0.9)";
//             break;
//     }
// }

//ウェザーコードの値に応じて、text・bgColor・dataをobjectに格納して返す
function weatherCode(codeData) {
    switch (true) {
        case codeData === 0:
            weatherCodeObject.text = "快晴";
            weatherCodeObject.bgColor = "rgba(238, 99, 0, 0.5)";
            weatherCodeObject.data = "fineWeather";
            break;
        case codeData === 1:
            weatherCodeObject.text = "晴れ";
            weatherCodeObject.bgColor = "rgba(238, 99, 0, 0.5)";
            weatherCodeObject.data = "sunny";
            break;
        case codeData === 2:
            weatherCodeObject.text = "一部曇り";
            weatherCodeObject.bgColor = "rgba(214, 93, 0, 0.5)";
            weatherCodeObject.data = "partlyCloudy";
            break;
        case codeData === 3:
            weatherCodeObject.text = "曇り";
            weatherCodeObject.bgColor = "rgba(77, 77, 77, 0.5)";
            weatherCodeObject.data = "cloudy";
            break;
        case codeData <= 49:
            weatherCodeObject.text = "霧"
            weatherCodeObject.bgColor = "rgba(112, 128, 144, 0.5)";
            weatherCodeObject.data = "fog";
            break;
        case codeData <= 59:
            weatherCodeObject.text = "霧雨"
            weatherCodeObject.bgColor = "rgba(22, 94, 131, 0.5)";
            weatherCodeObject.data = "drizzle";
            break;
        case codeData <= 69:
            weatherCodeObject.text = "雨"
            weatherCodeObject.bgColor = "rgba(65, 105, 225, 0.5)";
            weatherCodeObject.data = "rain";
            break;
        case codeData <= 79:
            weatherCodeObject.text = "雪"
            weatherCodeObject.bgColor = "rgba(25, 0, 99, 0.5)";
            weatherCodeObject.data = "snow";
            break;
        case codeData <= 84:
            weatherCodeObject.text = "にわか雨"
            weatherCodeObject.bgColor = "rgba(106, 90, 205, 0.5)";
            weatherCodeObject.data = "shower";
            break;
        case codeData <= 94:
            weatherCodeObject.text = "雪・霰"
            weatherCodeObject.bgColor = "rgba(77, 77, 77, 0.5)";
            weatherCodeObject.data = "hail";
            break;
        case codeData <= 99:
            weatherCodeObject.text = "雷雨"
            weatherCodeObject.bgColor = "rgba(248, 180, 0, 0.5)";
            weatherCodeObject.data = "thunderstorm";
            break;
        default:
            code.textContent = "不明";
    }
}

//当日の天気予報を表示
function nowWeather(temperature, code) {
    const getTime = date.getHours();
    weatherCode(code[getTime]);
    wrap.style.background = weatherCodeObject.bgColor;
    degree.textContent = `${temperature[getTime]}°`;
    nowCode.textContent = weatherCodeObject.text;
}

//一週間の天気予報を表示
function weekWeather(temperatureMax, temperatureMin, code, time) {
    const codeLength = code.length;
    for (let i = 1; i < codeLength; i++) {
        timeCompile = time[i].substring(5).replace('-', '.');//一日ずつの日付を表示
        year = date.getFullYear();
        month = date.getMonth();
        day = date.getDate() + i;
        const dayOfBirth = new Date(year, month, day);
        dayOfWeek = week[dayOfBirth.getDay()];//曜日を取得
        weatherCode(code[i]);//1日単位の天気予報を取得
        weekHourlyHtml +=
            `<li>
                <div class="wrapWeek box" style="background: ${weatherCodeObject.bgColor}">
                    <div class="weekDay">
                        <p>${timeCompile}.${dayOfWeek}</p>
                    </div>
                    <div class="weekCode">
                        <p>${weatherCodeObject.text}</p>
                    </div>
                    <div class="temperature">
                        <p>${temperatureMax[i]}°&thinsp;/&thinsp;${temperatureMin[i]}°</p>
                    </div>
                </div>
            </li>`
            ;
    }
    middleBlock.innerHTML = `<ul>${weekHourlyHtml}</ul>`;
}

//一日の天気の詳細を表示
function modalInnerElm(timeList, codeList, temperatureList, dayTemperatureMax, dayTemperatureMIn, dayCode, month, day, dayOfWeek) {

    weatherCode(dayCode);//1日単位のウェザーコードを取得

    let detailDate = `
    <div class="detailBlock01">
        <p>${month}.${day}.${dayOfWeek}</p>
    </div>
    <div class="detailBlock02">
        <div class="detail-code">
            <p>${weatherCodeObject.text}</p>
        <div>
        <div class="detail-temperature">
        <p>${dayTemperatureMax}°&thinsp;/&thinsp;${dayTemperatureMIn}°</p>
        <div>
    </div>
    `;

    for (let i = 0; i < timeList.length; i++) {
        weatherCode(codeList[i])
        detailHtml += 
            `
            <li data-name="${weatherCodeObject.data}">
                <div class="timeLineBlock01">
                    <p>${timeList[i].slice(11, 16)}</p>
                </div>
                <div class="timeLineBlock02">
                    <p>${weatherCodeObject.text}</p>
                </div>
                <div class="timeLineBlock03">
                    <p>${temperatureList[i]}</p>
                </div>
            </li>
            `;
    }

    modalBox.innerHTML = 
    `
        <div class="modal-inner">
            ${detailDate}
            <ul>
            ${detailHtml}
            </ul>
        </div>
    `;
    const modalInner = document.querySelector('.modal-inner');

    modalBox.addEventListener('animationend', function () {//モーダルインナー要素表示
        // const timeLineList = modalBox.getElementsByTagName('li');
        modalInner.classList.add('open');
        // for (const timeLine of timeLineList) {
        //     timeLine.addEventListener('mouseover', function () {
        //         modalBgColor(timeLine.dataset.name);
        //         modalBox.style.color = "#fff";
        //     });
        //     timeLine.addEventListener('mouseout', function () {
        //         modalBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        //         modalBox.style.color = "#000";
        //     });
        // }
    });

    modalBg.addEventListener('click', function () {//モーダルクローズ
        modalBox.classList.add('modalOut');
        modalInner.classList.remove('open');
        animationFlag = true;
    });

    modalBox.addEventListener('animationend', function () {//モーダルBgクローズ
        detailDate = '';
        detailHtml = '';
        if (animationFlag) {
            modalBg.classList.remove('modalOpen');
            modalBox.classList.remove('modalOpen');
            modalInner.classList.remove('open');
        }
        animationFlag = false;
    });
}

//モーダルに表示するためのデータ作成
function modalInnerdata(temperatureMax, temperatureMin, weeksCode, temperatureList, codeList, timeList) {

    let variableTime;
    let variableCode;
    let variableTemperture;
    let weekTemperatureMax;
    let weekTemperatureMIn;
    let weekCode;

    function dataGroup(num) {
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate() + num;
        dayOfBirth = new Date(year, (month - 1), day);
        dayOfWeek = week[dayOfBirth.getDay()];//曜日を取得
        variableTime = timeList.slice(num * 24, (num + 1) * 24);//1週間分の時間配列を、1日（24時間）ずつに区切る
        variableCode = codeList.slice(num * 24, (num + 1) * 24);//1週間分のウェザーコード配列を、1日（24時間）ずつに区切る
        variableTemperture = temperatureList.slice(num * 24, (num + 1) * 24);//1週間分の気温配列を、1日（24時間）ずつに区切る
        weekTemperatureMax = temperatureMax[num];//1週間分の最高気温を1日ずつに区切る
        weekTemperatureMIn = temperatureMin[num];//1週間分の最低気温を1日ずつに区切る
        weekCode = weeksCode[num];//1週間分のウェザーコードを、1日ずつに区切る
        modalInnerElm(variableTime, variableCode, variableTemperture, weekTemperatureMax, weekTemperatureMIn, weekCode, month, day, dayOfWeek);
        modalBg.classList.add('modalOpen');
        modalBox.classList.add('modalOpen');
        if (modalBox.classList.contains('modalOut')) {
            modalBox.classList.remove('modalOut');
        }
    }


    const boxList = document.querySelectorAll('.box');

    boxList.forEach((box, index) => {
        box.addEventListener('click', function () {
            switch (index) {
                case 0:
                    dataGroup(0);
                    break;
                case 1:
                    dataGroup(1);
                    break;
                case 2:
                    dataGroup(2);
                    break;
                case 3:
                    dataGroup(3);
                    break;
                case 4:
                    dataGroup(4);
                    break;
                case 5:
                    dataGroup(5);
                    break;
                case 6:
                    dataGroup(6);
                    break;
            }
        });
    });
}


request().then(function (data) {
    console.log(data);
    const variableData = data[0];
    const weeks = data[1];
    nowWeather(variableData.temperature_2m, variableData.weathercode);
    weekWeather(weeks.temperature_2m_max, weeks.temperature_2m_min, weeks.weathercode, weeks.time);
    modalInnerdata(weeks.temperature_2m_max, weeks.temperature_2m_min, weeks.weathercode, variableData.temperature_2m, variableData.weathercode, variableData.time);
});