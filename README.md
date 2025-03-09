# [MERN] 使用 socket.io 实现即时通信功能

效果实现如下：

<!-- [video(video-ErrYdPao-1741471681375)(type-bilibili)(url-https://player.bilibili.com/player.html?aid=114129041888503)(image-https://i-blog.csdnimg.cn/img_convert/ed70c922438e1215266495fe57281bcb.jpeg)(title-MERN-socket.io 实现即时聊天)] -->

[![](https://i2.hdslb.com/bfs/archive/d723d23e497f9a637175cb199e4eaa507b743ca2.jpg)](https://player.bilibili.com/player.html?isOutside=true&aid=114129041888503&bvid=BV1LcRxY6EFM&cid=28769190799&p=1)

Github 项目地址:<https://github.com/GoldenaArcher/messenger-mern>

项目使用了 MERN(MongoDB, Express, React, Node.js) + socket.io 实现即时通信功能，并且使用了[Turborepo](https://turbo.build/)进行 monorepo 的后端、前端和 socket 的模块管理

用到的具体技术栈有：

- MongoDB

  实现了数据的持久化

- Express

  实现的后端，负责登陆/注册/获取聊天记录的功能

- React

  实现 UI 功能

- Redux

  实现了 UI 部分的状态管理

  这次也是第一次尝试使用 RTQK 进行 CRUD 的操作，大体使用感觉是比 RTK 还要简单很多，loading/error 的状态全都由 RTKQ 进行管理，确实少写了很多的代码

  如果要单独进行状态的更新，实现起来也不太难，在 `onQueryStarted` 里面就可以通过 `queryFulfilled` 去进行操作。因为 api 是 cache 的，所以可以通过调动 `invalidateTags` 去自动重新调用 fetch api，使用起来确实方便很多

  唯一稍微有点麻烦的可能是 debug，我在实现信息的 delivered/read 这部分状态更新的时候卡 bug 卡了一段时间，主要是 RTKQ 在没有遇到硬核报错，并且有些情况下出现 cache 里找不到对应的数据这种情况下，会自动放弃（abort）剩下的操作。因为没有在 devtool 里看到任何的报错，函数里的 log 也没有被触发，所以在 debug 的时候也确实是折腾了挺久的……

- turborepo

  实现了 monorepo 的管理

  其实这个配置起来还挺简单的，因为项目比较简单，所以也没有办法进行一个和 yarn workspace 的对比，主要还是为了使用 **一个指令** 就能启动所有的项目，减少反复更新 concurrently 去运行对应的模块

  底层上来说 turborepo 还是使用了 yarn workspace，不过官网上说 turborepo 可以只重新编译修改过的模块，而 yarn workspace 是会更新所有的模块

  从 bash 上更新的情况上来说是这样的，不过主要问题就是项目体量太小了，确实没有办法感受出差别来

- docker

  这个为了方便一键运行整个项目，只要跑一下 `docker compose up -d` 就行了

## MongoDB

上次用 mongo 还是上次的事情了，这次的设计相对而言比较简单，就用了 2 个 model，一个是 user，一个是 message。这方面主要还是一个复习+学习，常见的 schema 比较简单，但是比较有趣的东西吧……一个是 aggregate，另一个是用 `find`+`updateMany` 比起 `updateMany`+`find` 的搭配可以提升一部分的性能——其主要原因是数据库在 mutation 后会出现一些延迟

但是从另一个方面来说，实用 `find`+`updateMany` 的操作也不是绝对的。在实际应用期间，我们为了保证数据的一致性，后端都是用 `updateMany`+`find`；后端返回给前端时，如果是 update 的操作，其实并不会返回具体的数据，只会返回一个 `null`，所以我们其实都是依赖前端的数据进行的修改……

所以，具体怎么操作还是一个 case by case 的操作，对于目前这个 app，二者的差异其实不太大

其实我还是不太会写 query，后端做的少这个是真没什么办法，只能说有空的时候多看看、多写写，多少补一点吧

具体到实践就是，写的还是简单了一些，对于 user 的设计其实没有做好友的部分，所以 demo 里的好友实现还是拉了一下数据库里所有存在的 users

message 的设计目前来说是可以满足需求的，虽然之前有在考虑设计一下 conversation 这个 schema 提升获取最后消息的功能，但是鉴于还没有做群组聊天这一功能，想想也就算了……

## Express

express 这部分没什么特别大的难点，总体来说使用还是比较简单的，毕竟 nodejs 作为服务端配置是真的简单……

目前来说主要做了 3 个路由：

- auth，这个就是比较简单的登录和注册的验证
- friend，这个是获取好友列表
- message，这个就是获取信息相关的路由

middleware 做了两个：

- auth，负责 verify/encode/decode jwt，以及将 decode 的 jwt 加到 request 中
- upload，负责文件上传的部分

  文件会上传到 server 的 `/upload` 文件下，同时用户要获取文件的话，就可以获取这个文件夹下 host 的静态文件

  上传的主要实现时通过 Formidable 做的，在 v3 之后 Formidable 会返回一个数组而不是单独的属性，所以我新写了一个 util 文件去负责这部分

demo 的时候没做注册，不过功能差不多都在这里了，唯一不太确定的是上传文件这块……我试过了上传图片并且渲染成功，但是上传其他类型的文件还真没试过

总体来说，express 部分做的和我记忆里面没什么特别大的差别，流程大概就是：

- 设计并实现对应的 controller，负责相关的 CRUD 操作
- 根据情况选择是否需要添加/实现 middleware
- 设计一个 route，并且决定对应的 CRUD 操作
- 在 server.js 里面使用对应的 route，使得 express 能够找到相关的路径

或者反过来也行，先搞定 route 再实现 controller

## React/Redux

React 部分没有用什么特别先进的东西，基本上就是 16.8 以后用到现在的 hooks，这次主要升级的部分还是 redux——第一次尝试全局用 RTKQ 操作

早起的项目（2020 年前）用的都是 redux/react-redux+redux thunk 的实现，当时 redux 本身对于异步 api 的支持是比较差的，所以 redux-thunk 和 redux-saga 的应用还是比较广泛。我们当时的考量是为了减少依赖的实现，所以只考虑了 thunk，没有使用 saga

后来也简单地了解了一下 saga 的用法，不过因为马上就用到了 redux toolkit，后面就直接换到了 RTK 的 `createSlice`，对于比较简单的实现不需要重复写 action，也就一直用了下去。期间的确是发现，使用 `asyncThunk` 的时候，还是需要写不少的 reducers，并且同样需要自己管理 loading 相关的状态。当然，这方面和之前使用 redux-thunk 时没什么太大的差别，所以一直以来感觉有点麻烦，但是可以接受

但是使用 RTKQ 是另外一种感觉了，RTKQ 本身就管理了 loading 和 error 的状态，让使用和调用都变得简单很多。并且因为 RTKQ 本身是 cache 了 API 调用的，所以它的调用不需要额外找 state，直接从导出的 useFunction 去找 data 就行了，二者在 React 中的 component 调用对比如下：

```javascript
// slice
const { userInfo } = useSelector((state) => state.auth);

// RTKQ
const { data, isFetching, error } = useFetchUsersQuery();
```

二者差别好像不是特别大，但是使用 `(state) => state.auth` 这种操作最大的问题还是在于 typo——虽然 slice 也可以导出 `reducerPath` ，不过 slice 层面的导入/导出还是需要额外的操作，我们一般都是直接写对应的状态

实现方面 RTKQ 就干净得多，以一个相对比较简单的 fetch query 为例：

```javascript
fetchMessages: builder.query({
  query: ({ sender, receiver }) => ({
    url: `/messages`,
    method: "GET",
    params: {
      sender,
      receiver,
    },
  }),
  transformResponse: (res) => res.data,
});
```

主要是不用管理 error 和 loading 的状态，所以就不用像传统写法那样写 `pending`, `fulfilled`, `rejected` 三个 actions

之余在 mutation 中更新 query 的数据，这个实现方法是这样的：

```javascript
postMessage: builder.mutation({
  query: (data) => ({
    url: "/messages",
    method: "POST",
    data,
  }),
  transformResponse: (res) => res.data,
  async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
    await updateMessageCache({
      queryFulfilled,
      dispatch,
      getState,
      messageApi,
      friendApi,
    });
  },
});
```

`updateMessageCache` 的实现：

```javascript
export const updateMessageCache = async ({
  queryFulfilled,
  messageApi,
  friendApi,
  getState,
  dispatch,
}) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      messageApi.util.updateQueryData(
        "fetchMessages",
        { sender: data.sender, receiver: data.receiver },
        (messageList) => {
          messageList.push(data);
        }
      )
    );

    const friendsState = getState()[friendApi.reducerPath];
    const friendList =
      friendsState?.queries?.["fetchFriends(undefined)"]?.data || [];

    if (friendList.length > 0) {
      dispatch(
        messageApi.util.updateQueryData(
          "fetchLastFriendMessages",
          { friendList },
          (lastMessages) => {
            const existingIndex = lastMessages.findIndex(
              (msg) =>
                (msg.sender === data.sender &&
                  msg.receiver === data.receiver) ||
                (msg.sender === data.receiver && msg.receiver === data.sender)
            );

            if (existingIndex !== -1) {
              lastMessages[existingIndex] = data;
            } else {
              lastMessages.push(data);
            }
          }
        )
      );
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
};
```

这里需要注意的是，在 `updateQueryData` 更新数据时，参数必须要和在 builder 的定义是一样的。如果是无参函数，那么写法如下： `fetchDemo(undefined)`，需要传一个 `undefined`，也不能留空

还需要注意的一点就是，如果在 `updateQueryData` 调用的方法里面找不到对应的数据，那么整个 callback 里面方法都不会被调用，而且也不会有任何的报错

以 `fetchMessages` 为例，它的代码是这样的：

```javascript
messageApi.util.updateQueryData(
  "fetchMessages",
  { sender: data.sender, receiver: data.receiver },
  (messageList) => {
    messageList.push(data);
  }
);
```

我当时的情况是，我在不同的好友列表上，也就是说 `sender` 和 `receiver` 和当前的数据不同，因此这段代码就没有触发，callback 也就没有执行。这个逻辑藏的还是挺深的，后来在这个 stack overflow 上找到的答案：[Unable to trigger updateQueryData in redux-toolkit](https://stackoverflow.com/questions/78223465/unable-to-trigger-updatequerydata-in-redux-toolkit)。这里面提到，如果整个 cache entry 不存在，即 `fetchMessages` 之前没有被调用过，那么这个 callback 也不会被执行

另外之前本来想着说多研究一下 `invalidateTag` 怎么用的，结果最后还是没怎么用上……

## socket.io

socket.io 的使用还是比较简单的，这里没有用到特别难的地方，主要就是用到了 `socket.on(event, callback)` 和 `socket.emit(event, callback)`，并且所有的操作都是从 socket 这部分执行的

基本逻辑就是：UI 触发一个 event，socket 接收到这个 event，在模块内处理完必须的逻辑后，再 emit 一个新的 event。UI 端监听到对应的 event 后，也会负责实现对应的逻辑，包括更新 redux 中的数据，或者是触发另一个 rest api 调用

简单的说就是，这个项目只用到了比较初级的 socket.io 进行实现——毕竟除了在当前的 socket 上发消息之外，就是通过 `to` 给指定的用户发消息。但是 socket.io 本身的能力还是挺强的，更广的功能目前还没办法用到，比如说：

- 广播消息

  类似于游戏里的世界广播那种功能

- 创建 room 和 namespace

  这个我其实有点想做的，比如说上面提到的创建一个 conversation schema，和做 group chat 就可以做这个功能

  不过想想先维持基本功能的实现吧

- acknowledge

  这个看了下，大体是如果 socket 的信息完成传输后，可以直接调用 callback 去确认信息已经传输完成

  在当前项目里的例子大体是：当用户发送信息后，就可以直接在后端更新消息已经 deliver 的操作，再通过 socket 将消息传到前端

  对于现在的实现——即用户 A 发送信息后通过 socket 发送给用户 B 新消息已经发送，用户 B 在 UI 接收到这个消息后，发送一个 rest api 调用到后端，再将消息通过 rest api 结果返回到前端，前端再对 UI 进行更新

  比起来，这里少了一个 socket 到 UI，UI 调用 rest api 的交流，因此对于性能的提升也是显著的

  没这么做的原因是想做 MFE 的……后面会提到

- middleware

  和 acknowledge 类似，可以直接在 socket 中验证用户，减少客户端对 API 调用

- 自动重连

  我知道有这个功能，没具体研究过

- MFE

  因为现在是把 socket 单独拉出来做了一个模块，之前有在考虑升级到 MFE 的实现，不过这样就会涉及到多个 socket instance，然后解决方案就需要升级到 redis。目前我对于 redis 的使用是项目里有用，一直想看，一直还没抽出时间来具体研究是怎么做的

  所以升级到 MFE 会上比较大的强度，因此暂时就搁置了。可能等到之后有空会回来看看吧……
