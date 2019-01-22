let myTool = (function () {}(
  return {
    // 手机号验证
    checkPhone(str) {
      return /^1[0-9]{10}$/.test(str)
    },
    // 电话验证
    tel(str) {
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
    },
    // 首尾空格去除
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    // 替换所有空格
    trimAll(str) {
      return str.replace(/\s+/g, '');
    },
    // 获取url参数
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
    // 设置cookie
    setCookie(name, value, iDay) {
      var oDate = new Date()
      oDate.setDate(oDate.getDate() + iDay)
      document.cookie = name + '=' + value + ';expires=' + oDate + '; path=/'
    },
    // 获取cookie
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
    // 删除cookie
    removeCookie(name) {
      this.setCookie(name, '', -1)
    },
    // 设置本地存储
    setItem(name, value) {
      localStorage.setItem(key, JSON.stringify({
        val: value,
        time: new Date().getTime()
      }))
    },
    // 获取本地存储
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
    // 判断微信浏览器
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase().indexOf('micromessenger')
      return ua !== -1
    },

  }
));
