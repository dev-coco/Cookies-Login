function doGet (request) {
  const params = request.parameter
  const action = params.action
  let data = ''
  if (action === 'getData') data = getData()
  if (action === 'setData') data = setData(params.userID)
  return ContentService.createTextOutput(JSON.stringify(data))
}

function setData (userID) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const row = sheet.getRange('B:B').createTextFinder(userID).findNext().getRow()
  sheet.getRange(`C${row}`).setValue('Login')
  return { status: 'Login' }
}

function getData () {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const data = sheet.getRange('A:C').getValues()
  const arr = []
  for (const info of data) {
    if (info[0] && info[1] && !info[2]) arr.push([info[0], info[1]])
  }
  const index = Math.floor((Math.random()*arr.length))
  if (arr.length === 0) return { url: 'none', cookie: 'none'}
  return { url: arr[index][0], cookie: arr[index][1]}
}
