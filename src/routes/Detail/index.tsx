import useMermaidEffect from "./hooks/useMermaidEffect"
import PostDetail from "./PostDetail"
import PageDetail from "./PageDetail"
import styled from "@emotion/styled"
import usePostQuery from "src/hooks/usePostQuery"
import { useRouter } from "next/router"

type Props = {}

const Detail: React.FC<Props> = () => {
  const data = usePostQuery()
  const router = useRouter()
  useMermaidEffect()

  const handleBackdropClick = () => {
    const savedQuery = sessionStorage.getItem("feedQuery")
    const query = savedQuery ? JSON.parse(savedQuery) : {}
    router.push({ pathname: "/", query })
  }

  if (!data) return null
  return (
    <StyledWrapper data-type={data.type} onClick={handleBackdropClick}>
      <div onClick={(e) => e.stopPropagation()} css={{ cursor: "auto" }}>
        {data.type[0] === "Page" && <PageDetail />}
        {data.type[0] !== "Page" && <PostDetail />}
      </div>
    </StyledWrapper>
  )
}

export default Detail

const StyledWrapper = styled.div`
  padding: 2rem 0;
  min-height: 100vh;
  cursor: pointer;

  &[data-type="Paper"] {
    padding: 40px 0;
  }
  /** Reference: https://github.com/chriskempson/tomorrow-theme **/
  code[class*="language-mermaid"],
  pre[class*="language-mermaid"] {
    background-color: ${({ theme }) => theme.colors.gray5};
  }
`
