function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('全期間のメッセージ');
  var json = JSON.parse(e.postData.getDataAsString());
  if (json.type === 'url_verification') {
    return ContentService.createTextOutput(json.challenge);
  }
  var nowTime = time()
  var userId = json.event.user;
  var text = json.event.text;

  //カウントする絵文字と、リストを表示するテキストを設定
  if (text.includes(':ここに絵文字を記入:')) {
    array = [nowTime, userId, text];
    sheet.appendRow(array);
  } else if (text == 'Hey chers!' || text == 'chers!') {
    sortData()
  }
  return
}
function sortData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ピアボーナスManage');
  var beerData = sheet.getRange(4, 6, sheet.getLastRow() - 3, 3).getValues();
  Logger.log(beerData)
  var sortReceivedData = []
  var sortGivenData = []
  beerData.sort((a, b) => {
    return (b[1] - a[1])
  })
  sortReceivedData = sortReceivedData.concat(beerData)
  beerData.sort((a, b) => {
    return (b[2] - a[2])
  })
  sortGivenData = sortGivenData.concat(beerData)
  prepareMessage(sortReceivedData, sortGivenData)
}

function prepareMessage(receiveData, sortData) {
  var message = "今週もお疲れ-!:speaking_head_in_silhouette:";
  var receiveMessage = "\n== 今週のreceiveAward  ==\n";
  var giveMessage = "\n== 今週のgiveAward  ==\n";
  var receiveArray = '';
  var giveArray = '';
  for (let i = 0; i < receiveData.length; i++) {
    var receiveText = receiveData[i][0] + ':ここに絵文字を記入::heavy_multiplication_x:' + receiveData[i][1] + '\n';
    receiveArray += receiveText;
    var giveText = sortData[i][0] + ':ここに絵文字を記入::heavy_multiplication_x:' + sortData[i][2] + '\n';
    giveArray += giveText;
  }
  var text = message + "\n" + receiveMessage + receiveArray + "\n" + giveMessage + giveArray;
  toSlack(text)
}
function toSlack(text) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('セッティング');
  var webHook = sheet.getRange("A2").getValue();
  var jsonData =
  {
    "username": "ピアボーナス",
    "icon_emoji": ":ここに絵文字を記入:",
    "text": text
  };
  var payload = JSON.stringify(jsonData);
  var options =
  {
    "method": "post",
    "contentType": "application/json",
    "payload": payload
  };

  UrlFetchApp.fetch(webHook, options);

}
function time() {
  var datetime = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  return toDate(datetime);
}
function toDate(date) {
  var day = date.getFullYear() +
    "/" + (date.getMonth() + 1) +
    "/" + date.getDate()
  // " " + date.getHours() +
  // ":" + date.getMinutes();
  return day
}
