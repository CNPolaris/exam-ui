import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '????????????', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/profile/timeline',
    component: () => import('@/views/profile/components/Timeline'),
    hidden: true
  },
  {
    path: '/exam/answer/read',
    component: () => import('@/views/exam/answer/read'),
    meta: {
      title: '????????????'
    },
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '??????',
          icon: 'dashboard',
          affix: true,
          roles: ['admin']
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '????????????',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: '/permission/user',
        component: () => import('@/views/permission/user'),
        name: 'UserList',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      },
      {
        path: '/permission/category',
        component: () => import('@/views/permission/category'),
        name: 'Category',
        meta: {
          title: '????????????',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: '/permission/list',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '????????????',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: '/permission/allocate',
        component: () => import('@/views/permission/allocate'),
        name: 'AllocatePermission',
        meta: {
          title: '????????????',
          roles: ['admin']
        },
        hidden: true
      },
      {
        path: '/permission/role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'User',
    meta: {
      title: '????????????',
      icon: 'user',
      roles: ['admin']
    },
    children: [
      {
        path: '/user/student',
        component: () => import('@/views/user/student'),
        name: 'StudentList',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      },
      {
        path: '/user/teacher',
        component: () => import('@/views/user/teacher'),
        name: 'TeacherList',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      },
      {
        path: '/user/admin',
        component: () => import('@/views/user/admin'),
        name: 'AdminList',
        meta: {
          title: '???????????????',
          roles: ['admin']
        }
      },
      {
        path: '/user/upload',
        component: () => import('@/views/user/upload-user'),
        name: 'UploadUser',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/class',
    component: Layout,
    name: 'Class',
    meta: {
      title: '????????????',
      icon: 'peoples',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/class/list',
        component: () => import('@/views/class/list'),
        name: 'ClassList',
        meta: {
          title: '????????????',
          roles: ['teacher', 'admin']
        }
      },
      {
        path: '/class/edit',
        component: () => import('@/views/class/edit'),
        name: 'ClasEdit',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/class/student',
        component: () => import('@/views/class/studentList'),
        name: 'StudentPage',
        meta: {
          title: '????????????',
          roles: ['teacher', 'admin']
        },
        hidden: true
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    name: 'subject',
    meta: {
      title: '????????????',
      icon: 'list',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/subject/list',
        component: () => import('@/views/subject/index'),
        name: 'SubjectList',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    name: 'question',
    meta: {
      title: '????????????',
      icon: 'el-icon-toilet-paper',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/question/list',
        component: () => import('@/views/question/list'),
        name: 'QuestionList',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/singleChoice',
        component: () => import('@/views/question/edit/single-choice'),
        name: 'singleChoicePage',
        meta: {
          title: '???????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/shortAnswer',
        component: () => import('@/views/question/edit/short-answer'),
        name: 'shortAnswerPage',
        meta: {
          title: '???????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/multipleChoice',
        component: () => import('@/views/question/edit/multiple-choice'),
        name: 'multipleChoicePage',
        meta: {
          title: '???????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/gapFilling',
        component: () => import('@/views/question/edit/gap-filling'),
        name: 'gapFillingPage',
        meta: {
          title: '???????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/trueFalse',
        component: () => import('@/views/question/edit/true-false'),
        name: 'trueFalsePage',
        meta: {
          title: '???????????????',
          roles: ['admin', 'teacher']
        }
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    name: 'exam',
    meta: {
      title: '????????????',
      icon: 'form',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/exam/list',
        component: () => import('@/views/exam/paper'),
        name: 'PaperList',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/exam/edit',
        component: () => import('@/views/exam/paper/edit'),
        name: 'ExamEdit',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/exam/detail',
        component: () => import('@/views/exam/paper/detail'),
        name: 'ExamPaperDetail',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        },
        hidden: true
      }
    ]
  },
  {
    path: '/exam/answer',
    component: Layout,
    name: 'answer',
    meta: {
      title: '????????????',
      icon: 'form',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/exam/answer/list',
        component: () => import('@/views/exam/answer/list'),
        meta: {
          title: '????????????'
        }
      },
      {
        path: '/exam/answer/complete',
        component: () => import('@/views/exam/answer/complete'),
        meta: {
          title: '????????????'
        }
      },
      {
        path: '/exam/answer/judge',
        component: () => import('@/views/exam/answer/judge'),
        meta: {
          title: '??????'
        },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/video',
    component: Layout,
    meta: {
      title: '????????????',
      icon: 'el-icon-video-camera',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/video/list',
        component: () => import('@/views/video/index'),
        name: 'VideoList',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/video/edit',
        component: () => import('@/views/video/edit'),
        name: 'VideoEdit',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/video/preview',
        component: () => import('@/views/video/preview'),
        name: 'PreviewVideo',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        },
        hidden: true
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    meta: {
      title: '????????????',
      icon: 'message',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/message/list',
        component: () => import('@/views/message/index'),
        name: 'MessageList',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/message/send',
        component: () => import('@/views/message/send'),
        name: 'SendMessage',
        meta: {
          title: '????????????',
          roles: ['admin', 'teacher']
        }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    meta: {
      title: '????????????',
      icon: 'el-icon-stopwatch',
      roles: ['admin']
    },
    children: [
      {
        path: '/monitor/server',
        component: () => import('@/views/monitor/server/index'),
        name: 'ServerMonitor',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      },
      {
        path: '/monitor/log/login/list',
        component: () => import('@/views/monitor/log/index'),
        name: 'LoginLog',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      },
      {
        path: '/monitor/user/event/log/list',
        component: () => import('@/views/monitor/event/index'),
        name: 'UserEventLog',
        meta: {
          title: '????????????',
          roles: ['admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  base: '/admin',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
