let layer = layui.layer
$(function () {
  // 目的：确保 dom 渲染完毕之后取请求数据
  getUserInfo()
})

// var const 的区别
// 由 var 关键字或者 function 声明的变量会默认存在 window 全局变量上，但是 let / const 不会

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // header: {
    //   Authorization: localStorage.getItem('big_news_token') || ''
    // },
    success(res) {
      // console.log(res)
      if (res.code !== 0) return layer.msg(res.message)
      // 按需渲染头像
      renderAvatar(res)
    },

  })
}

const renderAvatar = (res) => {
  //显示文字头像,取username属性的第一个字母
  // 取nickname和username
  const name = res.data.nickname || res.data.username
  // const char = res.data.username.charAt(0).toUpperCase()
  const char = name[0].toUpperCase()
  if (res.data.user_pic) {
    $('.text-avatar').hide()
    $('.user-box img').attr('src', res.data.user_pic).show()
  } else {
    $('.layui-nav-img').hide()

    $('.text-avatar').css('display', 'flex').html(char).show()
  }
  $('.text').html(`欢迎&nbsp;&nbsp;${name}`)
}

// 实现退出操作
$("#btnLogin").on('click', function () {
  // layer.confirm
  // const result = confirm('你确定要退出吗？')
  // if (result) {
  //   // 1、token需要移除
  //   localStorage.removeItem('big_news_token')
  //   // localStorage.clear()
  //   // 2、页面需要跳转到登录页
  //   location.href='/login.html'
  // }

  layer.confirm(
    '你确认要退出吗？',
    { icon: 3, title: '提示' },
    function (index) {
      // 1、token需要移除
      localStorage.removeItem('big_news_token')
      // localStorage.clear()
      // 2、页面需要跳转到登录页
      location.href = '/login.html'
      // close 是固定写法，关闭弹窗的时候
      layer.close(index)
    }
  )
})

// 获取用户信息，报错状态码 401 ，就是token问题（要么没传，要么就是过期了）
