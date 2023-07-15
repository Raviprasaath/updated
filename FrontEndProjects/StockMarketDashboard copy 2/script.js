let searchEvent = document.getElementById('search-bar');
let searchBtn = document.getElementById('fetchStart');
let tableBody = document.getElementsByClassName('table-data-filling-in-script')[0];
let searchingOptionLi = document.querySelector('.searching-option-li');

let apiArray = ["AO48IFCXLA3BX1O9", "T4Y29QFCCCFF7V03", "T4Y29QFCCCFF7V03", "7V18I4NFIV62Z5ZP", "HDW0XJ41JMQO936Y", "VU787JW5IOP6PXFZ", "IPW3ZIJPAL09OOPG", "IPW3ZIJPAL09OOPG", "3YI9UO1YNH2VBACE", "WKHEQRWNMJUGI3HG"];

let keyForApi = "AO48IFCXLA3BX1O9";

let apiIndex = 0;
function keyForApiFn() {
  keyForApi = apiArray[apiIndex];
  apiIndex++;
  if (apiIndex == apiArray.length - 1) {
    apiIndex = 0;
  }
}

let choosingTradeDetails = "";

// Searching Function
searchBtn.onclick = function () {
  keyForApiFn();
  let searchingKeyWords = searchEvent.value;
  let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchingKeyWords}&apikey=${keyForApi}`
  console.log(keyForApi);
  let urlforPrice = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${searchingKeyWords}&apikey=${keyForApi}`;

  fetchApiDataForsearch(url);

}


async function fetchApiData(apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=ama&apikey=${keyForApi}`) {
  keyForApiFn();
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Error occurs");
    }
    const data = await response.json();
    console.log(data, " table fetch")

    if (data["Error Message"]) {
      tableBody.innerHTML = "";
      alert("No Data in API");
    }
    else if ("Note".includes("Thank you for using Alpha Vantage")) {
      tableBody.innerHTML = "";
      alert("Please try after some time - Standard API call frequency is 5 calls per minute and 500 calls per day")
    }

    if (data.hasOwnProperty(choosingTradeDetails)) {
      const timeSeries = data[choosingTradeDetails];
      tableDataFill(timeSeries);
    }
  } catch (error) {
    tableBody.innerHTML = "";
    console.log(error, " Error is here");
  }
}


// async function fetchApiDataForsearch(apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=ama&apikey=${keyForApi}`) {
async function fetchApiDataForsearch(apiUrl) {
  keyForApiFn();
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Error occurs");
    }
    const data = await response.json();
    console.log(data, " searching fetch")

    if (data["Error Message"]) {
      tableBody.innerHTML = "";
      alert("No Data in API");
    }
    else if ("Note".includes("Thank you for using Alpha Vantage")) {
      tableBody.innerHTML = "";
      alert("Please try after some time - Standard API call frequency is 5 calls per minute and 500 calls per day")
    }

    searchingOptionLi.innerHTML = "";

    let result = await data.bestMatches;
    if (result === undefined || result.length === 0) {
      searchingOptionLi.innerText = "No Result Found";
    }
    
    if (searchingKey === "allData") {
      searchBarRender(result);
    } else if (searchingKey === "balanceSheet") {
      searchingBalaceSheet(result);
    }
    

  } catch (error) {
    tableBody.innerHTML = "";
    console.log(error, " Error is here");
  }
}




let searchResultData = [];

function searchBarRender(searchValue) {
  console.log(searchValue, " search value")
  searchResultData = (searchValue);

  for (const item of searchValue) {
    searchingOptionLi.innerHTML +=
      `
        <li>
            <div>
                <h3>${item["2. name"]}</h3>
                <h5>${item["1. symbol"]}</h5>
            </div>
            
            <i id="eye" onclick="symboltesting(this.getAttribute('symbol'))" symbol=${item["1. symbol"]} class="fa-solid fa-plus"></i>
        </li>
      `;
  }
}

if (localStorage.length > 0) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));
    (value[0].wishList) && watchListCardRender(value);
  }
  innitallDataShowing(localStorage.key(0));
}

function innitallDataShowing(companyKey) {
  let key = companyKey;
  let value = JSON.parse(localStorage.getItem(key))
  console.log(value);
}


