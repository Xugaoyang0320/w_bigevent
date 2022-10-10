$(function () {
  const form = layui.form

  loadCateList()

  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 初始化文章分类的方法
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: 'http://big-event-vue-api-t.itheima.net/my/cate/list',
      headers: {
        Authorization:localStorage.getItem('big_news_token')
      },
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类列表失败了')
        const html = template('tpl-cate', res)
        $('[name=cate_id]').html(html)
        // 通知layui重新渲染表单区域
        form.render()
      }
    })
  }

  $('#btnPub').on('click', function () {
    // 文件选择框
    $('#file').click()
  })

  // 
  $('#file').on('change', function (e) {
    const fileList = e.target.files
    if (fileList === 0) return layer.msg('请选择文件')
    // 转成blob格式的图片
    const imgUrl = URL.createObjectURL(fileList[0])
    // 更换裁剪图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', imgUrl)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  let state = '已发布'

  $('#btnSave2').on('click', function () {
    state = '草稿'
    console.log(state);
  })

  $('#formPub').on('submit', function (e) {
    e.preventDefault()
    // 将数据都收集到formData中
    let fd = new FormData($(this)[0])
    fd.append('state', state)

    // 获取裁剪区域的图片
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        
        $.ajax({
          method: 'POST',
          url: 'http://big-event-vue-api-t.itheima.net/my/article/add',
          data: fd,
          headers: {
            Authorization:localStorage.getItem('big_news_token')
          },
          contentType: false,
          processData:false,
          success(res) {
            if (res.code !== 0) return layer.msg('发布文章失败')
            layer.msg('发布文章成功')
          location.href='/article/art_list.html'
          }
        })
      })
    // console.log(fd)
    // fd.forEach((k, v) => {
    //   console.log(k,v);
    // })
  })
})