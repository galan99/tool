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
    isWeiXin: /micromessenger/i.test(navigator.userAgent.toLowerCase()),
    isIos: /iphone/i.test(navigator.userAgent.toLowerCase()) || /ipad/i.test(navigator.userAgent.toLowerCase()),
    isAndroid: /android/i.test(navigator.userAgent.toLowerCase()),
    // 判断数据类型
    isType(obj, type) {
      // obj instanceof Array
      // obj.constructor === Array
      // Array.isArray(obj)
      // undefined function boolean number string array object
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type
    },
    // 时间戳转时间
    timeFormat(val, type) {
      let time = ''
      if (val) {
        let date = new Date(val * 1000)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

        if (type === 'second') {
          // 2018.11.12 00:00
          time = `${year}.${month}.${day} ${h}:${m}`
        } else if (type === 'time') {
          // 12月11日00:00
          time = `${month}月${day}日${h}:${m}`
        } else if (type === 'month') {
          // 12月11日
          time = `${month}月${day}日`
        }
      }
      return time
    },
    // 数组里最大的数字
    max(arr) {
      // 方法1
      return Math.max(...arr)
      // 方法2
      return Math.max.apply(Math, arr)
    },
    // 设置html的font-size
    setFontSize(_client) {
      // _client 设计稿的宽度
      let docEl = document.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        countSize = function () {
          // 方法1
          let devieWidth = Math.min(_client, docEl.clientWidth, docEl.clientHeight)
          let fonSize = devieWidth > 1080 ? 144 : devieWidth / _client * 100
          docEl.style.fontSize = fonSize + 'px'

          // 方法2 根据vw ios兼容最低7 android兼容最低4.4
          docEl.style.fontSize = 100 / _client * 100 + 'vw'
        };
      window.addEventListener(resizeEvt, countSize, false)
      countSize()
    },
    // 查找类名 html5属性classList
    hasClass(obj, className) {
      // let obj = document.querySelectorAll(obj)
      return obj.classList.contains(className)
    },
    // 添加类名
    addClass(obj, className) {
      obj.classList.add(className)
      return this
    },
    // 删除类名
    removeClass(obj, className) {
      obj.classList.remove(className)
      return this
    },
    // 动画
    animate(obj, josn, fn) {
      function css(obj, attr) {
        if (obj.currentStyle) {
          return obj.currentStyle[attr]
        }
        return getComputedStyle(obj, false)[attr]
      }
      clearInterval(obj.iTimer)
      var iSpeed = 0
      var iCur = 0
      obj.iTimer = setInterval(function () {
        var iEnd = true
        for (var attr in json) {
          iCur = parseInt(css(obj, attr))
          iSpeed = (json[attr] - iCur) / 8
          iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed)

          if (iCur !== json[attr]) {
            iEnd = false;
            obj.style[attr] = iSpeed + iCur + 'px';
          }
          if (iEnd) {
            clearInterval(obj.iTimer);
            fn && fn.call(obj);
          }
        }
      }, 30);
    },
    // 拖拽移动
    drag(block) {
      var oW
      var oH
      var maxWidth = document.documentElement.clientWidth - block.offsetWidth
      var maxHeight = document.documentElement.clientHeight - block.offsetHeight
      block.addEventListener('touchstart', function (e) {
        var touches = e.touches[0]
        oW = touches.clientX - block.offsetLeft
        oH = touches.clientY - block.offsetTop
        document.addEventListener('touchmove', defaultEvent, false)
      }, false)

      block.addEventListener('touchmove', function (e) {
        var touches = e.touches[0]
        var oLeft = touches.clientX - oW
        var oTop = touches.clientY - oH
        oLeft = oLeft < 0 ? 0 : oLeft
        oLeft = oLeft > maxWidth ? maxWidth : oLeft
        oTop = oTop < 0 ? 0 : oTop
        oTop = oTop > maxHeight ? maxHeight : oTop
        block.style.left = oLeft + 'px'
        block.style.top = oTop + 'px'
        e.preventDefault()
      }, false)

      block.addEventListener('touchend', function () {
        document.removeEventListener('touchmove', defaultEvent, false)
      }, false)
    },
    // ajax封装
    ajax(opt) {
      let oAjax = null
      let j = {}
      if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
      } else {
        oAjax = new ActiveXObject('Microsoft.XMLHTTP')
      }

      j.method = opt.method || 'get'
      j.url = opt.url || ''
      j.data = opt.data || ''
      j.callback = opt.callback || function () {}

      if (j.method == 'get' && j.data) {
        let data_send = '?'
        Object.keys(j.data).forEach(key => {
          data_send += `${key}=${j.data[key]}`
        })
        j.url += data_send.slice(0, -1)
      }

      oAjax.open(j.method, j.url, true)

      if (j.method == 'get') {
        oAjax.send()
      } else {
        let data = j.data
        let header = 'application/x-www-form-urlencoded'
        if (typeof j.data !== 'string') {
            header = 'application/json'
            data = JSON.stringify(data)
        }
        xhr.setRequestHeader('Content-type', header)
        xhr.send(data)
      }

      oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {
          if (oAjax.status == 200) {
            j.callback(oAjax.responseText)
          }
        }
      }
    }
  }
));