function symboltesting(e) {
  let flag = false;
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === e) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
  }


  console.log(e);
  console.log(localStorage.key(e));
  console.log(e === localStorage.key(e));
  if (!flag) {

    let watchListObject = [];
    searchResultData.forEach((item) => {
      if (item["1. symbol"] == e) {
        const objToPush = {
          name: item["2. name"],
          symbol: item["1. symbol"],
          region: item["4. region"],
          wishList: true
        };

        let getWatchListObject = [];
        let getWatchListObjectstore = JSON.parse(localStorage.getItem(e));
        (getWatchListObjectstore && getWatchListObjectstore.length > 0) && (getWatchListObject = getWatchListObjectstore)
        getWatchListObject.push(objToPush);
        localStorage.setItem(e, JSON.stringify(getWatchListObject));
        watchListObject = getWatchListObject;

      }
    })
    watchListCardRender(watchListObject);
  }
  watchListDataContainer(e);
  intiallyCallingWatchListDataContainer();
}


function watchListCardRender(searchResultData) {

  for (const item of searchResultData) {
    document.getElementsByClassName('random-data-main-page')[0].innerHTML =
      `
      <div class="stock" id="${item.symbol}">
        <div>

            <span class="stock-name">${item.name} </span>
        </div>
        <div class="stock-region"> 
            <span class="stock-symbol"> ${item.symbol} </span>            
            <span class="region-heading">Region</span>
            <span class="region">${item.region}</span>
            
        </div>
        <div class="stock-latest-price">
          
        </div>
        <span>
            <button class="trade-data remove" value="${item.symbol}">Take off</button>
            <button class="trade-data analytics">Data Analytics</button>
        </span>
      </div>
    `
      + document.getElementsByClassName('random-data-main-page')[0].innerHTML
  }
  removingData();
}


// when directly see the data from watch list container
intiallyCallingWatchListDataContainer();
function intiallyCallingWatchListDataContainer() {
  let tradeDataAttachingInDataContainer = document.querySelectorAll('.analytics');

  tradeDataAttachingInDataContainer.forEach((item) => {
    item.addEventListener('click', (e) => {
      let itemName = document.getElementsByClassName('stock');
      for (let i = 0; i < itemName.length; i++) {
        itemName[i].style.border = "";
      }

      const container = e.target.parentElement.parentElement;

      const tradeType = container.childNodes[3].innerText.split(" ")[0];
      typeOfTrade(tradeType);
      container.style.border = '8px solid var(--secondary-color-dark)';
      container.style.scale = "1.05";
    });
  });
}

function watchListDataContainer(e) {
  typeOfTrade(e);
}

function typeOfTrade(entry) {
  let keyWordOfTrade;
  document.querySelectorAll(".trade-selection").forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.innerHTML === 'INTRADAY') {
        keyWordOfTrade = "TIME_SERIES_INTRADAY&interval=5min";
        choosingTradeDetails = "Time Series (5min)";
        // document.querySelector('.trading-type-heading').innerHTML = "Time Series (5min)";
        (e.target.parentElement.children[0].classList.add('active'));
        (e.target.parentElement.children[1].classList.remove('active'));
        (e.target.parentElement.children[2].classList.remove('active'));
        (e.target.parentElement.children[3].classList.remove('active'));
        keyForApiFn();
        document.getElementsByClassName('instruction')[0].style.display = 'none';
      } else if (e.target.innerHTML === 'DAILY') {
        // document.querySelector('.trading-type-heading').innerHTML = "Time Series (Daily)";
        keyWordOfTrade = "TIME_SERIES_DAILY_ADJUSTED"
        choosingTradeDetails = "Time Series (Daily)";
        (e.target.parentElement.children[0].classList.remove('active'));
        (e.target.parentElement.children[1].classList.add('active'));
        (e.target.parentElement.children[2].classList.remove('active'));
        (e.target.parentElement.children[3].classList.remove('active'));
        keyForApiFn();
        document.getElementsByClassName('instruction')[0].style.display = 'none';
      } else if (e.target.innerHTML === 'WEEKLY') {
        // document.querySelector('.trading-type-heading').innerHTML = "Weekly Time Series";
        keyWordOfTrade = "TIME_SERIES_WEEKLY"
        choosingTradeDetails = "Weekly Time Series";
        (e.target.parentElement.children[0].classList.remove('active'));
        (e.target.parentElement.children[1].classList.remove('active'));
        (e.target.parentElement.children[2].classList.add('active'));
        (e.target.parentElement.children[3].classList.remove('active'));
        keyForApiFn();
        document.getElementsByClassName('instruction')[0].style.display = 'none';
      } else if (e.target.innerHTML === 'MONTHLY') {
        // document.querySelector('.trading-type-heading').innerHTML = "Monthly Time Series";
        keyWordOfTrade = "TIME_SERIES_MONTHLY"
        choosingTradeDetails = "Monthly Time Series";
        (e.target.parentElement.children[0].classList.remove('active'));
        (e.target.parentElement.children[1].classList.remove('active'));
        (e.target.parentElement.children[2].classList.remove('active'));
        (e.target.parentElement.children[3].classList.add('active'));
        keyForApiFn();
        document.getElementsByClassName('instruction')[0].style.display = 'none';
      }
      let tradeUrl = `https://www.alphavantage.co/query?function=${keyWordOfTrade}&symbol=${entry}&apikey=${keyForApi}`;
      console.log(tradeUrl, " urllllllllllllllll")
      
      fetchApiData(tradeUrl);
    });
  });
}

