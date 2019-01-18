
let myTool = (function(){}(
  return {
    checkPhone(str){
      return /^1[0-9]{10}$/.test(str)
    },
    tel(str){
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
    },
    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    trimAll(str){
      return str.replace(/\s+/g, '');
    },
    getQueryString(name) {
      let url = location.href.split('?')[1]
      let theRequest = {}
      if (url) {
        let strs = url.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
        }
      }
      return theRequest[name]
    },
    setCookie(name, value, iDay) {
      var oDate = new Date()
      oDate.setDate(oDate.getDate() + iDay)
      document.cookie = name + '=' + value + ';expires=' + oDate + '; path=/'
    },
    getCookie(name) {
      var arr = document.cookie.split('; ')
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=')
        if (arr2[0] === name) {
          return arr2[1]
        }
      }
      return ''
    },
    removeCookie(name) {
      this.setCookie(name, '', -1)
    }
    setItem(name, value) {
      localStorage.setItem(key, JSON.stringify({ val: value, time: new Date().getTime() }))
    },
    getItem(key, day) {
      let text = ''
      let val = localStorage.getItem(key)
      if (val) {
        let item = JSON.parse(val)
        if (!item.time || (new Date().getTime() - item.time > day * 24 * 60 * 60 * 1e3)) {
          localStorage.removeItem(key)
        } else {
          text = item.val
        }
      }
      return text
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase().indexOf('micromessenger')
      return ua !== -1
    },
    
  }
));
