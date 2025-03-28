(function () {
  // 如果用户使用的不是美信浏览器则不引入
  if (navigator.userAgent.toLowerCase().indexOf('mideaconnect') === -1) {
    return
  }

  var u = navigator.userAgent
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  var flatform = isIOS ? 'ios' : 'android'
  // 兼容 IOS 升级 WKWebview 版本
  if (flatform === 'ios' && u.indexOf('MissonWKCordova') > -1) {
    flatform = 'ios-new'
  }
  var cordovaPath = './cordova/' + flatform + '/cordova.js'
  var script = window.document.createElement('script')
  script.src = cordovaPath
  script.type = 'text/javascript'
  script.async = true
  window.document.head.appendChild(script)
})()
