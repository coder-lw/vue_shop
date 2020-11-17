// 递归  
// 有一堆数据要处理，要实现上一次请求完成了，才能去调下一个请求
var ids = [34112, 98325, 68125];
(function sendRequest(){
    var id = ids.shift();
      // 删除数组第一个 并且返回该删除的数组的第一个值保存起来 原来的数组已经去除了第一个
    if(id){
        $.ajax({url: "/get", data: {id}}).always(function(){
            //do sth.
            console.log("finished");
            // 递归调用 继续截取数组的id发送数据请求
            sendRequest();
        });
    } else {
        console.log("finished");
    }
})();


// 例如用递归实现一个查DOM的功能document.getElementById
function getElementById(node, id){
  if(!node) return null;
  if(node.id === id) return node;
  for(var i = 0; i < node.childNodes.length; i++){
      var found = getElementById(node.childNodes[i], id);
      if(found) return found;
  }
  return null;
}
getElementById(document, "d-cal");
// document是DOM树的根结点，一般从document开始往下找。在for循环里面先找document的所有子结点，
// 对所有子结点递归查找他们的子结点，一层一层地往下查找。如果已经到了叶子结点了还没有找到，
// 则在第二行代码的判断里面返回null，返回之后for循环的i加1，继续下一个子结点。如果当前结点的id符合查找条件，
// 则一层层地返回。所以这是一个深度优先的遍历，每次都先从根结点一直往下直到叶子结点，再从下往上返回。


// ---------------------------------------------------工具函数-------------------------------------------------------------
// 获取对象的类型
getObjType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
// 对象深拷贝
var obj = {
	name : 'anc',
	age :123,
	card : ['visa', 'master'],
	wife : {
		name : 'bcd',
		son : {
			name : 'aaa'
		}
	}
}
var obj1 = {};
// 定义这个深度克隆的函数
function deepClone(origin, target){
	// 容错
	var target = target || {},
	// 需要后期使用Object.prototype.toString(用来判断是数组还是对象的，应用的是window的tostring方法)  所以先把这个东西赋值到一个变量上，方便引用
	toStr = Object.prototype.toString,
	// 一会判断数组需要比对，需要比对的是字符串，也很长，用一个变量保存，方便后期比对 注：数组的结果是[object Array]
	arrStr = "[object Array]";
	// 遍历
	for(var prop in origin){
		// 防止打印原型上的属性，加上一个条件判断   
		if(origin.hasOwnProperty(prop)) {
			// 判断是不是引用值
			if(origin[prop] !== 'null' && typeof(origin[prop]) == 'object'){
				// 判断数组还是对象  判断完之后建立相应的数组或者对象  通过window的那个tostring方法识别
				// 对比tostring方法之后origin[prop] 的字符串 和  arrStr = "[object Array]";数组结果的字符串是否相等
				if(toStr.call(origin[prop]) == arrStr){
					// 此处为真是数组，创建一个新的空数组
					target[prop] = [ ];
				}
				else{
					// 此处为假是对象，创建一个新的空对象
					target[prop] = {};
				}
				// 需要递归重复的执行上面的代码 复制数组或者对象里面的值赋给新的数组或对象（这里面还是需要判断上面的那些东西）  直接用了自己的这个方法：递归   出口是：原始值
				// 这里面的实参又变成了origin[prop],target[prop]；传入到这个克隆函数里，进行数组和对象（引用值）里面的
				deepClone(origin[prop],target[prop] );

			}
			else{
				// 拷贝原始值
				target[prop] = origin[prop];
			}
		}


	}
	// 如果没有传入target，就要给克隆好的target给返回去
	return target
}
// 动态插入css
loadStyle = (url) => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
  }
//根据字典的value查找对应的index
findArray = (dic, value) => {
    for (let i = 0; i < dic.length; i++) {
      if (dic[i].value == value) {
        return i
      }
    }
    return -1
  }
// 解决ie9不兼容placeholder问题
function compatiblePlaceholder() {
  if (!('placeholder' in document.createElement('input'))) {
    // 将返回的nodeList对象转为数组
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[placeholder]'))
    nodes.forEach(function (item, index) {
      if (item.nextElementSibling) {

      } else {
        item.addEventListener('focus', function () {
          this.nextSibling.style.display = 'none'
        })
        item.addEventListener('blur', function () {
          if (!this.value) {
            this.style.display = 'none'
            this.nextSibling.style.display = 'inline'
          }
        })
        var cloneNode = item.cloneNode()
        // 如果[type='password']类型，则转为text
        if (cloneNode.getAttribute('type').toLowerCase() === 'password') {
          cloneNode.setAttribute('type', 'text')
        }
        cloneNode.setAttribute('value', cloneNode.getAttribute('placeholder'))
        cloneNode.style.display = 'none'
        item.insertAdjacentHTML('afterend', cloneNode.outerHTML)
        item.nextSibling.addEventListener('focus', function () {
          this.style.display = 'none'
          this.previousSibling.style.display = 'inline'
          this.previousSibling.focus()
        })
        if (!item.value) {
          item.style.display = 'none'
          item.nextSibling.style.display = 'inline'
        }
      }

    })
  }
}
// 计算时间和当前时间的差值
spaceTime = function (atime) {
  atime = atime.replace(/-/g, '/'); //IE出现兼容问题，带“-”格式的时间无法被new Date()转成时间格式，返回NaN.
  let byTime = [365 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
  let unit = ["年", "天", "小时", "分钟", "秒钟"];
  var ct = new Date().getTime() - new Date(atime).getTime();
  if (ct <= 1000) {
    // return "时间数据出错!"
    return "刚刚"
  }
  var sb = [];
  for (var i = 0; i < byTime.length; i++) {
    if (ct < byTime[i]) {
      continue;
    }
    var temp = Math.floor(ct / byTime[i]);
    ct = ct % byTime[i];
    if (temp > 0) {
      sb.push(temp + unit[i]);
    }


    /*一下控制最多输出几个时间单位：
     一个时间单位如：N分钟前
     两个时间单位如：M分钟N秒前
     三个时间单位如：M年N分钟X秒前
    以此类推
    */
    if (sb.length >= 1) {
      break;
    }
  }
  return (sb.join("") + "前");
}
// 定义一个时间过滤器 全局得 VUE的过滤器
Vue.filter('dateFormat',function (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + "").padStart(2,'0')
    const d = (dt.getDate() + "").padStart(2,'0')
    const hh = (dt.getHours() + "").padStart(2,'0')
    const mm = (dt.getMinutes() + "").padStart(2,'0')
    const ss = (dt.getSeconds() + "").padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  })
  // 继承的圣杯模式
