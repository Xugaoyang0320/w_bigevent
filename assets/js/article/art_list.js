$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage
  // 定义过滤器
  template.defaults.imports.formatTime = (time) => {
    let date = new Date(time)
    let y = date.getFullYear()
    let m = (date.getMonth() + 1 + '').padStart(2, '0')
    let d = (date.getDate() + '').padStart(2, '0')
    let h = (date.getHours() + '').padStart(2, '0')
    let mm = (date.getMinutes() + '').padStart(2, '0')
    let ss = (date.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${mm}:${ss}`
  }

  let qs = {
    pagenum: 1, //当前页码值（表示当前是第几页）
    pagesize: 2, //当前每页显示几条
    cate_id: '', //当前选择的文章分类
    state: '' //当前文章所处位置，可选值：已发布。操作都是字符串类型
  }

  // 初始化文章分类
  loadCateList()
  // 加载文章列表
  loadArticleList()

  // 初始化文章分类的方法
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类列表失败了')
        const html = template('tpl-cate', res)
        $('[name=cate_id]').html(html)
        // 通知layui重新渲染表单区域
        form.render()
      }
    })
  }

  // 加载文章列表
  function loadArticleList() {
    $.ajax({
      method: 'GET',
      url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章列表失败')
        // console.log(res);
        const str = template('tpl-list', res)
        // $('tbody').html(htmlStr)
        $('tbody').empty().append(str)
        renderPager(res.total)
      }
    })
  }

  $('#choose-form').on('submit', function (e) {
    e.preventDefault()
    // 只需要处理一下参数，在直接调用获取列表的方法
    // const cate_id = $('[name=cate_id]').val()
    // qs.cate_id = cate_id
    qs.cate_id = $('[name=cate_id]').val()

    // const state = $('[name=state]').val()
    // qs.state = state
    qs.state = $('[name=state]').val()

    loadArticleList()
  })

  // 渲染分页功能
  function renderPager(total) {
    // layui提供的分页组件 total pagenum:1 pagesize:2这些条件加起来
    laypage.render({
      elem: 'pagerWrapper',
      // elem:document.getElementById('pagerWrapper'),
      count: total,  //总数
      limit: qs.pagesize,  //每页显示多少条
      curr: qs.pagenum,  //当前是第几页
      // layout:就是布局的意思
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 4, 6, 8, 10],
      // 分页发生切换时，触发jump回调
      // jump回调的时机：1.初次渲染分页组件的时候；2.主动切换页码值得时候
      jump(obj, first) {
        // console.log(obj,first);
        // 最新的第几页和最新的每页显示几条数据
        console.log(obj.curr, obj.limit);
        qs.pagenum = obj.curr
        qs.pagesize = obj.limit

        // 如果直接调用的话，会导致死循环的问题
        // 应该是用户主动切换页码值的时候去加载列表
        // loadArticleList()
        if (!first) {
          loadArticleList()
        }
      }
    })
  }

  // 
  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('你确定要删除该文章吗？')
    let len = $('.btnDelete').length
    console.log(len);
    if (result) {
      // prop  attr 都是用来根据属性名获取属性值的

      const id = $(this).attr('data-id')
      $.ajax({
        method: 'DELETE',
        url: `/my/article/info?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除文章失败！')
          layer.msg('删除文章成功！')

          // 判断一下，如果当前是最后一条数据的话，需要将pagenum-1
          // 获取删除按钮的个数
          if (len === 1) {
            // 页码值最小必须是1，如果当前页已经是第一页，就不用再减
            qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
          }
          loadArticleList()
        }
      })
    }
  })
})