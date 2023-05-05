chrome.tabs.onCreated.addListener(function(tab) {
  if (!tab.index) init()
})

const scriptUrl = ''

async function init () {
  const state = await accountState()
  console.log(state)
  if (state) return
  // 获取配置
  const json = await fetch(`${scriptUrl}?action=getData`).then(response => response.json())
  const url = json.url
  if (url === 'none') return
  const arr = []
  const cookieParams = formatCookie(json.cookie).split(';')
  for (const param of cookieParams) {
    const info = param.split('=')
    arr.push({
      domain: url,
      url: `https://${url}`,
      name: info[0],
      value: info[1]
    })
  }
  // 设置 cookie
  arr.forEach(cookie => {
    chrome.cookies.set(cookie)
  })
  // 记录
  const result = await fetch(`${scriptUrl}?action=setData&userID=${await accountState()}`).then(response => response.json())
  console.log(result)
}

// 获取登陆状态
const accountState = () => {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({ 'url': 'https://www.facebook.com' }, function (cookieInfo) {
      let state = false
      cookieInfo.forEach(detail => {
        if (detail.name === 'c_user') state = detail.value
      })
      setTimeout(function () {
        resolve(state)
      }, 1000)
    })
  })
}

// 格式化 cookie
function formatCookie (str) {
  if (/=|;/g.test(str)) {
    return str.replace(/ /g, '')
  } else {
    const nameList = str.match(/(?<="name": ").*?(?=")/g)
    const valueList = str.match(/(?<="value": ").*?(?=")/g)
    const arr = []
    for (let i = 0; i < nameList.length; i++) {
      arr.push(`${nameList[i]}=${valueList[i]}`)
    }
    return arr.join(';')
  }
}