Vue.prototype.$inherit = (Target,Origin) => {
    Target = Target || {}
     // d定义一个中间的构造函数F
      function F(){}
      // 让中间构造函数的原型  = Origin（原始）构造函数名的原型  
      F.prototype = Origin.prototype
      // 再让Target（目标）构造函数的原型  = new 中间构造函数F的执行；
      Target.prototype = new F()
      // 由于son.__proto__  ==>   new F() 中间层 __proto__    ==>  Father.prototype
      // 所以son的constructor指向不是自己的构造函数  而是Father的构造函数
  
      // 下面需要改变一下constructor的指向，变为自己
      Target.prototype.constructor = Target
  }
//防抖方法
function debounce(func,delay){
    let timer = null
    return function(...args){
      if(timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this,args)
      },delay)
    }
  }
//手机号码 匹配的正则表达式
const regmobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
// 验证邮箱的正则表达式
const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
// URL地址
function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
  }
//匹配8-16位数字和字母密码的正则表达式
function validatePwd (pwd) {
    var regName = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
    if (!regName.test(pwd)) return false
    return true
  }
//   密码匹配（至少数字、字母、特殊符号两组组合）
function validatePwd (pwd) {
    var regName = /(^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$)/
    if (!regName.test(pwd)) return false
    return true
  }
//   密码匹配（密码由8位数字、大小写字母和特殊符号组成!）
function validatePwd (pwd) {
    var regName =  /(^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$)/
    if (!regName.test(pwd)) return false
    return true
  }

// 判断身份证号码
function cardid (code) {
  let list = []
  let result = true
  let msg = ''
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  if (!validatenull(code)) {
    if (code.length == 18) {
      if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        msg = '证件号码格式错误'
      } else if (!city[code.substr(0, 2)]) {
        msg = '地址编码错误'
      } else {
        // 18位身份证需要验证最后一位校验位
        code = code.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x']
        var sum = 0
        var ai = 0
        var wi = 0
        for (var i = 0; i < 17; i++) {
          ai = code[i]
          wi = factor[i]
          sum += ai * wi
        }
        if (parity[sum % 11] != code[17]) {
          msg = '证件号码校验位错误'
        } else {
          result = false
        }
      }
    } else {
      msg = '证件号码长度不为18位'
    }
  } else {
    msg = '证件号码不能为空'
  }
  list.push(result)
  list.push(msg)
  return list
}

// 数组去重（写在原型链上）
Array.prototype.unique = function(){
	// 创建一个对象，来取数组的值；在创建一个新数组，来接受对象里的属性名（去重），不改变原数组
	var temp = {};
	var arr = [];
	// 用一个变量接收数组的长度，数组名用this，谁调用这个方法，这个方法的this就指向谁
	var len = this.length;
	// 遍历数组 去进行判断
	for(var i = 0; i < len; i ++){
		// 设置条件：undefined 放入对象，添加属性值，有值的不执行 用调用对象的属性有没有值（取反）执行；所以用!temp[this[i]]
		// temp[this[i]]是查看temp属性值的；用作判断
		if(!temp[this[i]]){
			// 没有属性值，就把他当做属性名，加上abc的属性值
			temp[this[i]] = 'abc';
			// 把数组的这位数，放到新数组里面
			arr.push(this[i]);
		}
		
	}
	// 最后返回这个去重之后的新数组
	return arr;
}
// 封装兼容性方法 IE8一下，getScrollOffset;调用时实时的返回一个一个滚动条滚动的距离 x 和  y  的距离
function getScrollOffset(){
	if(window.pageXOffset){
		return{
			x : window.pageXOffset,
			y : window.pageYOffset
		}

	}else{
		return{
			x : document.body.scrollLeft + document.documentElement.scrollLeft,
			y : document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}
//兼容性IE8一下    查看窗口尺寸函数 考虑IE8一下的标准模式还是怪异模式
function getViewportOffset(){
	if(window.innerWidth){
		return{
			w : window.innerWidth,
			h : window.innerHeight
		}
	}else{
		if(document.compatMode === 'BackCompat'){
			return{
				w : document.body.clientWidth,
				h : document.body.clientHeight
			}
		}else{
			return{
				W : document.documentElement.clientWidth,
				h : document.documentElement.clientHeight
			}
		}
	}
}



	

















