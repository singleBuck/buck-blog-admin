import React, { FC, useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Input, Select, Alert, Button} from 'antd'
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import styles from './style.less';
import { StateType } from './model'
import { tagStateType } from '@/models/tag'
import './marked.css'
import 'simplemde/dist/simplemde.min.css';
import './monokai_sublime.css';
const { TextArea } = Input;

interface createArticleProps {
  dispatch: Dispatch;
  article_list: StateType;
  tag_list: tagStateType;
}

// 富文本工具配置
const tetxToolBar = [
  'bold', 'italic', 'strikethrough', 'heading',
  'code', 'quote', 'unordered-list', 'ordered-list',
  'clean-block', 'link', 'image', 'table', 'horizontal-rule',
  'preview', 'side-by-side', 'fullscreen', 'guide'
]


export const createArticle: FC<createArticleProps> = (props) => {
  const {
    dispatch,
    article_list: { },
    tag_list: { }
  } = props;

  const [ curTitle, setCurTitle ] = useState<string>('')
  const [ curAuthor, setCurAuthor ] = useState<string>('')
  const [ curDesc, setCurDesc ] = useState<string>('')
  const [ curKeyWord, setCurKeyWord ] = useState<string>('')
  const [ curImgUrl, setCurImgUrl ] = useState<string>('')
  const [ curIssue, setCurIssue ] = useState<string>('1')
  const [ curArticleType, setCurArticleType ] = useState<string>('1')
  const [ curReship, setCurReship ] = useState<string>('0')
  const [ smde, setSmde ] = useState<any>()
  const [ curTag, setCurTag ] = useState<any>()

  useEffect(() => {
    highlight.initHighlightingOnLoad()
    const cursmde = new SimpleMDE({
      element: document.querySelector('#editor'),
      autofocus: true,
      autosave: true,
      toolbar: tetxToolBar,
      previewRender(plainText: any) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight(code) {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    });
    setSmde(cursmde)
  }, [])

  // 请求标签
  useEffect(() => {
    dispatch({
      type: 'tags/getTagList',
    })
    const {tag_list}  = props

    console.log(props.tag_list.data)
  }, [1])

  // 标题
  const handleTitleChange = (e: any):void => {
    setCurTitle(e.target.value)
  }

  // 作者
  const handleCurAuthor = (e: any):void => {
    setCurAuthor(e.target.value)
  }

  // 关键字
  const handleCurKeyWord = (e: any):void => {
    setCurKeyWord(e.target.value)
  }

  // 描述
  const handleCurDesc = (e: any):void => {
    setCurDesc(e.target.value)
  }

  // 封面连接
  const handleCurImgUrl = (e: any):void => {
    setCurImgUrl(e.target.value)
  }

  // 选择发布状态
  const handleCurIssue = (val: any):void => {
    setCurIssue(val)
  }

  // 选择文章类型
  const handleCurArticleType = (val: any):void => {
    setCurArticleType(val)
  }

  // 选择文章转载状态
  const handleCurReship = (val: any):void => {
    setCurReship(val)
  }

  // 标签选择
  const handleCurTag = (e: any):void => {
    setCurTag(e.target.value)
  }

  // 文章提交
  const handleArticleSubmit = ():void => {
    console.log(smde.value())
  }

  return (
    <div className={styles.create_article}>
      <Alert message="请持之以恒！！！" type="success">
      </Alert>

      <Input
        addonBefore="标题"
        size="large"
        placeholder="标题"
        name="title"
        value={curTitle}
        onChange={handleTitleChange}
      />
      <Input
        addonBefore="作者"
        size="large"
        placeholder="作者"
        name="author"
        value={curAuthor}
        onChange={handleCurAuthor}
      />
      <Input
        addonBefore="关键字"
        size="large"
        placeholder="关键字"
        name="author"
        value={curKeyWord}
        onChange={handleCurKeyWord}
      />
      <Input
        addonBefore="描述"
        size="large"
        placeholder="描述"
        name="desc"
        value={curDesc}
        onChange={handleCurDesc}
      />
      <Input
        addonBefore="封面连接"
        size="large"
        placeholder="封面连接"
        name="img_url"
        value={curImgUrl}
        onChange={handleCurImgUrl}
      />

      <Select
        style={{ width: 200 }}
        placeholder="选择发布状态"
        defaultValue={curIssue}
        onChange={handleCurIssue}
      >
        {/*  0 草稿，1 发布 */}
        <Select.Option value="0">草稿</Select.Option>
        <Select.Option value="1">发布</Select.Option>
      </Select>

      <Select
        style={{ width: 200 }}
        placeholder="选择文章类型"
        defaultValue={curArticleType}
        onChange={handleCurArticleType}
      >
        {/* 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍 */}
        <Select.Option value="1">普通文章</Select.Option>
        <Select.Option value="2">简历</Select.Option>
        <Select.Option value="3">管理员介绍</Select.Option>
      </Select>

      <Select
        style={{ width: 200 }}
        placeholder="选择文章转载状态"
        defaultValue={curReship}
        onChange={handleCurReship}
      >
        {/* 0 原创，1 转载，2 混合 */}
        <Select.Option value="0">原创</Select.Option>
        <Select.Option value="1">转载</Select.Option>
        <Select.Option value="2">混合</Select.Option>
      </Select>

      <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginLeft: 10, marginBottom: 20 }}
          placeholder="标签"
          value={curTag}
          onChange={handleCurTag}
        >
          {/* {tag_list} */}
        </Select>

      <TextArea id="editor"></TextArea>

      <Button
        type='primary'
        className={styles.IssuArticle}
        block
        onClick={handleArticleSubmit}
      >
          发布文章
      </Button>
    </div>
  );
}

export default connect(
  ({
    createArticleModel,
    tags
  }: {
    createArticleModel: StateType,
    tags: tagStateType
  }) => ({
    article_list: createArticleModel.list,
    tag_list: tags.tagList
  })
)(createArticle);