let tableHeading = document.getElementsByClassName('table-heading-main')[0];

let tableY = [];
let tableX = [];

// Table data filling
function tableDataFill(e) {
  console.log(e)
  document.getElementById('table-main').style.border = "2px solid black";
  tableHeading.innerHTML =
    `
  <tr class="table-heading">
      <th class="trading-type-heading">Type of Trade</th>
      <th>OPEN</th>
      <th>HIGH</th>
      <th>LOW</th>
      <th>CLOSE</th>
      <th>VOLUME</th>
  </tr>  
  `

  // let tableBody = document.getElementsByClassName('table-data-filling-in-script')[0];
  tableBody.innerHTML = '';
  let count = 0;
  tableY.length = 0;
  tableX.length = 0;

  for (let date in e) {
    if (e.hasOwnProperty(date)) {
      tableY.push(date);

      let rowData = e[date];
      let volume = (rowData['5. volume']);

      if (volume === undefined) {
        volume = (rowData['6. volume']);
      }
      tableX.push(rowData['4. close']);
      let row =
        `
        <tr>
          <td>${date}</td>
          <td>${rowData['1. open']}</td>
          <td>${rowData['2. high']}</td>
          <td>${rowData['3. low']}</td>
          <td>${rowData['4. close']}</td>
          <td>${volume}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
      count++;

      if (count >= 10) {
        break;
      }
    }
  }
  console.log(tableX);
  console.log(tableY);
  graph();
}



// local storage delete

function removingData() {
  let tradeDataAttachingInDataContainer = document.querySelectorAll('.remove');
  tradeDataAttachingInDataContainer.forEach((item) => {
    item.addEventListener('click', (e) => {
      localStorage.removeItem(e.target.value);
      let item = document.getElementById(e.target.value);
      item.remove();
    });
  });
}

// Search Result toggle
let searchBarClose = document.getElementById('search-close-button')
searchBtn.addEventListener('click', () => {
  searchingOptionLi.style.display = 'block';
})
searchBarClose.addEventListener('click', () => {
  searchingOptionLi.style.display = 'none';
  searchEvent.value = "";
})




let leftSideBar = document.getElementsByClassName('left-side-bar')[0];
let barIcon = document.getElementsByClassName('bar-icon')[0];
let barClose = document.getElementsByClassName('bar-close')[0];


barIcon.addEventListener('click', () => {
  console.log("hi")
  leftSideBar.style.display = 'flex';
  barClose.style.display = 'block';
  leftSideBar.style.transition = "2s ease";
})
barClose.addEventListener('click', () => {
  leftSideBar.style.display = 'none';
  barClose.style.display = 'none';
  leftSideBar.style.transition = "2s ease";
})
window.addEventListener('resize', () => {
  if (window.innerWidth > 590) {
    leftSideBar.style.display = 'flex';
  } else {
    leftSideBar.style.display = 'none';
    barClose.style.display = 'none';
  }
})













//--------

function graph () {
  document.getElementsByClassName('graph')[0].style.border = "2px solid black"
  const stockData = {
    // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: tableY,
    datasets: [{
      label: '[Y axis - Stock Closing rate]  [X axis - Trade duration]',
      // data: [200, 300, 450, 500, 550, 400],
      data: tableX,
      // backgroundColor: 'rgb(87, 69, 154)',
      backgroundColor: 'rgb(255, 255, 255, 0.1)',
      borderColor: 'rgb(87, 69, 154)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(87, 69, 154)',
      pointRadius: 5,
      pointBorderWidth: 5,
      tension: 0.4,
    }]
  };

  // Create the chart
  const ctx = document.getElementById('stockChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: stockData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              family: 'Arial',
              size: 12,
              weight: 'bold',
            },
            color: 'rgba(0, 0, 0, 0.5)',
          },
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              family: 'Arial',
              size: 12,
              weight: 'bold',
            },
            color: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
};



let uiSelection = document.getElementsByClassName('user-selection-nav-bar')[0];
let searchingKey;
uiSelection.addEventListener('click', (e)=> {
  let selection = e.target.innerText;
  if (selection.includes("Dashboard")) {
    document.getElementsByClassName('table-of-data')[0].style.display = "block";
    document.getElementsByClassName('data-graph-splitting')[0].style.display = "flex";
    document.getElementsByClassName('rights-side-data')[0].style.display = 'flex';
    document.getElementById('balanceSheet').style.display = 'none';
    searchingKey = "allData";

  } else if (selection.includes("Balance Sheet")) {
    document.getElementsByClassName('table-of-data')[0].style.display = "none";
    document.getElementsByClassName('data-graph-splitting')[0].style.display = "none";
    document.getElementsByClassName('rights-side-data')[0].style.display = 'flex';
    document.getElementById('balanceSheet').style.display = 'block';
    searchingKey = "balanceSheet";

    
  } else if (selection.includes("News")) {
    
  } else if (selection.includes("Inflation")) {
    
  } 
})

let searchResultData12 = [];
let bsName;
function searchingBalaceSheet(result) {
  console.log(result);
  searchResultData12 = (result);
  for (const item of result) {
    
    bsName = item["2. name"];
    searchingOptionLi.innerHTML +=
      `
        <li>
            <div>
                <h3>${item["2. name"]}</h3>
                <h5>${item["1. symbol"]}</h5>
            </div>
            
            <i id="eye" onclick="symbolforBalanceSheet(this.getAttribute('symbol'))" symbol=${item["1. symbol"]} class="fa-solid fa-plus }"></i>
        </li>
      `;
  }
}

function symbolforBalanceSheet(e) {
  console.log(e);
  document.getElementById('nameBS').innerHTML = bsName;
  apiUrlBS = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${e}&apikey=${keyForApi}`;
  balanceSheetApi(apiUrlBS);
  console.log(apiUrlBS)
}

keyForApiFn();


async function balanceSheetApi(apiUrl) {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Error occurred");
    }

    const data = await response.json();
    console.log(data, "table fetch");

    const balanceSheet = data?.quarterlyReports?.[0] || {}; // Access the first quarterly report (you can modify this based on your requirements)
    console.log(balanceSheet);
    console.log(balanceSheet["Total Assets"]);
    
    document.getElementById('bsheet').innerHTML += 
    `<tr>
      <td>${balanceSheet?.totalAssets}</td>
      <td>${balanceSheet?.totalCurrentAssets}</td>
      <td>${balanceSheet?.cashAndCashEquivalentsAtCarryingValue}</td>
      <td>${balanceSheet?.inventory}</td>
      <td>${balanceSheet?.currentNetReceivables}</td>
      <td>${balanceSheet?.totalNonCurrentAssets}</td>
      <td>${balanceSheet?.propertyPlantEquipment}</td>
      <td>${balanceSheet?.intangibleAssets}</td>
      <td>${balanceSheet?.goodwill}</td>
      <td>${balanceSheet?.totalLiabilities}</td>
      </tr>
    `;
  } catch (error) {
    console.log(error, "Error occurred");
  }
}

