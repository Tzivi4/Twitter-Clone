import styled from '@emotion/styled'
import { CommentIcon, FilledLikeIcon, LikeIcon, RetweetIcon, ShareIcon } from 'components/Icons'
import appContext from 'context/app/appContext'
import authContext from 'context/auth/authContext'
import useDateFormat from 'hooks/useDateFormat'
import useTimeAgo from 'hooks/useTimeAgo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import Highlight from 'react-hashtag'
import hash from 'string-hash'

const TweetContainer = styled.article`
  border-bottom: 1px solid rgb(56, 68, 77);
  width: 100%;
  padding: 0.6rem 1rem;
  display: flex;
  &:active {
    cursor: pointer;
    backdrop-filter: brightness(120%);
  }
`

const PictureContainer = styled.div`
  margin-right: 1rem;
`

const Picture = styled.img`
  width: 46px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s ease;

  &:active {
    filter: brightness(85%);
  }
`

const ContentContainer = styled.div`
  width: 100%;
`

const Content = styled.span`
  font-size: 14px;
`

const ImageContainer = styled.div`
  display: flex;
  margin: 0.8rem 0;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const Image = styled.img`
  width: 100%;
  border-radius: 10px;
`

const User = styled.span`
  font-size: 14px;
  font-weight: bold;
  &:active {
    text-decoration: underline;
    cursor: pointer;
  }
`

const Username = styled.span`
  font-size: 14px;
  color: #8899a6;
  margin: 0 0.4rem;
`

const Time = styled.time`
  font-size: 14px;
  color: #8899a6;
  margin: 0 0.4rem;

  &:active {
    text-decoration: underline;
    cursor: pointer;
  }
`

const Tooltip = styled.div`
  background-color: #8899a6;
  border-radius: 2px;
  font-size: 0.7rem;
  position: absolute;
  padding: 0.2rem;
  top: -1rem;
  left: 3rem;
`

const Interaction = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.7rem;
`

const InteractionIcon = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const Numbers = styled.span`
  font-size: 14px;
  color: #8899a6;
  margin-left: 0.4rem;
`

const Hashtag = styled.span`
  color: #1b95e0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const Tweet = ({
  liked,
  retweeted,
  id,
  displayName,
  username,
  picture,
  content,
  comments,
  likes,
  retweets,
  date,
  image,
}) => {
  const timeago = useTimeAgo(date)
  const formatDate = useDateFormat(date)
  const [showDate, setShowDate] = useState(false)
  const { like } = useContext(appContext)
  const { user } = useContext(authContext)

  const router = useRouter()

  const handleMouseEnter = () => {
    setShowDate(true)
  }

  const handleMouseLeave = () => {
    setShowDate(false)
  }

  // TweetContainer onClick={handleArticleClick}

  const handleArticleClick = e => {
    e.preventDefault()
    router.push(`/status/${id}`)
  }

  const handleLike = e => {
    const data = {
      tweetId: id,
      userId: user.uid,
      likes,
    }
    like(data)
    if (!e) {
      var e = window.event
    }
    e.cancelBubble = true
    if (e.stopPropagation) e.stopPropagation()
  }

  return (
    <TweetContainer>
      <PictureContainer>
        <Picture src={picture} />
      </PictureContainer>
      <ContentContainer>
        <div style={{ position: 'relative' }}>
          <User>{displayName}</User>
          {/* <Username>{username}</Username> */}
          <Link href={`/status/${id}`}>
            <Time onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} dateTime={formatDate}>
              {timeago}
            </Time>
          </Link>
          {showDate && <Tooltip>{formatDate}</Tooltip>}
        </div>
        <Content>
          <Highlight renderHashtag={hashtagValue => <Hashtag key={hash(hashtagValue)}>{hashtagValue}</Hashtag>}>
            {content}
          </Highlight>
        </Content>
        {image && (
          <ImageContainer>
            <Image src={image} />
          </ImageContainer>
        )}
        <Interaction>
          <InteractionIcon>
            <CommentIcon />
            <Numbers>{!(comments.length === 0) && comments.length}</Numbers>
          </InteractionIcon>
          <InteractionIcon>
            <RetweetIcon fill={retweeted ? '#17bf63' : '#8899a6'} />
            <Numbers style={liked ?{ color: '#17bf63' }: {color: "#8899a6"}}>{!(retweets.length === 0) && retweets.length}</Numbers>
          </InteractionIcon>
          <InteractionIcon>
            {liked ? (
              <FilledLikeIcon onClick={handleLike} />
            ) : (
              <LikeIcon fill="#8899a6" stroke="none" onClick={handleLike} />
            )}
            <Numbers style={liked ? { color: '#e0245e' } : { color: '#8899a6' }}>
              {likes.length !== 0 && likes.length}
            </Numbers>
          </InteractionIcon>
          <span>
            <ShareIcon />
          </span>
        </Interaction>
      </ContentContainer>
    </TweetContainer>
  )
}

export default Tweet
