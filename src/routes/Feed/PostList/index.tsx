import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"

type Props = {
  q: string
}

// ... 상단 import 부분 동일

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery() // 실제 전체 포스트 데이터
  const [filteredPosts, setFilteredPosts] = useState(data)

  // 쿼리 값들을 문자열로 안전하게 변환
  const currentTag = String(router.query.tag || "")
  const currentCategory = String(router.query.category || DEFAULT_CATEGORY)
  const currentOrder = String(router.query.order || "desc")

  useEffect(() => {
    let newFilteredPosts = [...data] // 원본 데이터 복사

    // 1. 키워드 검색 (q)
    if (q) {
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = (post.title + post.summary + tagContent).toLowerCase()
        return searchContent.includes(q.toLowerCase())
      })
    }

    // 2. 태그 필터링 (가장 중요한 부분)
    if (currentTag) {
      // URL의 "1::WIKI::분석" -> "분석" 추출
      const targetTag = currentTag.includes("::") 
        ? currentTag.split("::")[2] 
        : currentTag

      newFilteredPosts = newFilteredPosts.filter((post) => {
        if (!post.tags) return false
        
        // 게시글의 각 태그들도 "1::WIKI::분석" 형태일 수 있으므로 
        // 각 태그의 실제 이름만 뽑아서 비교합니다.
        return post.tags.some(postTag => {
          const cleanPostTag = postTag.includes("::") 
            ? postTag.split("::")[2] 
            : postTag
          return cleanPostTag === targetTag
        })
      })
    }

    // 3. 카테고리 필터링
    if (currentCategory !== DEFAULT_CATEGORY) {
      newFilteredPosts = newFilteredPosts.filter(
        (post) => post.category && post.category.includes(currentCategory)
      )
    }

    // 4. 정렬
    if (currentOrder !== "desc") {
      newFilteredPosts.reverse()
    }

    setFilteredPosts(newFilteredPosts)
    
    // [중요] 의존성 배열에 data를 반드시 추가해야 데이터 로딩 후 필터링이 작동합니다.
  }, [q, currentTag, currentCategory, currentOrder, data]) 

  return (
    <>
      <div className="my-2">
        {!filteredPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
        )}
        {filteredPosts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  )
}

export default PostList

/* const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()
  const [filteredPosts, setFilteredPosts] = useState(data)

  const currentTag = `${router.query.tag || ``}` || undefined
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  useEffect(() => {
    setFilteredPosts(() => {
      let newFilteredPosts = data
      
      // keyword
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = post.title + post.summary + tagContent
        return searchContent.toLowerCase().includes(q.toLowerCase())
      })

      // tag
      if (currentTag) {
        // "숫자::대분류::소분류" 형태에서 실제 태그인 "소분류"만 가져옵니다.
        const targetTag = currentTag.includes("::")
          ? currentTag.split("::")[2]
          : currentTag
        // 여기까지 추가한 내용
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post && post.tags && post.tags.includes(targetTag)
        )
      }

      // category
      if (currentCategory !== DEFAULT_CATEGORY) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) =>
            post && post.category && post.category.includes(currentCategory)
        )
      }
      // order
      if (currentOrder !== "desc") {
        newFilteredPosts = newFilteredPosts.reverse()
      }

      return newFilteredPosts
    })
  }, [q, currentTag, currentCategory, currentOrder, setFilteredPosts])

  return (
    <>
      <div className="my-2">
        {!filteredPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
        )}
        {filteredPosts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  )
}

export default PostList */
