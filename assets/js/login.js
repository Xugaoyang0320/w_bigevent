$(function () {
  // 点击去注册
  $('#go2Reg').on('click', function () {
    $('.login-wrap').hide()
    $('.reg-wrap').show()
  })
  
  // 点击去登录
  $('#go2Login').on('click', function () {
    $('.login-wrap').show()
    $('.reg-wrap').hide()
  })

  // 从 layui 对象中获取form属性
  let form = layui.form
  let layer=layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 添加自定义规则
    pwd: [/^[\S]{6,12}$/, '密码必须是6-12位，且不能出现空格'],
    // 校验两次密码是否一致
    repwd: function (value) {
      // 拿到密码框和确认密码框里面的值是否一致
      if ($('#password').val() !== value) {
        return '两次密码不一致，请输入输入'
      }
    }
  })

  // 说明一下，video里面的请求地址不用了，用新的http://big-event-vue-api-t.itheima.net
  // 请求参数的类型也换了()$.post Content-Type:'application/x-www-form-urlencoded'
  // 原来的：Content-Type:'application/x-www-form-urlencoded' -> key1=value1&key2=value2
  // 现在的：Content-Type需要指定：'application/json' -> {"key1":"value1","key2":"value2"}
  
  // 给注册表单添加提交事件（会刷新浏览器）
  $('#formReg').on('submit', function (e) {
    // 阻止默认提交动作
    e.preventDefault()
    $.ajax({
      method: 'POST',
      // url: 'http://big-event-vue-api-t.itheima.net/api/reg',
      url: '/api/reg',
      // contentType: 'application/json',
      // data: JSON.stringify({
      //   // 可以将对象转换成json格式字符串
      //   username: $('#formReg [name=username]').val(),
      //   password: $('#formReg [name=password]').val(),
      //   repassword: $('#formReg [name=repassword]').val(),
      // }),
      data:$(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg('注册成功')
       $('#go2Login').click()
      }
      
    })
  })

  // 给登录表单添加提交事件
  $('#formLogin').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      // url: 'http://big-event-vue-api-t.itheima.net/api/login',
      url: '/api/login',
      // contentType: 'application/json',
      // data: JSON.stringify({
      //   // 可以将对象转换成json格式字符串
      //   username: $('#formReg [name=username]').val(),
      //   password: $('#formReg [name=password]').val(),
      //   repassword: $('#formReg [name=repassword]').val(),
      // }),
      data:$(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        // token 意思是令牌的意思（下一次去请求有权限的接口的时候‘带着’）
        // 固定写法：Bearer token字符串， Bearer:译为持票人拿着token去请求
        localStorage.setItem('big_news_token', res.token)
        location.href = '/index.html'
      }
    })
  })
})